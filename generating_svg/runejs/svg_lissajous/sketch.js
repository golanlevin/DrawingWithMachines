// Generate a Lissajous curve, and export it as an SVG file.
// Uses rune.js v1.1.8 by Rune Madsen:
// https://runemadsen.github.io/rune.js/
// Uses rune.save.js v0.4.1 by Jorge Moreno:
// https://www.npmjs.com/package/rune.save.js
// See index.html for includes. 

// Letter: 11"x8.5" at 96 DPI.
var r = new Rune({
  container: "body",
  width: 1056,
  height: 816
});

var nPoints = 100;
var cx = r.width/2; 
var cy = r.height/2; 
var radius = r.width/4; 

var liss = r.polygon(0,0);

for (var i=0; i<nPoints; i++) {
  var theta = Rune.map(i, 0, nPoints, 0, 2.0*Math.PI); 
  var px = cx + radius * Math.sin(2.0 * theta);
  var py = cy + radius * Math.cos(3.0 * theta); 
  liss.lineTo(px, py);
}

liss.fill("none");
liss.stroke(0,0,0);

r.draw();
r.save("lissajous-from-runejs.svg");