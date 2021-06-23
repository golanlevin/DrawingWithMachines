# Plotting with the Line-Us

"Line-us is an internet connected robot drawing arm. It's small, portable and draws with a nice wobbly line using a real pen on paper."

#### Important Links

* [**First time Line-us set up**](https://www.line-us.com/help.html)
* [**Getting Started with Line-us Programming**](https://github.com/Line-us/Line-us-Programming): The central source for programming Line-Us.

#### Line-Us with Python

* [The Official Line-us Python Module](https://github.com/Line-us/Line-us-Programming#official-python-module-for-line-us). It includes machine discovery via DNS-sd and access to all of the Line-us GCodes. There is a [quickstart guide](https://lineuspythonmodule.readthedocs.io/en/latest/#quickstart), full [documentation](https://lineuspythonmodule.readthedocs.io/en/latest/#module-lineus), and its [GitHub repository](https://github.com/Line-us/LineUsPythonModule).
* ["Hello World" Python example](https://github.com/Line-us/Line-us-Programming/blob/master/Python/HelloWorld.py)
* [WebSockets Python example](https://github.com/Line-us/Line-us-Programming/blob/master/Python/HelloWorldWebsockets.py)

#### Line-Us with JavaScript

* [@beardicus/line-us](https://github.com/beardicus/line-us): A JavaScript library for controlling the Line-us drawing robot via its websocket interface. Works in both Node.js and the browser.
* [basic example using node/js](https://github.com/pandrr/line-us): sends an array of commands to the line-us drawing machine via a net.Socket connection; a port of the HelloWorld.py example.

#### Line-Us with Processing

* [Processing code for a very simple example](https://github.com/Line-us/Line-us-Programming/blob/master/Processing/HelloWorld/HelloWorld.pde)

#### Other Line-Us Software

* This is a [readymade SVG plotter for Line-Us](https://github.com/ixd-hof/LineUs_SVG), made in Processing 2.2.1 wigh Geomerative. There are pre-built releases for Mac and Windows [here](https://github.com/ixd-hof/LineUs_SVG/releases/tag/v0.01).


---

### Line-Us Setup

![Line-Us on its plate](images/calibration3.jpg)

* **Download** and install the Line-Us app for your operating system from [line-us.com/software.html](https://www.line-us.com/software.html). (I've stashed a backup of the MacOS v3.0.0.33 app [here](tools/line-us-3.0.0build33.dmg), current as of 6/2001.) Don't launch the app yet. 
* **Arrange** Line-Us on its magnetic plate as shown above. When the pen is in its 'neutral' (home) position, it should be over the small hole.
* **Connect** Line-Us into a USB power supply or USB port, and wait for its light to flash blue.
* Hold its button down for 2 seconds until the light flashes red (putting the robot in "setup mode"). 
* **Connect** your computer to the new "Line-us-Setup" WiFi network. (Line-Us is now broadcasting a new temporary WiFi network called "Line-us-Setup" and is waiting for your computer to join this network. If necessary, you can also use this network when there is no local WiFi.)
* **Launch** the Line-Us app, and **instruct** Line-us how to join your local WiFi. You can now reconnect your computer to the local WiFi, too. See [here](https://www.line-us.com/help.html) for more detailed instructions on connecting to the WiFi. (The next time you turn Line-Us on it will automatically connect to the last WiFi it was on.) The light on Line-Us should be solid blue. 
* **Verify** that Line-Us is able to communicate and draw by making a scribble in the app (with the "Draw"/pencil mode), and then execute the drawing with the "Play" button in the upper right. 
* You can access more settings by horizontally dragging/sliding the buttons at the top of the Line-Us app. There you can access controls for **setting the pen height**. More information on setting the pen height is [here](https://www.line-us.com/help.html#3).
* You can also check to see if Line-Us is connectable on your local network, by typing its name correctly in the address bar of your browser. For example, one of our robots is named *sfci-lineus-1*, and you can see its vital information at: [http://sfci-lineus-1.local/](http://sfci-lineus-1.local/), which should look like the following: 

![lineus-server.png](images/lineus-server.png)

---

### Line-Us + p5.js

* *Note: Line-Us cannot run at https://Editor.p5js.org because browsers require secure websocket connections from secure sites, and Line-Us does not support secure web sockets, as discussed [here](https://forum.line-us.com/t/https-secure-websockets-only/586).*
* In Terminal, ```cd lineus_test1``` (or whatever directory your sketch is in).
* Launch a local server, as described [here](https://github.com/processing/p5.js/wiki/Local-server): ```python -m http.server```
* Visit ```http://localhost:8000``` in your browser
