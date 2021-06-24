// Control Line-Us in real time with the cursor.
// Uses https://github.com/beardicus/line-us
// The coordinates used by Line-Us range from:
// x: 0-1125, y: 0-2000; approx. 20 units per mm.
// Home is at (350, 0) in Line-Us units.

var bot;
function setup() {
  createCanvas(280, 500);
  background(220);

  // My Line-Us is named 'sfci-lineus-1'.
  // This is set in the official Line-Us app.
  var myLineusOptions = {
    url: 'ws://sfci-lineus-1.local/',
    autoConnect: true,
    autoStart: true,
    concurrency: 5
  };
  bot = new LineUs(myLineusOptions);
}

function mousePressed(){
  bot.clear();
  bot.start();
  botTo(mouseX, mouseY);
  bot.penDown(); 
}

function mouseDragged(){
  botTo(mouseX, mouseY);
}

function mouseReleased(){
  botTo(mouseX, mouseY); 
  bot.penUp();
}

async function botTo (mx, my){
  var scaleFactor = 2000 / height; 
  var rx = round(mx * scaleFactor);
  var ry = round(my * scaleFactor);
  bot.to({x: rx, y: ry});
}

function draw() {
  fill(0); noStroke(); 
  text("Make marks with your cursor.", 15, 25);

  if (mouseIsPressed){
    stroke(0); strokeWeight(2); 
    line(pmouseX, pmouseY, mouseX, mouseY); 
  }
}
