// Processing (Java) program
// Randomizes the design on mousePressed.
// Exports an SVG when the user presses a key.

import processing.svg.*;
boolean bDoRecord = false;
int myRandomSeed = 12345;

void setup() {
  size(1056, 816);
}

void draw() {
  background(250);
  randomSeed(myRandomSeed);
  
  if (bDoRecord){
    beginRecord(SVG, "random_lines_" + myRandomSeed + ".svg");
  }
  
  noFill();
  stroke(0);
  strokeWeight(2);
  beginShape();
  for (int i=0; i<16; i++) {
    float px = random(0.1, 0.9) * width;
    float py = random(0.1, 0.9) * height;
    vertex(px, py); // try curveVertex
  }
  endShape();
  
  if (bDoRecord){
    endRecord();
    bDoRecord = false;
  }
  noLoop();
}

void mousePressed(){
  myRandomSeed = millis(); 
  loop();
}

void keyPressed() {
  bDoRecord = true;
  loop(); 
}
