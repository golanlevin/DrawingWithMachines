// Generate a Lissajous curve, render with Line-Us
// Uses https://github.com/beardicus/line-us
// The coordinates used by Line-Us range from:
// x: 0...1125, y: 0...2000; 20 units per mm.
// Home is at (350, 0).

function setup() {
  createCanvas(280,500);
  noLoop(); 

  var bot = new LineUs({url: 'ws://sfci-lineus-1.local/'});
  print(bot);

  background(220);
  stroke(0);
  noFill(); 

  // When the robot connects, draw the figure.
  bot.on('connected', async () => {

    var nPoints = 100;
    var cx = width/2; 
    var cy = height/2; 
    var radius = width/4;

    // 'mult' is a scaling factor for the robot.
    var mult = 2000 / height; 

    beginShape(); 
    for (var i=0; i<=nPoints; i++) {
      var theta = map(i, 0, nPoints, 0, TWO_PI);
      var px = cx + radius * cos(3.0 * theta); 
      var py = cy + radius * sin(2.0 * theta);

      // Draw the vertex on-screen.
      vertex(px, py); 
      
      // Plot the (scaled-up) vertex with the robot.
      // Note: Line-Us strongly prefers integers!!
      var pxi = round(px * mult);
      var pyi = round(py * mult); 
      if (i === 0){ 
        bot.moveTo({x: pxi, y: pyi});
      } else {
        bot.lineTo({x: pxi, y: pyi});
      }
    }
    endShape(); 

    await bot.home();
    await bot.disconnect();
    print("Done!");
  });
}