#!/usr/bin/env python

from pyaxidraw import axidraw
from pynput.mouse import Controller
import time 

mouse = Controller()
ad = axidraw.AxiDraw() # Create class instance
ad.interactive()  # Enter interactive context
ad.connect()    

try:
	while True:
	  pos = mouse.position 
	  print(pos)
	  dpi = 96.0
	  ad.moveto( pos[0]/dpi, pos[1]/dpi) 
	  time.sleep(0.0333)
except KeyboardInterrupt:
    ad.moveto(0,0) 
    ad.disconnect()
    print("\nFinished")