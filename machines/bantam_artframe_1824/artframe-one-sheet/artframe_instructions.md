# Plotting SVG files on the ArtFrame 1824

<img src="artframe_instructions_qr.png" width="128">

---

## 1. Convert SVG to G-Code

* Launch **BantamToolsStudio.app** on the dedicated gray Mac Mini. 
* Click **Open SVG**, and load your SVG file.
* Adjust settings as necessary: 
	* In the **Paper Settings** section, adjust your paper size
	* In the **Artwork Settings** section, you can adjust margins and rotate the artwork 90°
	* In **Tool Settings** you can adjust the pen height and feed rate (speed). 
	* Try an XY feed rate of 100 in/min (2500 mm/min) to start.
* Click **Generate and Save G-Code**.
* Copy the G-Code file onto the ArtFrame's MicroSD card (you may need a dongle).
* Return the MicroSD card to the plotter.

## 2. Plot the G-Code on the ArtFrame

* Plug in the Bantam ArtFrame 1824, and power it on.
* Once the plotter's OLED screen displays the 📂🏠⚙️ icons, use its main Knob to scroll to the 🏠 **Home** icon, and press the Knob in. The plotter will locate its origin ("homing"). 
* On the OLED, navigate back to 📂 **Browse Files**. Select your chosen .gcode file, and press the Knob once. *NOTE*: The Z-stage may shoot downward!
* Install your paper in the plotter.
* Install your pen in the plotter. For the default pen height of 3.5mm, try moving your pen down until its tip is resting on the circular metal [Pen Height Setup Tool](https://bantamtools.com/products/pen-height-setup-tool), and then slide the setup tool out of the way.
* To actually start the plot, press the main Knob again.
* To **pause** the plot, tab the Knob. To **resume**, tap the knob. Note that the plotter may not stop immediately, as it may have a backlog queue of points. To **cancel** a job altogether, give the Knob a "long press".

---

