# (Perlin Noise) Flow Fields

-- 

## Code

Here's code for a simple [p5.js demo of a Perlin-noise flow field](https://editor.p5js.org/golan/sketches/Tent2cAg5).

[![flow_field_p5_demo.png](img/flow_field_p5_demo.png)](https://editor.p5js.org/golan/sketches/Tent2cAg5)

---

## Technical Overview

Here’s an [excellent Observable notebook](https://observablehq.com/@esperanc/flow-fields) with interactive illustrations of Perlin Noise flow fields:

![flow_field_observable_perlin_noise.jpg](img/flow_field_observable_perlin_noise.jpg)

Here’s Dan Shiffman offering an explanation [on the Coding Train](https://www.youtube.com/watch?v=BjoM9oKOAKY).

![flow_field_coding_train.jpg](img/flow_field_coding_train.jpg)

Algorithmic alternatives to Perlin Noise:

* [Inigo Quilez noise examples](https://www.shadertoy.com/playlist/fXlXzf&from=0&num=12)
* [Paul Bourke noise examples](https://paulbourke.net/fractals/noise/)
* [Simplex Noise](https://www.youtube.com/watch?v=Lv9gyZZJPE0)
* [Worley (Voronoi) Noise](https://www.youtube.com/watch?v=4066MndcyCk)
* Value Noise, Gradient Noise, etc. 



---

## Some Artworks that Use Perlin Noise Flow Fields 

By [Nadieh Bremer](https://twitter.com/NadiehBremer/status/1429820630250184708): 

![flow_field_nadieh_bremer.jpg](img/flow_field_nadieh_bremer.jpg)

By [Tyler X. Hobbs](https://tylerxhobbs.com/fidenza):
![flow_field_tyler-hobbs-annetta-2020.jpg](img/flow_field_tyler-hobbs-annetta-2020.jpg)

![flow_field_tyler-hobbs-aligned-movement-paper-crop-2020.jpg](img/flow_field_tyler-hobbs-aligned-movement-paper-crop-2020.jpg)

By [Mark Webster](https://twitter.com/motiondesign_01/status/1443930292121657344):

![flow_field_mark_webster.jpg](img/flow_field_mark_webster.jpg)

By [Lionel Radisson](https://twitter.com/MAKIO135/status/1444047935055007745):

![flow_field_lionel_radisson_1.jpg](img/flow_field_lionel_radisson_1.jpg)
![flow_field_lionel_radisson_2.jpg](img/flow_field_lionel_radisson_2.jpg)

By [Fred Briolet](https://twitter.com/p1xelfool/status/1435000906693726212):

![flow_field_fred_briolet.jpg](img/flow_field_fred_briolet.jpg)

By [Itay Niv](https://twitter.com/Itay_niv/status/1441863748516397060):

![flow_field_itay_niv.jpg](img/flow_field_itay_niv.jpg)

By [Julien Gachadoat](https://twitter.com/v3ga/status/1432463143167565832):

![flow_field_julien_gachadoat.jpg](img/flow_field_julien_gachadoat.jpg)

By [Caleb Ogg](https://twitter.com/caleb_ogg/status/1552770615970476032). Each circles is constructed from two identical spirals overlaid with a small offset. The *direction* of the offset is based on Perlin noise, yielding field-aligned interference patterns.

![flow_field_caleb_ogg.jpg](img/flow_field_caleb_ogg.jpg)

By [Manolo Gamboa Naon](https://www.behance.net/manoloide):

![flow_field_manolo_gamboa_naon_1.jpg](img/flow_field_manolo_gamboa_naon_1.jpg)
![flow_field_manolo_gamboa_naon_2.jpg](img/flow_field_manolo_gamboa_naon_2.jpg)

By [Aleksandra Jovanić](https://twitter.com/alexis_o_O/status/1413060985884221445):

![flow_field_aleksandra_jovanic.jpg](img/flow_field_aleksandra_jovanic.jpg)

By [Jessica In](https://www.instagram.com/p/COdZNZgnVqW/):

![flow_field_jessica_in.png](img/flow_field_jessica_in.png)

By 90PercentArt:

![flow_field_90percentart.jpg](img/flow_field_90percentart.jpg)

---

## Blending Algorithmic Approaches

In [this article](https://tylerxhobbs.com/essays/2020/flow-fields), Tyler Hobbs shows how different algorithms (including circle packing) can be used to seed the initial positions of moving particles — which can affect how a Perlin Noise flow field looks.


![hobbs-combo.png](img/hobbs-combo.png)

In [this example (YouTube)](https://www.youtube.com/watch?v=s3VsK8BtIw0) (discussed [here](https://medium.com/@jason.webb/simulating-dla-in-js-f1914eb04b1d), "Simulating 2D diffusion-limited aggregation (DLA) with JavaScript"), Jason Webb shows how a Diffusion-Limited Aggregation simulation can be expressively altered, when the diffusing particles are not simply moving in a random way, but are moving along gradients of another simulation (in this case, a Perlin Noise flow field).

[![perlin-flow-dla.png](img/perlin-flow-dla.png)](https://www.youtube.com/watch?v=s3VsK8BtIw0)

---

[2021 version](https://courses.ideate.cmu.edu/60-428/f2021/index.html%3Fp=1372.html)