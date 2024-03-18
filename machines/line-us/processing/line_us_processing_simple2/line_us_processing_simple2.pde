// This program executes a drawing on both the Line-Us plotter,
// and on screen, but it's not threaded, so it waits until the 
// plotter is done executing the drawing before rendering on screen. 

import processing.net.*;

LineUs myLineUs;
void setup() {
  size(390,960); // should have aspect ratio of 13:32
  myLineUs = new LineUs(this);
}

//----------------------------------------------
void visualizeLinusLineOnScreen(int lx0,int ly0, int lx1,int ly1){
  // assume canvas has aspect ratio of 13:32
  
  float sx0 = map(lx0, 700,2000, 0,width); 
  float sy0 = map(ly0, 1600,-1600, 0,height);
  float sx1 = map(lx1, 700,2000, 0,width); 
  float sy1 = map(ly1, 1600,-1600, 0,height); 
  line(sx0,sy0, sx1,sy1);
  println(sx0 + " " + sy0); 
}

//----------------------------------------------
void executeLinusLineOnPlotter(int lx0, int ly0, int lx1,int ly1){
  myLineUs.g01(lx0, ly0, 0); 
  myLineUs.g01(lx1, ly1, 0);
  myLineUs.g01(lx1, ly1, 1000); // pen up
}

//----------------------------------------------
void executeScreenLineOnPlotter(float sx0,float sy0, float sx1,float sy1){
  int lx0 = (int) map(sx0, 0,width, 700,2000);
  int ly0 = (int) map(sy0, 0,height, 1600,-1600);
  int lx1 = (int) map(sx1, 0,width, 700,2000);
  int ly1 = (int) map(sy1, 0,height, 1600,-1600);
  executeLinusLineOnPlotter(lx0,ly0, lx1,ly1);
}

//----------------------------------------------
void visualizeAndPlotLinusLine(int lx0,int ly0, int lx1,int ly1){
  visualizeLinusLineOnScreen(lx0,ly0, lx1,ly1);
  executeLinusLineOnPlotter(lx0,ly0, lx1,ly1);
}

//----------------------------------------------
void visualizeAndPlotScreenLine(float sx0,float sy0, float sx1,float sy1){
  line(sx0,sy0, sx1,sy1);
  executeScreenLineOnPlotter(sx0,sy0, sx1,sy1);
}




//----------------------------------------------
void draw() {
  delay(1000);
  
  visualizeAndPlotLinusLine(900,300, 900,-300); // Line-Us coordinates
  visualizeAndPlotLinusLine(1200,300, 1200,-300);
  visualizeAndPlotLinusLine(900,0, 1200,0); 
  visualizeAndPlotLinusLine(1500,150, 1500,-300);
  visualizeAndPlotLinusLine(1500,250, 1500,300);
  
  visualizeAndPlotScreenLine(100, 640, 200,640); // Screen coordinates

  delay(1000);
  noLoop();
}

//----------------------------------------------
// Class to abstract and control the Line-Us. 
// Should not be necessary to modify. 
class LineUs {
  
  Client lineUs;
  Boolean connected = false;
  String helloMessage;
  
  LineUs(PApplet papp) {
    lineUs = new Client(papp, "line-us.local", 1337);
    connected = true;
    helloMessage = readResponse();
  }
  
  String getHelloString() {
    if(connected) {
      return helloMessage;
    } else {
      return("Not connected");
    }
  }
  
  // Close the connection to the Line-us
  void disconnect() {
    lineUs.stop();
    connected = false;
  }
  
  // Send a G01 (interpolated move), and wait for the response before returning
  void g01(int x, int y, int z) {
    String cmd = "G01 X";
    cmd += str(x);
    cmd += " Y";
    cmd += str(y);
    cmd += " Z";
    cmd += str(z);
    sendCommand(cmd);
    readResponse();
  }
  
  // Read from the socket one byte at a time until we get a null
  String readResponse() {
    String line = "";
    int c;
    while(true) {
       c = lineUs.read();
       if(c != 0 && c != -1) {
         line += (char) c;
       } else if(c == 0) {
         break;
       }
    }
    return line;
  }
  
  // Send a command to Line-us
  void sendCommand(String command) {
    command += "\0";
    lineUs.write(command);
  }
}
