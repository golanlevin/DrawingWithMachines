// Very simple real-time control for uArm Metal (2015).
// For more documentation, see: 
// https://github.com/uArm-Developer/UF_uArm_Metal
// http://download.ufactory.cc/docs/en/uArm-Metal-Developer-Guide.pdf
// https://readthedocs.org/projects/uarmdocs/downloads/pdf/latest/

import processing.serial.*;
Serial myPort;

//-----------------------------------------------------------
void setup() {
  size(256,256); 

  // Print out a list of all available serial ports
  String[] serialPortArray = Serial.list();
  for (int i=0; i<serialPortArray.length; i++) {
    println(i + ":\t" + Serial.list()[i]);
  }

  // Select a serial port. On my computer, I'm using:
  // /dev/tty.usbserial-A600CRMU for the uArm
  int whichPortToUse = 5;
  String portName = Serial.list()[whichPortToUse];
  println("Connected to port #" + whichPortToUse + ": " + portName);
  myPort = new Serial(this, portName, 9600);
}

//-----------------------------------------------------------
void draw() {
  if (mousePressed){
    boolean gripper = false;
    int handRot = 45;
    
    // Some old lissajous nonsense
    float lx = 0.7 * sin(millis()/1500.0);
    float ly = 0.7 * cos(millis()/1500.0);

    int rxi = (int) round(constrain(map(mouseX, 0, width, -90,90),-90,90));
    int ryi = (int) round(constrain(map(lx, -1,1, 0,255),0,255));
    int rzi = (int) round(constrain(map(ly, -1,1, 0,90),0,90));
    
    setArmTo(rxi, ryi, rzi, handRot, gripper);
    
  } else {
    myPort.clear();
  }

}

//-----------------------------------------------------------
// See: https://github.com/uArm-Developer/UF_uArm_Metal/blob/master/examples/RemoteControl/RemoteControl.ino#L30
void setArmTo(int x, int y, int z, int handRot, boolean gripper) {
  // UArm expects 1 for an open gripper and 2 for a closed gripper
  int gripperState = gripper ? 2 : 1;
  byte[] bytes = new byte[11];
  bytes[0] = (byte) 0xFF;
  bytes[1] = (byte) 0xAA;

  bytes[2] = (byte) ((x < 0) ? -1:0); 
  bytes[3] = (byte) (x & 0xFF);
  bytes[4] = 0;
  bytes[5] = (byte) (y & 0xFF);
  bytes[6] = 0; 
  bytes[7] = (byte) (z & 0xFF);

  bytes[8] = (byte)((handRot >> 8) & 0xFF);
  bytes[9] = (byte)(handRot & 0xFF);
  bytes[10] = (byte)gripperState;

  // Send the bytes over to uarm
  myPort.write(bytes);
}
