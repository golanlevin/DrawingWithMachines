// Ported from p5.js version at:
// https://editor.p5js.org/golan/sketches/CQmqp4JTQ
//
// Main differences from p5.js:
// 1. Processing is "strongly typed" and uses data types:
//    PImage, int, float, color, etc.
// 2. There's no preload() in Java. Load images in setup().
// 3. get() fetches the color at some (x,y) location
//    and returns a 'color' object.
// 
// See this documentation: 
// https://processing.org/reference/loadImage_.html
// https://processing.org/reference/get_.html

PImage myImg;
void setup() {
  size(640, 320);
  String imageFilename = "mona.png";
  myImg = loadImage(imageFilename);
  noLoop();
}

void draw() {
  background(255);
  image(myImg, myImg.width, 0);
  stroke(0);
  strokeWeight(0.5);

  int nRows = 32;
  int nCols = 20;
  int dx = int(myImg.width/nCols);
  int dy = int(myImg.width/nRows);

  for (int row=0; row<nRows; row++) {
    for (int col=0; col<nCols; col++) {

      int px = col * dx;
      int py = row * dy;
      color colorAtXY = myImg.get(px, py);
      // myImg.pixels would be faster to run,
      // but is slightly more complex to implement.

      float r = red (colorAtXY);
      float g = green (colorAtXY);
      float b = blue (colorAtXY);
      float bri = (0.299*r + 0.587*g + 0.114*b);
      //  NTSC luminance; (r+g+b)/3 also works fine

      float bri01 = bri / 255.0;
      int nLines = int(map(bri01, 0, 1, 10, 0));
      for (int i=0; i<nLines; i++) {
        float lx = map(i, 0, nLines, px, px+dx);
        line(lx, py, lx, py+dy);
      }
    }
  }
}
