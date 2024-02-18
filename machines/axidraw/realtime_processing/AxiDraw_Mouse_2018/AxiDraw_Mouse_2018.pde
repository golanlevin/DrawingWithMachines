// Real-time AxiDraw Mouse-Following. 
// by Golan Levin, September 2018. 
//
// Known to work with Processing v3.4 on OSX 10.13.5, 
// Using Node.js v10.10.0, npm v6.4.1.
// Based on AxiDraw_Simple by Aaron Koblin
// https://github.com/koblin/AxiDrawProcessing
// Uses CNCServer by @techninja
// https://github.com/techninja/cncserver
//
// Instructions: in a terminal, type 
// node cncserver --botType=axidraw
// Then run this program. 


CNCServer cnc;
boolean bPlotterIsZeroed;
boolean bFollowingMouse;

void setup() {
  size(1000, 1000); 
  background(0, 0, 0); 
  fill(255, 255, 255); 
  text("Waiting for plotter to connect.", 20, 20); 

  bPlotterIsZeroed = false;
  bFollowingMouse = false;
  cnc = new CNCServer("http://localhost:4242");
  cnc.unlock();
  cnc.penUp();
  println("Plotter is at home? Press 'u' to unlock, 'z' to zero, 'd' to draw");
}

//=======================================
void draw() {

  if (bPlotterIsZeroed) {
    background(255, 255, 255); 
    if (bFollowingMouse) {
      float mx = constrain(mouseX/10.0, 0, 100);
      float my = constrain(mouseY/10.0, 0, 100); 
      cnc.moveTo(mx, my);
      if (mousePressed) {
        cnc.penDown();
      } else {
        cnc.penUp();
      }
    } else {
      fill(0, 0, 0);
      text ("Enable drawing to move plotter.", 20, 20);
      text ("Toggle 'd' to enable drawing.", 20, 35);
    }
  } else {
    background(255, 0, 0); 
    fill(255, 255, 255); 
    text("Must zero plotter before use!", 20, 20);
    text("Move plotter to home position, press 'z'.", 20, 35);
  }
}


//=======================================
void keyPressed() {

  if (key == 'u') {
    cnc.unlock();
    println("Pen unlocked ..... remember to zero!");
  }

  if (key == 'z') {
    cnc.zero();
    bPlotterIsZeroed = true; 
    println("Pen zero'd");
  }

  if (key == 'd') {
    bFollowingMouse = !bFollowingMouse;
    println("bFollowingMouse = " + bFollowingMouse);
  }
}

//=======================================
void exit() {
  cnc.penUp();
  cnc.unlock();
  println("Goodbye!");
  super.exit();
}

void stop() {
  super.exit();
}
