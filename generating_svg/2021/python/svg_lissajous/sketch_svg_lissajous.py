import math
import numpy as np
import vsketch

class SvgLissajousSketch(vsketch.SketchClass):
    
    # Sketch parameters:
    radius = vsketch.Param(264.0)

    def draw(self, vsk: vsketch.Vsketch) -> None:
        vsk.size("8.5in", "11in", landscape=True)
        vsk.scale(1.0)

        nPoints = 100
        cx = vsk.width /2 
        cy = vsk.height /2

        qx = cx + self.radius * np.sin(0)
        qy = cy + self.radius * np.cos(0)
        for i in range (nPoints):
            theta = vsk.map(i, 0, nPoints-1, 0, 2.0*np.pi)
            px = cx + self.radius * np.sin(2.0 * theta)
            py = cy + self.radius * np.cos(3.0 * theta)
            vsk.line(qx,qy, px,py)
            qx = px
            qy = py

    def finalize(self, vsk: vsketch.Vsketch) -> None:
        vsk.vpype("linemerge linesimplify reloop linesort")

if __name__ == "__main__":
    SvgLissajousSketch.display()
