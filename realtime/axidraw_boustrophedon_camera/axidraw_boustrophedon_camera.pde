//---------------------------------------------
import processing.video.*;
Capture cam;
final float UNITS_PER_CM_X = 300/100.0; // 300mm is the size of the A3 plotter
final float UNITS_PER_CM_Y = 300/100.0; // 218?? ///300mm is the size of the A3 plotter

PVector path[];
int nPathPoints;
int currentPathSegment = 0;
boolean bPaused = true;
int lastSegmentStartTime;
float prevMovePercent = 0;
PFont myFont;

// at the command prompt, run:
// node cncserver --botType=axidraw
CNCServer cnc;
boolean bPlotterIsZeroed;
boolean bPlotterIsEnabled;
// NOTE: jna-4.1.0.jar is incompatible with processing v4 camera!


//---------------------------------------------
// EMMANUEL VARIABLES
int moveDurationMillis = 500; //
int stopDurationMillis = 3000; //
float movementOffsetX = (0.0 * UNITS_PER_CM_X);
float movementOffsetY = (0.0 * UNITS_PER_CM_Y);
float movementWidthX  = (10.0 * UNITS_PER_CM_X);
float movementHeightY = (10.0 * UNITS_PER_CM_Y);
int nStepsX = 25;
int nStepsY = 25;

//---------------------------------------------
void setup() {
  size(960, 960); // 11x8.5 @72dpi

  // Create font
  myFont = createFont("Arial", 32);
  textFont(myFont);

  // Create CNC to control AxiDraw
  text("Waiting for plotter to connect.", 20, 20);
  bPlotterIsZeroed = false;
  bPlotterIsEnabled = false;
  cnc = new CNCServer("http://localhost:4242");
  cnc.unlock();
  cnc.penUp();
  println("Plotter is at home? Press 'u' to unlock, 'z' to zero, 'd' to draw");


  // Create camera capture
  String[] cameras = Capture.list();
  if (cameras == null) {
    println("Failed to retrieve the list of available cameras, will try the default...");
    cam = new Capture(this, 640, 480); // DON'T USE THESE CAPTURE DIMENSIONS
  } else if (cameras.length == 0) {
    println("There are no cameras available for capture.");
    exit();
  } else {
    println("Available cameras:");
    printArray(cameras);
    // cam = new Capture(this, cameras[0]);
    cam = new Capture(this, 1920, 1080, "USB Video", 30); // USE THIS
    cam.start();
  }

  nPathPoints = nStepsX * nStepsY;
  path = new PVector[nPathPoints];
  calculateAndStorePath();
}

//---------------------------------------------
void draw() {

  if (cam.available() == true) {
    cam.read();
  }

  if (bPlotterIsZeroed) {
    background(255, 255, 255);

    if (!bPlotterIsEnabled) {
      fill(0, 0, 0);
      text ("Press 'e' to enable plotter.", 20, 40);
    }
    
    image(cam, 0, height-cam.height/2, cam.width/2, cam.height/2);
    displayPath();
    updateMovement();
  } else {
    background(255, 200, 200);
    fill(0, 0, 0);
    text("Must zero plotter before use!", 30, 40);
    text("Move plotter to home position, press 'z'.", 30, 80);
    image(cam, 0, height-cam.height/2, cam.width/2, cam.height/2);
  }
  
  
}

void updateMovement() {
  if (bPlotterIsEnabled) {
    if (bPaused) {
      fill(255, 0, 0);
      text("PAUSED; press space to start", 180, 40);
    } else {

      // Calculate the axidraw position
      int now = millis();
      int elapsedInThisSegment = now - lastSegmentStartTime;
      float movePercent = 1.0;
      if (elapsedInThisSegment < moveDurationMillis) {
        movePercent = map(elapsedInThisSegment, 0, moveDurationMillis, 0, 1);
      }
      PVector p0 = path[currentPathSegment];
      PVector p1 = path[currentPathSegment+1];
      float px = map(movePercent, 0, 1, p0.x, p1.x);
      float py = map(movePercent, 0, 1, p0.y, p1.y);
      if ((prevMovePercent < 1.0) && (movePercent >= 1.0)) {
        cnc.moveTo(px, py);
      }
      prevMovePercent = movePercent;

      // Draw a colored position indicator
      if (movePercent < 1.0) {
        fill(0, 0, 255);
      } else {
        fill(255, 0, 0);
      }
      float sc = 10;
      ellipse(px*sc, py*sc, 12, 12);
      fill(0, 0, 0);
      text(currentPathSegment + " / " + nPathPoints, 180, 40);


      // Capture the photo and update the segment counter
      float totalSegmentDurationMillis = (moveDurationMillis + stopDurationMillis);
      if (elapsedInThisSegment > totalSegmentDurationMillis) {
        lastSegmentStartTime = now;
        currentPathSegment++;
        doCapture();

        if (currentPathSegment >= (nPathPoints-1)) {
          println("Finished.");
          bPaused = true;
        }
      }
    }
  }
}


//---------------------------------------------
void doCapture() {
  String filename = "output/capture_" + nf(currentPathSegment, 4) + ".jpg";
  println("Captured: " + filename);
  cam.save(filename);
}

//---------------------------------------------
void keyPressed() {
  if (key == ' ') {
    bPaused = !bPaused;
    if (!bPaused) {
      lastSegmentStartTime = millis();
      doCapture(); // one at the start
    }
  }


  if (key == 'u') {
    cnc.unlock();
    println("Pen unlocked ..... remember to zero!");
  } else if (key == 'z') {
    cnc.zero();
    bPlotterIsZeroed = true;
    println("Plotter is zero'd");
  } else if (key == 'e') {
    bPlotterIsEnabled = !bPlotterIsEnabled;
    println("bPlotterIsEnabled = " + bPlotterIsEnabled);
  }
}


//---------------------------------------------
void calculateAndStorePath() {
  int count = 0;
  for (int xStep=0; xStep<nStepsX; xStep++) {
    for (int yStep=0; yStep < nStepsY; yStep++) {
      float x1 = movementOffsetX + map(xStep, 0, nStepsX-1, 0, movementWidthX);
      float y1 = movementOffsetY + map(yStep, 0, nStepsY-1, 0, movementHeightY);
      path[count++] = new PVector(x1, y1);
    }
  }
}


/*
//---------------------------------------------
void calculateAndStorePath() {
  // evidently, boustrophedon is incompatible with some panorama stitchers! :(
  int count = 0;
  int dir = 1;
  for (int xStep=0; xStep<nStepsX; xStep++) {
    int yInit = (dir > 0) ? 0 : nStepsY-1;
    int yEnd = (dir > 0) ? nStepsY : -1;
    for (int yStep=yInit; yStep != yEnd; yStep+=dir) {
      float x1 = movementOffsetX + map(xStep, 0, nStepsX-1, 0, movementWidthX);
      float y1 = movementOffsetY + map(yStep, 0, nStepsY-1, 0, movementHeightY);
      path[count++] = new PVector(x1, y1);
    }
    dir = 0-dir;
  }
}
*/


//---------------------------------------------
void displayPath() {
  pushMatrix();
  float sc = 10;

  float x0 = path[0].x;
  float y0 = path[0].y;
  for (int i=0; i<nPathPoints; i++) {
    float x1 = path[i].x;
    float y1 = path[i].y;
    stroke(0, 0, 0, 90);
    line(x0*sc, y0*sc, x1*sc, y1*sc);
    noStroke();
    fill(255, 0, 0, 90);
    ellipse(x1*sc, y1*sc, 8, 8);
    x0 = x1;
    y0 = y1;
  }
  popMatrix();
}

//---------------------------------------------
void exit() {
  cnc.penUp();
  cnc.unlock();
  println("Goodbye!");
  super.exit();
}
void stop() {
  super.exit();
}
