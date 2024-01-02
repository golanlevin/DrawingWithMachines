# For Processing v.3.5.4 ONLY.
# Does NOT work with Python Mode for Processing 4+, 
# Owing to incompatibility with SVG Export Library.
#
# Draws a grid of lines. Good for testing the plotter.
# The lines are ordered to give you the quickest overview
# of whether things are aligned properly :)
#
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
    beginRecord(SVG, "testgrid_from_processing_py.svg");
    
    dpi = 96
    margin = dpi * 0.5
    L = margin
    R = width-margin
    T = margin
    B = height-margin
  
    noFill()
    stroke(0,0,0)
    strokeWeight(1.0)
    
    # Draw the outer rectangle first
    beginShape()
    vertex(L,T)
    vertex(R,T)
    vertex(R,B)
    vertex(L,B)
    vertex(L,T)
    endShape(CLOSE)
    
    # half-inch grid.
    gridSize = 0.5; 
    nDivsX = (int)((R-L)/(dpi * gridSize))
    nDivsY = (int)((B-T)/(dpi * gridSize))

    # Draw the even grid lines
    for i in range(2, nDivsX, 2):
        x = map(i, 0,nDivsX, L,R); 
        if i % 4 == 0:
            line(x,B, x,T)
        else:
            line(x,T, x,B)
            
    for i in range(2, nDivsY, 2):
        y = map(i, 0,nDivsY, T,B)
        if i % 4 == 0:
            line(R,y, L,y)
        else:
            line(L,y, R,y)

    # Draw the odd grid lines
    for i in range(1, nDivsX, 2):
        x = map(i, 0,nDivsX, L,R)
        if (i-1)%4 == 0:
            line(x,B, x,T)
        else:
            line(x,T, x,B)

    for i in range(1, nDivsY, 2):
        y = map(i, 0,nDivsY, T,B)
        if (i-1)%4 == 0:
            line(R,y, L,y)
        else:
            line(L,y, R,y)

    endRecord()
