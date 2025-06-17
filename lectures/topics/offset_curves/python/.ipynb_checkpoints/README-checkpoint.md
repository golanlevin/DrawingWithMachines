
* First, check if Python3 is installed. Run: `python3 --version`. This notebook was developed with Python 3.13.3 on MacOSX 14.5.
* `cd /Users/gl/Desktop/offset_curves`
* Because this notebook requires the installation of numerous Python libraries, working in a virtual environment (venv) is extremely strongly recommended. Create a virtual environment, e.g. `offsetVenv`:
  * Mac: `python3 -m venv offsetVenv`
  * Win: `python -m venv offsetVenv`
* Activate the offsetVenv virtual environment:
  * Mac: `source offsetVenv/bin/activate`
  * Win: `offsetVenv\Scripts\activate`
* Before we install necessary libraries, it's optional but recommended that you upgrade pip first: `pip install --upgrade pip`
* `pip install numpy noise shapely matplotlib svgwrite`
* `pip install notebook`
* Launch Jupyter Notebook: `jupyter notebook`