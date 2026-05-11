// Generate a test file including a Lissajous curve; export it as an SVG file.
// Uses https://github.com/golanlevin/p5.plotSvg to export SVG.
// This is known to work with p5.js v.1.11.13 and p5.plotSvg v.0.1.8.

p5.disableFriendlyErrors = true; // hush p5
let bDoExportSvg = false;
const INCH = 96;

//--------------------------
function setup() {
  // createCanvas(11*INCH, 8.5*INCH); // ANSI-A (Letter), landscape
  createCanvas(8.5*INCH, 11*INCH); // ANSI-A (Letter)
  setSvgResolutionDPI(INCH); // Set the SVG resolution to 96 DPI.
  
  let saveButton = createButton("Save SVG");
  saveButton.position(10, 10);
  saveButton.mousePressed((event) => {
    event.stopPropagation();
    bDoExportSvg = true;
  });
}


//--------------------------
function draw() {
  background(240);
  stroke(0);
  noFill();

  let nPoints = 180;
  let cx = width / 2;
  let cy = height / 2;
  let radius = INCH * 2.5;

  // If we are exporting, start the SVG recording.
  if (bDoExportSvg){
    let svgFilename = "test_ansi-a_landscape.svg"; 
    if (width < height){
      svgFilename = "test_ansi-a_portrait.svg"; 
    }
    beginRecordSvg(this, svgFilename);
  }
  
  // Draw a Lissajous curve.
  beginShape();
  for (let i = 0; i < nPoints; i++) {
    let theta = map(i, 0, nPoints, 0, TWO_PI);
    let px = cx + radius * sin(2.0 * theta);
    let py = cy + radius * cos(3.0 * theta);
    vertex(px, py);
  }
  endShape(CLOSE);
  
  // Draw a box near the drawing limits, and some text 
  const rectL = 0.625; 
  const rectT = 0.625; 
  const rectW = width/INCH - 2*rectL;
  const rectH = height/INCH - 2*rectT;
  rect(INCH*rectL, INCH*rectT, INCH*rectW, INCH*rectH); 
  beginSvgGroup(); 
  drawString("Top Left", 0.7*INCH, 1.125*INCH, 5, 1);
  endSvgGroup(); 
  
  // Draw inch rulers
  beginSvgGroup(); 
  const rectR = rectL+rectW; 
  const rectB = rectT+rectH; 
  let rx = INCH*(rectL+1); 
  let ry = INCH*(rectT+1); 
  while (rx < INCH*rectR){
    line(rx,INCH*rectB, rx,INCH*(rectB-0.25)); 
    rx += INCH;
  }
  while (ry < INCH*rectB){
    line(INCH*rectR, ry, INCH*(rectR-0.25), ry); 
    ry += INCH;
  }
  endSvgGroup(); 
  
  // If we are exporting, we need to end the SVG recording.
  if (bDoExportSvg){
    endRecordSvg();
    bDoExportSvg = false;
  }
}



// ========================================================
// Abel Vincze's GearGenerator font, from:
// https://github.com/golanlevin/p5-single-line-font-resources/
const font = [
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-/=*;:,.<>",
  "0204284442324335464738181215080307480525452224683316263634174130100106373120004014232713",
  "4ABCDE/BD 4AFGDHIJKLM/NH/OL 4GFMPQLKJ 4AFGJKO/LM 4EAOR/ST 4AOR/ST 4HUEMPQLR 4ER/US/OA 2VA/ML/CO 4RGFMP 4ENR/AO/NS 4EAO 4ERWOA 4REOA 4UGFMPQLKJU 4SHIJKOA 4DVMPQLKJD/YE 4ENHIJKOA/NS 4JKLQGFMP 4RO/CV 4RGFMPO 6XFO 6XEHVO 4RA/EO 4RTO/TV 4EARO 4YVMPSZaHYE 4OBabUGFVBA 4EMPSZI 4EDVMPSZaDR 4FMPSZbUcB 4MdCKJ/HS 4EMPSZbUefgh 4BabUE/AO 0Ai/QO 3Kj/bklgh 4EWI/AO/WB 1MPO 4Ai/SZTbUE/WT 4Ai/BabUE 4GFMPSZbUG 4mi/SZbUGFA 4nI/EMPSZbU 4Ai/BabU 4IZSocGFA 4GFpC/Ii 4IE/DVMPi 4IVi 4IFaMi 4IA/Ei 4Igm/Vi 4EAIi 3YVMPQLCjY 2QLM/VA 4EABNHIJKLQ 4QLKJIHDGFMP/TH 4DBKF 4ROibUGFMP 4SHDGFMPiCK 4ORV 4NBPMFGDHNiQLKJIH 4UNiQLKJDVM 4pq/US 4US 4RA 4Ii/DB 4US/pq/JP/GQ 1ZN/oMh 1ZN/or 1rMh 0PA 3KSF 3OHA"
];

function drawString(str, x, y, sca, spacing = 1, lineH = 1.6) {
  let cx = x; let cy = y;
  const GG_CAPH = 8;
  for (let i = 0; i < str.length; i++) {
    const ch = str[i];
    if (ch === "\n") {
      cy += GG_CAPH * sca * lineH;
      cx = x; continue;
    }
    drawGlyph(ch, cx, cy, sca);
    const data = getchardata(ch);
    const adv = (data[0] >= 0) ? data[0] : 3;
    cx += (adv + spacing) * sca;
  }
}

function drawGlyph(ch, gx, gy, sca) {
  const data = getchardata(ch);
  if (data[0] < 0) return;  
  for (let l = 1; l < data.length; l++) {
    const stroke = data[l];
    if (!stroke || stroke.length === 0) continue;
    beginShape();
    for (const pt of stroke) {
      vertex(gx + pt.x * sca, gy - pt.y * sca);  
    }
    endShape();
  }
}

function getchardata(chr) {
  function getindex(code) {
    code -= 65; if (code > 25) code -= 6;
    return code * 2;
  }
  const i = font[0].lastIndexOf(chr);
  const data = [];
  if (i > -1) {
    const chdata = font[2].split(" ")[i];
    let l = 0;
    data[0] = Number(chdata.charAt(0));  
    for (let p = 0; p < chdata.length; p++) {
      const pi = getindex(chdata.charCodeAt(p));
      if (pi < 0) {
        data[++l] = [];
      } else {
        if (!data[l]) data[l] = [];
        const pair = font[1].substr(pi, 2);
        data[l].push({ x: Number(pair[0]), y: Number(pair[1]) });
      }
    }
  } else {
    data[0] = (chr === " ") ? 3 : -1;
  }
  return data;
}
