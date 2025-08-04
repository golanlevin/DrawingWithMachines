import math
import vsketch

class LissajousSketch(vsketch.SketchClass):
    n_points = vsketch.Param(100)
    radius = vsketch.Param(264.0)  # ~ WIDTH/4 at 96 DPI
    freq_x = vsketch.Param(2.0)
    freq_y = vsketch.Param(3.0)

    def draw(self, vsk: vsketch.Vsketch) -> None:
        # Letter size in landscape, measured in pixels at 96 DPI
        vsk.size("letter", landscape=True)
        vsk.scale("px")  # work in pixels

        cx = vsk.width / 2
        cy = vsk.height / 2

        # Starting point
        qx = cx + self.radius * math.sin(0)
        qy = cy + self.radius * math.cos(0)

        for i in range(self.n_points):
            theta = (i / (self.n_points - 1)) * (2 * math.pi)
            px = cx + self.radius * math.sin(self.freq_x * theta)
            py = cy + self.radius * math.cos(self.freq_y * theta)
            vsk.line(qx, qy, px, py)
            qx, qy = px, py

    def finalize(self, vsk: vsketch.Vsketch) -> None:
        # Clean up for plotting
        vsk.vpype("linemerge linesimplify reloop linesort")


if __name__ == "__main__":
    LissajousSketch.display()