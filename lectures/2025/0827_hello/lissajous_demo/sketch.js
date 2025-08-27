// Generate a Lissajous curve, and export it as SVG, GCode, and HPGL
function setup() {
  createCanvas(1056, 816); // Letter: 11"x8.5" at 96 DPI.
  background(255);
  noFill();

  // --- SVG (p5.plotSvg) ---
  beginRecordSVG(this, "lissajous.svg");

  // --- Shared constants ---
  const dpi = 96;
  const pxToMm = 25.4 / dpi;

  // --- GCODE params (Bantam/metric, absolute, Z up/down) ---
  const zHi = 25;
  const zLo = 20;

  // --- HPGL params (1016 units per inch) ---
  const unitsPerInch = 1016;
  const pxToHP = unitsPerInch / dpi;
  const pageHeightHP = round(height * pxToHP); // for Y flip

  // --- Curve params ---
  const nPoints = 40;
  const cx = width / 2;
  const cy = height / 2;
  const radius = width / 4;

  // --- Prepare exporters ---
  let gcodeData = [];
  gcodeData.push("$H");       // Home (Bantam-specific)
  gcodeData.push("G21");      // mm units
  gcodeData.push("G90");      // absolute
  gcodeData.push("G1 F5000"); // feed rate

  // We'll build HPGL points first, then emit a spec-safe command sequence
  const hpPoints = [];

  // --- Draw + collect toolpaths ---
  beginShape();
  for (let i = 0; i <= nPoints; i++) {
    // Lissajous point
    let theta = map(i, 0, nPoints, 0, TWO_PI);
    let px = cx + radius * sin(2.0 * theta);
    let py = cy + radius * cos(3.0 * theta);

    // On-screen drawing (for preview)
    vertex(px, py);

    // ---- GCODE: mm, Y flipped, absolute ----
    let gx = nf(px * pxToMm, 1, 4);
    let gy = nf((height - py) * pxToMm, 1, 4);

    if (i === 0) {
      // travel (pen up) to first point
      gcodeData.push("G1 X" + gx + " Y" + gy + " Z" + zHi);
      // then put pen down
      gcodeData.push("G1 X" + gx + " Y" + gy + " Z" + zLo);
    } else {
      gcodeData.push("G1 X" + gx + " Y" + gy + " Z" + zLo);
    }

    // ---- HPGL: integer units, Y flipped, absolute ----
    let hx = round(px * pxToHP);
    let hy = round(pageHeightHP - py * pxToHP);
    hpPoints.push(`${hx},${hy}`);
  }
  endShape();

  // --- Finalize GCODE ---
  gcodeData.push("G1 Z" + zHi); // lift pen
  gcodeData.push("$H");         // re-home
  gcodeData.push("M2");         // end program
  saveStrings(gcodeData, "lissajous.gcode");

  // --- Emit HPGL ---
  const hpglData = [];
  hpglData.push("IN;");   // initialize
  hpglData.push("DF;");   // defaults (helps some parsers)
  hpglData.push("PS4;");  // pen speed (optional; adjust/omit as needed)
  hpglData.push("SP1;");  // select pen 1
  hpglData.push("PA;");   // absolute coordinates

  // Move pen up to first point
  if (hpPoints.length > 0) {
    hpglData.push(`PU${hpPoints[0]};`);
  }

  // Draw all remaining points in ONE PD list (no implicit continuation)
  if (hpPoints.length > 1) {
    hpglData.push(`PD${hpPoints.slice(1).join(",")};`);
  } else {
    // single-point fallback
    hpglData.push("PD;");
  }

  hpglData.push("PU;");   // pen up
  hpglData.push("SP0;");  // deselect pen
  hpglData.push("PG;");   // page eject (helps some viewers)
  saveStrings(hpglData, "lissajous.hpgl.txt");

  // --- Finalize SVG ---
  endRecordSVG();
  
  // --- Emit PNG ---
  save("lissajous.png"); 
}


