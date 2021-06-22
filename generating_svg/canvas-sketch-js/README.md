## Instructions

#### 1. Install node & npm 

* Install [node and npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) using nvm, [following the instructions here](https://github.com/nvm-sh/nvm).
* To download, compile, and install the latest release of node, do this: ```nvm install node```
* Get npm: ```nvm install-latest-npm```

#### 2. Install canvas-sketch 

* Following the instructions from [here](https://github.com/mattdesl/canvas-sketch/), install canvas-sketch: ```npm install canvas-sketch-cli -g```
* Also install canvas-sketch-util: ```npm install canvas-sketch-util --save```

#### 3. Run the sketch

* At the command line, ```canvas-sketch lissajous.js```. This will create many local files nearby. 
* This will create a local server. In your browser, go to the provided address (it will look something like ```http://192.168.1.151:9966/```
* You should see the sketch running. Press Command-S to export the SVG to your Downloads folder.

#### 4. Make your own 
* ```canvas-sketch myNewSketch.js --new --open```