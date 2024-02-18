
// For use with CNC Server
// https://github.com/techninja/cncserver/blob/master/API.md
//
// Configured for AxiDraw
// run: node cncserver --botType=axidraw
//
// by Aaron Koblin


class CNCServer {

  public String url;
  
  String penURL;
  String motorsURL;
   
  CNCServer(String url) {
    this.url = url;
    
    penURL = url+"/v1/pen";
    motorsURL = url+"/v1/motors";
  }


  void penDown(){
   JSONObject comJSON = new JSONObject();
   comJSON.put("state", .75);// fully down is 1
   sendPut(penURL, comJSON);
  }
  void penUp(){
   JSONObject comJSON = new JSONObject();
   comJSON.put("state", 0);
   sendPut(penURL, comJSON);
  }
  
  void moveTo(float x, float y){ // Percentage of total width/height (0 to 100)
   JSONObject comJSON = new JSONObject();
   comJSON.put("x", x);
   comJSON.put("y", y);
   sendPut(penURL, comJSON);
  }
  
  void zero(){ // calibrate 0,0
   JSONObject comJSON = new JSONObject();
   comJSON.put("reset", 1);
   sendPut(motorsURL, comJSON);
  }
  
   void unlock(){ // unlock motors
   sendDelete(motorsURL);
  }

}