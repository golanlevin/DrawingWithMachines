# 5. Shape

[**Original assignment here**](https://courses.ideate.cmu.edu/60-428/f2021/index.html%3Fp=1069.html). 

*Please respond to these prompts before the beginning of class on Wednesday, September 29.*

---

## 5.1. Blob Reading

```
A blob is a raw amorphous form
A blob is a potentiality
A blob is an indeterminate destination
A blob is a liminal manifestation of the inexplicable
A blob is neither this nor that but points as is
A blob is a transitional state of being
A blob is a subtle deconstruction of preconceptions
A blob is a real-time negotiation
A blob is a polite refusal of hierarchy
A blob is a poetic irregularity
A blob is a vague matter of existence
A blob is a sensitization to nonlinearity
— Laura Hyunjhee Kim
```

Please read one or more of the following excerpts:

* *Entering the Blobosphere*, by [Laura Hyunjhee Kim](https://www.lauraonsale.com/) — [online](https://www.lauraonsale.com/blob.html) • [PDF](https://github.com/golanlevin/DrawingWithMachines/blob/main/readings/blobosphere_kim.pdf)
* *Blobjects: Beyond the New Fluidity in Design*, by Steven Holt and Maria Skov — [online](https://www.scribd.com/doc/22260328/Blobjects-Beyond-The-new-fluidity-in-design-Steven-Skov-Holt-and-Maria-Holt-Skov-2005) • [PDF](https://github.com/golanlevin/DrawingWithMachines/blob/main/readings/blobjects_holt.pdf)
* “Good Shape”, from *The Nature of Order*, by Christopher Alexander — [PDF](https://github.com/golanlevin/DrawingWithMachines/blob/main/readings/nature_of_order_alexander_good_shape.pdf)

In your blog post for *Part 2* (“Blob Family”, below) please add a sentence about something that caught your attention or influenced your thinking from these readings.

---

## 5.2. Blob Family

*The objective of this prompt is to develop your skills in the control of expressive shape.*

**Write a program** that generates various compositions of “blob families.” Your blobs must be closed curves, constructed of vector data, and at least one of them must be filled with some sort of hatch. For inspiration, consider works by [Hans Arp](https://www.google.com/search?q=jean+arp&tbm=isch&chips=q:jean+arp,g_1:composition:qkKObJ-meXw%3D&hl=en), [Joan Miro](https://www.google.com/search?q=Joan+Miro&tbm=isch), [Hilma af Klint](https://www.guggenheim.org/exhibition/hilma-af-klint), and [Zach Lieberman](https://twitter.com/search?q=%40zachlieberman%20blob&src=typed_query). *Now:*

* **Run** your generator a few times to produce different compositions. Collect screenshots of some of your favorite compositions.
* **Select** a particular composition you like, export it as an SVG, and render it with a pen plotter. Do some quick tests with your materials before plotting.
* **Consider** your materials! You are welcome (but not required) to use colored inks. Use nice (heavy) paper. Note: You are prohibited from using standard white printer paper. You are welcome (but not required) to use colored paper. You can [plot with the HP7475a](https://github.com/golanlevin/DrawingWithMachines/blob/main/machines/hp7475a/README.md) if you want to use multiple colors, and if you have time. 
* **Photograph** your plotted composition with your phone or other camera. Be sure your composition is plotted before the beginning of class on Wednesday, September 29.

**Hints:**

* *There’s no single correct technique to make a blob.* You are welcome to consider possible techniques including (but not limited to) making polylines made from particle systems; making high-order Catmull-Rom or Bezier curves; tracing the contours (2D isolines) of metaballs; concatenating elliptical arcs; calculating a Cassini ellipse, [cranioid](https://mathworld.wolfram.com/Cranioid.html), or other parametric curve from Mathworld; simulating a smooth ropelike contour using Verlet integration, etc. Some possibly helpful Coding Train videos can be found below.
* *There’s no single correct technique to fill (hatch) an arbitrary shape.* You are welcome to use a [point-in-polygon test](https://rosettacode.org/wiki/Ray-casting_algorithm), a [flood-fill algorithm](https://courses.ideate.cmu.edu/60-428/f2021/index.html%3Fp=1069.html#:~:text=flood%2Dfill%20algorithm), or an API/library of your choice, such as [PEmbroider](https://github.com/CreativeInquiry/PEmbroider/), [hatched](https://github.com/plottertools/hatched), [Shapely](https://shapely.readthedocs.io/en/latest/), etc.
* *There is no single correct technique to construct an ‘attractive’ form or an attractive composition of forms.* Devise your own principles.

To document your work, the requirements are as follows:

* **Create** a blog post on this website. Title it Nickname-BlobFamily, and Categorize it, 05-BlobFamily.
* In your web page, **write** 100-200 words about your process. Be sure to give credit to any libraries or code that you used from elsewhere.
* **Include** a sentence or two about how the reading(s) and/or inspirational viewings, above, influenced your thinking.
* In your web page, **embed** the screenshots of some of your compositions (including un-plotted ones).
In your web page, embed a photograph of your final plot.
* If appropriate, **embed** a photograph of a detail view of your plot (for example, a detailed view of the hatching).

Some possibly helpful Coding Train videos:

* [Coding Challenge #36: Blobby!](https://www.youtube.com/watch?v=rX5p-QRP6R4&t=1s)
* [Coding Challenge #28: Metaballs](https://youtu.be/ccYLb7cLB1I)
* [Coding Marching Squares](https://youtu.be/0ZONMNUKTfU)





