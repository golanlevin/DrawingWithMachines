# Generate a Lissajous curve, and export it as an SVG file.
# For more information on the Processing SVG library, see:
# https://processing.org/reference/libraries/svg/index.html

add_library('svg')

def setup():
    # Letter: 11"x8.5" at 96 DPI.
    size(1056, 816) 
    # Only run once:
    noLoop()


def draw():
    background(255)
    beginRecord(SVG, "lissajous-from-processing-py.svg");
  
    stroke(0)
    noFill()

    nPoints = 100
    cx = width/2 
    cy = height/2
    radius = width/4

    beginShape()
    for i in range (nPoints):
        theta = map(i, 0, nPoints, 0, TWO_PI)
        px = cx + radius * sin(2.0 * theta)
        py = cy + radius * cos(3.0 * theta)
        vertex(px, py)
    endShape(CLOSE)
    endRecord()
