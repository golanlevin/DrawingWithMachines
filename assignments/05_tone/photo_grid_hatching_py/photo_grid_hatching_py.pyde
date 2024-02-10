# Ported from p5.js version at:
# https://editor.p5js.org/golan/sketches/CQmqp4JTQ


def setup():
  size(640, 320)
  global myImg
  myImg = loadImage("mona.png")
  noLoop()


def draw():
  background(255)
  image(myImg, myImg.width, 0)
  stroke(0)
  strokeWeight(0.5)

  nRows = 32
  nCols = 20
  dx = int(myImg.width/nCols)
  dy = int(myImg.width/nRows)

  for row in range(nRows):
    for col in range(nCols):

      px = col * dx
      py = row * dy
      colorAtXY = myImg.get(px, py)
      
      r = red (colorAtXY)
      g = green (colorAtXY)
      b = blue (colorAtXY)
      bri01 = (0.299*r + 0.587*g + 0.114*b)/255.0;

      nLines = int(map(bri01, 0,1, 10,0))
      for i in range(nLines):
        lx = map(i, 0, nLines, px, px+dx)
        line(lx,py, lx,py+dy)
