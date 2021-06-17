# Generating SVG Files

Example projects in various creative-coding toolkits for computationally generating SVG files suitable for pen plotters. 


### Java

* [Processing](https://processing.org/), with its [SVG Library](https://processing.org/reference/libraries/svg/index.html): [**Lissajous**](processing/svg_lissajous/svg_lissajous.pde)

### JavaScript

* [p5.js](https://p5js.org/), with @zenozeng's [p5.js-svg library](https://github.com/zenozeng/p5.js-svg): [**Lissajous**](p5js/svg_lissajous/sketch.js) (and at [Editor.p5js.org](https://editor.p5js.org/golan/sketches/Eu6b4gm_i))
* [svg5.js](https://www.npmjs.com/package/svg5) by @MAKIO135: [**Lissajous**](svg5/svg_lissajous/sketch.js) (and at [Editor](https://editor.p5js.org/golan/sketches/QbOhi4I1v))

---

### Work in Progress 

Templates not yet created for these environments

* [canvas-sketch](https://github.com/mattdesl/canvas-sketch/) by @mattdesl, with the [```pathsToSVG()```](https://github.com/mattdesl/canvas-sketch-util/blob/master/docs/penplot.md#pathsToSVG) function in the [canvas-sketch-util](https://github.com/mattdesl/canvas-sketch-util/blob/master/docs/penplot.md) penplot utilities. (Also see [these examples](https://codesandbox.io/examples/package/canvas-sketch) and [p5.js integration](https://github.com/mattdesl/canvas-sketch/blob/master/examples/animated-p5-instance.js))
* [Rune.js](http://runemadsen.github.io/rune.js/) by @runemadsen
* [Paper.js](http://paperjs.org/) by @lehni & @puckey, using its [```exportSVG()```](http://paperjs.org/reference/project/#exportsvg) function as demonstrated [here](http://paperjs.org/features/#svg-import-and-export) 
* [two.js](https://github.com/jonobr1/two.js) by @jonobr1, as described [here](https://github.com/jonobr1/two.js/issues/80)

### Python
* [vsketch](https://github.com/abey79/vsketch) by @abey79,  with e.g. shapely https://shapely.readthedocs.io/en/latest/ in Colab notebooks https://vsketch.readthedocs.io/en/latest/install.html#using-notebooks 
* [Drawbot](https://www.drawbot.com/) by Just van Rossum is "a powerful, free application for macOS that invites you to write Python scripts to generate two-dimensional graphics". 


### C++

* [openFrameworks](https://openframeworks.cc/), with the [ofxSVG addon](https://openframeworks.cc/documentation/ofxSVG/ofxSVG/)


---

### Other SVG Tools and Readymades

* [SVG Crowbar](https://nytimes.github.io/svg-crowbar/), a Chrome-specific bookmarklet that extracts SVG nodes and accompanying styles from an HTML document and downloads them as an SVG file.
* [Potrace](https://www.npmjs.com/package/potrace), a NodeJS-compatible JavaScript tool for tracing bitmaps.
* [Flowchart.fun](https://flowchart.fun/), a tool that generates SVGs of flowcharts from structured text
* [City Map Generator](https://maps.probabletrain.com/#/), a readymade tool by @probabletrain for creating procedural city maps in the browser
* [flow-lines](https://msurguy.github.io/flow-lines/) by @msurguy, a readymade tool for generating SVGs of flow fields
* [rad-lines](https://msurguy.github.io/rad-lines/) by @msurguy, a readymade tool for generating SVGs of rotating patterns


### Other Programming Toolkits

* [cozyvec](https://brubsby.itch.io/cozyvec) by @brubsby is "a tiny terminal program for creating plotter art" with JavaScript.
* [D3.js](https://d3js.org/), "A JavaScript library for manipulating documents based on data", widely used in data visualization. Can export SVG as described [here](https://observablehq.com/@mbostock/saving-svg).
* [SnapSVG](http://snapsvg.io/) by Adobe Systems. "A JavaScript SVG library for the modern web", possibly no longer maintained.
* [svgwrite](https://pypi.org/project/svgwrite/) by @mozman is "a Python library to create SVG drawings." Currently in maintenance mode.
* [drawSvg](https://pypi.org/project/drawSvg/), a Python 3 library for programmatically generating SVG images (vector drawings) and rendering them or displaying them in a Jupyter notebook. 
* [NodeBox](https://www.nodebox.net/code/index.php/Home.html), by Frederik De Bleser, is "an interactive Python environment where you can create two-dimensional graphics", and a fork of Drawbot. Possibly no longer maintained.