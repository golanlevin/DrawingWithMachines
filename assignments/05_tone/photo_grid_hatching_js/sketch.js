// Do not delete, used as a demo in DwM. 

let myImg;
function setup() {
  createCanvas(640, 320);
  background(255);
  noLoop(); 
}
function preload(){
  myImg = loadImage("mona.png"); 
}

function draw() {
  image(myImg,myImg.width,0); 
  stroke(0); 
  strokeWeight(0.5); 
  
  let nRows = 32;
  let nCols = 20;
  let dx = int(myImg.width/nCols);
  let dy = int(myImg.width/nRows);

  for (let row=0; row<nRows; row++){
    for (let col=0; col<nCols; col++){
      let px = col * dx; 
      let py = row * dy; 
      let colorAtXY = myImg.get(px,py); 
      let r = red (colorAtXY); 
      let g = green (colorAtXY); 
      let b = blue (colorAtXY); 
      let bri01 = (0.299*r + 0.587*g + 0.114*b)/255; //  NTSC luminance
      
      let nLines = round(map(bri01,0,1, 10,0)); 
      for (let i=0; i<nLines; i++){
        let lx = map(i,0,nLines, px,px+dx);
        line(lx,py, lx,py+dy); 
      }
    }
  }
}