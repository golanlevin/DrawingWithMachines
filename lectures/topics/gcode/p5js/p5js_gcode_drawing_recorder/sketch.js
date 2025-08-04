// This p5.js 1.11 sketch records a series of mouse marks 
// and exports a GCode file when the 's' key is pressed.
// Golan Levin, August 2025

let bDoExportGCode = false; 
let gcodeData = [];
let marks = [];
let currentMark = []; 
const pxToMm = 25.4 / 96; // (25.4 mm/in) / (96 px/in)

function setup() {
  createCanvas(384, 576); // 4" x 6"
}

//-----------------------
function keyPressed(){
  if (key == 's'){
    bDoExportGCode = true; 
  } else if (key == ' '){
    marks = [];
    currentMark = [];
  }
}

//-----------------------
function draw(){
  background(245); 
  fill(0); 
  noStroke();
  text("Draw to begin; press 's' to save, space to clear", 6,15); 
  strokeWeight(1);
  stroke(0);
  noFill();
  
  const feedRate = 5000; // mm/min
  const zHi = 25; 
  const zLo = 20; 
  
  if (bDoExportGCode){
    gcodeData = [];
    gcodeData.push("$H"); // Home the plotter - this is specific to Bantam
    gcodeData.push("G21"); // Tell the plotter to use millimeters
    gcodeData.push("G90"); // Use absolute coordinates, not relative
    gcodeData.push("G1 F" + feedRate); // Let's use a feed rate of 5000 mm/min
  }

  // Draw each of the stored marks
  for (let j=0; j<marks.length; j++){
    if (bDoExportGCode){
      gcodeData.push("(mark " + j + " )"); // add a GCode comment
      gcodeData.push("G1 Z" + zHi); // start with pen raised.
    }
    beginShape();
    for (let i=0; i<marks[j].length; i++){
      let px = marks[j][i].x;
      let py = marks[j][i].y; 
      let gx = nf(px * pxToMm,1,4); 
      let gy = nf((height-py) * pxToMm,1,4); 
      if (i==0){
        // Travel to the first point with the pen raised
        gcodeData.push("G1 X" + gx + " Y" + gy + " Z" + zHi);
      }
      gcodeData.push("G1 X" + gx + " Y" + gy + " Z" + zLo);
      vertex(px,py); 
    }
    gcodeData.push("G1 Z" + zHi); // raise pen at end
    endShape(); 
  }

  if (bDoExportGCode){
    // End exporting, if doing so
    gcodeData.push("$H"); // Re-home the plotter
    gcodeData.push("M2"); // End the GCode program
    let gcodeFilename = "gcode_recording_" + frameCount + ".gcode.txt";
    saveStrings (gcodeData, gcodeFilename);
    bDoExportGCode = false;
  }
  
  // Note: the currently active mark is not exported
  stroke(255,0,0, 80); 
  beginShape();
  for (let i=0; i<currentMark.length; i++){
    vertex(currentMark[i].x, currentMark[i].y); 
  }
  endShape(); 
}

//-----------------------
function mousePressed(){
  currentMark = [];
  currentMark.push(createVector(mouseX, mouseY)); 
}
function mouseDragged(){
  currentMark.push(createVector(mouseX, mouseY)); 
}
function mouseReleased(){
  if (currentMark){
    marks.push(currentMark); 
  }
}