# 4: Tone/Hatching

This assignment has two parts, and is due at the beginning of class on Tuesday, February 13: 

* [**4.1. Hatching Studies**](#41-hatching-studies) *(3 hours, 40%)*
* [**4.2. Hatched Image / Tonal Surface**](#42-hatched-image-tonal-surface) *(4 hours, 50%)*

For reference, the [**Tone lecture is here**](https://github.com/golanlevin/DrawingWithMachines/blob/main/lectures/topics/tone/README.md).

<!--

---

## 4.1. Hatching Studies

*Please read this prompt all the way to the end, before you start any drawing or coding. The purpose of this prompt is for you to develop foundational skills in controlling value and tone.*

*First, a warmup exercise*: By hand, with a pen and paper, **draw** some hatching studies (i.e., ways of approximating gray tones using assemblies of lines, in order to fill areas of paper). Specifically: **Generate** 9 different hand-drawn hatching concepts or styles (say, in a 3×3 grid)—starting with the most obvious and simple hatching methods, and aiming for some more exotic hatching methods that you might not have any idea how to implement in code. For each hatching style/concept, draw a "value scale" in which you explore how that method achieves variations in density.

![value-scale-3-subset.jpg](img/value-scale-3-subset.jpg)

*Now*: 

* Write code to **implement** four different methods of hatching. You're not required to implement any method that you sketched earlier, but you're welcome to do so.
* For each hatching method, **create** a value scale (gradient sequence) of five adjacent one-inch squares, with evenly-spaced gray values of 10%, 30%, 50%, 70%, 90%. Some inspirations can be seen [below](#hatch-inspo).
* **Export** a single SVG with all four hatching sequences, and **plot** this using a thin black pen on a sheet of heavy white paper. *(Alternatively, you may use a white pen on black paper.)* If you use 11x8.5" paper, you will have the option to use the (fast) [HP7475a plotter (instructions here)](https://github.com/golanlevin/DrawingWithMachines/blob/main/machines/hp7475a/README.md).
* **Create** a Discord post in the *#5a-hatching-studies* channel.
* (*5 points*) In your Discord post, **embed** a photo of your 3×3 grid of handmade sketches.
* (*40 points, i.e. 10 points for each of the four methods*) In your Discord post, **embed** a photograph of your plot with the four computer-generated value sequences.
* (*5 points*) In your Discord post, please **write** a sentence to describe each of your hatching methods, and what you learned making them. Did you have any surprises? Remember to give credit to any external code sources you may have used.

**In your designs,** 

* **Consider** methods like: hatching, cross-hatching, scribbling, scumbling, stippling, fill patterns, or other creative methods of your own design. If you're feeling ambitious and self-directed, this is a perfect opportunity to explore how you can create hatching techiques using things like Perlin noise flow fields, physics simulations (e.g. particle systems, Lloyd's relaxation), typography (e.g. Hershey fonts), etc. 
* **Consider** how you can productively control and contrast properties like: line direction, line density, line length, line curvature, line thickness, and line duty cycle (dashes) to produce different hatches with different characters. Consider how you can control the variation (e.g. randomness, or standard deviations) of these properties. *Do any of your hatching methods have more than one expressive variable (apart from value/density)*? 
* **"Easement" 1:** For up to two of of your hatching methods, you are permitted to integrate “readymade” hatching code into your project (i.e., literally made by someone else — such as you might find in a high-level library like e.g. [PEmbroider](https://github.com/CreativeInquiry/PEmbroider), Cartopy, PyGeode, or [PySLM](https://github.com/drlukeparry/pyslm)). You may use such a library for no more than two of your four different hatch methods. An example project using PEmbroider is given [here](pembroider-example.md). Note that using an external library will not necessarily save you any time (*why*?).
* **Easement 2:** For one of your hatching methods, feel free to implement the following extremely simple method shown immediately below, using parallel lines.  I have posted the code for this method [here](https://editor.p5js.org/golan/sketches/4KhqqgP7l) in case you'd like to peek at an example solution.

![simple-line-hatching.png](img/simple-line-hatching.png)

### Hatchspo 

![joanie_lemercier_hatching.jpg](img/joanie_lemercier_hatching.jpg)

![hatch-inspo.jpg](img/hatch-inspo.jpg)

![lars-wander-axidraw-hatches.jpg](img/lars-wander-axidraw-hatches.jpg)<br />*AxiDraw hatching by Lars Wander.*


---

## 4.2. Hatched Image / Tonal Surface

(*4 hours, 50%*). In this exercise, you will devise a method to render a continuous-tone image using the plotter. The objectives of this project are: 

1. To learn how to represent gradations of continuous tone through *hatching*, dithering, halftones, or related techniques, and
2. Potentially (depending on your goals) to learn how to convert or transduce *raster* images into *vector* representations.

### Ground Rules

To be very clear: for this project, you may choose between "**converting**" a pixel-based image into a hatched vector design, or **generating** a hatched surface directly, using algorithmic techniques.

Some special rules apply if you are converting a pixel-based image into a plottable design:

* If you choose to convert a pixel-based image, you may use any *type* of pixel-based source image, such as a video, photograph, drawing, AI-synthesized image, or shader.
* If you choose to convert a pixel-based image, it must be *an image you created or captured yourself* (such as with a camera, scanner, paint program, etc.). (The main point is that you are not permitted to just download some photo off the internet.)
* If you choose to convert a pixel-based image, give consideration to the relationship between your subject (*who/what*) and your hatching method (*how*). Ideally, these will be tightly coupled: you will choose a photo for a specific rendering treatment, and/or develop a rendering treatment for a specific photo. I recommend depicting a subject in which you have some meaningful personal investment, such as a portrait of someone you know personally (friend, family, self). 
* You may not create a portrait of a celebrity, nor of the professor, please.

### Requirements

* **Write** code to create a "hatched surface". You could implement a hatching method to transduce a continuous-tone image into a vector file, or you may synthesize a hatched vector design entirely from scratch, using generative techniques.
* **Plot** the result. You may plot using any colors of pen and paper you like, but it is suggested (for purely practical reasons) that you **limit** yourself to one color of pen. **Remember** that your plot may take several hours to execute. 
* **Create** a Discord post in the *#42-hatched-image* channel.
* **Embed** a scan or photograph of your plotter drawing in your Discord post. If you derived your hatched design on a source photograph, **embed** a copy of your original source photo as well.
* **Write** a couple sentences about your process in your Discord post. Evaluate your work.
* **Submit** high-quality documentation of your project to [this Google Form]() (TBA).
* **Bring** your work to class on Wednesday 9/17 for pinup. 

-->

<!-- 

Code: 

**SAMPLE CODE.** Here is some sample code to get you started: 

* [weighted rejection sampling of an image](https://editor.p5js.org/golan/sketches/qmdA2b2_Y) in p5.js 
* [line hatching in grid-based image subdivision](https://editor.p5js.org/golan/sketches/CQmqp4JTQ) in p5.js
* [line hatching in grid-based image subdivision](photo_grid_hatching_java/photo_grid_hatching_java.pde) in Processing (Java)
* [line hatching in grid-based image subdivision](photo_grid_hatching_py/photo_grid_hatching_py.pyde) in Processing (Python)
* [Axis-Aligned Polygon Hatching in Processing (Java)](axis_aligned_hatching_java/axis_aligned_hatching_java.pde)

-->

---

<!-- 
PAST VERSIONS: 
2021: https://courses.ideate.cmu.edu/60-428/f2021/offerings/4-hatching/
2021: https://courses.ideate.cmu.edu/60-428/f2021/index.html%3Fp=823.html
2024: https://github.com/golanlevin/DrawingWithMachines/blob/main/assignments/2024/05_tone/README.md
-->