# Generating SVG Files for Plotters (2025)

**Contents:** 

* [Introduction: What are SVG Files?](#-introduction-what-are-svg-files)
* Recommended Toolchains
	* [Looking Ahead: Finalizing Your SVGs with *vpype*](#-looking-ahead-finalizing-your-svgs-with-vpype)
	* [Generating SVGs with JavaScript (p5.js)](#-generating-svgs-with-javascript-p5js)
	* [Generating SVGs with Java (Processing)](#-generating-svgs-with-java-processing)
	* [Generating SVGs with Python](#-generating-svgs-with-python)
	* [Other SVG Tools and Generators](#-other-svg-toolkits-and-generators)

---

# ![SVG](img/svg_logo.png) Introduction: What are SVG Files?

SVG ("Scalable Vector Graphic") files are text files that contain descriptions of geometry. SVG is a markup language based on XML (eXtensible Markup Language), which uses XML syntax to describe two-dimensional vector graphics.

Paths in SVG files are defined as sequences of points, which makes them very suitable for controlling pen plotters. [Here is a sample SVG file](https://raw.githubusercontent.com/golanlevin/DrawingWithMachines/refs/heads/main/generating_svg/img/simple_svg.svg), and its code: 

<img src="img/simple_svg.svg">

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

In this course, you will generally: 

1. Generate SVG files using your preferred programming toolkit (such as p5.js, Python, or Processing);
2. Use *vpype* to prepare and optimize your SVG files for plotting. 

---

# Recommended Toolchains

## ![vpype](img/vpype_logo.png) Looking Ahead: Finalizing Your SVGs with *vpype*

**Heads up!** No matter which programming toolkit you use to create your SVG files, you will likely want to process and optimize them for plotting using [*vpype*](https://github.com/abey79/vpype), a powerful command-line tool. For example, *vpype* can layout SVGs with precise control of position, scale, and cropping; optimize the drawing order of paths; and merge and de-duplicate points. Using this tool will help avoid damage to our machines, and can make your plots execute much faster, too. To use *vpype*: 

1. Follow these instructions [*(Prepping SVGs for Plotting with vpype)*](vpype_svg_prep/README.md) for installing *vpype*.
2. *vpype* allows commands to be "stacked" into a filtering pipeline. For example, the following *vpype* command loads your `inputfile.svg`; ensures that any line segments with coincident endpoints are merged into polylines; optimally *sorts* the polylines; and crops the image for an 11x8.5 page with a half-inch margin: `vpype read inputfile.svg linemerge --tolerance 0.1mm linesort crop 0.5in 0.5in 10.0in 7.5in write outputfile.svg`
3. Some other common ready-to-use formulas for *vpype* can be found [here](https://github.com/abey79/vpype?tab=readme-ov-file#examples). The main *vpype* documentation is [here](https://vpype.readthedocs.io/en/latest/index.html).
4. *vpype* also has an ecology of plug-ins, including tools like [Deduplicate](https://github.com/LoicGoulefert/deduplicate), for adjusting overlapping lines, and [Occult](https://github.com/LoicGoulefert/occult), for removing lines occulted by polygons.


---

## ![p5.js](img/p5_logo.png) Generating SVGs with JavaScript (p5.js)

[**p5.js**](https://p5js.org/) is a popular JavaScript toolkit for creative coding; its documentation can be found [here](https://p5js.org/reference/). For fall 2025, my recommended solution for exporting plotter-friendly SVGs from p5.js sketches is my own [**p5.plotSvg**](https://github.com/golanlevin/p5.plotSvg) library. Resources for using p5.plotSvg include:

* The p5.plotSvg [quickstart guide](https://github.com/golanlevin/p5.plotSvg/blob/main/README.md#quickstart-installation) and [example programs](https://github.com/golanlevin/p5.plotSvg/blob/main/examples/README.md). 
* *Lissajous* demo: [at Editor.p5js.org](https://editor.p5js.org/golan/sketches/vPpKzbp7h) • [on GitHub](p5js/p5_with_p5plotSvg/plotSvg_lissajous/sketch.js)
* *100 Random Lines* demo: [at Editor.p5js.org](https://editor.p5js.org/golan/sketches/KeTD57Bc9) • [on GitHub](p5js/p5_with_p5plotSvg/plotSvg_100_random_lines/sketch.js)


<details>
  <summary>**Click** to learn about some alternative approaches to generate SVGs in JavaScript.</summary>

* [*p5.js-svg*](https://github.com/zenozeng/p5.js-svg) p5.js library, by @zenozeng.  Note that this is an SVG *runtime* which completely replaces p5's Canvas-based renderer. For @zenozeng's p5.js-svg library, here is the *Lissajous demo* ([at Editor.p5js.org](https://editor.p5js.org/golan/sketches/JBWOKOQYH) and [on GitHub](p5js/p5_with_p5svgjs/svg_lissajous/sketch.js)); and a demo of *100 Random Lines* ([at Editor.p5js.org](https://editor.p5js.org/golan/sketches/afWmQU4yg) and [on GitHub](p5js/p5_with_p5svgjs/svg_random_lines/sketch.js)).
* Make SVGs completely from scratch: Demo [at Editor.p5js.org](https://editor.p5js.org/golan/sketches/cR3C_JI1-) • [on GitHub](p5js/p5_with_svg_from_scratch/sketch.js)
* [*svg5.js*](https://www.npmjs.com/package/svg5) by @MAKIO135:  (demo at [Editor.p5js.org](https://editor.p5js.org/golan/sketches/QbOhi4I1v))
* [*Rune.js*](http://runemadsen.github.io/rune.js/) by @runemadsen, with [rune.save.js](https://www.npmjs.com/package/rune.save.js) by @alterebro
* [*canvas-sketch*](https://github.com/mattdesl/canvas-sketch/) by @mattdesl, with [```pathsToSVG()```](https://github.com/mattdesl/canvas-sketch-util/blob/master/docs/penplot.md#pathsToSVG) from [canvas-sketch-util](https://github.com/mattdesl/canvas-sketch-util/blob/master/docs/penplot.md)
* [*Paper.js*](http://paperjs.org/) by @lehni, using [```exportSVG()```](http://paperjs.org/reference/project/#exportsvg) as shown [here](http://paperjs.org/features/#svg-import-and-export) 

</details>

---

## ![Processing](img/processing_logo.png) Generating SVGs with Java (Processing)

[**Processing**](https://processing.org/) is a mature toolkit for creative coding, with an extensive set of 3rd-party libraries. With its built-in [**SVG Export Library**](https://processing.org/reference/libraries/svg/index.html), Processing provides several different ways of using Java to generate SVG files, including: 

* [SVG Export (No Screen Display)](https://processing.org/reference/libraries/svg/index.html#svg-export-no-screen-display)
* [SVG Export (With Screen Display)](https://processing.org/reference/libraries/svg/index.html#svg-export-with-screen-display)
* [Single Frame from an Interaction/Animation (With Screen Display)](https://processing.org/reference/libraries/svg/index.html#single-frame-from-an-animation-with-screen-display)
* [SVG Files from 3D Geometry (With Screen Display)](https://processing.org/reference/libraries/svg/index.html#svg-files-from-3d-geometry-with-screen-display)

The Processing toolkit is documented [here](https://processing.org/reference) and [here](https://processing.org/environment). The following example sketches should help you get started.

* [*Test Grid demo*](processing_java/svg_testgrid/svg_testgrid.pde)
* [*Lissajous demo*](processing_java/svg_lissajous/svg_lissajous.pde)
* [*Simple Flow Field*](processing_java/svg_simpleFlowField/svg_simpleFlowField.pde)
* [*100 Random Lines*](processing_java/svg_random_lines/svg_random_lines.pde)

---

## ![Python](img/python_logo.png) Generating SVGs with Python 

[**Here's a Python v.3 workflow**](python/README.md) for generating SVG files. The recommended toolchain includes [**vsketch**](https://github.com/abey79/vsketch) (a Processing-like Python toolkit for generating SVGs), and [**vpype**](https://vpype.readthedocs.io/en/latest/index.html) (a Python framework for generating SVGs, as well as prepping them for plotting), which interoperates with vsketch.

  * [*Lissajous demo*](python/svg_lissajous/sketch_svg_lissajous.py)
  * [Shapely](https://shapely.readthedocs.io/en/latest/project.html), a Python package for manipulation and analysis of planar geometric objects.


<details>
  <summary>**Click** to learn about other Python toolkits for generating SVGs.</summary>

### Generating SVGs with py5

[**py5**](https://py5coding.org/index.html) is a new (2024) version of Processing for Python 3.9+. py5 works with other popular Python libraries and tools such as Jupyter, NumPy, SciPy, Shapely, trimesh, matplotlib, and Pillow. py5 allows you to generate SVGs using its [`py5drawsvg`](https://py5coding.org/reference/py5magics_py5drawsvg.html) command. 

### Generating SVGs with Processing.py (v.3.5.4)

Processing has a semi-obsolete "Python Mode" that allows you to use the same [SVG Export Library](https://processing.org/reference/libraries/svg/index.html) as the Java version. It is documented [here](https://py.processing.org/tutorials/gettingstarted/). There are some small snags: 

* In Python Mode, the SVG Export Library is **only compatible with Processing v.3.5.4**, from 2020, [which you can download here](https://processing.org/releases). As of January 2024, the SVG Export Library is not working in the Python Mode of Processing 4.x. 
* Processing's Python Mode is not compatible with native Python libraries, such as NumPy or SciPy. 

Assuming you're working in Processing 3.5.4, you can install the Python Mode using the instructions [here](https://py.processing.org/tutorials/gettingstarted/). Here are example projects:

* [*Test Grid demo*](processing_py_3.5.4/svg_testgrid/svg_testgrid.pyde)
* [*Lissajous demo*](processing_py_3.5.4/svg_lissajous/svg_lissajous.pyde)
* [*100 Random Lines*](processing_py_3.5.4/svg_random_lines/svg_random_lines.pyde)

</details>

---

## ![Drawingbots](img/drawingbots_logo.png) Other SVG Toolkits and Generators

Many creative technology toolkits provide good support for generating SVG files, such as: 

* Blender, with the [Sverchok](https://www.patreon.com/posts/introduction-to-42844297) plugin
* Max/MSP, with the [MGraphicsSVG](https://docs.cycling74.com/apiref/js/mgraphicssvg/) class
* [openFrameworks](https://openframeworks.cc/) (C++), with the [ofxSVG](https://openframeworks.cc/documentation/ofxSVG/ofxSVG/) addon
* Rhino/Grasshopper, with the [Graphic+](https://www.food4rhino.com/en/app/graphic) plugin
* [Rust](rust/README.md)
<!-- * [Scratch](https://www.youtube.com/watch?v=c4rpS4Y9vWs) -->


*We will generally not be using other peoples' "readymade" SVG generators in this course, but it's good to be aware of the kinds of free tools that people make.*

* [**There's a huge list of SVG tools**](https://drawingbots.net/resources#5) at Drawingbots.net. Check it out!
* [**DrawingBotV3**](https://drawingbotv3.com/) creates stylised drawings from pixel-based images. [Portions](https://github.com/SonarSonic/DrawingBotV3) of it are open-source.
* [RadLines](https://msurguy.github.io/rad-lines/) by @msurguy, a readymade tool for generating SVGs of rotating patterns
* [SquiggleCam](https://msurguy.github.io/SquiggleCam/) by @msurguy, a readymade tool for converting images into squiggly lines.
* [FlowLines](https://msurguy.github.io/flow-lines/) by @msurguy, a readymade tool for generating SVGs of flow fields
* [Potrace](https://www.npmjs.com/package/potrace), a NodeJS-compatible JavaScript tool for tracing bitmaps.
* [Flowchart.fun](https://flowchart.fun/), a tool that generates SVGs of flowcharts from structured text
* [City Map Generator](https://maps.probabletrain.com/#/), a readymade tool by @probabletrain for creating procedural city maps in the browser
* [Great96](https://isohedral.ca/great-96/), a tool for generating Islamic tiling geometric patterns
* [AudioPlotter](https://audioplotter.ars.is/), a tool for generating SVGs of audio waveforms from sound files

---

*Note: the [2021 version of this document](2021/README_2021.md) includes additional resources which may or may not be obsolete.*