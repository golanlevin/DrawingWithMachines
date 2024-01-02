// VERY IMPORTANT NOTE:
// The output SVG will still need to be processed by vpype
// in order to trim the points that go beyond the paper bounds!
// Otherwise you will mess up the plotter!!!

//-----------------------
import processing.svg.*;
void setup() {
  size(1056, 816); // Letter: 11"x8.5" at 96 DPI.
}

//-----------------------
void draw() {
  background(255); 
  beginRecord(SVG, "simpleFlowField_from_processing.svg");
  // Loosely adapted from "Flow Fields" by Tyler Hobbs
  // https://tylerxhobbs.com/essays/2020/flow-fields
  
  float margin = width/6;
  float L = -margin; 
  float R = width+margin; 
  float T = -margin; 
  float B = height+margin;
  
  int nCurves = 1000;
  int nSteps = 100; 
  float step_length = width * 0.002; 
  
  noFill(); 
  stroke(0,0,0); 
  strokeWeight(1.0); 
  noiseSeed(millis()); 
  
  // For each curve, pick a random starting location
  for (int c=0; c<nCurves; c++){
    float x = random(L, R); 
    float y = random(T, B); 
    
    // Move that point by an increment 
    // whose orientation is based on noise()
    beginShape(); 
    for (int s=0; s<nSteps; s++){
      float scaled_x = x * 0.005; 
      float scaled_y = y * 0.005; 
      
      float noise_val = noise(scaled_x, scaled_y);
      float angle = map(noise_val, 0.0, 1.0, 0.0, TWO_PI);
      
      float x_step = step_length * cos(angle); 
      float y_step = step_length * sin(angle);
      
      x += x_step;
      y += y_step; 
      vertex(x, y); 
    }
    endShape(); 
  }
  endRecord();
  noLoop(); 
}

//-----------------------
void mousePressed(){
  loop() ;
}
