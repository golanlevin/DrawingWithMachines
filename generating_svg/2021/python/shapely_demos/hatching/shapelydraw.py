import math
import numpy as np
from shapely.geometry import Point, LineString, Polygon, MultiPolygon
from shapely.ops import clip_by_rect

# Generic clipping function
def clip(geometry, mask: LineString, interior=True, precision=1):

    clipped = []

    [min_x, min_y, max_x, max_y] = mask.bounds
    for i in range(min_y, max_y, precision):
        dy = LineString([[min_x, i], [max_x, i]])

        temp = mask.intersection(dy)
        print(temp)


    return MultiPolygon(clipped)

# returns shapely LineString
def arc(x, y, w, h, start, stop, precision=0.05, degrees=False):

    if (degrees):
        start *= math.pi / 180
        stop *= math.pi / 180
        precision *= math.pi / 180

    points = []
    if (w == 0 or h == 0): return LineString(points)
    for theta in np.arange(start, stop, np.sign(stop - start) * precision):
        points.append([x + w/2 * math.cos(theta), y + h/2 * math.sin(theta)])

    return LineString(points)

# returns shapely LineString
def rect(x, y, w, h=None, tl=0, tr=0, bl=0, br=0):
    if (h == None): h = w

    points = []
    points.extend(arc(x+tl, y+tl, 2*tl, 2*tl, 0, 90, degrees=True).coords)           # top left arc   
    points.extend([[x + tl, y], [x + w - tr, y]])                               # top line 
    points.extend(arc(x+w-tr, y-tr, tr, tr, 0, math.pi/2).coords)               # top right arc     
    points.extend([[x + w, y + tr], [x + w, y + h - br]])                       # right line 
    points.extend(arc(x+w-br, y+h-br, br, br, 3 * math.pi / 2, 0).coords)       # bottom right arc   
    points.extend([[x + bl, y + h],    [x + w - br, y + h]])                    # bottom line  
    points.extend(arc(x-bl, y+h-bl, bl, bl, math.pi, 3 * math.pi / 2).coords)   # bottom left arc    
    points.extend([[x, y + tl],        [x, y + h - bl]])                        # left line
    
    print(points)
    return LineString(points)

# returns shapely LineString
def ellipse(x, y, w, h=None):
    if (h == None): h = w
    return arc(x, y, w, h, -math.pi/100, 2 * math.pi)

# # returns shapely LineString
# def bezier(x1, y1, x2, y2, x3, y3, x4, y4):
#     pass