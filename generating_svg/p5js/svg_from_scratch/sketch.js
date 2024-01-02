let theRandomSeed = 0;
let circleX, circleY, circleR;
let lineX0, lineY0, lineX1, lineY1;
let aPolyline = [];

//----------------------------------------------------------------
function setup() {
  createCanvas(297*3, 210*3);
  initialize();
}
function mousePressed(){
  initialize();
}
function keyPressed() {
  createSVG();
}

//----------------------------------------------------------------
function initialize() {
  // Set up variables that will be used to render graphics
  // both to the screen as well as to the SVG file. 
  theRandomSeed = int(millis()); 
  
  circleX = 300; 
  circleY = 200; 
  circleR = 100; 
  
  lineX0 = 50; 
  lineY0 = 100; 
  lineX1 = 150; 
  lineY1 = 300; 
  
  for (let i=0; i<10; i++){
    let px = 50 + i*50; 
    let py = 400 + random(-50,50); 
    aPolyline[i] = createVector(px,py); 
  }
}

//----------------------------------------------------------------
function draw() {
  background('white');
  noFill();
  stroke(0);
  
  circle(circleX, circleY, circleR*2); 
  line (lineX0, lineY0, lineX1, lineY1); 
  beginShape();
  for (let i=0; i<aPolyline.length; i++){
    vertex(aPolyline[i].x, aPolyline[i].y); 
  }
  endShape(); 
}

//----------------------------------------------------------------
const SVG_WIDTH_MM = 297;
const SVG_HEIGHT_MM = 210;

function createSVG() {
  let aDocumentStr = getSVGDocumentHeader();
  const svgScale = SVG_WIDTH_MM / width; // converts pixels to mm.
  // Set graphic elements to be black, unfilled, 1px lineweight.
  const sw1pt = 1.0 / 2.8346456692913; // pt to mm.
  aDocumentStr += '<g fill="none" stroke="black" stroke-width="' + sw1pt + '"> \n';

  // Add strings to the SVG file...
  aDocumentStr += getCircleSVG(circleX, circleY, circleR, svgScale);
  aDocumentStr += getLineSVG(lineX0, lineY0, lineX1, lineY1, svgScale);
  aDocumentStr += getPolylineSVG(aPolyline, svgScale, false);
  
  aDocumentStr += "</g>\n";
  aDocumentStr += "</svg>";
  let svgFilename = "svg_output_" + theRandomSeed; 
  saveStrings([aDocumentStr], svgFilename, "svg"); 
}

//----------------------------------------------------------------
// https://www.w3.org/TR/SVG2/render.html#PaintingShapesAndText
function getSVGDocumentHeader() {
  let aDocumentStr = "";
  aDocumentStr += '<?xml version="1.0" encoding="UTF-8" standalone="no"?> \n';
  aDocumentStr += '\n';
  aDocumentStr += '<svg \n';
  aDocumentStr += '  width="' + SVG_WIDTH_MM + 'mm" \n';
  aDocumentStr += '  height="' + SVG_HEIGHT_MM + 'mm" \n';
  aDocumentStr += '  viewBox="0 0 ' + SVG_WIDTH_MM + " " + SVG_HEIGHT_MM + '" \n';
  aDocumentStr += '  version="1.1" \n';
  aDocumentStr += '  xmlns="http://www.w3.org/2000/svg" \n';
  aDocumentStr += '  xmlns:svg="http://www.w3.org/2000/svg" \n';
  aDocumentStr += '  xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">\n';
  aDocumentStr += '\n';
  return aDocumentStr;
}

//----------------------------------------------------------------
function getLineSVG(px,py, qx,qy, svgScale){
  // Generate SVG for a line segment.
  let lineSVGStr = "  <path\n";
  lineSVGStr += '    d="';
  lineSVGStr += "M ";
  lineSVGStr += nf(px*svgScale, 1, 3) + ",";
  lineSVGStr += nf(py*svgScale, 1, 3);
  lineSVGStr += "L ";
  lineSVGStr += nf(qx*svgScale, 1, 3) + ",";
  lineSVGStr += nf(qy*svgScale, 1, 3);
  lineSVGStr += '"/>\n';
  return lineSVGStr;
}

//----------------------------------------------------------------
function getCircleSVG(px, py, radius, svgScale) {
  // Generate SVG for a circle.
  let cx = px * svgScale;
  let cy = py * svgScale;
  let cr = radius * svgScale; 
  
  let circleSVGStr = '  <circle ';
  circleSVGStr += 'cx="' + nf(cx, 1, 3) + '" ';
  circleSVGStr += 'cy="' + nf(cy, 1, 3) + '" ';
  circleSVGStr += 'r="'  + nf(cr, 1, 3) + '"';
  circleSVGStr += '/>\n';
  return circleSVGStr;
}

//----------------------------------------------------------------
function getPolylineSVG(verts, svgScale, bClosed) {
  // Generate SVG for a polyline.
  let aPolylineStr = "  <path\n";
  aPolylineStr += '    d="';
  for (let j = 0; j < verts.length; j++) {
    if (j == 0) {
      aPolylineStr += "M ";
    } else {
      aPolylineStr += " L ";
    }
    let px = verts[j].x * svgScale;
    let py = verts[j].y * svgScale;
    aPolylineStr += nf(px, 1, 3) + ",";
    aPolylineStr += nf(py, 1, 3);
  }
  if (bClosed) {
    aPolylineStr += " Z"; // close loop if appropriate.
  }
  aPolylineStr += '"/>\n';
  return aPolylineStr;
}