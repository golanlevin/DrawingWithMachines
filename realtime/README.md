## Realtime Plotter Control

**Contents:** 

* Realtime Control of Line-Us
* Realtime Control of Bantam ArtFrame 1824
* Realtime Control of AxiDraw from Processing (Java)
* Realtime Control of AxiDraw from Python
* Realtime Control of HP7475A with Processing (Java)
* Realtime Control of HP7475A with Python
* Realtime Control of HP7475A with openFrameworks (C++)




---

### Realtime Control of Line-Us

Information about the Line-Us plotters is [here](../machines/line-us/README.md). 

* [p5.js (JavaScript) code](../machines/line-us/p5js/lineus_p5js_realtime/lineus_p5js_realtime.js) for controlling the Line-Us in real time
* [Processing (Java) code](../machines/line-us/processing/line_us_processing_realtime/line_us_processing_realtime.pde) for controlling the Line-Us in real time 

---

### Realtime Control of Bantam ArtFrame 1824

A user guide about the Bantam ArtFrame 1824 is [here](../machines/bantam_artframe_1824/artframe_guide_v1-1-1.pdf). 

* Information about control of the Bantam Artframe via terminal is [here](artframe_realtime/README.md).
* [Processing (Java) code](artframe_realtime/artframe_realtime_processing/artframe_realtime_processing.pde) for controlling the Bantam ArtFrame in real time

---

### Realtime Control of AxiDraw from Processing (Java)

We will use @techninja's [CNCserver](https://github.com/techninja/cncserver) as a bridge from Processing to the AxiDraw. 

* Install Node.js. Obtain this from [https://nodejs.org/en/download/](https://nodejs.org/en/download/)
* Install NPM. Obtain this at the terminal with `curl https://www.npmjs.com/install.sh | sh`.
* Download the files from [this repo](https://github.com/techninja/cncserver/archive/master.zip) or use this locally-stashed copy, [axidraw_processing_realtime/installs/cncserver.zip](cncserver.zip). Unzip these files to a *`cncserver`* folder.
* Install the CNCServer package. Following the instructions from [here](https://github.com/techninja/cncserver#installing-npm-dependencies),  navigate to the cncserver folder at the command line, and execute `npm install`
* In the terminal, enter `node cncserver --botType=axidraw`
* In Processing, run the program [axidraw_processing_realtime.pde](axidraw_processing_realtime/axidraw_processing_realtime.pde).
* Note that the file jna-4.1.0.jar is incompatible with Processing v4's video capture library. 

---

### Realtime Control of AxiDraw from Python

We will use EMSL's [pyaxidraw](https://axidraw.com/doc/py_api/#quick-start-interactive-xy) and [axicli](https://axidraw.com/doc/cli_api/) to control the AxiDraw from Python. Documentation is [here](https://axidraw.com/doc/py_api/#quick-start-interactive-xy).

* Be sure to have [installed Python](https://www.python.org/download/) and [installed pip](https://pip.pypa.io/en/stable/installing/).
* Install the EMSL libraries at the terminal: `python -m pip install https://cdn.evilmadscientist.com/dl/ad/public/AxiDraw_API.zip`. More detailed instructions are [here](https://axidraw.com/doc/py_api/#installation).
* Install [pynput](https://pypi.org/project/pynput/), which can access real-time mouse coordinates: `pip3 install pynput`
* Run the program [mouse_to_axidraw.py](axidraw_python_esml/mouse_to_axidraw.py), or other demos that come in the [AxiDraw API](axidraw_python_esml/AxiDraw_API.zip).

An alternative option for realtime AxiDraw control via Python is [Fogleman's Axi library](https://github.com/fogleman/axi). 

---

### Realtime Control of HP7475A with Processing (Java)

[This Processing sketch](https://github.com/golanlevin/DrawingWithMachines/blob/main/machines/hp7475a/processing/realtime_7475a/realtime_7475a.pde) provides realtime control of the HP7475A Plotter, with HPGL streamed via Serial.

Draw with the mouse; the plotter will attempt to copy the drawing as quickly as it can. This program has been tested in Processing v.4.3 in Mac OSX Sonoma 14.1.2 (January 2024).

--- 

### Realtime Control of HP7475A with Python

Python code for streaming HPGL files in realtime to the HP7475A can be found [here](hp7475a_realtime_python/README.md). This code is a a mirror of [hp7475a-send](https://github.com/vogelchr/hp7475a-send/tree/master) by [Christian Vogel](https://github.com/vogelchr) (@vogelchr). 

---

### Realtime Control of HP7475A with openFrameworks (C++)

We use Nick Hardeman's [ofxHPGL](https://github.com/NickHardeman/ofxHPGL) as a bridge from openFrameworks (C++) to the HP7475A. 

* This assumes that the HP7475A is connected and working, as per [these instructions](https://github.com/golanlevin/DrawingWithMachines/tree/main/machines/hp7475a).
* This assumes that you have downloaded and installed an appropriate development envrironment (e.g. XCode) as well as [openFrameworks](https://openframeworks.cc/download/), using the instructions from [here](https://openframeworks.cc/setup/xcode/)
* Download the [ofxHPGL](https://github.com/NickHardeman/ofxHPGL) addon, and install it in the OF addons folder. 
* There is an example project provided here: [hp7475a_openframeworks](hp7475a_openframeworks). (Note, this is not a full openFrameworks installation bundle). 
* In [ofApp.cpp](hp7475a_openframeworks/of_v0.11.2_osx_release/apps/myApps/hp7475a_1/src/ofApp.cpp) on line 5, you'll see `hp.setup( "/dev/tty.usbserial-A101768Y" );`. You'll need to change this to whatever is your computer's name for its USB-to-serial adaptor. You can locate your adapter by executing this in the terminal: `ls /dev/tty.*`.

