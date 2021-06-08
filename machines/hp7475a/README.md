# Plotting with the HP7475A

This document outlines a workflow for offline (non-interactive) plotting with the STUDIO for Creative Inquiry's HP7475A, using Processing and from a Mac.

#### Contents

* [Standalone Testing the HP7475A](#standalone-testing-the-hp7475a)
* [Testing Connectivity of a Mac to the HP7475A](h#testing-connectivity-of-a-mac-to-the-hp7475a)
* [Some Alternate Workflows](#some-alternate-workflows)

1. [Generate an SVG with Processing](#1-generate-an-svg-with-processing)
2. [Convert SVG to HPGL with vpype](#2-convert-svg-to-hpgl-with-vpype)
3. [Transmit HPGL to HP7475A with Chiplotle](#3-transmit-hpgl-to-hp7475a-with-chiplotle)


---

## Standalone Testing the HP7475A:

1. **Plug in** the HP7475A plotter to 120VAC wall power.
2. **Load** the plotter carousel with 6 pens. You'll need to depress the carousel's spring-loaded black rubber pen-caps in order to insert the pens.
3. **Load** the plotter with letter (8.5x11) paper. Push the paper load lever up; align the paper against the left edge; and push the paper just past the short white line in the upper left of the paper bed. 
4. **Execute** the plotter's "Demonstration Plot (Confidence Test)" as described on page 2-31 of the HP7475A [*Operation and Interconnection Manual*](manuals/7475A-OperationAndInterconnectionManual-07475-90002-102pages-Sep90.pdf). This is achieved by holding down the plotter's P1 and P2 buttons while powering it on, and continuing to hold them down "until the tapping noise begins". This should produce a multicolor plot which looks something like the following: 

![HP7475A demonstration plot](manuals/7475a_demonstration_plot.png)


---

## Testing Connectivity of a Mac to the HP7475A:

1. **Connect** the USB to Serial Cable Adapter (USB-A to DB9 male) to your Mac. The STUDIO has a Sabrent cable which is known to work. (If your Mac uses USB-C, you may need to pre-pend a USB-C to USB-A adapter.)
2. **Verify** that the serial adapter is visible to your Mac's operating system, by opening the Terminal app and typing ```ls /dev/tty.*```. You should see something similar to ```/dev/tty.usbserial-A101768Y``` among the listed results.
3. **Connect** the serial adapter into the HP 24542G cable (DB9 female to DB25 male). This cable has the following wiring, according to page A-6 of the HP7475A [*Operation and Interconnection Manual*](manuals/7475A-OperationAndInterconnectionManual-07475-90002-102pages-Sep90.pdf):<br />![HP_24542G 9-to-25 pin cable wiring](manuals/7475a_HP_24542G_cable_wiring.png) 
4. **Ensure** that the DIP switches on the rear of the plotter are set to [9600/8-N-1](https://en.wikipedia.org/wiki/8-N-1), and US letter (8.5x11") paper, as described on page 2-21 of the HP7475A [*Operation and Interconnection Manual*](manuals/7475A-OperationAndInterconnectionManual-07475-90002-102pages-Sep90.pdf). Note that the DIP switches control the machine *defaults* for paper size and measuring system (imperial/metric), but these can be changed from the front panel as well. The switches should look like the following:<br />![HP 7474A DIP switches.jpg](manuals/7474a_DIP_switches.jpg). 
5. **Turn on** the plotter.
6. **Launch** a serial port terminal program, such as [CoolTerm](http://freeware.the-meiers.org/). (A list of other possible serial port apps can be found [here](https://pbxbook.com/other/mac-ser.html) and includes Screen, Minicom, ZTerm, goSerial, Serial Tools, etc.) CoolTerm is distributed for macOS, Windows, Linux, and Raspberry Pi; a backup copy of version 1.9.0 (5/31/2021) for Mac is stashed [here](tools/CoolTermMac_1.9.0.zip).
7. **Configure** the serial port terminal program so that it matches the communication settings of the plotter, 9600/8-N-1:<br />![CoolTerm configured for 9600/8-N-1](manuals/coolterm_7475a_serial_configuration.png)
8. **Configure** (optionally) the serial port terminal program so that it is in "line mode", meaning that commands are transmitted when you press return:<br />![CoolTerm configured for line mode](manuals/coolterm_7475a_terminal_configuration.png)
8. **Transmit** HPGL to the plotter. Type the command ```IN;SP1;``` into CoolTerm and press return:<br />![](manuals/coolterm_7475a_testcommand.png)
9. In response to the command, the HP7475A plotter should Initialize Set Instruction (```IN;```) and Select Pen #1 (```SP1;```). 


---

## 1. Generate an SVG with Processing

**Summary:** Generate an SVG file using [Processing](https://processing.org/) and its [SVG Library](https://processing.org/reference/libraries/svg/index.html).

The following [Processing sketch](processing/svg_lissajous/svg_lissajous.pde) generates an SVG file of a Lissajous curve. This was created with [Processing v3.5.4](https://processing.org/). 

```
// Generate a Lissajous curve, and export it as an SVG file.
// For more information on the Processing SVG library, see:
// https://processing.org/reference/libraries/svg/index.html
import processing.svg.*;

void setup() {
  size(792, 612); // Letter 11"x8.5" @72dpi
  noLoop(); // just execute once.
}

void draw() {
  background(255); 
  stroke(0);
  noFill();

  beginRecord(SVG, "lissajous.svg");

  int nPoints = 100;
  float cx = width/2; 
  float cy = height/2; 
  float radius = width/4; 

  beginShape(); 
  for (int i=0; i<nPoints; i++) {
    float theta = map(i, 0, nPoints, 0, TWO_PI);
    float px = cx + radius * sin(2.0 * theta);
    float py = cy + radius * cos(3.0 * theta); 
    vertex(px, py);
  }
  endShape(CLOSE); 
  endRecord();
}
```

This produces [an SVG file](processing/svg_lissajous/lissajous.svg) that resembles the following: 

![Screenshot of Processing program generating an SVG of a Lissajous curve](processing/svg_lissajous/svg_lissajous_screenshot.png)


---

## 2. Convert SVG to HPGL with vpype

**Summary:** Convert the SVG to HPGL with [vpype](https://github.com/abey79/vpype), using its export settings for the HP7475A as described [here](https://vpype.readthedocs.io/en/latest/cookbook.html#converting-a-svg-to-hpgl).


---

## 3. Transmit HPGL to HP7475A with Chiplotle

**Summary:** Transmit the HPGL to the HP7475A plotter using the "HPGL Pipeline" in [Chiplotle](http://sites.music.columbia.edu/cmc/chiplotle/manual/index.html), as described [here](http://sites.music.columbia.edu/cmc/chiplotle/manual/chapters/tutorial/intro.html#hpgl-pipeline).


---

## Some Alternate Workflows

#### Tools for Generating SVG files:
 
* [Processing](https://processing.org/) (Java), with its [SVG Library](https://processing.org/reference/libraries/svg/index.html)
* @mattdesl's [canvas-sketch](https://github.com/mattdesl/canvas-sketch/) (JavaScript) with the [```pathsToSVG()```](https://github.com/mattdesl/canvas-sketch-util/blob/master/docs/penplot.md#pathsToSVG) function in the [canvas-sketch-util](https://github.com/mattdesl/canvas-sketch-util/blob/master/docs/penplot.md) penplot utilities

#### Tools for Converting SVG to HPGL:

* [Inkcut](https://www.codelv.com/projects/inkcut/) standalone application
* InkScape, using the [InkCut](https://inkscape.org/~frmdstryr/%E2%98%85inkcut) extension


## Graveyard

* Download [Inkscape](https://inkscape.org/release/1.1/platforms/). I am using Inkscape v.1.0.2 for OSX (5/24/2021).
* Download the Inkcut extension for Inkscape. Go to the [Inkcut extension for Inkscape page](https://inkscape.org/~frmdstryr/%E2%98%85inkcut), then click on the Download button (looks like an arrow) to get [this file](https://inkscape.org/gallery/item/12796/inkcut-for-inkscape-2.1.1.tar.gz). A backup is stashed [here](tools/inkcut-for-inkscape-2.1.1.tar.gz). 

Inkcut is an open source application for controlling 2D plotters. It can load SVG files, generate HPGL commands, and transmit these directly to the HP7475A. We follow installation instructions from [here](https://www.codelv.com/projects/inkcut/download/):

To install a new extension, download and unpack the archive file. Copy the files into the directory listed at Edit > Preferences > System: User extensions. After a restart of Inkscape, the new extension will be available.


