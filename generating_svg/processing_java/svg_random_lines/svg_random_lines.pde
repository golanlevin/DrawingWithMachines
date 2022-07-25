import processing.svg.*;

void setup() {
  size(1056, 816); // Letter: 11"x8.5" at 96 DPI.
  noLoop(); // Only run this once
}

void draw() {
  background(255);
  beginRecord(SVG, "random.svg");

  stroke(0, 0, 0); // black line
  strokeWeight(1.0); // one pixel thick

  for (int i=0; i<100; i++) {  // make 100 random lines
    float px = random(0, width);
    float py = random(0, height);
    float qx = random(0, width);
    float qy = random(0, height);
    line(px, py, qx, qy);
  }

  endRecord();
}
