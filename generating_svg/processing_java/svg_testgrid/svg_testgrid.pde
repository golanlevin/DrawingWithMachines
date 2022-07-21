// Draws a grid of lines. Good for testing the plotter.
// The lines are ordered to give you the quickest overview
// of whether things are aligned properly :)

//-----------------------
import processing.svg.*;
void setup() {
  size(1056, 816); // Letter: 11"x8.5" at 96 DPI.
  noLoop(); 
}

//-----------------------
void draw() {
  background(255); 
  beginRecord(SVG, "testgrid_11x8.5.svg");
 
  float dpi = 96; 
  float margin = dpi * 0.5;
  float L = margin; 
  float R = width-margin; 
  float T = margin; 
  float B = height-margin;
  
  noFill(); 
  stroke(0,0,0); 
  strokeWeight(1.0); 
  
  // Draw the outer rectangle first
  beginShape(); 
  vertex(L,T); 
  vertex(R,T);
  vertex(R,B);
  vertex(L,B);
  vertex(L,T); 
  endShape(CLOSE);
  
  float gridSize = 0.5; // half-inch grid.
  int nDivsX = (int)((R-L)/(dpi * gridSize));
  int nDivsY = (int)((B-T)/(dpi * gridSize));
  
  // Draw the even grid lines
  for (int i=2; i<nDivsX; i+=2){
    float x = map(i, 0,nDivsX, L,R); 
    if (i%4 == 0){
      line(x,B, x,T); 
    } else {
      line(x,T, x,B); 
    }
  }
  for (int i=2; i<nDivsY; i+=2){
    float y = map(i, 0,nDivsY, T,B); 
    if (i%4 == 0){
      line(R,y, L,y);
    } else {
      line(L,y, R,y);
    }
  }
  // Draw the odd grid lines
  for (int i=1; i<nDivsX; i+=2){
    float x = map(i, 0,nDivsX, L,R); 
    if ((i-1)%4 == 0){
      line(x,B, x,T); 
    } else {
      line(x,T, x,B); 
    }
  }
  for (int i=1; i<nDivsY; i+=2){
    float y = map(i, 0,nDivsY, T,B); 
    if ((i-1)%4 == 0){
      line(R,y, L,y);
    } else {
      line(L,y, R,y);
    }
  }
  
  endRecord();
}
