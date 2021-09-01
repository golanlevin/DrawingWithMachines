# Generating SVG Files

## Introduction

SVG ("Scalable Vector Graphic") files are text files that contain descriptions of geometry. Paths in SVG files are defined as sequences of points (though elliptical arcs and Bezier curves are also possible), which makes them very suitable for controlling pen plotters. Here is an SVG file, and its code: 

<img src="simple_svg.svg">

```
<svg version="1.1"
	width="400" height="400"
	xmlns="http://www.w3.org/2000/svg">

	<rect width="100%" height="100%" fill="lightgray" />

	<circle cx="100" cy="100" r="80" fill="white" />

	<path fill="none" stroke="black" stroke-width="1.0px" d="
		M100 100 
		L300 100 
		L250 300 
		Z" />
</svg>
```


## Toolchains

You could write code to directly generate SVG text files, but if you wish to preview your work, you would likely use a creative-coding toolkit. Here are some links and example projects for various toolkits for computationally generating SVG files. 


### Java

* [**Processing**](https://processing.org/) v3.5.4 and v.4.0, with its [SVG Library](https://processing.org/reference/libraries/svg/index.html): 
  * [*Lissajous demo*](processing_java/svg_lissajous/svg_lissajous.pde)


### JavaScript

* [**p5.js**](https://p5js.org/) v.1.3.1, with [p5.js-svg library](https://github.com/zenozeng/p5.js-svg) v.1.0.7 by @zenozeng: 
  * [*Lissajous demo*](p5js/svg_lissajous/sketch.js) (and at [Editor.p5js.org](https://editor.p5js.org/golan/sketches/Eu6b4gm_i))
* [**svg5.js**](https://www.npmjs.com/package/svg5) v.0.1.4 by @MAKIO135: 
  * [*Lissajous demo*](svg5/svg_lissajous/sketch.js) (and at [Editor.p5js.org](https://editor.p5js.org/golan/sketches/QbOhi4I1v))
* [**Rune.js**](http://runemadsen.github.io/rune.js/) v.1.1.8 by @runemadsen, with [rune.save.js](https://www.npmjs.com/package/rune.save.js) v.0.4.1 by @alterebro:
  * [*Lissajous demo*](runejs/svg_lissajous/sketch.js)
* [**canvas-sketch**](https://github.com/mattdesl/canvas-sketch/) v.0.7.4 by @mattdesl, with [```pathsToSVG()```](https://github.com/mattdesl/canvas-sketch-util/blob/master/docs/penplot.md#pathsToSVG) in the [canvas-sketch-util](https://github.com/mattdesl/canvas-sketch-util/blob/master/docs/penplot.md) v.1.10.0 utilities.
  * [*Lissajous demo*](canvas-sketch-js/svg_lissajous.js)
* [**Paper.js**](http://paperjs.org/) by @lehni & @puckey, using its [```exportSVG()```](http://paperjs.org/reference/project/#exportsvg) function as demonstrated [here](http://paperjs.org/features/#svg-import-and-export) 
* [**two.js**](https://github.com/jonobr1/two.js) by @jonobr1, as described [here](https://github.com/jonobr1/two.js/issues/80)


### Python

* [**Processing.py**](https://py.processing.org/) for Processing v.3.5.4, with its [SVG Library](https://processing.org/reference/libraries/svg/index.html): 
  * [*Lissajous demo*](processing_py/svg_lissajous/svg_lissajous.pyde)
* [**Drawbot**](https://www.drawbot.com/) by Just van Rossum, "a powerful, free application for macOS that invites you to write Python scripts to generate two-dimensional graphics". 
* [**vsketch**](https://github.com/abey79/vsketch) by @abey79, with e.g. [Shapely](https://shapely.readthedocs.io/en/latest/), which can be used [in Google Colab notebooks](https://vsketch.readthedocs.io/en/latest/install.html#using-notebooks)

### C++

* [**openFrameworks**](https://openframeworks.cc/), with the [ofxSVG addon](https://openframeworks.cc/documentation/ofxSVG/ofxSVG/)


---

### Other SVG Tools

* [**Huge list of SVG tools**](https://drawingbots.net/resources#5) at Drawingbots.net
* [vpype](https://github.com/abey79/vpype), which can 
  * layout vector files with precise control of position & scale
  * optimize existing SVG files for faster and cleaner plots;
  * create HPGL output for vintage plotters;
  * create generative artwork from scratch;
  * create, modify and process multi-layer vector files for multi-colour plots; etc.
* [Occult](https://github.com/LoicGoulefert/occult), vpype plug-in to remove lines occulted by polygons from SVG files.
* [Deduplicate](https://github.com/LoicGoulefert/deduplicate), vpype plug-in to remove overlapping lines in SVG files.
* [Shapely](https://shapely.readthedocs.io/en/latest/project.html), a Python package for manipulation and analysis of planar geometric objects.

---

### SVG Readymades

*We will generally not be using others' "readymade" SVG generators, but it's good to be aware of the kinds of free tools that people make.*

* [SVG Crowbar](https://nytimes.github.io/svg-crowbar/), a Chrome-specific bookmarklet that extracts SVG nodes and accompanying styles from an HTML document and downloads them as an SVG file.
* [Potrace](https://www.npmjs.com/package/potrace), a NodeJS-compatible JavaScript tool for tracing bitmaps.
* [Flowchart.fun](https://flowchart.fun/), a tool that generates SVGs of flowcharts from structured text
* [City Map Generator](https://maps.probabletrain.com/#/), a readymade tool by @probabletrain for creating procedural city maps in the browser
* [flow-lines](https://msurguy.github.io/flow-lines/) by @msurguy, a readymade tool for generating SVGs of flow fields
* [rad-lines](https://msurguy.github.io/rad-lines/) by @msurguy, a readymade tool for generating SVGs of rotating patterns
* [Great96](https://isohedral.ca/great-96/), a tool for generating Islamic tiling geometric patterns
* [AudioPlotter](https://audioplotter.ars.is/), a tool for generating SVGs of audio waveforms from sound files
* [DrawingBotV3](https://github.com/SonarSonic/DrawingBotV3) a tool to create stylised line drawings from images

---

### Other Programming Toolkits

*These are mostly obsolete or experimental.*

* [cozyvec](https://brubsby.itch.io/cozyvec) by @brubsby is "a tiny terminal program for creating plotter art" with JavaScript.
* [D3.js](https://d3js.org/), "A JavaScript library for manipulating documents based on data", widely used in data visualization. Can export SVG as described [here](https://observablehq.com/@mbostock/saving-svg).
* [three.js](https://threejs.org/) with its [SVGRenderer](https://threejs.org/docs/#examples/en/renderers/SVGRenderer)
* [SnapSVG](http://snapsvg.io/) by Adobe Systems. "A JavaScript SVG library for the modern web", possibly no longer maintained.
* [svgwrite](https://pypi.org/project/svgwrite/) by @mozman is "a Python library to create SVG drawings." Currently in maintenance mode.
* [drawSvg](https://pypi.org/project/drawSvg/), a Python 3 library for programmatically generating SVG images (vector drawings) and rendering them or displaying them in a Jupyter notebook. 
* [NodeBox](https://www.nodebox.net/code/index.php/Home.html), by Frederik De Bleser, is "an interactive Python environment where you can create two-dimensional graphics", and a fork of Drawbot. Possibly no longer maintained.