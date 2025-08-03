# Strategies for Walking a Dot (or Line)

1. **Direct calculation**. Use an equation to determine the position of a point leaving a trace. For example: 
  * explicit curves: `y=f(x)`
  * polar curves: `r=f(θ)` [...and then convert: `x=r*cos(θ), y=r*sin(θ)`]
  * parametric curves: `y=f(t), x=g(t)`, etc.
  * Evolutes and involutes
2. **Differential curve plotting**. Trace the movement of a point as its position accumulates small stepwise differences. Those small differences could be computed in lots of (similar) ways: 
  * using "turtle graphics", in which an agent's bearing (speed and orientation) change over time: `x+=speed*cos(orientation), y+=speed*sin(orientation)`
  * from randomness (e.g. drunk walk): `x+=random(), y+=random()`.
  * using differential equations: `dy=f(t), dx=g(t); y+=dy, x+=dx`. 
  * using particle physics and/or flocking algorithms: in which a particle's position or bearing changes as a result of environmental "forces" (gravity, wind, flow fields, attraction to other agents or food sources, avoiding predators, etc.). See Braitenberg Vehicles, Craig Reynolds' Steering Behaviors, Boids-type Flocking, etc. 
3. **Whole-line transformations and/or physics**. Given a polyline, 
  * Signal processing and filtering (convolution): Smoothing & sharpening
  * Segmentwise substitution rules (space filling curves)
  * Filament simulations: Represent the line as a sequence of particles; affect all of the particles with forces. 
  * Differential growth: Filament simulation in which new particles can be "born" between older ones.
4. **Other**
  * Path planning
  * Fourier synthesis
  * ...

---

### Some Specific Techniques

#### Turtle Graphics

* [p5.js starter program](https://editor.p5js.org/golan/sketches/SeiQiFsMa)

![Turtle_Graphics_Spiral.svg.png](img/Turtle_Graphics_Spiral.svg.png)

#### Turtle Graphics: Greek Meander Designs

A meander or meandros, also called a Greek fret or Greek key, is a decorative border constructed from a continuous line, shaped into a repeated motif. Meanders are [common decorative elements in Greek and Roman art](https://blogmymaze.wordpress.com/2012/06/07/different-types-of-meanders-in-greek-art/), used as running ornaments. On one hand, the name “meander” recalls the twisting and turning path of the Maeander River in Asia Minor, and on the other hand, as Karl Kerenyi has pointed out, “the meander is the figure of a labyrinth in linear form”.

![greek-border-patterns.png](img/greek-border-patterns.png)

---

#### Writing-Like

#### Manfred Mohr, *P-021/B*, 1969

> *"The elements are horizontal, vertical, 45 degree lines, square waves, zig-zags, and have probabilities for line widths and lengths. The algorithm places elements in a horizontal direction and has a high probability to move from left to right and a limited probability to backtrack. The original idea of this algorithm was to create a visual musical score which defies the progression in time by occasionally turning back on itself. Thus at the same time an abstract text is created."*

![p021b.gif](img/p021b.gif)

*P-021/A + B*, "band-structure", computer generated algorithmic plotter drawings, ink/paper, 1969, 50cm x 50cm

---


#### Spencerian Flourishes (copperplate calligraphy) 

* [p5.js code example](https://editor.p5js.org/golan/sketches/_bBzlrd26)

[![compu-flourish.png](img/compu-flourish.png)](https://editor.p5js.org/golan/sketches/_bBzlrd26)

![flourish-exercises-1.jpg](img/flourish-exercises-1.jpg)

![flourishes_23.jpg](img/flourishes_23.jpg)

#### Drunk Walk


```
// Simple Drunk Walk
let px = 200; 
let py = 200;
let speed = 5; 

function setup() {
  createCanvas(400, 400);
  background(220);
}

function draw() {
  let qx = px + speed * random(-1,1);
  let qy = py + speed * random(-1,1);
  line(px,py,qx,qy); 
  px = qx; 
  py = qy;
}
```
Using Perlin Noise:

```
// Simple Perlin Drunk Walk
let px = 200; 
let py = 200;
function setup() {
  createCanvas(400, 400);
  background(220);
}

function draw() {
  let qx = px + map(noise(12345+millis()/1000),0,1,-1,1);
  let qy = py + map(noise(34567+millis()/1000),0,1,-1,1);
  line(px,py,qx,qy); 
  px = qx; 
  py = qy;
}
```

---

#### Segment Substitution with Recursion (Fractals)

The [Koch Snowflake](https://en.wikipedia.org/wiki/Koch_snowflake), [Peano Curve](https://en.wikipedia.org/wiki/Peano_curve), [Hilbert Curve](https://en.wikipedia.org/wiki/Hilbert_curve), [Gosper Curve](https://en.wikipedia.org/wiki/Gosper_curve), [Minkowski Island](https://en.wikipedia.org/wiki/Minkowski_sausage), and other "[space-filling curves](https://teachout1.net/village/fill.html)", use *segment substitution rules*: each line segment is replaced by a more articulated polyline — whose line segments are then replaced, etc.

![python-turtle-graphics-recursion-line.png](img/python-turtle-graphics-recursion-line.png)

![hilbert_curve.svg.png](img/hilbert_curve.svg.png)

![minkowski-island.png](img/minkowski-island.png)

---

#### Signal Filtering

* Smoothing & sharpening ("convolution kernel filtering"). [p5.js code example](https://editor.p5js.org/golan/sketches/G-uT6taZ_)

[![line_filtering.gif](img/line_filtering.gif)](https://editor.p5js.org/golan/sketches/G-uT6taZ_)

---

#### Braitenberg Vehicles

* Read [*Notes on “Phototaxis”*](https://medium.com/@REAS/notes-on-phototaxis-db7aa7641ad8) by Casey Reas 

![braitenberg-vehicles.png](img/braitenberg-vehicles.jpg)

![reas_braitenberg.png](img/reas_braitenberg.png)

---

#### Differential Growth

![differential-growth.png](img/differential-growth.png)

--- 

#### Chaotic Path Simulations

* Dan Shiffman's [*Double Pendulum*](https://editor.p5js.org/codingtrain/sketches/jaH7XdzMK)

[![double_pendulum.gif](img/double_pendulum.gif)](https://editor.p5js.org/codingtrain/sketches/)

* Scott Snibbe's [*Tripolar*](https://editor.p5js.org/golan/sketches/nurnJ6_8l)

[![tripolar.png](img/tripolar.png)](https://editor.p5js.org/golan/sketches/nurnJ6_8l)

---

#### Fourier Epicycles

* https://www.youtube.com/watch?v=r6sGWTCMz2k
* https://www.youtube.com/watch?v=Mm2eYfj0SgA 
* https://www.youtube.com/watch?v=MY4luNgGfms
* https://www.youtube.com/watch?v=n9nfTxp_APM
* https://www.dynamicmath.xyz/fourier-epicycles/ Good interactive
* https://www.jezzamon.com/fourier/index.html Good interactive

![trex.gif](img/trex.gif)

* https://github.com/jasonwebb/morphogenesis-resources?tab=readme-ov-file#fourier-series
* https://www.youtube.com/watch?v=MY4luNgGfms

---

#### Dubins Path

Optimal path for robots/turtles with a fixed turning radius. 

* [Dubins Paths](https://en.wikipedia.org/wiki/Dubins_path)
* [Example app](https://editor.p5js.org/Codefish/sketches/mtTdme9-H)

![dubins-paths-between-two-nodes.png](img/dubins-paths-between-two-nodes.png)

![jurg-lehni-hektor-dubins-font.gif](img/jurg-lehni-hektor-dubins-font.gif)

---

#### Path Planning

* https://www.youtube.com/watch?v=aKYlikFAV4k

![rrt_path_planning.gif](img/rrt_path_planning.gif)

![Comparison-Chart-of-Path-Planning-using-DWA-Wu.png](img/Comparison-Chart-of-Path-Planning-using-DWA-Wu.png)


#### Other

* Parametric equations (mathworld)
* Leaf venation, space colonization
* Crack formation 
* Self-avoiding walk, https://en.wikipedia.org/wiki/Self-avoiding_walk
* TSP
* Convex Hull
* Concave Hull


---

![bangert_complex_intersecting_line_1976_spalter.jpg](img/bangert_complex_intersecting_line_1976_spalter.jpg)<br />Colette and Charles Bangert, [*Complex Intersecting Line*](https://spalterdigital.com/artworks/3314/), 1976. Spalter Collection. [Detail](https://i0.wp.com/spalterdigital.com/wp-content/uploads/2019/09/IMG_4451-e1569338421449.jpeg?fit=2000%2C1500&ssl=1)

![gl_linewalk.gif](img/gl_linewalk.gif)<br />
[*The Professor's Attempt*](https://editor.p5js.org/golan/sketches/im4aJHJO_) (p5)


---

#### Time Permitting

* William Forsythe's *Improvisation Technologies* (1995): [*Point-Point-Line*](https://www.youtube.com/watch?v=6X29OjcBHG8), [*Line Extrusion*](https://www.youtube.com/watch?v=e_7ixi32lCo), [*Line Avoidance*](https://www.youtube.com/watch?v=cqGyFiEXXIQ), [*Dropping Curves*](https://www.youtube.com/watch?v=_zt95yXWLX4)