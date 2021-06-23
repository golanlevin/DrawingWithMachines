// Record the mouse and play it back on Line-Us.
// Uses https://github.com/beardicus/line-us
// Note that there is also z-height control:
// https://github.com/beardicus/line-us#toxyz
//
// The coordinates used by Line-Us range from:
// x: 0...1125, y: 0...2000; 20 units per mm.
// Home is at (350, 0).

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
  if (key == 'e') executeRobotDrawing();
}

//-------------------------------
function createRobot(){
  var myLineusOptions = {
    url: 'ws://sfci-lineus-1.local/',
    autoConnect: true,
    autoStart: true,
    concurrency: 3
  };

  bot = new LineUs(myLineusOptions);
  print("Line-Us Robot:"); 
  print(bot);
}

//-------------------------------
async function executeRobotDrawing(){
  bot.clear();
  bot.start();

  var nPoints = xPos.length; 
  if (nPoints > 0){
    bot.moveTo({x: xPos[0], y: yPos[0]}); 
    for (var i=1; i<nPoints; i++){
      bot.lineTo({x: xPos[i], y: yPos[i]});
    }
  }
  
  await bot.home();
  print("Line-Us Done!");
}

//-------------------------------
function mouseDragged(){
  xPos.push(mouseX * renderScale);
  yPos.push(mouseY * renderScale);
}

//-------------------------------
function draw() {
  background(220);

  fill(0); noStroke(); 
  text("Record a scribble.", 15, 25);
  text("Press 'e' for Line-Us to draw it.", 15,40);

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
