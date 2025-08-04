#!/usr/bin/env python3
import re
import sys

def parse_gcode(gcode_file):
    """Parse G-code file and extract G0 and G1 movements."""
    g0_movements = []
    g1_movements = []
    
    current_position = {"X": 0, "Y": 0, "Z": 0}
    
    with open(gcode_file, 'r') as file:
        for line in file:
            line = line.strip()
            
            # Skip empty lines
            if not line:
                continue
            
            # Check if line starts with G0 or G1
            if line.startswith("G0") or line.startswith("G00"):
                command = "G0"
            elif line.startswith("G1") or line.startswith("G01"):
                command = "G1"
            else:
                continue  # Skip this line, not G0 or G1
            
            # Extract coordinates from the line
            new_position = current_position.copy()
            
            # Use regular expressions to find X, Y, Z coordinates
            x_match = re.search(r'X([-+]?\d*\.?\d+)', line)
            y_match = re.search(r'Y([-+]?\d*\.?\d+)', line)
            z_match = re.search(r'Z([-+]?\d*\.?\d+)', line)
            
            if x_match:
                new_position["X"] = float(x_match.group(1))
            if y_match:
                new_position["Y"] = float(y_match.group(1))
            if z_match:
                new_position["Z"] = float(z_match.group(1))
            
            # Record the movement only if position changed
            if new_position != current_position:
                if command == "G0":
                    g0_movements.append((current_position.copy(), new_position.copy()))
                else:  # G1
                    g1_movements.append((current_position.copy(), new_position.copy()))
                
                # Update current position
                current_position = new_position
    
    return g0_movements, g1_movements

def create_svg(g0_movements, g1_movements, output_file):
    """Create SVG file with paths for G0 and G1 movements."""
    # Find the bounding box of all movements
    all_x_coords = []
    all_y_coords = []
    
    for start, end in g0_movements + g1_movements:
        all_x_coords.extend([start["X"], end["X"]])
        all_y_coords.extend([start["Y"], end["Y"]])
    
    if not all_x_coords:
        min_x, min_y = 0, 0
        max_x, max_y = 100, 100  # Default size if no points
    else:
        min_x = min(all_x_coords)
        min_y = min(all_y_coords)
        max_x = max(all_x_coords)
        max_y = max(all_y_coords)
    
    # Add some padding
    padding = 10
    min_x -= padding
    min_y -= padding
    max_x += padding
    max_y += padding
    
    width = max_x - min_x
    height = max_y - min_y
    
    # Create SVG content
    svg_content = f"""<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<svg width="{width}" height="{height}" viewBox="{min_x} {min_y} {width} {height}" xmlns="http://www.w3.org/2000/svg">"""
    
    # Create G1 path (blue)
    if g1_movements:
        svg_content += '\n  <path d="'
        last_point = None
        
        for start, end in g1_movements:
            if last_point is None or start != last_point:
                svg_content += f'M {start["X"]},{start["Y"]} '
            
            svg_content += f'L {end["X"]},{end["Y"]} '
            last_point = end
        
        svg_content += '" stroke="blue" fill="none" stroke-width="1" />'
    
    # Create G0 path (red)
    if g0_movements:
        svg_content += '\n  <path d="'
        last_point = None
        
        for start, end in g0_movements:
            if last_point is None or start != last_point:
                svg_content += f'M {start["X"]},{start["Y"]} '
            
            svg_content += f'L {end["X"]},{end["Y"]} '
            last_point = end
        
        svg_content += '" stroke="red" fill="none" stroke-width="1" />'
    
    svg_content += '\n</svg>'
    
    # Write to file
    with open(output_file, 'w') as file:
        file.write(svg_content)

def main():
    """Main function to convert G-code to SVG."""
    if len(sys.argv) != 3:
        print("Usage: python gcode_to_svg.py <input_gcode_file> <output_svg_file>")
        sys.exit(1)
    
    input_file = sys.argv[1]
    output_file = sys.argv[2]
    
    g0_movements, g1_movements = parse_gcode(input_file)
    create_svg(g0_movements, g1_movements, output_file)
    
    print(f"Converted {input_file} to {output_file}")
    print(f"Found {len(g0_movements)} G0 movements and {len(g1_movements)} G1 movements")

if __name__ == "__main__":
    main()
