// A simple grid calibration pattern.
// You'll see some wiggly nonlinearities!
//
// Uses https://github.com/beardicus/line-us
// The coordinates used by Line-Us range from:
// x: 0-1125, y: 0-2000; approx. 20 units per mm.
// Home is at (350, 0) in Line-Us coordinates.
// The canvas graphics are shown at 25% scale. 

var bot; 
var gridRes = 8; 

function setup() {
  createCanvas(280,500);

  // This is where you need to put your robot's name.
  // Mine is called 'sfci-lineus-1'. This name is
  // set in the official Line-Us app. 
  var myLineusOptions = {
    url: 'ws://sfci-lineus-1.local/',
    autoConnect: true,
    autoStart: true,
    concurrency: 3
  };

  bot = new LineUs(myLineusOptions);
  executeDrawing();
}


function draw(){
  // Renders a grid to the (browser) screen.
  background(220);
  stroke(0);

  var w = width;
  var h = height;
  
  for (var i=0; i<=gridRes; i++){
    var px = map(i, 0,gridRes, 0,w); 
    line(px, 0, px, h);
  }
  for (var i=0; i<=gridRes; i++){
    var py = map(i, 0,gridRes, 0,h); 
    line(0, py, w, py);
  }
  line(0, 0, w, h);
  line(0, h, w, 0);
}


async function executeDrawing(){
  // Executes a very similar drawing on the robot.
  bot.clear();
  bot.start();
  bot.on('connected', async () => {

    // 'mult' is a scaling factor for the robot!
    var mult = 2000 / height; 
    var w = width * mult;
    var h = height * mult;
    
    for (var i=0; i<=gridRes; i++){
      var px = map(i, 0,gridRes, 0,w); 
      bot.moveTo({x: px, y: 0});
      bot.lineTo({x: px, y: h});
    }
    for (var i=0; i<=gridRes; i++){
      var py = map(i, 0,gridRes, 0,h); 
      bot.moveTo({x: 0, y: py});
      bot.lineTo({x: w, y: py});
    }

    bot.moveTo({x: 0, y: 0});
    bot.lineTo({x: w, y: h});
    bot.moveTo({x: 0, y: h});
    bot.lineTo({x: w, y: 0});
 
    await bot.home();
    await bot.disconnect();
    print("Done Plotting!");
  });
}