// Generate a Lissajous curve, and export it as an SVG file.
// Uses https://www.npmjs.com/package/svg5 to export SVG.
// Right-click on the graphic to download the SVG.
// Note that p5.js is not included at all. 

const w = 1056;
const h = 816;

precision(2);
createSVG(w, h);

var nPoints = 100;
var cx = w / 2;
var cy = h / 2;
var radius = w / 4;

strokeWidth(1.0);
stroke(0);
noFill();

beginShape();
for (var i = 0; i < nPoints; i++) {
  var theta = map(i, 0, nPoints, 0, Math.PI * 2.0);
  var px = cx + radius * Math.sin(2.0 * theta);
  var py = cy + radius * Math.cos(3.0 * theta);
  vertex(px, py);
}
endShape(CLOSE);

render();