import math
import matplotlib.pyplot as plt

# Constants
DPI = 96
PX_TO_MM = 25.4 / DPI
WIDTH = 1056   # 11 inches * 96 DPI
HEIGHT = 816   # 8.5 inches * 96 DPI
Z_HI = 25      # Pen up
Z_LO = 20      # Pen down
N_POINTS = 40

# Center and radius
cx = WIDTH / 2
cy = HEIGHT / 2
radius = WIDTH / 4

# Helper function to format float with 4 decimals
def fmt(val):
    return f"{val:.4f}"

# Prepare G-code data
gcode_data = [
    "$H",           # Home
    "G21",          # Use millimeters
    "G90",          # Absolute positioning
    "G1 F5000",     # Feed rate
    f"G1 Z{Z_HI}"   # Pen up
]

# Prepare points for plotting and G-code
x_vals = []
y_vals = []

for i in range(N_POINTS + 1):
    theta = (i / N_POINTS) * (2 * math.pi)
    px = cx + radius * math.sin(2.0 * theta)
    py = cy + radius * math.cos(3.0 * theta)
    
    gx = fmt(px * PX_TO_MM)
    gy = fmt((HEIGHT - py) * PX_TO_MM)  # Flip Y for G-code
    
    gcode_data.append(f"G1 X{gx} Y{gy} Z{Z_LO}")
    
    x_vals.append(px * PX_TO_MM)
    y_vals.append((HEIGHT - py) * PX_TO_MM)

# End G-code program
gcode_data.append(f"G1 Z{Z_HI}")
gcode_data.append("$H")
gcode_data.append("M2")

# Save G-code to file
with open("lissajous-from-python.gcode.txt", "w") as f:
    for line in gcode_data:
        f.write(line + "\n")

# Plot the figure
plt.figure(figsize=(11, 8.5)) # Letter-sized page in inches (landscape)
plt.plot(x_vals, y_vals, marker='o')
plt.title("Lissajous Figure (G-code Path)")
# plt.gca().invert_yaxis()  # unnecessary here, but sometimes helpful
plt.axis("equal")
plt.grid(True)
plt.show()