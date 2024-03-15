import processing.net.*;

// Simple example of how to draw lines with the Line-us API. 
//
// The most important thing to remember is: 
// read the response after sending a command. 
// The TCP buffer on Line-us is small and it does not 
// cope well with having to buffer more than one message.
// Adapted from:
// https://raw.githubusercontent.com/Line-us/Line-us-Programming/master/Processing/HelloWorld/HelloWorld.pde

LineUs myLineUs;
void setup() {
  myLineUs = new LineUs(this);
}

//----------------------------------------------
void draw() {
  delay(1000);
  
  myLineUs.g01(900, 300, 0);
  myLineUs.g01(900, -300, 0);
  myLineUs.g01(900, -300, 1000); // pen up

  myLineUs.g01(1200, 300, 0);
  myLineUs.g01(1200, -300, 0);
  myLineUs.g01(1200, -300, 1000);

  myLineUs.g01(900, 0, 0);
  myLineUs.g01(1200, 0, 0);
  myLineUs.g01(1200, 0, 1000);

  myLineUs.g01(1500, 150, 0);
  myLineUs.g01(1500, -300, 0);
  myLineUs.g01(1500, -300, 1000);

  myLineUs.g01(1500, 250, 0);
  myLineUs.g01(1500, 300, 0);
  myLineUs.g01(1500, 300, 1000);
  
  delay(1000);
  exit();
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
