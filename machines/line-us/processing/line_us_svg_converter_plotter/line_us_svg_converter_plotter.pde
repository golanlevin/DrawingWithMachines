// Processing v3/v4 tool for plotting SVGs with LineUs 
// This tool is based (with very minimal modifications) on
// https://github.com/tbertz/LineUs_SVG/tree/release/v0.2
// Installation instructions: 
// 1. Install the Geomerative library (via Tools > Add Tool)
// 2. Install the Interfascia library (from http://interfascia.berg.industries/download/)



// Pre-Release
// v0.2
// Creative Commons
// Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)
// https://creativecommons.org/licenses/by-sa/4.0/
// Michael Zoellner, 2018
// Tom Burton, 2020


import geomerative.*;
import interfascia.*; //GUI Lib http://interfascia.berg.industries/documentation/
import processing.net.*;
import java.net.*;
import javax.swing.JOptionPane;

RShape grp;
boolean rawpoints = true;
boolean hide = true;
boolean plotting = false;
float resolution = 5;
float rotatestep = 2;

String lineus_adress = "line-us.local"; //default line-us address

LineUs myLineUs; //device connection class

// App Drawing Area
// x: 650 - 1775
// y: 1000 - -1000
// z: 0 - 1000
// 100 units = 5mm

int line_min_x = 650;
int line_max_x = 1775;
int line_min_y = -1000;
int line_max_y = 1000;

int lw = 1775 - 650;
int lh = 2000;

//GUI
GUIController c;
IFLabel status;
IFTextField t_address;
IFButton b_connect;
IFButton b_opensvg;
IFButton b_plot;
//
IFButton b_help;
//
IFLabel l_zoom;
IFButton b_zoomin;
IFButton b_zoomout;
IFLabel l_move;
IFButton b_left;
IFButton b_right;
IFButton b_up;
IFButton b_down;
IFLabel l_rotate;
IFTextField t_rotatestep;
IFButton b_rotate;

void setup() {

  size(562, 1000);
  smooth();

  c = new GUIController(this);
  status = new IFLabel("Not connected to Line-Us", 20, 30);
  t_address = new IFTextField("Address", 200, 20, 100, lineus_adress);
  b_connect = new IFButton("Connect", 310, 20, 70, 20);
  b_opensvg = new IFButton("Open SVG File", 380, 20, 70, 20);
  b_plot = new IFButton("Plot", 450, 20, 50, 20);
  //
  b_help = new IFButton("?", 520, 20, 20, 20);
  //
  l_zoom = new IFLabel("Zoom", 20, 80);
  b_zoomin = new IFButton("-", 40, 100, 20, 20);
  b_zoomout = new IFButton("+", 20, 100, 20, 20);
  l_move = new IFLabel("Move", 20, 130);
  b_right = new IFButton("R", 40, 150, 20, 20);
  b_left = new IFButton("L", 20, 150, 20, 20);
  b_up = new IFButton("U", 20, 170, 20, 20);
  b_down = new IFButton("D", 40, 170, 20, 20);
  l_rotate = new IFLabel("Rotate", 20, 250);
  t_rotatestep = new IFTextField("Rotate Step", 45, 270, 30, "10");
  b_rotate = new IFButton("\u00AE", 20, 270, 20, 20);


  c.add(status);
  c.add(t_address);
  c.add(b_connect);
  c.add(b_opensvg);
  c.add(b_plot);
  //
  c.add(b_help);
  //
  c.add(l_zoom);
  c.add(b_zoomin);
  c.add(b_zoomout);
  c.add(l_move);
  c.add(b_left);
  c.add(b_right);
  c.add(b_up);
  c.add(b_down);
  c.add(l_rotate);
  c.add(t_rotatestep);
  c.add(b_rotate);


  b_connect.addActionListener(this);
  b_opensvg.addActionListener(this);
  b_plot.addActionListener(this);
  //
  b_help.addActionListener(this);
  //
  b_zoomout.addActionListener(this);
  b_zoomin.addActionListener(this);
  b_left.addActionListener(this);
  b_right.addActionListener(this);
  b_up.addActionListener(this);
  b_down.addActionListener(this);
  b_rotate.addActionListener(this);

  RG.init(this);
  grp = RG.loadShape("venn_.svg");
}


void draw() {

  background(255);

  RG.setPolygonizer(RG.UNIFORMLENGTH);

  if (rawpoints == false) {
    RG.setPolygonizerLength(resolution);
  }
  RPoint[][] points = grp.getPointsInPaths();


  // If there are any points
  if (points != null) {
    for (int j=0; j<points.length; j++) {
      noFill();
      stroke(0, 0, 0, 255);
      beginShape();
      for (int i=0; i<points[j].length; i++) {
        vertex(points[j][i].x, points[j][i].y);
      }
      endShape(OPEN);

      noFill();
      stroke(0, 0, 0, 30);
      for (int i=0; i<points[j].length; i++) {
        // ellipse(points[j][i].x, points[j][i].y, 2, 2);
      }
    }
  }


  // interface
  if (hide == false)
  {
    //Key Shortcuts:\n\n- 'o' to open SVG file\n- Plus and minus for zoom\n- Arrow keys for movement\n- 'r' for rotate\n\nOfficial diagram for the drawing area:/n https://github.com/Line-us/\nLine-us-Programming/blob/master/Documentation/LineUsDrawingArea.pdf
    fill(0, 255);
    text("Key Shortcuts", 20, 320);
    text("- 'o' to open SVG file\n- Plus and minus for zoom\n- Arrow keys for movement\n- 'r' for rotate" + lineus_adress + " (a)", 20, 340);
  }
}

void plot()
{

  plotting = true;

  myLineUs = new LineUs(this, lineus_adress);

  if (rawpoints == false)
    RG.setPolygonizerLength(resolution);
  RPoint[][] points = grp.getPointsInPaths();

  delay(1000);

  // x: 650 - 1775
  // y: 1000 - -1000
  // If there are any points
  int x = 700;
  int y = 0;
  int last_x = 700;
  int last_y = 0;

  if (points != null) {
    for (int j=0; j<points.length; j++)
    {
      for (int i=0; i<points[j].length; i++) {
        
        // Line-Us may throw errors when receiving high-precision floating-point coordinates. 
        // It's recommended to transmit integer coordinates instead.
        x = int(round(map(points[j][i].x, 0, width, 650, 1775)));
        y = int(round(map(points[j][i].y, 0, height, 1000, -1000)));

        // safety check. there could be svg elements outsside the drawing area crashing the robot
        if (x >= line_min_x && x<= line_max_x && y >= line_min_y && y<= line_max_y)
        {
          myLineUs.g01(x, y, 0);
          last_x = x;
          last_y = y;
          delay(100);
        }
      }
      myLineUs.g01(last_x, last_y, 1000);
      delay(100);
    }
  }

  plotting = false;
}


void actionPerformed (GUIEvent event) {

  int t = 2;
  rotatestep = float(t_rotatestep.getValue());


  if (event.getSource() == b_connect && !plotting) { //connect to line-us
    myLineUs = new LineUs(this, t_address.getValue());      
    status.setLabel(myLineUs.statusMessage);
  }
  if (event.getSource() == b_opensvg && !plotting) { //open svg
    selectInput("Select an SVG file:", "svgSelected");
  }
  if (event.getSource() == b_plot && !plotting) { //plot drawing
    if (myLineUs.connected) {
      plot();
    } else {
      status.setLabel("Please connect first");
    }
  }
  if (event.getSource() == b_help && !plotting) { //toggle help dialog
    hide=!hide;
  }
  //
  if (event.getSource() == b_zoomin && !plotting) { //zoom in
    grp.scale(0.95);
  }
  if (event.getSource() == b_zoomout && !plotting) { //zoom out
    grp.scale(1.05);
  }
  if (event.getSource() == b_left && !plotting) { //move left
    grp.translate(-t, 0);
  }
  if (event.getSource() == b_right && !plotting) { //move right
    grp.translate(t*2, 0);
  }
  if (event.getSource() == b_up && !plotting) { //move up
    grp.translate(0, -t);
  }
  if (event.getSource() == b_down && !plotting) { //move down
    grp.translate(0, t);
  }
  if (event.getSource() == b_rotate && !plotting) { //rotate plot
    grp.rotate(PI/rotatestep, grp.getCenter());
  }
  grp.draw();
}

void keyPressed()
{
  int t = 2;
  rotatestep = float(t_rotatestep.getValue());

  if (keyCode == LEFT)
  {
    grp.translate(-t, 0);
  } else if (keyCode == RIGHT)
  {
    grp.translate(t*2, 0);
  } else if (keyCode == UP)
  {
    grp.translate(0, -t);
  } else if (keyCode == DOWN)
  {
    grp.translate(0, t);
  } 

  grp.draw();
}

void svgSelected(File selection) {
  if (selection == null) {
    println("Window was closed or the user hit cancel.");
  } else {
    println("User selected " + selection.getAbsolutePath());
    grp = RG.loadShape(selection.getAbsolutePath());
    println(grp.getWidth());
  }
}
