# Generating SVGs in Python

**Contents:**

1. Creating a Suitable Python3.10 Virtual Environment
2. Generating an SVG within a Jupyter Python Notebook
  * 2a. Generating an SVG within a Google Colab Notebook
3. Generating an SVG using vsketch, vpype, and VSCode

---

## 1. Creating a Suitable Python3.10 Virtual Environment

1. As of August 2025, the **recommended Python version** for our course is **3.10**. To get started, at the MacOS Terminal, **find out** whether you have Python v.3.10 installed by typing: `which python3.10`
2. You should see a response like `/opt/local/bin/python3.10`. If you don't already have Python 3.10 installed, you'll need to do that. To **install** Python3.10, if necessary:
  * Use [Homebrew](https://brew.sh/) if you already have it installed, because it’s common and widely documented: `brew install python@3.10`
  * Otherwise, use the [official Python.org installer](https://www.python.org/downloads/release/python-3100/), which is easy and requires no package manager.
  * You could also use the [MacPorts](https://www.macports.org/) package manager if that's your thing. 
3. You can now **test** that Python 3.10 is installed correctly by typing `python3.10` at the Terminal. You should see something like `Python 3.10.14 (main, Mar 20 2024, 14:43:31)`. (To quit, type `quit()`.)
4. **Change directory** to the folder in which you'd like to create your virtual environment(s). In my case, that looks like: `cd /Users/golan/Documents/dev/python_virtual_environments`.
5. **Create** a new *virtual environment* in that directory by typing: `python3.10 -m venv myDwMPy310Venv` . This will create a subdirectory (*myDwMPy310Venv*) containing various files. A virtual environment is like a bubble that protects your Python installation by keeping its packages and dependencies isolated from the rest of your system.
6. **Activate** the newly created virtual environment: `source myDwMPy310Venv/bin/activate`. (You can exit the virtual environment later by typing `deactivate`.) Your Terminal prompt should change to indicate that you are now operating within this virtual environment.
7. We will now **add some libraries** to grow our virtual environment. First we will install/update `pip`, which is a package manager for Python that lets you install and manage external libraries and tools: `pip install --upgrade pip`.
8. Now we **add** more libraries: support for [Jupyter](https://jupyter.org/) notebooks and [matplotlib](https://matplotlib.org/), a graphing/visualization library. Type: `pip install notebook matplotlib`
9. We now install *vpype* and its collection of sidecar plugins: `pip install "vpype[all]"`
10. We will also install vpype's sibling project, *vsketch*: `pip install vsketch`, which will come in handy soon.  
11. *vpype* should now be installed and ready to use. You may check that it is fully functional by checking its version: `vpype --version` (I get the result: `vpype 1.13.0`.) You can also check *vpype* by displaying some random lines: `vpype random show`.
12. *Eventually*, you may wish to also `pip install` some additional useful libraries into this virtual environment, such as: 
  * `svgpathtools` — for parsing and manipulating SVG paths and Bézier curves
  * `numpy` — foundational array math for geometry, transforms, and image data
  * `scipy` — numerical and scientific computing, including interpolation and optimization
  * `shapely` — 2D geometry manipulation (union, intersection, buffering, etc.)
  * `opencv-python` — image processing and computer vision (e.g., contour tracing, edge detection)
  * `scikit-image` — image analysis and filters (e.g., thinning, labeling, segmentation)

---

## 2. Generating an SVG within a Jupyter Python Notebook

A Python notebook is an interactive, document-like workspace that lets you write and run code in small, testable chunks alongside text, images, and visual output — making it ideal for exploring ideas, documenting your process, and sharing work in a clear, reproducible way. Popular notebook formats include Jupyter and Google Colab. 

1. From within your virtual environment (i.e., with it "activated"), you should now be able to **launch** the Jupyter notebook environment. Type: `jupyter notebook`. This will open a browser window at `http://localhost:8888`. 
2. From there, you can **create** a new notebook. In the upper right corner, click **New → Python3 (ipykernel)**.
3. You will find yourself in a blank new Jupyter notebook called "Untitled" (in the upper left). **Change** the title to `python-lissajous-svg-1.ipynb`. Be conscientious about where you save this file. 
4. To **test** whether you are running in the correct Python environment, **type** the following in the first cell of your notebook, and then click *Run*: `import sys; print(sys.version)`. You should see something like `3.10.14 (main, Mar 20 2024, 14:43:31)`. (You could also add `print(sys.executable)`, and it should report the filepath of your virtual environment.)
5. Now, **paste** the following Python code into an empty cell, and click *Run*. You should see a Lissajous figure rendered in the notebook by matplotlib, and a file named `python-lissajous-1.svg` should appear in the same folder as your notebook. 

```python
import math
import svgwrite  # Already installed because vpype depends on it
import matplotlib.pyplot as plt

# Canvas setup (in pixels, at 96 DPI for 11x8.5in landscape)
WIDTH = 1056  # 11 inches * 96 DPI
HEIGHT = 816  # 8.5 inches * 96 DPI
N_POINTS = 100
RADIUS = WIDTH / 4
CX = WIDTH / 2
CY = HEIGHT / 2

# Storage for points
points = []

# Compute Lissajous points
for i in range(N_POINTS):
    theta = (i / (N_POINTS - 1)) * (2 * math.pi)
    x = CX + RADIUS * math.sin(2.0 * theta)
    y = CY + RADIUS * math.cos(3.0 * theta)
    points.append((x, y))

# --- Write SVG using svgwrite ---
dwg = svgwrite.Drawing("python-lissajous-1.svg", size=(WIDTH, HEIGHT))
dwg.add(dwg.polyline(points=points, stroke="black", fill="none", stroke_width=1))
dwg.save()

# --- Plot using matplotlib for preview ---
x_vals, y_vals = zip(*points)
plt.figure(figsize=(11, 8.5))  # Inches
plt.plot(x_vals, y_vals, marker='o')
plt.title("Lissajous Figure (SVG Output)")
plt.axis("equal")
plt.grid(True)
plt.show()
```

Here's how it should look in your browser:

![python-lissajous-svg-1.png](img/python-lissajous-svg-1.png)

<details>
  <summary><strong>Click here</strong> for information about generating SVGs within a Google Colab Notebook.</summary>

---

### 2a. Generating an SVG within a Google Colab Notebook

In general, we **won’t** be using Google Colab notebooks this semester because our workflow depends on reading and writing local files for plotting, which Colab’s cloud-based environment makes cumbersome. In addition, the visualization tools in *vpype* and *vsketch* require a local graphics context and do not run inside a browser-based environment like Colab, making them impractical for our needs.

That said, the above program is *so simple* — it uses just three libraries, `math`, `matplotlib`, and `svgwrite` — that only small changes are needed to create the following **Google Colab version** of the same program, which you can set up in your Google Drive. This may be a workable fallback if you're unable to set up a local Python environment, but keep in mind that it won't support our full toolchain.

* To create a Colab notebook from Google Drive, go to **+New → More → Google Colaboratory**.
* If you don’t see “Google Colaboratory” in the list, click **+New → More → Connect more apps**, search for *Colaboratory*, and install it.

```
# VERSION FOR GOOGLE COLAB NOTEBOOK
!pip install svgwrite

import math
import svgwrite
import matplotlib.pyplot as plt
from google.colab import files

# Canvas setup
WIDTH = 1056  # 11 inches * 96 DPI
HEIGHT = 816  # 8.5 inches * 96 DPI
N_POINTS = 100
RADIUS = WIDTH / 4
CX = WIDTH / 2
CY = HEIGHT / 2

points = []
for i in range(N_POINTS):
    theta = (i / (N_POINTS - 1)) * (2 * math.pi)
    x = CX + RADIUS * math.sin(2.0 * theta)
    y = CY + RADIUS * math.cos(3.0 * theta)
    points.append((x, y))

# Save SVG
svg_path = "/content/python-lissajous-1.svg"
dwg = svgwrite.Drawing(svg_path, size=(WIDTH, HEIGHT))
dwg.add(dwg.polyline(points=points, stroke="black", fill="none", stroke_width=1))
dwg.save()

# Preview
x_vals, y_vals = zip(*points)
plt.figure(figsize=(11, 8.5))
plt.plot(x_vals, y_vals, marker='o')
plt.axis("equal")
plt.grid(True)
plt.show()

# Download SVG
files.download(svg_path)
```

Here's how the Google Colab version should look in your browser:

![python-lissajous-svg-1-colab.png](img/python-lissajous-svg-1-colab.png)

</details>

In the next section, we’ll use *vpype* to inspect this SVG with precision, and later generate toolpaths suitable for plotters.


---






<!--

### 1. Prep the Virtual Environment

* Follow [instructions from here](../vpype_svg_prep/README.md) to install a Python virtual environment, and the very useful SVG optimization and plot-prepping tool, *vpype*.
* If you'd like to plot directly from your computer, follow instructions from here to install the AxiDraw command-line interface (CLI), [*axicli*](https://axidraw.com/doc/cli_api/#installation), e.g. `python3 -m pip install https://cdn.evilmadscientist.com/dl/ad/public/AxiDraw_API.zip`
* We'll do our Python coding with [*vsketch*](https://github.com/abey79/vsketch), a Processing-like python environment. Use the [instructions from here](https://vsketch.readthedocs.io/en/latest/install.html) to install it, e.g. `pipx install git+https://github.com/abey79/vsketch --system-site-packages`
* Activate the virtual environment with `source myVypeEnvironment/bin/activate`. 
* Separately download and test the [*vsketch* examples](https://vsketch.readthedocs.io/en/latest/install.html#running-the-examples), with e.g. `vsk run path/to/vsketch-master/examples/shotter`

-->

---