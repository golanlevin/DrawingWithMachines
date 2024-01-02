// Generate a Lissajous curve, and export it as an SVG file.
// Uses canvas-sketch & canvas-sketch-util by @mattdesl
// See: https://github.com/mattdesl/canvas-sketch-util/blob/master/docs/penplot.md
// https://github.com/mattdesl/canvas-sketch/blob/master/examples/pen-plotter-cubic-disarray.js
//
// Note: This program exports both PNG and SVG files on 'Cmd-S'.

const canvasSketch = require('canvas-sketch');
const { pathsToSVG, createPath, renderPaths } = require('canvas-sketch-util/penplot');

// Sketch parameters
const mySettings = {
  dimensions: 'letter',
  orientation: 'landscape',
  scaleToView: true,
  pixelsPerInch: 96,
  units: 'px'
};

const sketch = ({ context, width, height }) => {

  const nPoints = 100;
  const cx = width/2; 
  const cy = height/2; 
  const radius = width/4; 

  const myPath0 = createPath();
  for (var i=0; i<=nPoints; i++) {
    var theta = 2.0 * Math.PI * i / nPoints;
    var px = cx + radius * Math.sin(2.0 * theta);
    var py = cy + radius * Math.cos(3.0 * theta); 
    myPath0.lineTo(px, py);
  }

  // (Optionally) combine path(s) into an array
  const myPathsArray = [ myPath0 ];

  // You'll want to review these settings carefully!
  return props => renderPaths(myPathsArray, {
    ...props,
    precision: 2, 
    curveResolution: 0.01,
    optimize: {
      sort: false,
      removeDuplicates: true,
      removeCollinear: true
    }
  });
  
};

// Start the sketch
canvasSketch(sketch, mySettings);
