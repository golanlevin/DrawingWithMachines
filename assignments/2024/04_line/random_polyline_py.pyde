# Processing.py (Python) program for Processing v.3.5.4
# Randomizes the design on mousePressed.
# Exports an SVG when the user presses a key.

add_library('svg')  # Importing the SVG library

bDoRecord = False
myRandomSeed = 12345

def setup():
    size(1056, 816)

def draw():
    global bDoRecord
    background(250)
    randomSeed(myRandomSeed)
    
    if bDoRecord:
        beginRecord(SVG, "random_lines_" + str(myRandomSeed) + ".svg")
    
    noFill()
    stroke(0)
    strokeWeight(2)
    beginShape()
    for i in range(16):
        px = random(0.1, 0.9) * width
        py = random(0.1, 0.9) * height
        vertex(px, py) 
    endShape()
    
    if bDoRecord:
        endRecord()
        bDoRecord = False
    noLoop()

def mousePressed():
    global myRandomSeed
    myRandomSeed = millis()
    loop()

def keyPressed():
    global bDoRecord
    bDoRecord = True
    loop()
