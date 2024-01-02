// Generate a page with 100 random lines, and export as an SVG file.
// Uses https://github.com/zenozeng/p5.js-svg to export SVG.
// NOTE: p5.js-svg@1.5.1 is only compatible with p5.js v.1.6.0.
// Press a key to export the SVG.

let bDoExport = false;
let theRandomSeed = 12345;

function setup() {
  createCanvas(1056, 816, SVG); // Letter: 11"x8.5" at 96 DPI.
}
function keyPressed() {
  // Press a key to initiate export of the SVG.
  bDoExport = true;
}
function mousePressed(){
  // Click the mouse to choose a new random seed
  theRandomSeed = millis(); 
}

function draw() {
  randomSeed(theRandomSeed); 
  clear(); // Important; starts the SVG canvas fresh.
  if (!bDoExport) {
    background(255);
  }

  stroke(0,0,0); // black line
  for (let i=0; i<100; i++) {  // Make 100 random lines
    let px = width * random(0.05, 0.95);
    let py = height * random(0.05, 0.95);
    let qx = width * random(0.05, 0.95);
    let qy = height * random(0.05, 0.95);
    line(px, py, qx, qy);
  }
  
  if (bDoExport) {
    let svgFilename = "random_lines_p5js.svg"; 
    saveSVG(svgFilename);
    bDoExport = false;
  }
}