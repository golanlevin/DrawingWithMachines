// This program shows how to use the p5.plotSvg library to export 
// SVG files from a simple "generative art" sketch in p5.js.
// It is known to work with p5.js v.1.11.9 and p5.plotSvg v.0.1.5.
//
// Click the "Regenerate" button for a new composition.
// Click the "Export SVG" button to export the SVG. 


// This line of code disables the p5.js "Friendly Error System" (FES), 
// to prevent some distracting warnings. Feel free to omit.
p5.disableFriendlyErrors = true; // hush, p5

let bDoExportSvg = false; 
let myRandomSeed = 12345;

let regenerateButton; 
let exportSvgButton; 

//--------------------------
function setup() {
  createCanvas(1056, 816); // Letter: 11"x8.5" at 96 DPI.
  setSvgResolutionDPI(96); // Set the SVG resolution to 96 DPI.
  
  regenerateButton = createButton('Regenerate');
  regenerateButton.position(5, 5);
  regenerateButton.mousePressed(regenerate);
  
  exportSvgButton = createButton('Export SVG');
  exportSvgButton.position(95, 5);
  exportSvgButton.mousePressed(initiateSvgExport);
}

//--------------------------
// This function is called when the "Regenerate" button is pressed. 
// It sets the random seed to a fresh number. 
function regenerate(){
  myRandomSeed = round(millis()); 
}

// This function is called when the "Export SVG" button is pressed. 
// It sets a flag to cause the SVG to be exported.
function initiateSvgExport(){
  bDoExportSvg = true; 
}

//--------------------------
function draw(){
  randomSeed(myRandomSeed); 
  background(245); 
  strokeWeight(1);
  stroke(0);
  noFill();
  
  if (bDoExportSvg){
    let svgFilename = "plotSvg_100_random_lines_" + myRandomSeed + ".svg";
    beginRecordSVG(this, svgFilename);
  }

  // Draw 100 random lines: some red, some black.
  let nLines = 100; 
  for (let i=0; i<nLines; i++){
    let x1 = width  * random(0.1, 0.9); 
    let y1 = height * random(0.1, 0.9); 
    let x2 = width  * random(0.1, 0.9); 
    let y2 = height * random(0.1, 0.9); 
    line (x1,y1, x2,y2); 
  }

  if (bDoExportSvg){
    endRecordSVG();
    bDoExportSvg = false;
  }
}