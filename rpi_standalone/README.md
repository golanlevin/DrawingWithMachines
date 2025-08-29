# AxiDraw RPi Instructions (2025)

*How to plot with AxiDraws using the RPi kiosks.*

---

### 1. Move your SVG file onto the RPi:

* **Insert** the thumbdrive with your SVG file into the RPi. You'll see a window ("Removable medium is inserted"). Select "Open in File Manager" and click `OK`.
* To **copy** your SVG file onto the RPi Desktop, **drag** it from the thumbdrive window.
* **Eject** the thumbdrive using the eject icon in the top right of the menu bar:
  ![eject flashdrive](README_assets/rpi_standalone_eject_drive.png)


---

### 2. Plotting your work: 

* If needed, **open** a Terminal window by clicking the black icon `>_` in the top left.
* In the Terminal, **type** `axicli -m align` to unlock the motors. 
* **Move** the plotter's pen to the top left corner, to set your plot's origin. 
* **Locate** your paper so that the paper's top left corner is under the pen. **Affix** the paper with magnets or painter's tape. 
* **Put** some painter's tape on the paper under the pen. **Type** `axicli -m toggle` to raise and lower the pen. **Ensure** the pen is touching the paper when it's in the *down* position. (The tape keeps you from accidentally marking the paper at the origin.)
* On the AxiDraw V3, **type** `axicli filename.svg` to plot the SVG called *filename.svg*. If you're using the larger SE/A3, type `axicli --model 2 filename.svg` instead.
* **Delete** your file when you're done: **right-click** on your file and select "Move to Trash".

--- 

### Summary of `axicli` Commands

* `axicli -m align` — unlocks the motors so you can home the device
* `axicli -m toggle` — moves the pen up and down
* `axicli filename.svg` — plots *filename.svg* on the AxiDraw V3
* `axicli --model 2 filename.svg` — plots *filename.svg* on the SE/A3
* `axicli --help` — for all other help
* To **Terminate** an active plot: `Control-C`
* To **Pause** an active plot: `Control-Z`
* To **Resume** a paused plot: type `fg` and press `Enter`

