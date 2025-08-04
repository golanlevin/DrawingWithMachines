# shapely-demos
demos of using [shapely](https://shapely.readthedocs.io/en/stable/manual.html) with [vpype](https://github.com/abey79/vpype) and [vsketch](https://vsketch.readthedocs.io/en/latest/) for generating .svg files

## Contents
1. [hatching](https://github.com/shivaPeri/shapely-demos/blob/main/hatching/README.md), demo of using clip_by_rect
2. [blob](https://github.com/shivaPeri/shapely-demos/blob/main/blob/README.md), demo of data manipulation with sklearn
3. [tiling](https://github.com/shivaPeri/shapely-demos/blob/main/tiling/README.md), demo of triangular coordinates with numpy
4. [moire](https://github.com/shivaPeri/shapely-demos/blob/main/moire/README.md), demo of using offset curves

## Usage
1. create a virtual environment for running vpype
2. clone the directory you want to run
3. run `vsk run` in the directory

## numpy.ndarray
Numpy's ndarray's allows for rapidly manipulating collections of points with ease.

Random Point generation
```python
points = np.random.rand(500, 2)                                   # creates 500 (x, y) coordinates in (0,1) range
points[:,0] = np.interp(points[:,0], [0,1], [-10, 200])           # maps the x-coords from (0,1) to (-10, 200)
points[:,1] = np.interp(points[:,1], [0,1], [-200, 150])          # maps the y-coords from (0,1) to (-200, 150)
```

nGon with `np.cos` and `np.sin`
```python
# [I] n : integer
# [O] ls : np.ndarray
# returns a centered, unit, n-sided polygon
def nGon(n):
    thetas = np.arange(n) * (2 * np.pi / n)
    xs = np.cos(thetas)
    ys = np.sin(thetas)
    return  np.array([xs, ys]).T
```

applying a vector field to an array given a string pattern
```python
FIELDS = [
    'xOff + xMag * np.cos(x+y), yOff + yMag * np.sin(x+y)',
    'xOff + np.cos(xMag * (x+y)), yOff + np.sin(yMag * (x+y))',
    'xOff + xMag * np.log(x), yOff + yMag * np.log(y)',
]

SELECTED_FIELD = 1

# additively applies a vector field to given coordinates
def applyVectorField(x, y, xMag=1, yMag=1, xOff=0, yOff=0):
    x_, y_ = eval(FIELDS[SELECTED_FIELD])
    return np.array([x + x_, y + y_])
```

## shapely.geometry
shapely provides several data structures which are useful for plotting, in particular `LineString`, `LinearRing`, `MultiLineString`, and `Polygon`

Suppose we have `point: np.ndarray` from earlier. We can convert basically any iterable to a `shapely.geometry` as follows
```python
points = np.random.rand(500, 2)
ls = LineString(points)

points = np.random.rand(3, 500, 2)
mls = MultiLineString(points)
```
Once our coordinate data is represented as a `shapely.geometry`, we can now apply shapely manipulations to the geometry such as clipping (`shapely.ops.clip_by_rect`) or generating offset curves (`LineString.parallel_offset`)

Moreover, using the `Polygon` class allows for complex boolean operations including `intersection`, `union`, etc. 
Suppose we take the nGon from earlier and want to intersect it with a MultiLineString. We can do so as follows. 
Better examples are found in the blob demos
```python
points = np.random.rand(3, 500, 2)
mls = MultiLineString(points)

pentagon = LinearRing(nGon(5))
intersection = Polygon(pentagon.coords).intersection(mls)
```

## vsk.geometry
When we are finally done with all the preprocessing and data manipulations we want, we can finally write vsketch svg as follows
```python
points = np.random.rand(500, 2)
ls = LineString(points)
vsk.geometry(ls)
```
