// Lissajous curve, exported as G-Code with (z) pressure.
// Used as a demo in DwM; do not delete. 
// Press 'g' to save G-Code. 
// Preview your G-Code using: https://ncviewer.com/


// Don't touch these constants:
const pxToMm = 25.4 / 96;
const xMaxMm = 457;
const yMaxMm = 609;
const zMaxMm = 60;

// These Z values are up to you: 
const zUp = 25.0;
const zHi = 21.5;
const zLo = 20.0;

//------------------------------------------------
let bDoExportGCode = false;
function setup() {
  createCanvas(1056, 816); // Letter: 11"x8.5" at 96 DPI.
}

// Press 'g' to initiate saving of the G-Code file
function keyPressed(){
  if (key == 'g'){
    bDoExportGCode = true;
  } 
}

function draw() {
  background(255);
  let points = computePoints(); 
  drawPointsOnScreen(points); 
  savePointsToGCode(points); 
}


//------------------------------------------------
// This function executes the computation of your points, 
// and returns them as an array of PVectors. 
function computePoints(){
  const nPoints = 3600;
  let pts = []; 
  for (let i=0; i<=nPoints; i++){
    let t01 = i/nPoints; 
    let pt = calculatePoint(t01); 
    pts.push(pt); 
  }
  return pts; 
}

//------------------------------------------------
// This function takes a number from 0..1, and
// returns a point with x,y,z data as a PVector.
function calculatePoint(t01){
  let cx = width / 2;
  let cy = height / 2;
  let radius = width / 4;
  
  // Lissajous
  let px = cx + radius * sin(2.0 * TWO_PI * t01 * 0.94);
  let py = cy + radius * cos(3.0 * TWO_PI * t01 * 0.94);
  
  // For this particular design: 
  // "pressure" is Perlin noise, enveloped by a sine wave. 
  let pressure = noise(px/100.0, py/100.0) * sin(t01*PI); 
  let pz = map(pressure, 0,1, zHi, zLo); 
  
  return createVector(px,py,pz); 
}

//------------------------------------------------
// This function previews the points you computed onscreen.
// It draws a polyline spine, and then uses circles 
// to indicate how the z-pressure might look. 
function drawPointsOnScreen(points){
  noFill();
  
  // Draw the spine 
  beginShape();
  for (let i=0; i<points.length; i++){
    let pt = points[i]; 
    vertex(pt.x, pt.y);
  }
  endShape();

  // Preview the lineweight
  const maxLineWeightPx = 20; 
  for (let i=0; i<points.length; i++){
    let pt = points[i]; 
    let d = map(pt.z, zLo,zHi, maxLineWeightPx,0); 
    circle(pt.x, pt.y, d);
  }
}

//------------------------------------------------
// This function takes the points you computed, 
// and exports them to a G-Code text file 
// if the user has enabled the bDoExportGCode latch. 
function savePointsToGCode(points){
  if (bDoExportGCode){
    let gcodeData = [];
    gcodeData.push("$H"); // Home the plotter 
    gcodeData.push("G21"); // Use millimeters
    gcodeData.push("G90"); // Use absolute coordinates
    gcodeData.push("G1 F5000"); // Feed rate of 5000 mm/min

    // Compute each vertex
    for (let i=0; i<points.length; i++){
      let pt = points[i]; 
      let px = pt.x * pxToMm; 
      let py = (height-pt.y) * pxToMm;
      let pz = pt.z;
    
      if ((px >= 0) && (px < xMaxMm) && 
          (py >= 0) && (py < yMaxMm) && 
          (pz >= 0) && (pz < zMaxMm)){
        let gx = nf(px,1,4); 
        let gy = nf(py,1,4); 
        let gz = nf(pz,1,4); 
      
        // Travel to the first point with the pen raised
        if (i==0){gcodeData.push("G1 X"+gx+ " Y"+gy+ " Z"+zUp);}

        // Save a line with the current point's data
        gcodeData.push("G1 X" + gx + " Y" + gy + " Z" + gz);
      } else {
        console.warn("POINT " + i + " OUT OF BOUNDS!");
      }
    }

    gcodeData.push("G1 Z" + zUp); // Raise pen at end
    gcodeData.push("M2"); // End the G-Code program
    gcodeData.push("$H"); // Re-home the plotter
    saveStrings (gcodeData, "lissajous_pressure.gcode.txt");
    bDoExportGCode = false; 
  } 
}