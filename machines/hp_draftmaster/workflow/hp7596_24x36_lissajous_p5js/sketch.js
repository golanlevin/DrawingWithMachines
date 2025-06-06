// Intended for plotting on a 24" roll with the HP DraftMaster.
// This design is vertical/portrait (24x36, Architecture-D Format).
// Press 's' to export an SVG. See bottom of this file for more info.
//
// Uses https://cdn.jsdelivr.net/npm/p5@1.11.7/lib/p5.js
// Uses https://cdn.jsdelivr.net/npm/p5.plotsvg@latest/lib/p5.plotSvg.js

p5.disableFriendlyErrors = true;

let bDoExportSvg = false; 
const inch = 96;

function setup(){
  createCanvas(24*inch, 36*inch); 
  setSvgResolutionDPI(inch);
  setSvgCoordinatePrecision(6);
}

function keyPressed(){
  if (key == 's'){ 
    bDoExportSvg = true; 
  }
}

function draw(){
  background(255); 
  if (bDoExportSvg){
    beginRecordSVG(this, "hp7596_24x36_lissajous.svg");
  }
  
  stroke(0); 
  strokeWeight(2); 
  noFill();
  
  rect(2*inch,2*inch, 20*inch,32*inch); 
  
  let cx = 12*inch; 
  let cy = 18*inch; 
  let nPoints = 120;
  let radius = inch * 8;
  beginShape();
  for (let i = 0; i < nPoints; i++) {
    let theta = map(i, 0, nPoints, 0, TWO_PI);
    let px = cx + radius * sin(2.0 * theta);
    let py = cy + radius * cos(3.0 * theta);
    vertex(px, py);
  }
  endShape(CLOSE);

  if (bDoExportSvg){
    endRecordSVG();
    bDoExportSvg = false;
  }
}



/* 
To plot using the DraftMaster, 
Make sure you have the following ustom configuration installed:

Create a file called `~/.vpype.toml` (e.g. with `nano ~/.vpype.toml`), paste in the .toml data below, and save the file. vpype automatically seeks this file whenever it runs. Note that this is a "dot file" which is ordinarily hidden, but becomes visible with `ls -l -a`. 

```

[device.hp7596a]
name = "HP DraftMaster II (HP 7596A)"
plotter_unit_length = "0.02488mm"
pen_count = 8

[[device.hp7596a.paper]]
name = "archdh"
aka_names = ["arch-d-horizontal", "arch-d", "architectural-d", "ansi-d"]
info = "Expects a 24-inch roll."
paper_size = ["36in", "24in"]
paper_orientation = "landscape"
origin_location = ["18in", "12in"]
origin_location_reference = "topleft"
x_range = [-18088, 18088]
y_range = [-11512, 11512]
y_axis_up = true
final_pu_params = "-18000,11500"

```

Once this profile is installed, generate HPGL from SVG using the command: 

vpype read hp7596_24x36_lissajous.svg  write --device hp7596a --page-size archdh --absolute hp7596_24x36_lissajous.hpgl

*/

