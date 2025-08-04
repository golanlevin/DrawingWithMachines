# Generating SVGs in Python with *vsketch* (2022)

*This document has been superceded by more recent instructions; look elsewhere in the DwM repo.*

---

### 1. Prep the Virtual Environment

* Follow [instructions from here](../vpype_svg_prep/README.md) to install a Python virtual environment, and the very useful SVG optimization and plot-prepping tool, *vpype*.
* If you'd like to plot directly from your computer, follow instructions from here to install the AxiDraw command-line interface (CLI), [*axicli*](https://axidraw.com/doc/cli_api/#installation), e.g. `python3 -m pip install https://cdn.evilmadscientist.com/dl/ad/public/AxiDraw_API.zip`
* We'll do our Python coding with [*vsketch*](https://github.com/abey79/vsketch), a Processing-like python environment. Use the [instructions from here](https://vsketch.readthedocs.io/en/latest/install.html) to install it, e.g. `pipx install git+https://github.com/abey79/vsketch --system-site-packages`
* Activate the virtual environment with `source myVypeEnvironment/bin/activate`. 
* Separately download and test the [*vsketch* examples](https://vsketch.readthedocs.io/en/latest/install.html#running-the-examples), with e.g. `vsk run path/to/vsketch-master/examples/shotter`

---

### 2. Generate the SVG

* Instructions are [here](https://github.com/abey79/vsketch#getting-started) for creating a new *vsketch* project, e.g. `vsk init svg_lissajous`
* A sample project, [*svg_lissajous* is here](svg_lissajous/sketch_svg_lissajous.py). From within the virtual environment, this can be run with `vsk run svg_lissajous`.
* This will open up the vsketch visual environment. Note that some variables can be exposed to the interface for interactive control. 

---

### 3. Additional & More Advanced Examples

* See the official [*vsketch* examples](https://vsketch.readthedocs.io/en/latest/install.html#running-the-examples)
* vsketch can be used in **Google Colab Notebooks**; [here's an example](https://colab.research.google.com/github/abey79/vsketch/blob/master/examples/_notebooks/google_colab.ipynb).
* [Examples by my student Shiva Peri](shapely_demos/README.md), showing the integration of *vsketch* and *vpype* with *numpy*, *sklearn*, and especially [***shapely***](https://pypi.org/project/Shapely/) (which can be used for advanced geometry operations like offset curves and clipping):
	1. [*hatching*](https://github.com/shivaPeri/shapely-demos/blob/main/hatching/README.md), demo of using clip_by_rect
	2. [*blob*](https://github.com/shivaPeri/shapely-demos/blob/main/blob/README.md), demo of data manipulation with sklearn
	3. [*tiling*](https://github.com/shivaPeri/shapely-demos/blob/main/tiling/README.md), demo of triangular coordinates with numpy
	4. [*moire*](https://github.com/shivaPeri/shapely-demos/blob/main/moire/README.md), demo of using offset curves



