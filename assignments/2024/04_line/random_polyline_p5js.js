// Template for interactive SVG export. Requires p5.js v.1.6.0.
// Uses https://github.com/zenozeng/p5.js-svg v.1.5.1 to export SVG,
// Available from https://unpkg.com/p5.js-svg@1.5.1

function setup() {
  createCanvas(1056, 816, SVG); // 11x8.5
}

function draw() {
  clear();
  noFill();
  stroke(0);
  strokeWeight(2);

  beginShape();
  for (let i = 0; i < 16; i++) {
    let px = random(0.1, 0.9) * width;
    let py = random(0.1, 0.9) * height;
    vertex(px, py);
  }
  endShape();
  noLoop();
}

function keyPressed() {
  let now = nf(hour(),2) + nf(minute(),2) + nf(second(),2);
  saveSVG("random_lines_" + now + ".svg");
}

function mousePressed() { 
  loop();
}