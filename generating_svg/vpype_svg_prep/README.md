# Prepping SVGs for Plotting with vpype in a Python Virtual Environment

1. Install Python; create a virtual environment
2. Install MacPorts and *vpype*.
3. Use *vpype* to crop and optimize
4. *vpype* cheatsheet

---

### 1. Install Python; create a virtual environment.

*These instructions are for MacOS.*

1. Find out which version of Python you have installed. At the Terminal, type: `python3`. You may see a response like `Python 3.8.9 (default, May 17 2022, 12:55:41)`. 
2. The preferred way to work with *vpype* is in a dedicated virtual environment running Python 3.9+. We will follow the vpype installation instructions for end-users, [here](https://vpype.readthedocs.io/en/latest/install.html), which are duplicated below. Make sure your computer has at least 1GB of available hard drive space for this virtual environment. 
3. In MacOS, you'll need to have the Homebrew package manager installed. You can achieve this with: `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`
4. Using your Mac's Terminal app, install Python 3.9: `brew install python@3.9`. 
5. You can now test that Python is installed correctly by typing `python3.9` at the Terminal. To quit, type `quit()`.
6. Change directory to the folder in which you'd like to create your virtual environment(s). In my case, that looks like: `cd /Users/golan/Documents/dev/python_virtual_environments`
7. Create a new virtual environment in that directory: `python3.9 -m venv myVypeEnvironment` . This will create a subdirectory (*myVypeEnvironment*) containing various files.

---

### 2. Install MacPorts and *vpype*.

1. [MacPorts](https://www.macports.org/) is the recommended way to install the Python interpreter on macOS. Following the instructions from [here](https://guide.macports.org/chunked/installing.macports.html), download the latest package installer for MacPorts. For example, I have installed *MacPorts-2.7.2-12-Monterey.pkg*.
2. To confirm the MacPorts installation is working as expected, now try using port in a ***new*** terminal window: `port version`.
3. Activate the newly created virtual environment: `source myVypeEnvironment/bin/activate`. (You can exit the virtual environment later by typing `deactivate`.)
4. If you have a **non-M1 Mac**, or if you have an M1 Mac but *don't* expect to use vpype plugins, then you can install vpype using `sudo port install vpype`, or by using pip, with `pip install --upgrade pip` followed by `pip install vpype[all]`. However, according to the [vpype installation instructions](https://vpype.readthedocs.io/en/latest/install.html#installing-using-pipx-apple-silicon-m1), as of July 2022, M1 Macs require special care; see the next step below.
5. If you have an **M1 Mac**, using [pipx](https://pypa.github.io/pipx) is the recommended method when using plug-ins. Follow these instructions from [here](https://vpype.readthedocs.io/en/latest/install.html#installing-using-pipx-apple-silicon-m1), *from within the virtual environment:*
	* First, install the required ports (from within the virtual environment!) using MacPorts: `sudo port install python39 py39-shapely py39-scipy py39-numpy py39-pyside2`. This could take some time. 
	* Then, install pipx: `sudo port install pipx +python39`
	* Then, type `pipx ensurepath`. This ensures that both pipx and the software it will install are available at the terminal. (You may need to close and re-open the terminal window and the virtual environment for this to take effect.)
   * Finally, install *vpype*: `pipx install "vpype[all]" --system-site-packages`. (Note the use of the --system-site-packages option. This is important because because vpype relies the version of PySide2 that was installed earlier with MacPort.)
6. *vpype* should now be installed and ready to use. You may check that it is fully functional by checking its version: `vpype --version`
7. You can also check *vpype* by displaying some random lines: `vpype random show`

---

### 3. Use vpype to crop and optimize

Suppose you have generated an SVG (in, say, Processing). It is possible that your lines may go outside the bounds of the plottable region. It is also likely that your plot is not "optimized", so that strokes are badly ordered, and connecting line segments are not understood to be continuous. *vpype* can help. 

The workflow below assumes that the virtual environment has been activated at the command line, i.e. `source myVypeEnvironment/bin/activate`. 

Here is an 11x8.5" SVG of a flow field, called [`inputfile.svg`](inputfile.svg), generated in Processing, and viewed in InkScape. As you can see, the strokes go outside of the document bounds. Many plotters cannot handle such points, and (for example) grind the motors trying to reach them.

![inputfile.png](inputfile.png)

Using this Terminal command, we can verify and view the file with the *vpype* file viewer: `vpype read inputfile.svg show`. A command in its menu allows us to see the "pen-up trajectories", which clearly shows that the file is not optimized. 

![vpype-viewer.png](vpype-viewer.png)

We can use the following *vpype* command to crop the strokes to a specified rectangle: `vpype read inputfile.svg crop 0.5in 0.5in 10.0in 7.5in write outputfile.svg`. Viewing the `outputfile.svg` in Inkscape, we can see that the strokes have been cropped, with a half-inch margin all around: 

![cropped.png](cropped.png)

*vpype* allows commands to be "stacked" into a filtering pipeline. This command takes the original file; ensures that line segments with coincident endpoints are treated as polylines; sorts the results; and crops the image as before: `vpype read inputfile.svg linemerge --tolerance 0.1mm linesort crop 0.5in 0.5in 10.0in 7.5in write outputfile.svg`

Examining the result in the *vpype* viewer, and displaying the pen trajectories, we can now see that the strokes are now well-ordered: 

![cropped_and_sorted.png](cropped_and_sorted.png)

---

### 4. vpype cheatsheet

*vpype* documentation is [here](https://vpype.readthedocs.io/en/latest/index.html). Commands usually have optional arguments.

* Unit constants `px`, `in`, `mm`, `cm`, `pt`, etc. Reminder: SVG pixel units are 1/96th of an inch.
* [crop](https://vpype.readthedocs.io/en/latest/reference.html#crop) Crop the geometries.
* [linemerge](https://vpype.readthedocs.io/en/latest/reference.html#cmd-linemerge): Merge lines whose endings and starts overlap or are very close.
* [linesimplify](https://vpype.readthedocs.io/en/latest/reference.html#linesimplify): Reduce the number of segments in the geometries.
* [linesort](https://vpype.readthedocs.io/en/latest/reference.html#linesort): Sort lines to minimize the pen-up travel distance.
* [multipass](https://vpype.readthedocs.io/en/latest/reference.html#multipass) Add multiple passes to each line.
* [pagerotate](https://vpype.readthedocs.io/en/latest/reference.html#pagerotate) Rotate the page by 90 degrees.
* [pagesize](https://vpype.readthedocs.io/en/latest/reference.html#pagesize) Change the current page size (does not affect the geometry). 
* [reloop](https://vpype.readthedocs.io/en/latest/reference.html#reloop) Randomize the seam location of closed paths.
* [reverse](https://vpype.readthedocs.io/en/latest/reference.html#reverse). Reverse the *order* of lines.
* [scale](https://vpype.readthedocs.io/en/latest/reference.html#scale) Scale the geometries by a factor.
* [show](https://vpype.readthedocs.io/en/latest/reference.html#show) Display the geometry in a GUI.
* [text](https://vpype.readthedocs.io/en/latest/reference.html#text) Generate text using Hershey fonts.












