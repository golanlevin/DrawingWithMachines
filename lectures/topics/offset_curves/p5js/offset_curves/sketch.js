p5.disableFriendlyErrors = true; // hush
let bDoExportSvg = false; 

function setup() {
  createCanvas(11*96, 8.5*96);
}


function keyPressed(){
  if ((key == 's') || (key == 'S')) { 
    bDoExportSvg = true; 
  }
}


function draw() {
  background(250);

  if (bDoExportSvg){
    beginRecordSVG(this, "myOutput.svg");
  }

  // Generate a wiggly polyline, our 'spine'.
  let nPoints = 32; 
  let aPolyline = [];
  let deltaT = millis()/5000.0; 
  for (let i=0; i<nPoints; i++){
    let px = map(i, 0, nPoints-1, 200, width-200); 
    let py = height/2 + 500 * (noise(px/300.0 + deltaT) - 0.5); 
    let v = createVector(px, py);
    aPolyline.push(v); 
  }
  // Draw the wiggly polyline.
  strokeJoin(ROUND); 
  strokeWeight(3); 
  noFill(); 
  stroke(0); 
  beginShape();
  for (let i=0; i<aPolyline.length; i++){
    let v = aPolyline[i]; 
    vertex(v.x, v.y); 
  }
  endShape(); 
  

  // We compute the offset curves using Lingdong Huang's 'unmess' library, 
  // which is available here: https://github.com/LingDong-/squiggy
  // The unmess code is designed to clean up a messy, self-intersecting closed polyline.
  // First, we compute a naive offset curve -- ourselves -- around both sides of the polyline.
  // Then we use unmess to simplify that curve, removing bowties and other crud.
  // In this design, this process is then repeated for a number of offset curves.

  let nOffsetCurves = 10
  let offsetSpacing = 10; 
  for (let r=0; r<nOffsetCurves; r++){ 

    let w = (1+r) * offsetSpacing;
    let N = aPolyline.length;
    let l0 = [];
    let l1 = [];
    for (let i=0; i<N-1; i++){
      let a = aPolyline[(i%N)];
      let b = aPolyline[(i+1)%N];
      let dx = b.x-a.x;
      let dy = b.y-a.y;
      let l = sqrt(dx*dx+dy*dy);
      let nx = dx/l*w;
      let ny = dy/l*w;
      let xx = -ny;
      let yy = nx;
    
      l0.push([a.x+xx,a.y+yy]);
      l1.push([a.x-xx,a.y-yy]);
      l0.push([b.x+xx,b.y+yy]);
      l1.push([b.x-xx,b.y-yy]);
    }
    
    // Add endcap to the l1 polyline.
    let a = aPolyline[N-2];
    let b = aPolyline[N-1];
    let abdx = b.x-a.x;
    let abdy = b.y-a.y;
    for (let i=0; i<12; i++){
      let t = map(i, 0,12, 0,PI) + atan2(abdy,abdx) - PI/2;
      let xx =  1* w * cos(t); 
      let yy =  1* w * sin(t);
      l1.push([b.x+xx,b.y+yy]);
    }
    // reverse the l0 polyline to match the direction of l1, and add an endcap to it.
    // Reversal is necessary because unmess expects the input to be a closed loop.
    l0.reverse();
    let c = aPolyline[1];
    let d = aPolyline[0];
    let cddx = d.x-c.x;
    let cddy = d.y-c.y;
    for (let i=0; i<12; i++){
      let t = map(i, 0,12, 0,PI) + atan2(cddy,cddx) - PI/2;
      let xx =  1* w * cos(t); 
      let yy =  1* w * sin(t);
      l0.push([d.x+xx,d.y+yy]);
    }

    // Compute the unmessed polyline.
    let unmessInput = l1.concat(l0);
    let unmessResults = unmess.unmess(unmessInput,{
      hole_policy:unmess.HOLE_AGGRESSIVE,
      epsilon:0.001, 
      search_percent:0.3,
    });
    let unmessPoly = unmessResults[0]; 
    
    // Draw the unmessed polyline.
    strokeWeight(1);
    stroke(0); 
    beginShape();
    for (let i=0; i<unmessPoly.length; i++){
      let unmessedPt = unmessPoly[i]; 
      vertex(unmessedPt[0], unmessedPt[1]); 
    }
    endShape(CLOSE); 
    
  }

  if (bDoExportSvg){
    endRecordSVG();
    bDoExportSvg = false;
  }
}