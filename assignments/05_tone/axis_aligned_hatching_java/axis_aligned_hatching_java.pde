ArrayList<PVector> shape; 
ArrayList<PVector> hatchLines;
PGraphics hatchBuffer;
int HATCH_SPACING = 5;

//---------------------------------------
void setup() {
  size(600, 300);
  hatchBuffer = createGraphics(300, 300);

  hatchLines = new ArrayList<PVector>();
  shape = new ArrayList<PVector>();
  makeShape();
  computeHatchedShapes();
}

//---------------------------------------
void makeShape() {
  shape = new ArrayList<PVector>();
  for (int i=0; i<7; i++) {
    float t = map(i, 0, 7, 0, TWO_PI);
    float rx = random(40, 180);
    float ry = random(40, 180);
    float px = floor(150 + rx * cos(t));
    float py = floor(150 + ry * sin(t));
    shape.add(new PVector(px, py));
  }
}

//---------------------------------------
void computeHatchedShapes() {
  float cx = hatchBuffer.width/2;
  float cy = hatchBuffer.height/2;
  int hbh = hatchBuffer.height;
  int hbw = hatchBuffer.width;

  // 1. Draw a version of the input graphics into the offscreen buffer.
  // Shapes to be hatched should be drawn as white shapes on a black background.
  hatchBuffer.beginDraw();
  hatchBuffer.background(0, 0, 0);
  hatchBuffer.fill(255);
  hatchBuffer.noStroke();
  hatchBuffer.beginShape();
  for (int i=0; i<shape.size(); i++) {
    float px = shape.get(i).x; 
    float py = shape.get(i).y;
    hatchBuffer.vertex(px,py);
  }
  hatchBuffer.endShape(CLOSE);
  hatchBuffer.endDraw();

  // 2. Compute hatch lines in the hatchBuffer graphics.
  hatchLines = new ArrayList<PVector>();
  hatchBuffer.loadPixels();
  int nPixels = hbw * hbh; 
  for (int y=0; y<hbh; y+=HATCH_SPACING) {
    int row = y*hbw;
    boolean bActive = false;
    int prevR = 0;
    for (int x=0; x<hbw; x++) {
      int index = (row + x);
      int currR = (int)red(hatchBuffer.pixels[index]); // red byte
      if (x == (hbw-1)) {
        if (bActive) {
          hatchLines.add(new PVector(x,y)); // line end
          bActive = false;
        }
      } else {
        if ((currR >= 128) && (prevR < 128)) {
          hatchLines.add(new PVector(x+1, y)); // line start
          bActive = true;
        } else if ((currR < 128) && (prevR >= 128) && bActive) {
          hatchLines.add(new PVector(x-1, y)); // line end
          bActive = false;
        }
      }
      prevR = currR;
    }
  }
}

//---------------------------------------
void draw() {
  background(255);
  computeHatchedShapes();

  // draw shape
  fill(255,200,200);
  noStroke();
  beginShape();
  for (int i=0; i<shape.size(); i++) {
    float px = shape.get(i).x; 
    float py = shape.get(i).y;
    vertex(px,py);
  }
  endShape(CLOSE);

  stroke(0, 0, 0); // draw hatchlines;
  for (int i=0; i<hatchLines.size(); i+=2) {
    PVector s = hatchLines.get(i); // start
    PVector e = hatchLines.get(i+1); // end
    line(s.x, s.y, e.x, e.y);
  }
  image(hatchBuffer, 300, 0);
}

//---------------------------------------
void mousePressed() {
  makeShape();
  computeHatchedShapes();
}
