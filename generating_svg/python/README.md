# Python

* https://github.com/shivaPeri/shapely-demos
* https://github.com/benfordslaw/uscutter-MH871-MK2-plotting
* https://github.com/golanlevin/DrawingWithMachines/tree/main/machines/hp7475a#2-convert-svg-to-hpgl-with-vpype=

---

## Instructions

#### 1. Create a virtual environment for running Python

These instructions are for MacOS. 

1. Find out what version of Python you have installed. At the Terminal, type: `python3`. You may see a response like `Python 3.8.9 (default, May 17 2022, 12:55:41)`. 
2. The preferred way to work with vpype is in a dedicated virtual environment running Python 3.9+. We will follow the vpype installation instructions for end-users, [here](https://vpype.readthedocs.io/en/latest/install.html), which are duplicated below. Make sure your computer has at least 1GB of available hard drive space for this virtual environment. 
3. In MacOS, you'll need to have the Homebrew package manager installed. You can achieve this with: `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`
4. Using your Mac's Terminal app, install Python 3.9: `brew install python@3.9`. 
5. Change directory to the folder in which you'd like to create your virtual environment, e.g. `cd /Users/golan/Documents/dev/python_virtual_environments`