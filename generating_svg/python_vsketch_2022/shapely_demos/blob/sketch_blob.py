import vsketch, math, random
import numpy as np
from sklearn import svm
from itertools import groupby
from scipy.spatial import ConvexHull
from perlin_noise import PerlinNoise
from shapely.ops import clip_by_rect
from shapely.geometry import LineString, MultiLineString, Polygon, MultiPoint


# modified from https://en.wikipedia.org/wiki/Centripetal_Catmull%E2%80%93Rom_spline
# return type: np.ndarray
def CatmullRomSpline(P0, P1, P2, P3, nPoints=100):

    # Convert the points to numpy so that we can do array multiplication
    P0, P1, P2, P3 = map(np.array, [P0, P1, P2, P3])

    # Parametric constant: 0.5 for the centripetal spline, 0.0 for the uniform spline, 1.0 for the chordal spline.
    alpha = 0.5
    # Premultiplied power constant for the following tj() function.
    alpha = alpha/2
    def tj(ti, Pi, Pj):
        xi, yi = Pi
        xj, yj = Pj
        return ((xj-xi)**2 + (yj-yi)**2)**alpha + ti

    # Calculate t0 to t4
    t0 = 0
    t1 = tj(t0, P0, P1)
    t2 = tj(t1, P1, P2)
    t3 = tj(t2, P2, P3)

    # Only calculate points between P1 and P2
    t = np.linspace(t1, t2, nPoints)

    # Reshape so that we can multiply by the points P0 to P3
    # and get a point for each value of t.
    t = t.reshape(len(t), 1)
    A1 = (t1-t)/(t1-t0)*P0 + (t-t0)/(t1-t0)*P1
    A2 = (t2-t)/(t2-t1)*P1 + (t-t1)/(t2-t1)*P2
    A3 = (t3-t)/(t3-t2)*P2 + (t-t2)/(t3-t2)*P3
    B1 = (t2-t)/(t2-t0)*A1 + (t-t0)/(t2-t0)*A2
    B2 = (t3-t)/(t3-t1)*A2 + (t-t1)/(t3-t1)*A3

    C = (t2-t)/(t2-t1)*B1 + (t-t1)/(t2-t1)*B2
    return C

# [I] points : np.ndarray (___ x 2)
# [O] LineString of spline coordinates
def CatmullRomSplineWrapper(points, nPoints=100, closed=False):

    start = 0 if closed else 3
    ls = np.zeros((len(points) - start, nPoints, 2))
    for i in range(start, len(points)):
        p0 = points[i-3]
        p1 = points[i-2]
        p2 = points[i-1]
        p3 = points[i]

        ls[i-3] = CatmullRomSpline(p0, p1, p2, p3, nPoints=nPoints)

    ls = np.reshape(ls, (len(points) - 3 * nPoints, 2))
    return LineString(ls)
        
# [I] ls, array
# [O] mls, MultiLineString
def scribble(ls, overlay=1, scale=1):

    mls = []
    rand = np.random.randint(0, 100000, size=(overlay)) 
    if not isinstance(ls, np.ndarray): ls = np.array(ls)

    for i in range(overlay):
        def noise_fn(val): return PerlinNoise(seed=int(rand[i]))(float(val))

        noise_offset = np.zeros(ls.shape)
        noise_offset[:,0] = np.vectorize(noise_fn)(np.interp(ls[:,0], [ls[:,0].min(), ls[:,0].max()], [-1,1]))
        noise_offset[:,1] = np.vectorize(noise_fn)(np.interp(ls[:,1], [ls[:,1].min(), ls[:,1].max()], [-1,1]))
        mls.append(LineString(ls + noise_offset * scale))

    return MultiLineString(mls)


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

# Tiny arcs hatching
def hatch1(vsk: vsketch.Vsketch, x, y, w, h, tone=0.5) -> None:

    x_margin, y_margin = w/10, h/10
    points = np.random.rand(int(np.interp(tone, [0,1], [100, 500])), 2)
    points[:,0] = np.interp(points[:,0], [0,1], [x-x_margin, x+w+x_margin])
    points[:,1] = np.interp(points[:,1], [0,1], [y-y_margin, y+h+y_margin])

    mls = []
    for p in points:
        r = 20
        start, stop = np.random.rand(2)
        start, stop = np.interp([start, stop], [0, 1], [-200, 200])
        ls = arc(p[0], p[1], r, r, start, stop, degrees=True)
        # vsk.geometry(ls)
        mls.append(ls)

    return MultiLineString(mls)

# generates random blob
# returns LineString
def generateBlob(vsk: vsketch.Vsketch, num_points=6) -> None:
    points = np.random.rand(num_points, 2)
    return CatmullRomSplineWrapper(points, closed=True)

def generateBlobCreature(vsk: vsketch.Vsketch, boundary) -> None:

    # -------------------- PREPROCESS --------------------

    # center blob
    centroid = np.average(boundary, axis=0)
    boundary -= centroid
    boundary += np.random.rand(*boundary.shape) * 50

    # subsample blob
    indices = np.random.choice(np.arange(boundary.shape[0]), min(7, boundary.shape[0]), replace=False)
    indices.sort()
    boundary = boundary[indices]


    # -------------------- GENERATE --------------------

    # compute spline
    spline = CatmullRomSplineWrapper(boundary, closed=True).coords
    minx, miny, maxx, maxy = LineString(boundary).bounds

    # TODO: compute eyes & mouth
    NUM_CLASSES = 3
    x = np.random.rand(NUM_CLASSES, 2)
    x[:,0] = np.interp(x[:,0], [0,1], [minx, maxx])
    x[:,1] = np.interp(x[:,1], [0,1], [miny, maxy])
    y = np.arange(NUM_CLASSES)
    clf = svm.SVC()
    clf.fit(x, y)

    points = np.random.rand(1000, 2)
    points[:,0] = np.interp(points[:,0], [0,1], [minx, maxx])
    points[:,1] = np.interp(points[:,1], [0,1], [miny, maxy])
    # points = np.array(Polygon(spline).intersection(LineString(points)))

    cells = list(zip(clf.predict(points), points))
    cells.sort(key=lambda a: a[0])
    cells = {key:list(v[1] for v in valuesiter) for key,valuesiter in groupby(cells, key=lambda a: a[0])}

    features = []
    for i in cells.keys():
        cell_points = np.array(cells[i])
        features.append(cell_points[ConvexHull(cell_points).vertices])

    eye1, eye2, mouth = features[0], features[1], features[2]


    # -------------------- DRAW --------------------

    # Matrix transformation
    vsk.pushMatrix()
    vsk.translate(*centroid)
    vsk.scale(0.7)
    # vsk.rotate(np.random.rand)

    # blob spline
    vsk.geometry(scribble(spline, overlay=10, scale=100))
    mls = hatch1(vsk, minx, miny, maxx-minx, maxy-miny, tone=.8)
    mls = Polygon(spline).intersection(mls)
    vsk.geometry(mls)

    # # draw eyes
    # vsk.geometry(LineString(eye1))
    # # vsk.geometry(scribble(eye1, overlay=10, scale=20))
    # vsk.geometry(LineString(eye2))
    # # vsk.geometry(scribble(eye2, overlay=10, scale=20))

    # # draw mouth
    # vsk.geometry(LineString(mouth))
    # # vsk.geometry(scribble(mouth, overlay=10, scale=20))

    vsk.popMatrix()

    

def generateBlobCreatureFamily(vsk: vsketch.Vsketch, NUM_CLASSES=5, N=1000) -> None:

    # generate & classify classes
    x = np.random.rand(NUM_CLASSES, 2)
    x[:,0] = np.interp(x[:,0], [0,1], [vsk.width/3, vsk.width/3*2])
    x[:,1] = np.interp(x[:,1], [0,1], [vsk.height/3, vsk.height/3*2])
    y = np.arange(NUM_CLASSES)
    clf = svm.SVC()
    clf.fit(x, y)

    # generate random (r, theta) coords --> (x,y) coords
    points = np.random.rand(N, 2)
    points[:,0] = np.interp(points[:,0], [0,1], [0, vsk.height/2])
    points[:,1] = np.interp(points[:,1], [0,1], [0, np.pi * 2])
    points2 = np.random.rand(N, 2)
    points2[:,0] = points[:,0] * np.cos(points[:,1]) + vsk.height/2
    points2[:,1] = points[:,0] * np.sin(points[:,1]) + vsk.height/2

    # Sort & group classes
    cells = list(zip(clf.predict(points2), points2))
    cells.sort(key=lambda a: a[0])
    cells = {key:list(v[1] for v in valuesiter) for key,valuesiter in groupby(cells, key=lambda a: a[0])}

    # generateBlob per voronoi cell
    for i in cells.keys():
        cell_points = np.array(cells[i])
        boundary = cell_points[ConvexHull(cell_points).vertices]
        generateBlobCreature(vsk, boundary)
    

class BlobSketch(vsketch.SketchClass):

    def draw(self, vsk: vsketch.Vsketch) -> None:

        print('DRAWING >>>>>>>>>>>>>')

        vsk.size("12inx9in")
        vsk.scale("px")
        generateBlobCreatureFamily(vsk)

        # points = np.random.rand(10, 2)
        # points[:,0] = np.interp(points[:,0], [0,1], [0, vsk.width])
        # points[:,1] = np.interp(points[:,1], [0,1], [0, vsk.height])

        # points = CatmullRomSplineWrapper(points).coords
        # vsk.geometry(scribble(points, overlay=10, scale=100))


        print('>>>>>>>>>>>>> DRAWN')


    def finalize(self, vsk: vsketch.Vsketch):
        vsk.vpype("linemerge linesimplify reloop linesort")


if __name__ == "__main__":
    BlobSketch.display()
