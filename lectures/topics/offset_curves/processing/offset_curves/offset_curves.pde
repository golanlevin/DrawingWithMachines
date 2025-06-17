import processing.svg.*;
import processing.embroider.*;
PEmbroiderGraphics E;

boolean bEnableRecord = false;
int myRandomSeed = 12345; 
int demoMode = 1; 


void setup() {
  size(1056, 816); // 11x8.5@96dpi
  pixelDensity(1); // needed for PEmbroider
  E = new PEmbroiderGraphics(this, width, height);
  E.setOutOfBoundsHandler(E.IGNORE);
}


//------------------------------------------------
// Press spacebar to save an SVG file. 
// Press 'r' to randomize the design. 

void keyPressed() {
  if ((key == 's') || (key == 'S')) {
    bEnableRecord = true;
  } else if ((key == 'r') || (key == 'R')) {
    myRandomSeed = int(millis());
  } else if (key == '1'){
    demoMode = 1; 
  } else if (key == '2'){
    demoMode = 2; 
  } else if (key == '3'){
    demoMode = 3; 
  } 
}


//------------------------------------------------
void draw() {
  background(255);
  
  fill(0); 
  noStroke(); 
  text("Requires PEmbroider library from https://github.com/CreativeInquiry/PEmbroider", 20,30); 
  text("Press 'S' to save SVG to current sketch folder.", 20,50); 
  text("Press 'R' to randomize the design.", 20,70); 
  text("Press keys 1-3 to change demo mode.", 20, 90); 
  if (demoMode == 1){
    text("Demo: Naive offset method", 20,110); 
  } else if (demoMode == 2){
    text("Demo: Smart inset method", 20,110); 
  } else if (demoMode == 3){
    text("Demo:multi-shape topologies", 20,110); 
  } 
  
  
  randomSeed(myRandomSeed); 
  strokeWeight(1);
  stroke(0);
  noFill();
  

  if (bEnableRecord) {
    beginRecord(SVG, "offset_curves_" + millis() + ".svg");
    // Saves the output SVG into the current sketch folder. 
    // As usual, I recommend treating the resulting SVG with vpype afterwards, using e.g. the command
    // vpype read offset_curve_design.svg crop 0.5in 0.5in 10.0in 7.5in write offset_curve_design.svg show
  }
  
  switch(demoMode){
    case 1: 
      drawShapeWithNaiveOffsets(); // Uses a naive method. 
      break;
    case 2: 
      drawShapeWithSmartInsets(); // Uses a smart inset method
      break;
    case 3: 
      drawMultipleShapesWithOffsets();
      break;
  }
  

  if (bEnableRecord) {
    bEnableRecord = false;
    endRecord();
  }
}



//============================================================
void drawMultipleShapesWithOffsets() {
  loop();

  ArrayList<PVector> inputPolygon0 = new ArrayList<PVector>();
  inputPolygon0.add(new PVector(300, 250)); // clockwise
  inputPolygon0.add(new PVector(500, 200));
  inputPolygon0.add(new PVector(500, 400));
  inputPolygon0.add(new PVector(400, 350));
  inputPolygon0.add(new PVector(350, 400));
  inputPolygon0.add(new PVector(300, 250));

  // Note how this counter-clockwise shape produces a hole!
  ArrayList<PVector> inputPolygon1 = new ArrayList<PVector>();
  inputPolygon1.add(new PVector(600, 250)); 
  inputPolygon1.add(new PVector(580, 350));
  inputPolygon1.add(new PVector(650, 400));
  inputPolygon1.add(new PVector(700, 350));
  inputPolygon1.add(new PVector(700, 250));
  inputPolygon1.add(new PVector(600, 250));

  // Generate a random 17-sided polygon centered on the mouse.
  ArrayList<PVector> inputPolygon2 = new ArrayList<PVector>();
  inputPolygon2 = new ArrayList<PVector>();
  int nSides = 17;
  for (int i=0; i<nSides; i++) {
    float t = map(i, 0, nSides, 0, TWO_PI);
    float px = mouseX + random(300, 350)*cos(t);
    float py = mouseY + random(230, 330)*sin(t);
    PVector vIn = new PVector(px, py);
    inputPolygon2.add(vIn);
  } inputPolygon2.add(inputPolygon2.get(0));


  // Install the input polygons into an ArrayList<ArrayList<PVector>>.
  ArrayList<ArrayList<PVector>> inputPolygons;
  inputPolygons = new ArrayList<ArrayList<PVector>>();
  inputPolygons.add(inputPolygon0);
  inputPolygons.add(inputPolygon1);
  inputPolygons.add(inputPolygon2);

  // Draw the input polygons
  strokeWeight(3);
  noFill(); 
  for (int j=0; j<inputPolygons.size(); j++) {
    beginShape();
    for (int i=0; i<inputPolygons.get(j).size(); i++) {
      PVector v = inputPolygons.get(j).get(i);
      vertex(v.x, v.y);
    }
    endShape(CLOSE);
  }
  
  // Draw inset curves inside the input polygon.
  strokeWeight(1);
  noFill(); 
  for (int k=1; k<10; k++) {
    ArrayList<ArrayList<PVector>> outputPolygons;
    float offsetDistance = k*10;
    outputPolygons = E.insetPolygonsRaster(inputPolygons, offsetDistance);
    for (int j=0; j<outputPolygons.size(); j++) {
      ArrayList<PVector> aPolygon = outputPolygons.get(j);
      beginShape();
      for (int i=0; i<aPolygon.size(); i++) {
        PVector v = aPolygon.get(i);
        vertex(v.x, v.y);
      }
      endShape(CLOSE);
    }
  }
}


//============================================================
void drawShapeWithSmartInsets() {

  // Generate a random 17-sided polygon for the input.
  ArrayList< PVector > inputPolygon;
  inputPolygon = new ArrayList<PVector>();
  int nSides = 17;
  for (int i=0; i<nSides; i++) {
    float t = map(i, 0, nSides, 0, TWO_PI);
    float px = width/2  + random(150, 350)*cos(t);
    float py = height/2 + random(150, 350)*sin(t);
    PVector vIn = new PVector(px, py);
    inputPolygon.add(vIn);
  }
  inputPolygon.add(inputPolygon.get(0)); // optionally, close the shape


  // Draw the input polygon
  strokeWeight(3);
  noFill(); 
  beginShape();
  for (int i=0; i<inputPolygon.size(); i++) {
    PVector v = inputPolygon.get(i);
    vertex(v.x, v.y);
  }
  endShape();
  strokeWeight(1);
  noFill(); 

  // Draw inset curves inside the input polygon:
  // First, install the input polygon into an ArrayList<ArrayList<PVector>>.
  ArrayList<ArrayList<PVector>> inputPolygons;
  inputPolygons = new ArrayList<ArrayList<PVector>>();
  inputPolygons.add(inputPolygon);
  // Next, for each of the offset distances, 
  // fetch and draw the resulting offset curves. 
  // Note that there could be more than one (e.g. for dumbbell shapes). 
  for (int k=1; k<50; k++) {
    ArrayList<ArrayList<PVector>> outputPolygons;
    float offsetDistance = k*10;
    outputPolygons = E.insetPolygonsRaster(inputPolygons, offsetDistance);
    for (int j=0; j<outputPolygons.size(); j++) {
      ArrayList<PVector> aPolygon = outputPolygons.get(j);
      beginShape();
      for (int i=0; i<aPolygon.size(); i++) {
        PVector v = aPolygon.get(i);
        vertex(v.x, v.y);
      }
      endShape();
    }
  }
}




//============================================================
void drawShapeWithNaiveOffsets() {
  // Use a naive method for drawing offset curves. 

  // Generate a random 17-sided polygon for the input.
  ArrayList< PVector > inputPolygon;
  inputPolygon = new ArrayList<PVector>();
  int nSides = 17;
  for (int i=0; i<nSides; i++) {
    float t = map(i, 0, nSides, 0, TWO_PI);
    float px = width/2  + random(150, 250)*cos(t);
    float py = height/2 + random(150, 250)*sin(t);
    PVector vIn = new PVector(px, py);
    inputPolygon.add(vIn);
  }
  inputPolygon.add(inputPolygon.get(0)); // optionally, close the shape

  // Draw the input polygon
  strokeWeight(3);
  noFill(); 
  beginShape();
  for (int i=0; i<inputPolygon.size(); i++) {
    PVector v = inputPolygon.get(i);
    vertex(v.x, v.y);
  }
  endShape(CLOSE);

  // Draw a set of 10 offset curves. 
  // Click mouse to switch between interior and exterior.
  strokeWeight(1); 
  noFill(); 
  int dir = (mousePressed) ? -1:1; 
  for (int j=0; j<10; j++) {
    ArrayList<PVector> offsetPolygon;
    float offsetDistance = j*10*dir;
    offsetPolygon = E.offsetPolyline(inputPolygon, offsetDistance); // naive method
    beginShape();
    for (int i=0; i<offsetPolygon.size(); i++) {
      PVector v = offsetPolygon.get(i);
      vertex(v.x, v.y);
    }
    endShape(CLOSE);
  }
}
