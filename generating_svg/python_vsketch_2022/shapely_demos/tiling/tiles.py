# encode tile groups via coordinates of cube centers
# ensure that tiles are listed in sorted order of layers to be occluded
# the groups are centered at [0,0]

# triangles encodes a list of (i,j,k,v) tuples
# points encodes the (i,j) coordinates 
# 'triangles': [[0,0,0,1], [0,0,1,1], [1,0,1,3], [0,1,0,2], [1,1,0,3], [1,1,1,2]],
# 'points': [[0,0], [1,0], [0,1], [1,1], [2,1], [1,2], [2,2]]

import numpy as np

def create_tile(pattern):

    SIZE = 10
    cube_triangles = [[0,0,0,1], [0,0,1,1], [1,0,1,3], [0,1,0,2], [1,1,0,3], [1,1,1,2]]
    cube_vertices = [[0,0], [1,0], [0,1], [1,1], [2,1], [1,2], [2,2]]

    triangles = np.zeros((SIZE, SIZE, 2))
    visited = []

    for point in pattern:

        a, b = point[0] + SIZE//2, point[1] + SIZE//2

        for triangle in cube_triangles:
            i, j, k, value = triangle
            triangles[a + i, b + j, k] = value

        for vertex in cube_vertices:
            i, j = vertex
            visited.append([a+i, b+j])

    return triangles, visited
        


SINGLETON =     create_tile([[ 0, 0]])
STAIRCASE_1 =   create_tile([[ 0, 0], [-1,-2], [ 1, 2]])
STAIRCASE_2 =   create_tile([[ 0, 0], [-2,-1], [ 2, 1]])
ROD_1 =         create_tile([[-1, 0], [ 0, 0], [ 1, 0]])
ROD_2 =         create_tile([[ 0,-1], [ 0, 0], [ 0, 1]])
ROD_3 =         create_tile([[ 1, 1], [ 0, 0], [-1,-1]])
PLANE_1 =       create_tile([[-1,-1], [-1, 0], [ 0,-1], [-1, 1], [ 0, 0], [ 1,-1], [ 0, 1], [ 1, 0], [ 1, 1]])
PLANE_2 =       create_tile([[ 0, 1], [ 1, 1], [ 2, 1], [-1, 0], [ 0, 0], [ 1, 0], [-2,-1], [-1,-1], [ 0,-1]])
L1 =            create_tile([[ 0, 0], [ 0, 1], [ 1, 1], [ 2, 1]])
L2 =            create_tile([[ 0, 0], [-1,-1], [-1, 0], [-1, 1]])
L3 =            create_tile([[ 0, 0], [ 0, 1], [-1,-1], [-2,-2]])
L4 =            create_tile([[ 0, 0], [-1,-1], [ 1, 0], [ 2, 0]])
BIG =           create_tile([[-2,-2], [-2,-1], [-1,-2], [-1,-1], 
                             [ 0, 2], [-1, 1], [-2, 0], 
                             [ 1, 2], [ 0, 1], [-1, 0], 
                             [ 2, 0], [ 1,-1], [ 0,-2],
                             [ 2, 1], [ 1, 0], [ 0,-1],
                             [ 2, 2], [ 1, 1], [ 0, 0]])
