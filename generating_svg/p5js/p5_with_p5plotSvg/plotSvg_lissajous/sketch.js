// Generate a Lissajous curve, and export it as an SVG file.
// Uses https://github.com/golanlevin/p5.plotSvg to export SVG.
// This is known to work with p5.js v.1.11.9 and p5.plotSvg v.0.1.5.
//
// Move the mouse horizontally to change the resolution of the curve.
// Press the 's' key to export the SVG.

p5.disableFriendlyErrors = true; // hush p5
let bDoExportSvg = false;

//--------------------------
function setup() {
  createCanvas(1056, 816); // Letter: 11"x8.5" at 96 DPI.
  setSvgResolutionDPI(96); // Set the SVG resolution to 96 DPI.
}

//--------------------------
function keyPressed(){
  // Press the 's' key to initiate export of the SVG.
  if (key == 's'){ 
    bDoExportSvg = true; 
  }
}

//--------------------------
function draw() {
  background(255);
  stroke(0);
  noFill();

  let nPoints = floor(map(mouseX, 0,width, 10,100, true));
  let cx = width / 2;
  let cy = height / 2;
  let radius = width / 4;

  // If we are exporting, start the SVG recording.
  if (bDoExportSvg){
    let svgFilename = "lissajous_from_p5-" + nPoints + ".svg"; 
    beginRecordSVG(this, svgFilename);
  }
  
  // Draw the Lissajous curve.
  beginShape();
  for (let i = 0; i < nPoints; i++) {
    let theta = map(i, 0, nPoints, 0, TWO_PI);
    let px = cx + radius * sin(2.0 * theta);
    let py = cy + radius * cos(3.0 * theta);
    vertex(px, py);
  }
  endShape(CLOSE);

  // If we are exporting, we need to end the SVG recording.
  if (bDoExportSvg){
    endRecordSVG();
    bDoExportSvg = false;
  }
}