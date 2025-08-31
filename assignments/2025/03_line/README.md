# 3: Line

<img src="img/ellsworth_kelly_rubber_plant_1957.jpg" width="400"><br />
<small>Ellsworth Kelly, *Rubber Plant*, 1957</small>

* 3.1. Line Readings
* 3.2. Line Exercises
* 3.3. Offset Curve Composition
* 3.4. Taking A Dot for A Walk

---

### 3.1.0. Install *vpype*

It's time. As we [discussed in class](https://github.com/golanlevin/DrawingWithMachines/blob/main/generating_svg/vpype_svg_prep/README.md), *vpype* is a powerful tool for preparing SVG files for plotting. From this point on, it will be extremely handy to have a Python3.10 virtual environment installed on your laptop that can run *vpype*. Instructions for installing the right version of Python, creating a correctly-configured virtual environment, and installing *vpype* can be found here: [**Creating a Suitable Python3.10 Virtual Environment**](https://github.com/golanlevin/DrawingWithMachines/blob/main/generating_svg/python/README.md#1-creating-a-suitable-python310-virtual-environment).


---

### 3.1.2. Making Lines of Different Weights

*In this exercise, you will construct a basic drawing primitive from first principles: lines thicker than one's pen.*

<img src="img/alphonse_mucha_detail.jpg" width="400"><br />
<small>Alphonse Mucha's *La Plume* (1897) uses lines of different weights to establish visual hierarchy.</small> 

**Hand-sketch first!** Using your hand, paper, and a single pen, **think through** some workflows for constructing lines that appear to have different thicknesses. Use an ordinary pen that makes a line of the same thickness no matter how you hold or press it, such as a rollerball, gel, or ballpoint pen. (I recommend the Pilot G-2 or Pilot V5.) 

Of course, there is no single "correct" method for doing this; for example, you might:

* Draw a dense zig-zag
* Draw slightly-offset parallel lines that are closely spaced
* Draw a line very slowly or very quickly, using a pen/paper combo that bleeds ink
* Draw a line which turns out to be, upon close examination, a decorative border
* Draw a line comprised of a cloud of small dots


![handmade_line_weights.jpg](img/handmade_line_weights.jpg)

**Keep** your hand-made tests. *Now*, using one of your methods:

* **Write** code for a function that produces "lines" with different weights. **Extend** your code so that it can produce a polyline of a given thickeness. Your program should **export** SVGs of those lines, such that the lines will appear to have different weights when plotted using the pen you used earlier. *(I say "lines" in quotes because technically, each thick line may actually be comprised of many constituent sub-lines.)*
	* **Note 1**: For this exercise, you are not permitted to use Z-axis pressure.
	* **Note 2**: Sadly, the p5.js [`strokeWeight()`](https://p5js.org/reference/p5/strokeWeight/) command will not be helpful.
* **Use** your function to create a "test-sheet" design that uses at least three line weights. You may use any color pen(s) and any color paper, but your design should allow for direct comparison between lines of different weights drawn with the same pen.
* **Plot** your design on 8.5x11" or 9x12" paper. I recommend using either AxiDraw or HP7475A plotters for this project. **Note**: If you use the HP7475A, you will need to convert SVG to HPGL using vpype; see [these instructions](https://github.com/golanlevin/DrawingWithMachines/blob/main/generating_svg/vpype_svg_prep/README.md), and this [one-sheet PDF for using the HP7475A](https://github.com/golanlevin/DrawingWithMachines/blob/main/machines/hp7475a/hp7475a-one-sheet/hp7475a-one-sheet.pdf).




<!-- 
PAST VERSIONS: 
2021: https://courses.ideate.cmu.edu/60-428/f2021/index.html%3Fp=456.html
2024: https://github.com/golanlevin/DrawingWithMachines/blob/main/assignments/2024/04_line/
README.md
-->
