# Tone

[*A Crack in the Hourglass*](https://www.youtube.com/watch?v=BsVsULhoSbM), Rafael Lozano-Hemmer, 2021. Portraits of deceased loved ones are drawn, ephemerally, in sand.<br />[![Rafael Lozano Hemmer, Crack in the Hourglass](../realtime_plotting/img/lozano-hemmer_crack-in-the-hourglass.jpg)](https://www.youtube.com/watch?v=BsVsULhoSbM)

In this lecture, we turn our attention to the problem of **tone in drawing** — and more specifically, how we can achieve variations in light and dark across a surface, by building up marks that in themselves may not vary in their darkness.

[*Portraits*](https://www.youtube.com/watch?v=A4dQIuD6xbA), [Patrick Tresset](https://patricktresset.com/new/), 2016.<br />![Patrick Tresset](../realtime_plotting/img/patrick-tresset-portrait.jpg)


---

## Hatching: Some Reminders

* Question to the group: What are some *dimensions of variability* that are used to achieve tone and tone textures in drawings?

<details><summary>Click to reveal some examples</summary>

* density (elements per linear inch, or per square inch)
* line weight (by varying pen pressure or orientation)
* layering (cross-hatching of multiple marks)
* duty cycle (of a dashed line)
* hardness of pencil
* darkness of ink

</details>


![hatching-techniques](img/hatching-techniques.jpg)

![crosshatching](img/crosshatching.jpg)

![sketch-hatching](img/sketch-hatching.jpg)

![texture-pattern-elements](img/texture-pattern-elements.jpg)

![contrasts](img/contrasts.jpg)


---

## Orientation Matters


The illustration below shows a very simplistic cross-hatching method. If a region of the image is darker than 0.7, a horizontal line is drawn there. If a region is darker than 0.5, a vertical line is *also* drawn there. In this way, several different effective grayscale levels are achieved. However, beyond representing gross luminance, the hatched lines are not otherwise *image-aware*. They are missing an important opportunity to help structure the image in other ways, at the same time that they communicate value.

![simple_hatching](img/simple_hatching.png)

In classical engraving, you may see hatch lines that move along, against, or perpendicular to natural gradients in the image. These hatch lines not only convey dark and light, but help model the volume of the depicted form, and even its surface texture. 

![Queens-of-Persia-at-the-Feet-of-Alexander-detail](img/Queens-of-Persia-at-the-Feet-of-Alexander-detail.jpg)<br />*Gérard Edelinck after Charles Le Brun, French, ca. 1675.*

![goltzius](img/goltzius.jpg)<br />Hendrick Goltzius (1558–1617), *Apostle Simon*, 1589 (detail)

We can also hatch in ways that may ignore gradients in the "primary" visual material, but nonetheless establish intriguing secondary flows in the image plane.

![NicolasJolly](img/NicolasJolly.jpg)<br />By Nicolas Jolly.


---

## Material Considerations

Here are some alternative approaches to achieving tone that rely on using combinations of different tools, or using tools in unconventional ways.

We can achieve different tones (and textures) by using a set of pens with different nib sizes. 

![pens-make-a-difference](img/pens-make-a-difference.jpg)

We can achieve different tones by using a set of pencils with different hardnesses. 

![fogleman-pencils](img/fogleman-pencils.png)

We can acheive different tones by allowing ink to bleed for different amounts of time ("dwell-based halftoning"):

![bleeding-ink-dwelling](img/bleeding-ink-dwelling.png)


---

## Tone and Algorithm I: Alphabets of Modular Texture Elements

One way to establish tone is to use an **alphabet** of modular elements of varying luminance.

![harmon_onethird](img/harmon_onethird.jpg)<br />Leon Harmon & Ken Knowlton, *Computer Nude (Studies in Perception I)*, 1967.

> *Computer Nude (Studies in Perception I)* is the most widely circulated early artwork made using a computer. It demonstrates the unique capacity of the viewer's brain to interpret a composition of abstract symbols grouped to emulate areas of tonal value as a human figure. Leon Harmon, a researcher in cognitive neuroscience, and Ken Knowlton, a computer engineer at AT&T’s Bell Labs, reenvisioned a photograph of dancer Deborah Hay as a bitmap mosaic using a program they developed. Harmon and Knowlton were brought together by Experiments in Art and Technology (E.A.T.), a nonprofit group which aimed to provide creative minds with access to new technology and engineering professionals. A special scanner converted analog voltages to binary numbers which were assigned typographic symbols.

![harmon_knowlton_nyt1967](img/harmon_knowlton_nyt1967.jpg)

> Rauschenberg hung a copy of this image in his studio during a press conference for an E.A.T. event. It was photographed and subsequently reproduced in an October 11, 1967, article in The New York Times titled “Art and Science Proclaim Alliance in Avant-Garde Loft,” becoming the publication’s first full-frontal nude. Due to the popularity of the image, a limited-edition screen print was created from the original work.

Nowadays we know this as ASCII art. Here's live ASCII webcam video art by [Alida Sun](https://www.instagram.com/p/Cz87BMryZgW/?hl=en&img_index=1): 

![alida-sun](img/alida-sun.png)<br />Alida Sun

![arjan_van_der_meij](img/arjan_van_der_meij.jpg)<br />Arjan van der Meij

![archi-materials](img/archi-materials.png)

![wood-and-stone-material-hatch-patterns](img/wood-and-stone-material-hatch-patterns.jpg)



<details><summary>Sidebar about stamps/printing</summary>

Our current discussion focuses on using *lines*. Having an alphabet of modular elements verges on imaging with stamps (i.e. **printing**), as in this thumbprint work by Chuck Close:<br />
![chuck_close_thumbprint_georgia](img/chuck_close_thumbprint_georgia.jpg)

Or this typewriter drawing by Lenka Clayton:<br />
![lenka_clayton_big_flowery_pot.webp](img/lenka_clayton_big_flowery_pot.webp)

</details>

---

## Tone and Algorithm II: Grab Bag. 


Just a small handful of many possible approaches: 

[Weighted Rejection Sampling](https://editor.p5js.org/golan/sketches/qmdA2b2_Y) (p5)

![weighted-rejection-sampling](img/weighted-rejection-sampling.png)

[Rasterization with variable line weight](http://paperjs.org/examples/spiral-raster/) (SpiralRaster)

![rasterization-with-line-weight](img/rasterization-with-line-weight.png)

[Novel approaches to variable line density](https://msurguy.github.io/SquiggleCam/) (SquiggleCam)

![squigglecam](img/squigglecam.png)

[Weighted Voronoi Stippling](https://observablehq.com/@mbostock/voronoi-stippling) & [p5.js](https://editor.p5js.org/golan/sketches/i3-pa_GPI)

![weighted-voronoi-stippling](img/weighted-voronoi-stippling.png)

[Traveling Salesman Problem tour](https://www.math.uwaterloo.ca/tsp/data/art/) & [example](img/robert_bosch_pareja_160K.png)

![tsp-mona-detail](img/tsp-mona-detail.png)


[TSP Tour & Figurative Tour](https://blogs.scientificamerican.com/roots-of-unity/when-the-mona-lisa-is-np-hard/)

> As Bosch and Wexler write, “Even though this tour is the best one possible and does indeed resemble the target image, it doesn’t achieve as good a likeness as the points do alone.” It seems like kind of a waste to solve the traveling salesman problem just to make the picture worse, so they decided to change the rules of the game.

![tsp-mona](img/tsp-mona.png)

> Instead of clustering the points in their image, they start with a regular grid of points. The object of the game is then to connect them not with a path that solves the traveling salesman problem but with one that visually resembles the target image. The path should still hit each point exactly once, but now the winning trip will probably be longer than the TSP-optimal path.

![tsp-mona](img/mona-figurative-tour.png)

[Halftoning with Reaction-Diffusion Patterns](https://estebanhufstedler.com/2020/05/17/halftoning-with-reaction-diffusion-patterns/) (+[Sims](https://www.karlsims.com/rd.html))

![reaction-diffusion-haring](img/reaction-diffusion-haring.jpg)

The [**DrawingBotv34 software**](https://docs.drawingbotv3.com/en/latest/pfms.html#) offers *numerous* different readymade algorithms for converting raster images to vector drawings.

![drawingbotv3](img/drawingbotv3.jpg)

---

## Tone and Algorithm III: Dithering

[Dithering](https://en.wikipedia.org/wiki/Dither) is the problem of rendering a continuous-tone (or high bit-depth) raster image with fewer bits. There are many, many different techniques.

![dithering-montage](img/dithering-montage.png)

Some easy ones are: *Threshold*; *Random*; *Bayer*. (How do you suppose they work?)

![dithering](img/dithering.png)

[Floyd-Steinberg](https://en.wikipedia.org/wiki/Floyd%E2%80%93Steinberg_dithering) is the most common dithering method. it works by using error diffusion, meaning it propagates (adds) the residual quantization error of a given pixel onto its neighboring pixels, to be dealt with later.

```
for each y from top to bottom do
    for each x from left to right do
        oldpixel := pixels[x][y]
        newpixel := find_closest_palette_color(oldpixel)
        pixels[x][y] := newpixel
        quant_error := oldpixel - newpixel
        pixels[x + 1][y    ] := pixels[x + 1][y    ] + quant_error × 7/16
        pixels[x - 1][y + 1] := pixels[x - 1][y + 1] + quant_error × 3/16
        pixels[x    ][y + 1] := pixels[x    ][y + 1] + quant_error × 5/16
        pixels[x + 1][y + 1] := pixels[x + 1][y + 1] + quant_error × 1/16
```

#### Further Reading on Dithering

If you want to nerd out, these articles are amazing:

* [Wikipedia Article on Dithering](https://en.wikipedia.org/wiki/Dither)
* [Image Dithering: Eleven Algorithms and Source Code](https://tannerhelland.com/2012/12/28/dithering-eleven-algorithms-source-code.html)
* [Ditherpunk — The article I wish I had about monochrome image dithering](https://surma.dev/things/ditherpunk/)
* [Joel Yliluoma's arbitrary-palette positional dithering algorithm](https://bisqwit.iki.fi/story/howto/dither/jy/)
* [Case Study: Dithering in *Return of the Obra Dinn*](https://forums.tigsource.com/index.php?topic=40832.msg1363742#msg1363742)
* [DITHERT: Dithering implementations in Processing](https://bitbucket.org/mwebster_/dithering/src/master/)


#### Dithering Art

[Work by Loackme (Loïc Schwaller)](https://twitter.com/loackme_)

<!-- 
![loackme-0](img/loackme-0.gif)
-->
![loackme-1](img/loackme-1.gif)

[*Cajal* Neural Drawings by Mark Webster](https://twitter.com/search?q=%40motiondesign_01%20cajal)

![mark-webster](img/mark-webster.jpg)

![mark-webster-3](img/mark-webster-3.jpg)

![mark-webster-2](img/mark-webster-2.jpg)



---

[2021 version](https://courses.ideate.cmu.edu/60-428/f2021/index.html%3Fp=771.html)