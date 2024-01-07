// Realtime control of HP7475-A Plotter in Processing, with HPGL via Serial:
// Draw with the mouse; the plotter copies it as quickly as it can. 
// Tested in Processing v.4.3 in Mac OSX Sonoma 14.1.2
// Golan Levin, January 2024 

import processing.serial.*;
Serial myPlotter; // The plotter is just a serial port
final char LF = 10;  // ASCII linefeed character
final boolean PLOTTING_ENABLED = true; // Toggle plotting

// Default scaling points for 11x8.5in ("A") paper. See page 1-13 of:
// 7475A-InterfacingAndProgrammingManual-07475-90001-274pages-Oct84.pdf located in:
// https://github.com/golanlevin/DrawingWithMachines/tree/main/machines/hp7475a/manuals
final int pxMin =   250;
final int pyMin =   596;
final int pxMax = 10250;
final int pyMax =  7796;

ArrayList<PVector> points; // stores the current squiggle
int currPointIndex = 0; // which point are we currently transmitting

//--------------------------------------------
void setup() {
  size(792, 612); // 11x8.5 @72dpi
  background(250, 245, 235);
  points = new ArrayList<PVector>();

  // Print out a list of all available serial ports
  String[] serialPortArray = Serial.list();
  for (int i=0; i<serialPortArray.length; i++) {
    println(i + ":\t" + Serial.list()[i]);
  }
  // Select a serial port. On my computer, I'm using:
  // /dev/tty.usbserial-PX8G5IK8 for the HP-IB interface
  int whichPortToUse = 5;
  String portName = Serial.list()[whichPortToUse];
  println("Plotting to port #" + whichPortToUse + ": " + portName);

  // Open the port for the plotter
  myPlotter = new Serial(this, portName, 9600);
  myPlotter.bufferUntil(LF); // important setup

  // HPGL: INitialize plotter; SelectPen #1
  myPlotter.write("IN;SP1;");
}

//--------------------------------------------
void mousePressed() {
  points.clear();
  currPointIndex=0;
  points.add(new PVector(mouseX, mouseY));
}
void mouseReleased() {
  points.add(new PVector(mouseX, mouseY));
}

//--------------------------------------------
void draw() {
  if (mousePressed) {
    points.add(new PVector(mouseX, mouseY));
  }

  int nPoints = points.size();
  if (currPointIndex < nPoints) {
    int sx1 = (int)points.get(currPointIndex).x;
    int sy1 = (int)points.get(currPointIndex).y;
    if (currPointIndex == 0) {
      plotterActionTo(sx1, sy1, false);// Moveto
      plotterActionTo(sx1, sy1, true);// Lineto
    }
    if (currPointIndex > 0) {
      int prevPointIndex = currPointIndex-1;
      int sx0 = (int)points.get(prevPointIndex).x;
      int sy0 = (int)points.get(prevPointIndex).y;
      line(sx0, sy0, sx1, sy1);
      if (PLOTTING_ENABLED) {
        plotterActionTo(sx1, sy1, true); // Lineto
      }
    }
    if (currPointIndex == (nPoints-1)) {
      if (PLOTTING_ENABLED) {
        plotterActionTo(sx1, sy1, false); // Moveto
      }
    }
  }
  currPointIndex++;
}

void plotterActionTo(float sx, float sy, boolean bDown) {
  if (PLOTTING_ENABLED) {
    int px = (int)round(map(sx, 0, width, pxMin, pxMax));
    int py = (int)round(map(sy, height, 0, pyMin, pyMax));
    px = constrain(px, pxMin, pxMax);
    py = constrain(py, pyMin, pyMax);
    String command = (bDown) ? "PD" : "PU"; // HPGL: Pen Down or Pen Up
    String outStr = command + px + "," + py + ";" + LF;
    myPlotter.write(outStr);
  }
}
