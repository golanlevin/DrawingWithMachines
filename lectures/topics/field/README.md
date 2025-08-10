# Field

*How can we (write software to generatively) fill a surface with an aesthetic, organic field?*

![field_graphic_games-1536x570.jpg](img/field_graphic_games-1536x570.jpg)


[![julienv3ga_fields.jpg](img/julienv3ga_fields.jpg)](https://www.instagram.com/julienv3ga/)<br/>[Fields by Julien Gachadoat (v3ga)](https://www.instagram.com/julienv3ga/)

---

## Case Study I: Shantell Martin

![shantell-martin-13.jpg](img/shantell-martin-13.jpg)

[Video](https://youtu.be/peeXWxxfUAc)

## Case Study II: [Corollaria Railing](https://n-e-r-v-o-u-s.com/blog/?p=8753)

Jessica Rosenkrantz and Jesse Louis-Rosenberg, who work together as [Nervous System](https://n-e-r-v-o-u-s.com/), have been at the forefront of nature-inspired computational design for nearly two decades. In designing their new studio, they used simulation algorithms to create [an algorithmically-generated, lasercut steel railing](https://n-e-r-v-o-u-s.com/blog/?p=8753) that acts as a sculptural element winding through the space. 

[![corollaria.jpg](img/corollaria.jpg)](https://n-e-r-v-o-u-s.com/blog/?p=8753)

Nervous System also [created the plaques](https://n-e-r-v-o-u-s.com/blog/?p=9778) for the STUDIO for Creative Inquiry's Fund for Underwriting Creativity, Knowledge, Experimentation, Research and Yumminess, which supports antidisciplinary undergraduate research at CMU. 

[![moore_plaques_at_cmu_studio.jpg](img/moore_plaques_at_cmu_studio.jpg)](https://n-e-r-v-o-u-s.com/blog/?p=9778)

--- 

## Morphogenesis Resources

Resources surveying a wide variety of algorithms for growing forms.

* [*Morphogenesis Resources*](https://github.com/jasonwebb/morphogenesis-resources) by Jason Webb
* [*That Creative Code Page*](https://thatcreativecode.page/) by Taru Muhonen & Raphaël de Courville
* [*Processing repository*](https://github.com/v3ga/Processing) by Julien Gachadoat (v3ga)
* [*Algorithmic Botany papers*](http://algorithmicbotany.org/papers/#webdocs) and [Visual Models of Morphogenesis](http://algorithmicbotany.org/vmm-deluxe/TableOfContents.html) by Przemyslaw Prusinkiewicz 

![venation.png](img/venation.png)

--- 
## Contents 

Here's a small handful of approaches:

* [**Flow Fields**](../../topics/flow_fields/README.md) (page)
* [Shape Packing](#shape-packing)
* [Ice-Ray Grammars](#ice-ray-grammars)
* [Diffusion Limited Aggregation](#diffusion-limited-aggregation)

---

## Shape Packing

*A feedback process in which new shapes arise in the spaces between previous shapes.*

![packing.png](img/packing.png)

* [*Coding Train* Tutorial Video: Animated Circle Packing](https://www.youtube.com/watch?v=QHEQuoIKgNE)
* [Demo code: Animated Circle Packing](https://codepen.io/DonKarlssonSan/pen/VwLxXYg)
* [Approximate Circle Packing](https://estebanhufstedler.com/2020/12/11/approximate-circle-packing/)
* [Tutorial: in Processing](http://www.codeplastic.com/2017/09/09/controlled-circle-packing-with-processing/)
* [Lars Wander Article: Polygon Packing](https://larswander.com/art/polygon-packing/)
* Amy Goodchild: [*Maplands* artwork](https://www.amygoodchild.com/art/maplands)
* Amy Goodchild: [*Maplands* article](https://www.amygoodchild.com/blog/maplands)
* Amy Goodchild: [*Cake Shaped* at fxhash](https://www.fxhash.xyz/generative/13069)
* Box2D/Matter.js examples (Coding Train)
  * [Matter.js Boxes and boundaries](https://editor.p5js.org/natureofcode/sketches/WSoUy03ph)
  * [Matter.js Bridge demo](https://editor.p5js.org/natureofcode/sketches/7U7yrrbNz)


---

## Ice-Ray Grammars

*A feedback process in which a line propagates until it hits a previous line, while sometimes branching off new lines.*

![george_stiny_ice_ray_grammar_1977.png](img/george_stiny_ice_ray_grammar_1977.png)<br />George Stiny, [*Ice Ray Grammars*](https://www.contrib.andrew.cmu.edu/~ramesh/teaching/course/48-747/subFrames/readings/Stiny-1977-EPB3_89-98.Ice-ray..pdf), 1977

![mauro_annunziato_chaos_revenge.jpg](img/mauro_annunziato_chaos_revenge.jpg)<br />Mauro Annunziato, [*Chaos Revenge*](https://digitalartarchive.siggraph.org/artwork/mauro-annunziato-chaos-revenge/), 1999

![jared_tarbell_substrate.jpg](img/jared_tarbell_substrate.jpg)<br />Jared Tarbell, [*Substrate*](), 2003; [2023 recode by Tom White](https://dribnet.github.io/substrate/); [video](https://vimeo.com/208903786); [simple recode by Golan](https://editor.p5js.org/golan/sketches/lbIjah3p2)

> A single line (known internally as a “crack”) begins drawing itself from some random point in some random direction. The line continues to draw itself until it either (a) hits the edge of the screen or (b) hits another line, at which point it stops and two more lines begin. The one simple rule used in the creation of new lines is that they begin at tangents to existing lines. This process is repeated until there are too many lines to keep track of or the program is stopped.

![mitchell_whitelaw_limits_to_growth_2008.jpg](img/mitchell_whitelaw_limits_to_growth_2008.jpg)<br />Mitchell Whitelaw, [*Limits to Growth*](https://mtchl.net/limits-to-growth/), 2008

![mario_klingemann_subdivision.jpg](img/mario_klingemann_subdivision_2.jpg)<br />Mario Klingemann, [*Subdivision*](https://www.flickr.com/photos/quasimondo/albums/72157606163595189/with/2490048589), 2008


![rapidly_exploring_random_tree_rrt.gif](img/rapidly_exploring_random_tree_rrt.gif)<br />[Rapidly Exploring Random Tree](https://en.wikipedia.org/wiki/Rapidly_exploring_random_tree) (RRT) path-planning algorithm

---

## Diffusion-Limited Aggregation

*A feedback process in which particles get stuck to previous particles.*

![uri_shapira_dla_photo.jpg](img/uri_shapira_dla_photo.jpg)<br />*Chemical photo by Uri Shapira*

![bourke_dla7.gif](img/bourke_dla7.gif)

* [Animated Demonstration](https://twitter.com/0xelric_eth/status/1684045756863504384)
* [Reference: Paul Bourke on DLA](https://paulbourke.net/fractals/dla/)
* [Animated demonstration, starting from a line](https://twitter.com/DonKarlssonSan/status/649693928950775808)
* [Demo code by Shiffman](https://editor.p5js.org/codingtrain/sketches/XpS9wGkbB)
* [Video: Coding Train DLA Tutorial](https://www.youtube.com/watch?v=Cl_Gjj80gPE)
* [Video: DLA on Perlin Noise flow field](https://www.youtube.com/watch?v=s3VsK8BtIw0)
* [Artwork: Jewelry by Nervous System](https://n-e-r-v-o-u-s.com/shop/generativeProduct.php?code=9)
* [Artwork: 3D DLA slices](https://twitter.com/nacho_cossio/status/1372279259578953728)
* [Artwork: DLA + RD](https://twitter.com/colinreid_me/status/1680274061253853184)
* [Artwork: DLA in 3D type](https://twitter.com/mikebrondbjerg/status/1359748990041010177)
* [Reference: Prusinkiewicz](http://algorithmicbotany.org/vmm-deluxe/Section-05.html)
* [Physics demo: castor oil, bearings](https://twitter.com/Rainmaker1973/status/1551139590890733570)
* [*A Two-Dimensional Growth Process*](img/eden_2d_growth_process_1961.pdf), Murray Eden, 1961 (PDF)

---

* [2021 lecture on flow fields](https://courses.ideate.cmu.edu/60-428/f2021/daily-notes/10-06-field-distribution/)
* [2021 lecture on feedback fields](https://courses.ideate.cmu.edu/60-428/f2021/index.html%3Fp=1542.html)

Also: 

* [Voronoi stippling](https://www.youtube.com/watch?v=Bxdt6T_1qgc), [Lloyd's relaxation by Bostock](https://observablehq.com/@mbostock/lloyds-algorithm)
* [Spatial partitioning (Guillotine cutting)](https://en.wikipedia.org/wiki/Guillotine_partition)
* [Venation/Colonization](https://medium.com/@jason.webb/space-colonization-algorithm-in-javascript-6f683b743dc5)
