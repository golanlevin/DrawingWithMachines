## Realtime Plotter Control

---

### Realtime Control of AxiDraw from Processing

We will use @techninja's [CNCserver](https://github.com/techninja/cncserver) as a bridge from Processing to the AxiDraw. 

* Install Node.js. Obtain this from [https://nodejs.org/en/download/](https://nodejs.org/en/download/)
* Install NPM. Obtain this at the terminal with `curl https://www.npmjs.com/install.sh | sh`.
* Download the files from [this repo](https://github.com/techninja/cncserver/archive/master.zip) or use this locally-stashed copy, [axidraw_processing_realtime/installs/cncserver.zip](cncserver.zip). Unzip these files to a *cncserver* folder.
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

### Realtime Control of HP7475A with openFrameworks

We will use Nick Hardeman's [ofxHPGL](https://github.com/NickHardeman/ofxHPGL) as a bridge from openFrameworks (C++) to the HP7475A. 

* This assumes that the HP7475A is connected and working, as per [these instructions](https://github.com/golanlevin/DrawingWithMachines/tree/main/machines/hp7475a).
* This assumes that you have downloaded and installed an appropriate development envrironment (e.g. XCode) as well as [openFrameworks](https://openframeworks.cc/download/), using the instructions from [here](https://openframeworks.cc/setup/xcode/)
* Download the [ofxHPGL](https://github.com/NickHardeman/ofxHPGL) addon, and install it in the OF addons folder. 
* There is an example project provided here: [hp7475a_openframeworks](hp7475a_openframeworks). (Note, this is not a full openFrameworks installation bundle). 
* In [ofApp.cpp](hp7475a_openframeworks/of_v0.11.2_osx_release/apps/myApps/hp7475a_1/src/ofApp.cpp) on line 5, you'll see `hp.setup( "/dev/tty.usbserial-A101768Y" );`. You'll need to change this to whatever is your computer's name for its USB-to-serial adaptor. You can locate your adapter by executing this in the terminal: `ls /dev/tty.*`. 

---

### Realtime Control of Line-Us with p5.js

* See the [lineus_p5js_realtime.js](../machines/line-us/p5js/lineus_p5js_realtime/lineus_p5js_realtime.js) example described [here](../machines/line-us/README.md). 
