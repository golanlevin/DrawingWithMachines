import processing.serial.*;

Serial myPort = null;
String serialBuffer = "";
boolean bVerbose = true; 
boolean bWaitingForOK = true;
float px,py; // prev point

final int maxX = 609; // 24x18" in mm
final int maxY = 457; 

void setup(){
  size(609, 457); 
  background(255); 
  
  String portName = "/dev/cu.usbmodem1301"; 
  try {
    myPort = new Serial(this, portName, 115200);
    myPort.clear();
  } catch (RuntimeException e) {
    println("Could not open serial port: " + portName);
    println("Available ports are:");
    printArray(Serial.list());
  }
  
  delay(1000);             // Wait for the port to settle
  if (myPort != null){
    sendGCodeCommand("$H");  // Home the machine
    delay(10000);            // Wait for homing to complete
    sendGCodeCommand("G90"); // Absolute positioning mode
    String cmd = createG1MotionCommand(maxX/2, maxY/2, 20, 10000); 
    sendGCodeCommand(cmd);
  }
}

void draw(){
  checkForOK(); // poll for return value
  if (!bWaitingForOK) {
    
    // Generate a random destination
    float randomX = maxX * random(0.1, 0.9);
    float randomY = maxY * random(0.1, 0.9);
    
    // Draw a debug view line
    line(px,py, randomX,randomY); 

    // Construct and transmit the GCode command
    String gcodeCommand = createG1MotionCommand(randomX, randomY, 20, 10000); 
    sendGCodeCommand(gcodeCommand);
    
    // Update state machine
    bWaitingForOK = true;
    px = randomX; 
    py = randomY; 
  }
}

void keyPressed(){
  bWaitingForOK = false; 
}


void checkForOK() {
  // The ArtFrame returns the String "ok" when an action completes.
  if (myPort != null){
    while (myPort.available() > 0) {
      char inChar = myPort.readChar();
      if (inChar == '\n' || inChar == '\r') {
        if (serialBuffer.trim().length() > 0) {
          if (bVerbose){
            println("Received: " + serialBuffer.trim());
          }
        }
        if (serialBuffer.trim().equals("ok")) {
          bWaitingForOK = false;
        }
        serialBuffer = "";
      } else {
        serialBuffer += inChar;
      }
    }
  } else {
    bWaitingForOK = false; 
  }
}

String createG1MotionCommand(float x, float y, float z, float f){
  String cmd = "G1 ";
  cmd += "X" + nf(x, 0, 3) + " "; 
  cmd += "Y" + nf(y, 0, 3) + " ";
  cmd += "Z" + nf(z, 0, 3) + " ";
  cmd += "F" + int(f);
  return cmd; 
}

void sendGCodeCommand(String cmd){
  if (myPort != null){
    if (bVerbose){
      println("Sending: " + cmd);
    }
    myPort.write(cmd + "\r");
  }
}

void dispose() {
  if (myPort != null) {
    println("Closing serial port.");
    myPort.stop();
    myPort = null;
  }
}

void exit() {
  dispose();
  super.exit();
}
