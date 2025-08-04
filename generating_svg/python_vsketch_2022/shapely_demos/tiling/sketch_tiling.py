import vsketch
import numpy as np
from shapely.geometry import LineString, MultiLineString
from shapely.ops import clip_by_rect

import sys
sys.path.append('./')
from tiles import *


# Declare global constants
ROWS = 150
COLS = 150
SCALE = 50

# Store global state here
GRID = np.zeros((ROWS, COLS, 2))
VISITED = np.zeros((ROWS, COLS))
FRONTIER = []

TILES = [ SINGLETON, STAIRCASE_1, STAIRCASE_2, ROD_1, ROD_2, ROD_3, PLANE_1, PLANE_2, L1, L2, L3, L4, BIG ]


class TilingSketch(vsketch.SketchClass):

    def to_cartesian(self, i, j):
        return (j-i) * SCALE, (i+j) * SCALE / (3 ** .5)

    def hatch(self, coords, num_lines=5):
        p1, p2, p3 = coords
        lines = np.arange(num_lines)
        start_x = np.interp(lines, [0, num_lines-1], [p1[0], p3[0]])
        start_y = np.interp(lines, [0, num_lines-1], [p1[1], p3[1]])
        end_x = np.interp(lines, [0, num_lines-1], [p2[0], p3[0]])
        end_y = np.interp(lines, [0, num_lines-1], [p2[1], p3[1]])

        start_points = np.array([start_x, start_y]).T
        end_points = np.array([end_x, end_y]).T
        ls = np.array([start_points, end_points])

        return np.transpose(ls, axes=(1,0,2))

    def draw_triangle(self, vsk: vsketch.Vsketch, i, j, k, num_lines=5) -> None:
        
        value = GRID[i,j,k]
        if (value == 0): return

        # calculate coordinates of triangle boundary
        coords = np.zeros((3, 2)) + np.array([ i, j])
        p1, p2, p3 = [ 0, 0], [ 1, 1], [ 1-k, k]

        if (value == 1 and k == 0): coords += np.array([p3, p2, p1])
        if (value == 1 and k == 1): coords += np.array([p1, p3, p2])
        if (value == 2 and k == 0): coords += np.array([p3, p1, p2])
        if (value == 2 and k == 1): coords += np.array([p3, p2, p1])
        if (value == 3 and k == 0): coords += np.array([p1, p2, p3])
        if (value == 3 and k == 1): coords += np.array([p1, p2, p3])

        # generate hatching lines
        lines = self.hatch(coords, num_lines=num_lines)
        
        # Calculate x, y coordinates
        for line in lines:
            for i, point in enumerate(line):
                    a, b = self.to_cartesian(*point)
                    # line[i] = np.array([a, b])

                    # apply any vector field
                    amp1 = 30
                    amp2 = 100
                    phase1 = 0.005
                    phase2 = 0.001
                    x, y = a + amp1 * np.sin(phase1 * (a+b)), b + amp2 * np.cos(phase2 * (a-b))
                    
                    line[i] = np.array([x, y])


        # draw lines
        # if (value == 1):
        # if (value == 2):
        # if (value == 3):
        if not (value == 0):
            vsk.stroke(value)
            vsk.geometry(MultiLineString(lines.tolist()))

    def place_tile(self, a, b, triangles, visited):
        
        for i, x in enumerate(triangles):
            for j, y in enumerate(x):
                for k, value in enumerate(y):
                    if not (value == 0):
                        if (0 <= a+i and a+i < ROWS and 0 <= b+j and b+j < COLS):
                            GRID[a + i, b + j, k] = value

        for vertex in visited:
            i, j = vertex
            if (0 <= a+i and a+i < ROWS and 0 <= b+j and b+j < COLS):
                VISITED[a+i, b+j] += 1

    def generate_tiling(self):

        SEEDS = 20
        tile_positions = np.random.rand(SEEDS, 3)
        tile_positions[:,0] = np.interp(tile_positions[:,0], [0,1], [0, ROWS//5])
        tile_positions[:,1] = np.interp(tile_positions[:,1], [0,1], [0, COLS//5])
        tile_positions[:,2] = np.interp(tile_positions[:,2], [0,1], [0, len(TILES)])
        
        ITERS = 20
        for i in range(ITERS):

            # draw tiles at current positions
            for tile_pos in tile_positions:
                r, c, t = tile_pos
                self.place_tile(int(r), int(c), *TILES[int(t)])

            # update tile positions
 
            ##################### UPDATE 1
            visited_indices = np.array(np.nonzero(VISITED)).T

            indices = np.arange(len(visited_indices))
            chosen_indices = np.random.choice(indices, (SEEDS))
            tile_indices = visited_indices[chosen_indices].T
            tiles = np.interp(np.random.rand(SEEDS), [0,1], [0, len(TILES)])

            tile_positions[:,0] = tile_indices[0]
            tile_positions[:,1] = tile_indices[1]
            tile_positions[:,2] = tiles

            # ##################### UPDATE 2

            # randseed = int(np.random.rand() * 100000)
            # np.random.seed(randseed)

            # tile_positions = np.random.rand(SEEDS, 3)
            # tile_positions[:,0] = np.interp(tile_positions[:,0], [0,1], [0, ROWS])
            # tile_positions[:,1] = np.interp(tile_positions[:,1], [0,1], [0, COLS])
            # tile_positions[:,2] = np.interp(tile_positions[:,2], [0,1], [0, len(TILES)])



    def draw(self, vsk: vsketch.Vsketch) -> None:

        vsk.size("12inx9in")
        vsk.scale("px")

        print('GENERATING > ', end='', flush=True)  #####################
        self.generate_tiling()

        print('DRAWING > ', end='', flush=True)  #####################

        # # draw corners of plane
        # vsk.circle(*self.to_cartesian(0, 0), radius=10)
        # vsk.circle(*self.to_cartesian(ROWS-1, 0), radius=10)
        # vsk.circle(*self.to_cartesian(0, COLS-1), radius=10)
        # vsk.circle(*self.to_cartesian(ROWS-1, COLS-1), radius=10)

        for index in range(GRID.size):
            i, j, k = np.unravel_index(index, GRID.shape)
            self.draw_triangle(vsk, i, j, k, 50)

        print('DRAWN', end='\n', flush=True)  #####################


    def finalize(self, vsk: vsketch.Vsketch) -> None:
        vsk.vpype("linemerge linesimplify reloop linesort crop 0.5in 0.5in 11in 8in")


if __name__ == "__main__":
    TilingSketch.display()
