// Generate a Lissajous curve, and export it as an SVG file.
// Uses https://github.com/zenozeng/p5.js-svg to export SVG.
// See index.html for the inclusion of p5.js-svg@1.0.7.js

function setup() {
  createCanvas(1056, 816, SVG); // Letter: 11"x8.5" at 96 DPI.
  noLoop(); // Just execute once!
}

function draw() {
  clear();
  
  stroke(0); 
  noFill(); // Don't create duplicate shapes.

  var nPoints = 100;
  var cx = width/2; 
  var cy = height/2; 
  var radius = width/4; 

  beginShape(); 
  for (var i=0; i<nPoints; i++) {
    var theta = map(i, 0, nPoints, 0, TWO_PI);
    var px = cx + radius * sin(2.0 * theta);
    var py = cy + radius * cos(3.0 * theta); 
    vertex(px, py);
  }
  endShape(CLOSE); 
  saveSVG("lissajous-from-p5.svg");
}