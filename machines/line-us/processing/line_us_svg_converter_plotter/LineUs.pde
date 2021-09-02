class LineUs {
  
  Client lineUs;
  Boolean connected = false;
  String helloMessage;
  String statusMessage;
  
  LineUs(PApplet papp, String address) {
      lineUs = new Client(papp, address, 1337);
      if (lineUs.active()) {
        connected = true;
        helloMessage = readResponse();
        statusMessage = "Connected";
      } else {
        statusMessage = "Unable to connect"; 
      }
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
