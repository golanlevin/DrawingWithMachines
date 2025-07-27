# 4. Hatching

[**Original assignment here**](https://courses.ideate.cmu.edu/60-428/f2021/index.html%3Fp=823.html). 

This set of prompts has two parts, due by the beginning of class on Wednesday, 9/22:

* **4.1. Looking Outwards:** Review plotting resources on Drawingbots.net and the Drawingbots Discord
* **Hatching Studies:** Develop four different methods of hatching, and plot them on paper.

---

## 4.1. Looking Outwards

*The purpose of this prompt is for you to observe some of the kinds of expertise and energy that are developing around the topic of drawing with machines.*

Spend 10-15 minutes **browsing** the resources at [Drawingbots.net](https://drawingbots.net/) and the [Drawingbots Discord](https://discordapp.com/invite/XHP3dBg), both maintained by Maks Surguy. A good place to get started is this astonishing [list of software tools](https://drawingbots.net/resources#5), but you might also appreciate this list of [recommended supplies](https://drawingbots.net/knowledge/supplies). Now:

**Identify** something you found interesting, and, in a blog post, briefly **describe** it (including an image, if appropriate). **Title** your blog post *Nickname-Drawingbots* and Categorize it *04-Drawingbots*.

---

## 4.2. Hatching Studies

Please **read** this prompt all the way to the end, before you start any drawing or coding. *The purpose of this prompt is for you to develop foundational skills in controlling value and tone.*

*First: do some sketching.* With a pen and paper, **do some hatching studies by hand**. Try to generate 9 different hatching concepts or styles (say, in a 3×3 grid)—starting with the most obvious and butt-simple hatching methods, and aiming for some more exotic hatching methods that you would have no idea how to implement in code.

*Now*: **Write code** to implement four different methods of hatching *(in other words: approximating gray tones using assemblies of lines, in order to fill areas of paper)*.

* For each method, **program** a “gradient sequence” of five adjacent one-inch squares, with evenly-spaced gray values of 10%, 30%, 50%, 70%, 90%. Some inspirations can be seen below.
* **Export** a single SVG with all four hatching sequences, and **execute** this on an AxiDraw plotter using a thin black pen on a sheet of heavy white paper.
* **Create** a blog post, Titled Nickname-Hatching and Categorized 04-Hatching.
* In your blog post: **embed** a photo of your handmade sketches; embed your SVG; and **embed** a screenshot of your project.
* In your blog post, please **write** approximately 100-150 words (a paragraph or so) about your hatching methods, and what you learned making them. Did you have any surprises? Remember to give credit to any external code sources you may have used.
* You’re not required to embed your code, but feel free to do so (in part or in whole) if you wish.

In your designs, 

* **Consider** methods like: hatching, cross-hatching, scribbling, scumbling, stippling, fill patterns, or other creative methods of your own design.
* **Consider** how you can productively control and contrast properties like: line direction, line density, line length, line curvature to produce different hatches with different characters. * **Consider** how you can control the variation (e.g. randomness, or standard deviations) of these properties.
* **Easement 1:** For one of your hatching methods, you are permitted to use a “readymade” hatching method (i.e., made by someone else — such as you might find in a high-level library like PEmbroider, Axidraw Sketchpad, etc.). You may use such a library for no more than one of your four hatch methods. An example project using PEmbroider is given at the bottom of this page.
* **Easement 2:** For one of your hatching methods, feel free to implement one of the following very simple methods shown immediately below, using parallel lines. (These only differ in the orientation of the lines.) I have posted the code for these [here](https://editor.p5js.org/golan/sketches/4KhqqgP7l) in case you feel like it would help to peek at an example solution.

There are some inspirations in the [class notes from last session](https://courses.ideate.cmu.edu/60-428/f2021/index.html%3Fp=771.html).

### PEmbroider Example
 

Processing + PEmbroider code:

```java
// Hatch some shapes and export an SVG
import processing.embroider.*;
PEmbroiderGraphics E;

void setup() {
  noLoop(); 
  size (475, 700);
  E = new PEmbroiderGraphics(this, width, height);

  String outputFilePath = sketchPath("PEmbroider_hatching.svg");
  E.setPath(outputFilePath); 
  E.beginDraw(); 
  E.clear();
  E.strokeWeight(1); 
  E.fill(0, 0, 0); 
  E.noStroke(); 
  
  // VERY important for SVG
  E.toggleConnectingLines(false); // for SVG!
  E.toggleResample(false); // for SVG!


  //-----------------------
  // Perlin noise field fill. 
  E.HATCH_MODE = PEmbroiderGraphics.PERLIN;
  E.HATCH_SPACING = 4;
  E.HATCH_SCALE = 1.0;
  E.rect( 25, 25, 200, 200);

  E.HATCH_MODE = PEmbroiderGraphics.PERLIN;
  E.HATCH_SPACING = 8;
  E.HATCH_SCALE = 1.0;
  E.circle(350, 125, 200);

  
  //-----------------------
  // Shapes filled with PARALLEL hatch mode.
  // I've changed up the way I'm setting the parameters.
  E.hatchMode(E.PARALLEL);
  E.hatchAngleDeg(45); // Degrees!
  E.hatchSpacing(4);
  E.circle(125, 350, 200);

  E.hatchMode(E.PARALLEL);
  E.hatchAngle(radians(90)); // Radians!
  E.hatchSpacing(4);
  E.circle(350, 350, 200);


  //-----------------------
  // The "cross" hatch mode is a convenience mode, 
  // placing parallel lines of stitching at two orientations
  // specified by HATCH_ANGLE and HATCH_ANGLE2:
  E.HATCH_MODE = PEmbroiderGraphics.CROSS;
  E.HATCH_ANGLE = radians(90);
  E.HATCH_ANGLE2 = radians(0); 
  E.HATCH_SPACING = 4;
  E.circle(125, 575, 200);

  E.HATCH_MODE = PEmbroiderGraphics.CROSS;
  E.HATCH_ANGLE = radians(90); 
  E.HATCH_ANGLE2 = radians(75); 
  E.HATCH_SPACING = 8;
  E.circle(350, 575, 200);
  

  //-----------------------
  E.optimize(); // slow, but good and important
  E.visualize(); 
  E.endDraw(); // write out the file
  save("screenshot.png"); 
}

//--------------------------------------------
void draw() {;}
```

Screenshot:



SVG:



 