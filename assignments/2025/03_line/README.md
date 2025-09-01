# 3: Line

<img src="img/ellsworth_kelly_rubber_plant_1957.jpg" width="400"><br />
<small>Ellsworth Kelly, [*Rubber Plant*](https://matthewmarks.com/exhibitions/ellsworth-kelly-plant-drawings-05-2017), 1957</small>

This set of assignments has 

* 3.1. Line Reading
* 3.2. Warmup Exercises
	* 3.2.0. Install and Test *vpype*
	* 3.2.1. Naive Offset Curve
	* 3.2.2. Making Lines of Different Weights
	* 3.2.3. Calligraphic Polyline 
	* 3.2.4. Squiggy Hacking
* 3.3. Offset Curve Composition
* 3.4. Taking A Dot for A Walk

---

# 3.1. Line Reading

---

# 3.2. Warmup Exercises

The exercises below

* 3.2.0. Install and Test *vpype*
* 3.2.1. Naive Offset Curve
* 3.2.2. Making Lines of Different Weights
* 3.2.3. Calligraphic Polyline 
* 3.2.4. Squiggy Hacking

## 3.2.0. Install and Test *vpype*

**(0-60 minutes, depending)** *In this assignment I ask you to make sure that vpype is installed and operational on your computer.*

<img src="img/vpype_demo.png" width="400">

As we [discussed in class](https://github.com/golanlevin/DrawingWithMachines/blob/main/generating_svg/vpype_svg_prep/README.md), *vpype* is a powerful tool for preparing SVG files for plotting; from this point on, it will be extremely handy to have a Python3.10 venv (virtual environment) installed on your laptop that can run *vpype*. Instructions for installing *vpype* can be found here: [**Creating a Suitable Python3.10 Virtual Environment**](https://github.com/golanlevin/DrawingWithMachines/blob/main/generating_svg/python/README.md#1-creating-a-suitable-python310-virtual-environment). *So, please:*

* **Install** *vpype*, using these [instructions](https://github.com/golanlevin/DrawingWithMachines/blob/main/generating_svg/python/README.md#1-creating-a-suitable-python310-virtual-environment). **NOTE: I must emphasize the importance of installing vpype [in a virtual environment](https://docs.python.org/3/library/venv.html). Failing to do so could cause you a great deal of misery.**
* **Test** *vpype* with commands like `vpype --help` and `vpype random show`.
* **Run** the following *vpype* command, but **replace** "Your Name": `vpype text --font futural --size 40 "Your Name :)" show`. 
* **Screenshot** the *vpype* display with your name and **post** it in the Discord channel `#320-vpype-works`. (I want receipts, please.)
* In the unlikely event that you are unable to get *vpype* installed on your computer, **message** the professor in Discord to discuss other options for [optimizing](https://plotterfiles.com/tools/optimizer) and [cropping](https://msurguy.github.io/svg-cropper-tool/) your SVGs.

**Python programmers:** If you happen to prefer coding in Python, installing *vpype* and its interoperating sibling project [*vsketch*](https://github.com/abey79/vsketch) (for generative plotter art) is a great toolchain for this course. My instructions for [installing and using *vsketch* are here](https://github.com/golanlevin/DrawingWithMachines/blob/main/generating_svg/python/README.md#3-generating-an-svg-using-vsketch-and-vscode).


---

## 3.2.1. Spiced Line




---

## 3.2.2. Making Lines of Different Weights

**(30 minutes)** *In this exercise, you will construct a basic drawing primitive from first principles: lines thicker than the nib of one's pen.*

<img src="img/alphonse_mucha_detail.jpg" width="400"><br />
<small>Alphonse Mucha's *La Plume* (1897) uses lines of different weights to establish visual hierarchy.</small> 

**Hand-sketch first!** Using your hand, paper, and a single pen, **think through** some workflows for constructing lines that appear to have different thicknesses. Use an ordinary pen that makes a line of reasonably constant thickness no matter how you hold or press it, such as a rollerball, gel, or ballpoint pen. (I recommend the Pilot G-2 or Pilot Precise V5 in your student kits.) 

Of course, there are *many* ways to do this; for example, you might:

* Draw a dense zig-zag
* Draw slightly-offset parallel lines that are closely spaced
* Draw a line very slowly or very quickly, using a pen/paper combo that bleeds ink
* Draw a line which turns out to be, upon close examination, a decorative border
* Draw a line comprised of a cloud of small dots

<img src="img/handmade_line_weights.jpg" width="400">

**Keep** your hand-made tests. *Now*, using one of your methods:

* **Write** code for a function that produces "lines" with different weights. *(I say "lines" in quotes because technically, each thick line is likely comprised of many constituent sub-lines.)* **Extend** your code so that it can produce a *polyline* ([polygonal chain](https://en.wikipedia.org/wiki/Polygonal_chain)) of a given thickness. Your program should **export** SVGs of your lines/polylines — such that they appear as intended when plotted using the pen you used earlier. As a reminder, some overviews and sample code for generating SVGs can be found [here](https://github.com/golanlevin/DrawingWithMachines/tree/main/generating_svg). 
	* **Note 1**: For this exercise, you are not permitted to use Z-axis pressure.
	* **Note 2**: Sadly, the p5.js/Processing [`strokeWeight()`](https://p5js.org/reference/p5/strokeWeight/) command will not be helpful for generating plottable SVGs.
* **Use** your function to create a simple "test-sheet design" that uses at least three line weights. You may use any color pen(s) and any color paper, but your design should allow for direct comparison between lines of different weights that were drawn with the same pen.
* **Plot** your test-sheet design on 8.5x11" or 9x12" paper. For this project, I recommend using either [AxiDraw](https://github.com/golanlevin/DrawingWithMachines/blob/main/rpi_standalone/README.md), HP7475A, or [Line-Us](https://github.com/golanlevin/DrawingWithMachines/tree/main/machines/line-us) plotters. **Note**: If you use the HP7475A, you will need to convert SVG to HPGL using *vpype*; see [these instructions](https://github.com/golanlevin/DrawingWithMachines/blob/main/generating_svg/vpype_svg_prep/README.md), and this [one-sheet PDF for using the HP7475A](https://github.com/golanlevin/DrawingWithMachines/blob/main/machines/hp7475a/hp7475a-one-sheet/hp7475a-one-sheet.md).
* **Scan** or **photograph** your test-sheet design. 
* **Scan** or **photograph** your hand-made tests as well.
* **Create** a post in the Discord channel `#322-line-weight`.
* **Upload** the images of your hand-made tests and your test-sheet design plot. 
* **Write** a sentence or two that describes your method, and any considerations or discoveries you made.


---

## 3.2.4. Squiggy Hacking

**(30 minutes)** *In this exercise, you will develop experience designing strokes with procedural strokeweight functions.*

<a href="https://squiggy.netlify.app/"><img src="img/squiggy.png" width="400"></a>

[***Squiggy***](https://squiggy.netlify.app/) is a sketchpad for the design of lines with procedural strokeweights, and a [vector brushstroke library](https://github.com/LingDong-/squiggy). Squiggy was developed by former BCSA student [Lingdong Huang](https://lingdong.works/) in 2021.

Squiggy works by using a function to govern the thickness of the stroke. This function returns the local radius (half-width) `w` based on properties like the percentage of distance traveled  (`t`) and the user's velocity `z` (estimated from velocity) at a given point `o`, among others. For example, Squiggy's *slug* brush preset (pictured above) has the following equation, a half sine-wave:

`squiggy.tube_brush(o=>({w:Math.sin(o.t*Math.PI)*30+2}))`

In other words, the Squiggy brush function is an [arrow function callback](https://javascript.info/arrow-functions-basics) that Squiggy calls for each point along the line. *(Note that this function is pure JavaScript, not p5.js.)* Here are the available parameters for Squiggy brush functions:

```javascript
i,  // index of this point in polyline
d,  // distance travelled from start of path to this point
t,  // percentage of distance travelled (0.0-1.0)
dx, // delta X from previous point
dy, // delta Y from previous point
r,  // local rotation in radians
x,  // X (0th coordinate)
y,  // y (1st coordinate)
z,  // velocity, calculated as Math.hypot(dx,dy)
```

You can make your own brush function by typing code in the text region and clicking `set brush from code`. For example, in the illustration below, I have set the brush function `w` to `0.1 * o.x` — in other words: the thickness of the brush is directly (and strictly) proportional to the `x`-coordinate of the mark at that location `o`:

![squiggy_simple.png](img/squiggy_simple.png)

*Now:*

* **Tinker** with the [**Squiggy**](https://squiggy.netlify.app/) app for a few minutes. **Explore** the different brush presets, and **make** some superficial modifications to brush functions.
* **Devise** your own custom brush function. Feel free to consult Lingdong's [documentation](https://github.com/LingDong-/squiggy?tab=readme-ov-file#tube-brush). 
* **Create** a casual composition that shows off your brush function to good effect, and **screenshot** it.
* **Create** a post in the Discord channel `#324-squiggy`. **Paste** your function code in the post and **upload** your screenshot. **Write** a sentence that describes your function, and any thoughts you have about the exercise. *Note: Discord uses Markdown; you can format code in Discord by wrapping your code in backticks ( ` ) or triple-backticks for longer blocks.*

If you find this project interesting, I highly encourage you to read or skim the brief articles below.

* Lingdong Huang, [*Nuances of Hose Making*](https://quadst.rip/hose.html), 2021
* Matt Deslauriers, [*Drawing Lines is Hard*](https://mattdesl.svbtle.com/drawing-lines-is-hard), 2015




---

# 3.4. Taking A Dot for A Walk

![picasso dachshund 1957](https://github.com/golanlevin/DrawingWithMachines/raw/main/assignments/2024/04_line/resources/picasso_dachshund.jpg)<br />
Pablo Picasso, *Chien* (Dog), 1957.

(2-4 hours, 50%) *The objective of this prompt is to exercise your conceptual, aesthetic, and computational skills in using code to govern a foundational graphical form: a single line.*

Recall Paul Klee’s [*Pedagogical Sketchbook*](https://github.com/golanlevin/DrawingWithMachines/blob/main/readings/klee_pedagogical_sketchbook.pdf) (1925), in which he proposes that “a line is a dot that went for a walk”.

[![Klee line walk, from Pedagogical Sketchbook](https://github.com/golanlevin/DrawingWithMachines/raw/main/assignments/2024/04_line/resources/klee_line_walk.jpg)](https://github.com/golanlevin/DrawingWithMachines/blob/main/readings/klee_pedagogical_sketchbook.pdf)

The artwork [Sum05](https://www.liaworks.com/theprojects/sum05/) by Austrian software artist (2005), Lia (at left) and the artwork [Path_P](https://reas.com/path_p/) by Casey Reas (2001, at right, described in [this article](https://medium.com/@REAS/notes-on-phototaxis-db7aa7641ad8)), can be understood as examples of this, though they achieve this in very different ways: In her design, Lia composes trigonometric functions of trigonometric functions, while Casey records the paths taken by Braitenberg vehicles.

![walks by Lia and Casey](https://github.com/golanlevin/DrawingWithMachines/raw/main/assignments/2024/04_line/resources/walks.jpg)

In this open-ended assignment, you are asked to **write** code that takes a dot for a walk, to create an interesting line; **export** a plottable file representing your line; **plot** and **document** the result; and **write** a brief statement about your project. In evaluating your work, we may discuss things like: the expressiveness of your line, the muscularity of your control, conceptual propositions you may have engaged, etc.

*Now:*

* **Write** code to take a dot on an interesting walk. Your code may be written in any programming language you prefer, and should export a design that consists of exactly one line.
* Decide whether you will plot on a 12x9" or 11x8.5" page. Either is fine. Please use nice paper.
* Ensure that your drawing does not ask the plotter to move beyond the bounds of your page! You may ensure this through some combination of scaling, translation, and/or cropping. To crop your drawing, use either vpype (preferred; instructions here), Inkscape (instructions here), or svg-cropper-tool.
* Plot your line drawing. Please use a black pen on white paper. Color is not permitted for this project.
Create a post in the Discord channel, #34-line-walk.
* Embed a scan or photograph of your plotted project in your Discord post.
* Write a few sentences in your Discord post that describe your approach, what you struggled with, and what you learned.
* Bring your plot to class for pinup on 


#### Technical Suggestions

[**Some strategies for walking a dot are discussed in these lecture notes**](https://github.com/golanlevin/DrawingWithMachines/blob/main/lectures/topics/walking_a_dot/README.md) — but this list is only a starting point. There are an infinity of possible approaches to generate an interesting line, and there is no preferred method. 

Your line may be zig-zaggy, wavy, curly, wiggly, noisy, etc. Your line may be wholly synthesized using randomness and mathematics, or it may be a visualization of data captured from the real world. You may choose to start and end your line at the same point, or you may (for example) terminate your line at opposite corners of the page. Your line may cross itself, or you may write rules to prevent this from happening. Your line may have constant thickness, or you may give it an expressive and variable ductus. Dan Shiffman's *Coding Train* offers some additional starting points, among many:

* [Random Walker in p5.js](https://www.youtube.com/watch?v=l__fEY1xanY) (Coding Challenge #52)
* [Random Walker with Vectors and Lévy Flight](https://www.youtube.com/watch?v=bqF9w9TTfeo) (Coding Challenge #53)
* [Drawing with Fourier Transform and Epicycles](https://www.youtube.com/watch?v=MY4luNgGfms) (Coding Challenge #130.1)
* [Self-Avoiding Walk](https://www.youtube.com/watch?v=m6-cm6GZ1iw) (Coding Challenge #162)
* [Traveling Salesperson](https://www.youtube.com/watch?v=BAejnwN4Ccw) (Coding Challenge #35.1)
* [A* Pathfinding Algorithm](https://www.youtube.com/watch?v=aKYlikFAV4k) (Coding Challenge #51)
* [Polar Perlin Noise Loops](https://www.youtube.com/watch?v=ZI1dmHv3MeM) (Coding Challenge #136.1)
* [Horizontal Directional Drilling](https://www.youtube.com/watch?v=FfCBNL6lWK0) (Coding Challenge #172)

Here are some helpful templates to get you started:

JavaScript (p5.js) template for interactive SVG export • at the p5 Editor
Java (Processing) template for interactive SVG export
Python (Processing.py, v.3.5.4) template for interactive SVG export

#### Templates for Generating G-Code in p5.js

* [G-Code Lissajous Exporter](https://editor.p5js.org/golan/sketches/Gly-gpjzM)
* [G-Code Drawing Recorder](https://editor.p5js.org/golan/sketches/5NkOru6OA)




---




<!-- 
PAST VERSIONS: 
2021: https://courses.ideate.cmu.edu/60-428/f2021/index.html%3Fp=456.html
2024: https://github.com/golanlevin/DrawingWithMachines/blob/main/assignments/2024/04_line/
README.md
-->


Lecture Notes


In *Lines: a Brief History*, Chapter 6, Tim Ingold writes:

> “In his book *The Nature and Art of Workmanship*, theorist of design David Pye arrives at a […] distinction between what he calls the ‘workmanship of risk’ and the ‘workmanship of certainty’. In the workmanship of risk, the result is not pre-determined but ‘depends on the judgement, dexterity and care which the maker exercises as he works’ (Pye 1968: 4). Thus the quality of the outcome is never assured until the work is actually finished. In the workmanship of certainty, by contrast, the result is exactly pre-determined before the task is even begun. This determination is given in the settings and specifications of the apparatus of production, which in turn controls the movements of the working point. The workmanship of risk, Pye suggests, is exemplified by writing with a pen, and the workmanship of certainty by modern printing. In the workmanship of risk, however, practitioners are continually devising ways to limit risk through the use of jigs and templates, which introduce a degree of certainty into the proceedings. Thus ‘if you want to draw a straight line with your pen’, Pye advises, ‘you do not go at it freehand, but use a ruler, that is to say, a jig’.”

* [Sprouts](https://www.youtube.com/watch?v=ZQY4v5GItes); Conditional Design
* [Joanie Lemercier's workflow](https://twitter.com/JoanieLemercier/status/1391443586206535682) & [another thread](https://x.com/JoanieLemercier/status/996180699357958144)
* [Robert Hodgin's signature](https://www.instagram.com/p/CKmcSliHwg_/)
* Here is the short documentary [*CURVES*](https://www.youtube.com/watch?v=Be3R5YEKFN0) by Masahiko Sato. We will watch 0:15–6:45 and 13:20–19:20. Sato says, “A line is a miracle that you draw when you throw it.”