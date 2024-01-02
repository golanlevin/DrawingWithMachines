import sys
import random
import vsketch
import numpy as np
from shapely.geometry import Point, LineString, MultiLineString, box
from shapely.affinity import rotate, translate, scale
from shapely.ops import split, clip_by_rect

import sys
sys.path.append('./')
from shapelydraw import *


class HatchingSketch(vsketch.SketchClass):
    # Sketch parameters:
    # radius = vsketch.Param(2.0)

    def tiny_arcs(self, vsk: vsketch.Vsketch, x, y, w, h, tone=0.5) -> None:

        x_margin, y_margin = 0, 0
        # x_margin, y_margin = w/10, h/10
        points = np.random.rand(int(np.interp(tone, [0,1], [100, 500])), 2)
        points[:,0] = np.interp(points[:,0], [0,1], [x+x_margin, x+w-x_margin])
        points[:,1] = np.interp(points[:,1], [0,1], [y+y_margin, y+h-y_margin])

        for p in points:
            r, start, stop = np.random.rand(3)
            r = np.interp(tone, [0,1], [10, 100])
            start, stop = np.interp([start, stop], [0, 1], [-200, 200])
            ls = arc(p[0], p[1], r, r, start, stop, degrees=True)
            vsk.geometry(clip_by_rect(ls, x, y, x+w, y+h))

    def staples(self, vsk: vsketch.Vsketch, x, y, w, h, tone=0.5) -> None:

        x_margin, y_margin = 0, 0
        points = np.random.rand(int(np.interp(tone, [0,1], [20, 500])), 4)
        points[:,0] = np.interp(points[:,0], [0,1], [x-x_margin, x+w+x_margin])
        points[:,1] = np.interp(points[:,1], [0,1], [y-y_margin, y+h+y_margin])
        points[:,2] = np.interp(points[:,2], [0,1], [10, 100])
        points[:,3] = np.interp(points[:,3], [0,1], [10, 100])

        for p in points:
            p1 = p[0] - p[2]/2, p[1] - p[3]/2
            p2 = p[0] + p[2]/2, p[1] - p[3]/2
            p3 = p[0] + p[2]/2, p[1] + p[3]/2
            p4 = p[0] - p[2]/2, p[1] + p[3]/2

            ls = LineString([p1, p2, p3, p4])
            ls = rotate(ls, random.randint(0, 360), 'centroid')
            vsk.geometry(clip_by_rect(ls, x, y, x+w, y+h))


    def triangles(self, vsk: vsketch.Vsketch, x, y, w, h, tone=0.5) -> None:
        
        space = 1 / np.interp(tone, [0,1], [5, 100])
        num_lines = int(w / space)

        for i in range(num_lines):
            ls = LineString([[x - w/2, y - h/2 + i * i*space], [x + 2*w, y - h/2 + i * i*space]])
            ls = translate(ls, -10, -10)
            vsk.geometry(clip_by_rect(ls, x, y, x+w, y+h))

        for i in range(num_lines):
            ls = LineString([[x - w/2, y - h/2 + i * i*space], [x + 2*w, y - h/2 + i * i*space]])
            ls = rotate(ls, 30, 'centroid')
            ls = translate(ls, -10, -10)
            vsk.geometry(clip_by_rect(ls, x, y, x+w, y+h))

        for i in range(num_lines):
            ls = LineString([[x - w/2, y - h/2 + i * i*space], [x + 2*w, y - h/2 + i * i*space]])
            ls = rotate(ls, 60, 'centroid')
            ls = translate(ls, -10, -10)
            vsk.geometry(clip_by_rect(ls, x, y, x+w, y+h))


    def circles(self, vsk: vsketch.Vsketch, x, y, w, h, tone=0.5) -> None:

        number = int(np.interp(tone, [0,1], [10, 200]))

        for i in range(number):
            r = i / number * w * 2
            ls = ellipse(x + w/2, y + h/2, r, r)
            vsk.geometry(clip_by_rect(ls, x, y, x+w, y+h))

    def draw(self, vsk: vsketch.Vsketch) -> None:
        vsk.size("letter", landscape=True)
        vsk.scale("px")
        vsk.penWidth('0.1mm')
        
        space = 1.2
        scale = 100
        for j, hatch_type in enumerate(['tiny_arcs', 'staples', 'triangles', 'circles']):

            for i in range(5):
                vsk.rect(i*space*scale, j*space*scale, scale, scale)
                eval('self.' + hatch_type + '(vsk, i*space*scale, j*space*scale, scale, scale, i/5)')


    def finalize(self, vsk: vsketch.Vsketch) -> None:
        vsk.vpype("linemerge linesimplify reloop linesort")


if __name__ == "__main__":
    HatchingSketch.display()
