# For Processing v.3.5.4 ONLY.
# Does NOT work with Python Mode for Processing 4+.
#
# Draws some random lines. 
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
    beginRecord(SVG, "random_lines_from_processing_py.svg");
   
    noFill()
    stroke(0,0,0)
    strokeWeight(1.0)
 
    # Make 100 random lines
    for i in range(100):
        px = random(0, width)
        py = random(0, height)
        qx = random(0, width)
        qy = random(0, height)
        line(px, py, qx, qy)

    endRecord()
