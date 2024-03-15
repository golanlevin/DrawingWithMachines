import processing.net.*;
// Control the Line-Us in real time with the mouse. 

LineUs myLineUs;
int prevMouseX = 0; 
int prevMouseY = 0; 
boolean prevMousePressed = false;
PImage drawingAreaImg;

//-------------------------------------
void setup() {
  size(400,1000);
  
  myLineUs = new LineUs(this);
  prevMouseX = mouseX; 
  prevMouseY = mouseY;
  prevMousePressed = mousePressed;
  drawingAreaImg = loadImage("drawing-area.png"); 
  
  background(255);
  tint(255,255,255, 60);
  image(drawingAreaImg, 0,0,400,1000); 
}

//-------------------------------------
void draw() {
  delay(30);
  
  
  if (mousePressed){
    float delta = dist(prevMouseX,prevMouseY, mouseX,mouseY); 
    if (delta > 0){
      PVector prevCoord = getLineUsCoordinate(prevMouseX, prevMouseY); 
      PVector currCoord = getLineUsCoordinate(mouseX, mouseY); 
      myLineUs.g01((int)prevCoord.x, (int)prevCoord.y, 0);
      myLineUs.g01((int)currCoord.x, (int)currCoord.y, 0);
      
      stroke(0); 
      line(prevMouseX,prevMouseY, mouseX,mouseY);
    }
  } else {
    if (prevMousePressed){
      PVector prevCoord = getLineUsCoordinate(prevMouseX, prevMouseY);
      myLineUs.g01((int)prevCoord.x, (int)prevCoord.y, 1000);
    }
  }
  
  prevMouseX = mouseX; 
  prevMouseY = mouseY;
  prevMousePressed = mousePressed; 
}

PVector getLineUsCoordinate(float mx, float my){
  int lx = round(map(mx, 0,width, 700,1900)); 
  int ly = round(map(my, 0,height, 1500,-1500));
  PVector coord = new PVector(lx,ly,0);
  return coord;
}

//-------------------------------------------------------
//An example class to show how to use the Line-us API
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
  
  //Close the connection to the Line-us
  void disconnect() {
    lineUs.stop();
    connected = false;
  }
  
  //Send a G01 (interpolated move), and wait for the response before returning
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
  
  //Read from the socket one byte at a time until we get a null
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
  
  //Send the command to Line-us
  void sendCommand(String command) {
    command += "\0";
    lineUs.write(command);
  }
}
