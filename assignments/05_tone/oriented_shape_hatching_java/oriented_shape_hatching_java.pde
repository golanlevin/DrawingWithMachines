// PROCESSING v4 VERSION:
// The code below does not handle the case of
// the shape crossing the edge of the canvas.

PGraphics pg;
ArrayList<PVector> shape;
ArrayList<PVector> hatchLines;
float HATCH_ANGLE = radians(40);
int HATCH_SPACING = 5; 
float cx = 150;
float cy = 150;

//-----------------------------------
void setup() {
  size(600, 300);
  pg = createGraphics(300, 300);
  pg.noSmooth();
  
  makeShape();
  computeHatch();
}

void computeHatch() {
  pg.beginDraw();
  pg.background(0);
  pg.fill(255);
  pg.noStroke();

  pg.pushMatrix();
  pg.beginShape();
  for (int i=0; i<shape.size(); i++) {
    float xo = shape.get(i).x - cx;
    float yo = shape.get(i).y - cy;
    float xr = xo * cos(HATCH_ANGLE) - yo * sin(HATCH_ANGLE) + cx;
    float yr = yo * cos(HATCH_ANGLE) + xo * sin(HATCH_ANGLE) + cy;
    pg.vertex(xr, yr);
  }
  pg.popMatrix();
  pg.endShape(CLOSE);
  hatchLines = new ArrayList<PVector>();
  pg.loadPixels();
  color prevCol = color(0, 0, 0);
  int[] pgPixels = pg.pixels;
  for (int y=0; y<pg.height; y+=HATCH_SPACING) {
    for (int x=0; x<pg.width; x++) {
      int index = y*pg.width + x;
      color currCol = pgPixels[index];
      if (brightness(currCol) > brightness(prevCol)) { // line start
        hatchLines.add(new PVector(x+1, y));
      } else if (brightness(currCol) < brightness(prevCol)) { // line end
        hatchLines.add(new PVector(x-1, y));
      }
      prevCol = currCol;
    }
  }
  pg.endDraw();
}

//-----------------------------------
void makeShape() {
  shape = new ArrayList<PVector>(); 
  
  for (int i=0; i<7; i++) {
    float t = map(i, 0, 7, 0, TWO_PI);
    float r = random(40, 110);
    float px = 150 + r * cos(t);
    float py = 150 + r * sin(t);
    shape.add(new PVector(px, py));
  }
}

//-----------------------------------
void draw() {
  HATCH_ANGLE = radians(mouseX);
  background(255);
  computeHatch();

  // draw shape
  fill(255, 200, 200);
  noStroke();
  beginShape();
  for (int i=0; i<shape.size(); i++) {
    float px = shape.get(i).x;
    float py = shape.get(i).y;
    vertex(px,py);
  }
  endShape(CLOSE);

  stroke(0); // draw hatchlines;
  for (int i=0; i<hatchLines.size(); i+=2) {
    PVector s = hatchLines.get(i); // start
    PVector e = hatchLines.get(i+1); // end

    float sxo = s.x - cx;
    float syo = s.y - cy;
    float sxr = sxo * cos(-HATCH_ANGLE) - syo * sin(-HATCH_ANGLE) + cx;
    float syr = syo * cos(-HATCH_ANGLE) + sxo * sin(-HATCH_ANGLE) + cy;

    float exo = e.x - cx;
    float eyo = e.y - cy;
    float exr = exo * cos(-HATCH_ANGLE) - eyo * sin(-HATCH_ANGLE) + cx;
    float eyr = eyo * cos(-HATCH_ANGLE) + exo * sin(-HATCH_ANGLE) + cy;

    line(sxr, syr, exr, eyr);
  }
  image(pg, 300, 0);
}

//-----------------------------------
void mousePressed() {
  makeShape();
  computeHatch();
}
