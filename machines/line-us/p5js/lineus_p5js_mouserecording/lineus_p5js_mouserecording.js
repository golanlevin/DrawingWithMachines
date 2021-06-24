// Record a mouse gesture, and play it back on Line-Us.
// Uses https://github.com/beardicus/line-us
//
// The coordinates used by Line-Us range from:
// x: 0-1125, y: 0-2000; approx. 20 units per mm.
// Home is at (350, 0) in Line-Us units.
// The screen graphics have been scaled by 25%.

var bot;
var renderScale = 4.0;
var xPos = [];
var yPos = [];

//-------------------------------
function setup() {
  createCanvas(280, 500);
  createRobot(); 
}

//-------------------------------
function keyPressed(){
  if (key == 'e') {
    executeRobotDrawing();
  }
}

//-------------------------------
function createRobot(){
  
  // My Line-Us is named 'sfci-lineus-1'.
  // This is set in the official Line-Us app.
  var myLineusOptions = {
    url: 'ws://sfci-lineus-1.local/',
    autoConnect: true,
    autoStart: true,
    concurrency: 3
  };
  bot = new LineUs(myLineusOptions);
  
  // Print information about Line-Us 
  // to the JavaScript console:
  print("Line-Us Info:");
  print(bot);
  var diagnostics = bot.getDiagnostics();
  print("Diagnostics:"); 
  print(diagnostics); 
}

//-------------------------------
async function executeRobotDrawing(){
  var startTime = nf(hour(),2) + ":" + nf(minute(),2) + ":" + nf(second(),2); 
  print("Started plotting at " + startTime); 
  
  bot.clear();
  bot.start();
  
  // Note that z-height control is also possible:
  // https://github.com/beardicus/line-us#toxyz
  var nPoints = xPos.length; 
  for (var i=0; i<nPoints; i++){
    if (i == 0){
      bot.moveTo({x: xPos[i], y: yPos[i]});
    } else {
      bot.lineTo({x: xPos[i], y: yPos[i]});
    }
  }
  
  await bot.home();
  
  var endTime = nf(hour(),2) + ":" + nf(minute(),2) + ":" + nf(second(),2); 
  print("Finished plotting at " + endTime); 
}

//-------------------------------
function mousePressed(){
  xPos = [];
  yPos = [];
}

//-------------------------------
function mouseDragged(){
  xPos.push(mouseX * renderScale);
  yPos.push(mouseY * renderScale);
}

//-------------------------------
function draw() {
  background(220);

  // Draw helpful instructions
  fill(0); 
  noStroke(); 
  text("Record a scribble with your cursor.", 15, 25);
  text("Press 'e' to have Line-Us execute it.", 15,40);

  // Draw the user's gesture
  push();
  scale(1.0/renderScale);
  noFill(); 
  stroke(0);
  strokeWeight(4);
  beginShape();
  var nPoints = xPos.length;  
  for (var i=0; i<nPoints; i++){
    vertex(xPos[i], yPos[i]); 
  }
  endShape(); 
  pop();
}
