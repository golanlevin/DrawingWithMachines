# import copy
# import cv2
# from numpy.lib.function_base import angle
import vsketch
import numpy as np
from shapely.geometry import LineString


class Blob2Sketch(vsketch.SketchClass):

    def draw(self, vsk: vsketch.Vsketch) -> None:
        # vsk.size("12inx9in")
        # vsk.size("15inx10in")
        vsk.size("20inx20in")
        vsk.scale("px")

        print('DRAWING >>> ', end='', flush=True)
        vsk.scale(0.05)
        Hair().drawHairBlob(vsk, num=300, offset=0, spacing=60)

        # num = 10
        # scale = 100
        # for i in range(num):
        #     for j in range(num):
        #         vsk.pushMatrix()
        #         vsk.translate(i * scale, j * scale)
        #         vsk.scale(0.05)
        #         # Hair().makeHair(vsk=vsk, num_curves=1000)
        #         Hair().drawHairBlob(vsk, num=10, offset=0, spacing=50)
        #         vsk.popMatrix()

        #         # print('.', end='', flush=True)



        print('DRAWN')


    def finalize(self, vsk: vsketch.Vsketch) -> None:
        # vsk.vpype("linemerge linesimplify crop 0.25in 0.25in 14.5in 9.5in")
        # vsk.vpype("linemerge linesimplify reloop linesort")
        # vsk.vpype("linemerge linesimplify reloop linesort crop 0.25in 0.25in 11.5in 8.5in")
        vsk.vpype("linemerge linesimplify reloop")
        # vsk.vpype("linemerge linesimplify reloop linesort crop 0.25in 0.25in 11.5in 8.5in")


class Hair(object):

    def __init__(self):
        
        # CONSTANTS
        self.stepsize = 10
        self.ls = []

        # at any given instant we want
        self.anchor_pos = np.array([1, 0])
        self.anchor_rad = np.array([0, 100])
        self.anchor_sign = 1
        self.left = True

        self.update_dtheta()

    def update_dtheta(self):
        r = (np.sum(self.anchor_rad**2)) ** 0.5
        circ = 2 * np.pi * r
        self.dtheta = self.anchor_sign * self.stepsize / circ * 2 * np.pi
        self.rotation_matrix = np.array([[np.cos(self.dtheta), -np.sin(self.dtheta)], [np.sin(self.dtheta), np.cos(self.dtheta)]])

    def swing(self, steps):
        for i in range(steps):

            # Add new point
            pos = self.anchor_pos + self.anchor_rad
            self.ls.append(pos)

            # rotate anchor_rad
            self.anchor_rad = np.dot(self.rotation_matrix, self.anchor_rad)
            

    # sets new magnitude
    def thwip(self, scale):

        if (scale == 0): scale = 1
        current_pos = self.anchor_pos + self.anchor_rad
        self.anchor_rad *= scale / np.linalg.norm(self.anchor_rad)
        self.anchor_pos = current_pos - self.anchor_rad
        
        if (scale < 0): self.anchor_sign *= -1
        self.update_dtheta()


    def makeHair(self, vsk=None, num_curves=100, swingRange=[5,10], thwipRange=[50,300]):
        for i in range(num_curves):
            sign = 1
            if (np.random.rand() < 0.2): sign *= -1
            self.swing(int(np.interp(np.random.rand(), [0,1], swingRange)))
            self.thwip(int(np.interp(np.random.rand(), [0,1], thwipRange)) * sign)

        if vsk is not None:
            vsk.geometry(LineString(self.ls))


    def drawHairBlob(self, vsk: vsketch.Vsketch, num=500, offset=0, spacing=50):
        self.makeHair()
        ls = LineString(self.ls)
        vsk.geometry(ls)
        for i in range(1, num):
            vsk.geometry(ls.parallel_offset(offset + i * spacing, 'left', join_style=1))
            vsk.geometry(ls.parallel_offset(offset + i * spacing, 'right', join_style=1))


if __name__ == "__main__":
    Blob2Sketch.display()
