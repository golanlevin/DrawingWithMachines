// Generate a Lissajous curve, and export it as an SVG file.
// Uses https://github.com/zenozeng/p5.js-svg to export SVG.
// NOTE: p5.js-svg@1.5.1 is only compatible with p5.js v.1.6.0.
// Press a key to export the SVG.

let bDoExport = false;
function setup() {
  createCanvas(1056, 816, SVG); // Letter: 11"x8.5" at 96 DPI.
}

function keyPressed() {
  // Press a key to initiate export of the SVG.
  bDoExport = true;
}

function draw() {
  clear(); // Important; starts the canvas fresh.

  if (!bDoExport) {
    background(255);
  }
  
  let nPoints = floor(map(mouseX, 0,width, 10,100, true));
  let cx = width / 2;
  let cy = height / 2;
  let radius = width / 4;

  stroke(0);
  noFill(); // Important; turn off fill() to prevent duplicate shapes.
  beginShape();
  for (let i = 0; i < nPoints; i++) {
    let theta = map(i, 0, nPoints, 0, TWO_PI);
    let px = cx + radius * sin(2.0 * theta);
    let py = cy + radius * cos(3.0 * theta);
    vertex(px, py);
  }
  endShape(CLOSE);
  
  if (bDoExport) {
    let svgFilename = "lissajous_from_p5-" + nPoints + ".svg"; 
    saveSVG(svgFilename);
    bDoExport = false;
  }
}