# (Obsolete) Using `vsketch` and `vpype` on M1 Macs

*This document is from 2022 and is obsolete as of 2025. For 2025 instructions see [here](https://github.com/golanlevin/DrawingWithMachines/blob/main/generating_svg/python/README.md#1-creating-a-suitable-python310-virtual-environment) and [here](https://github.com/golanlevin/DrawingWithMachines/blob/main/generating_svg/python/README.md#3-generating-an-svg-using-vsketch-and-vscode).*

---

## Python Installation

We need a particular version of Python3 to get this to work on the M1.

1. Open a Terminal window
2. Install the xcode command line tools and Rosetta. You may be asked to accept some terms and conditions.
   ```zsh
   softwareupdate --install-rosetta
   xcode-select --install
   ```
3. Install the x86_64 (Intel) version of Homebrew
   ```zsh
   arch --x86_64 /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
   ```
4. Ensure that Homebrew installed to a directory beginning with `/usr` and not `/opt`. In the next steps section at the end of the install, follow any commands it says to (it will say in your terminal window).
5. Install the x86_64 Python 3
   ```zsh
   arch --x86_64 brew install python@3.9
   ```
6. Update some Python built-in packages. NOTE: If this command doesn't work, your Homebrew may not be installed in the default place.
   ```zsh
   arch --x86_64 /usr/local/opt/python@3.9/libexec/bin/python -m pip install wheel setuptools pip --upgrade
   ```

## `vsketch` Installation

We'll create a folder in which we install all of the packages (`vsketch`, `vpype`, `shapely`, etc.). This is to prevent conflicts and other annoying problems when you inevitably do other things with this Python installation. It also means you don't have to type out annoyingly long paths all the time.

1. Create the `venv`
   ```zsh
   arch --x86_64 /usr/local/opt/python@3.9/libexec/bin/python -m venv ~/venv_draw
2. Activate the `venv`
   ```zsh
   source ~/venv_draw/bin/activate
   ```
3. Update some Python built-in packages
   ```zsh
   python3 -m pip install wheel setuptools pip --upgrade
   ```
4. Install `vsketch`
   ```zsh
   python3 -m pip install git+https://github.com/abey79/vsketch#egg=vsketch
   ```

## How to use

Any time you wish to use `vsketch` or `vpype` or install additional packages, you should:

1. Open a Terminal
2. Activate the `venv`
   ```zsh
   source venv_draw/bin/activate
   ```
3. The `vsk` and `vpype` commands should now work.

## Using `vsketch`

1. Perform the previous section (open a terminal and activate the `venv`)
2. Use `cd` to go to the directory where your project should be stored
3. Use create a new project, run this and you can choose a paper size (i.e. `letter`) and portrait/landscape:
   ```zsh
   vsk init my-cool-project
   ```
4. Now go into the project directory
   ```zsh
   cd my-cool-project
   ```
5. Start vsketch from inside this directory (this is my recommended way to run `vsketch`)
   ```zsh
   vsketch run
   ```
6. If you update the `*.py` file in the `my-cool-project` directory, the preview window will automatically update.
7. If you click the "LIKE" button, then a SVG will appear in the `output` folder in the `my-cool-project` folder.
8. To change the ruler units to inches, click on the eye in the top left corner > Units > Imperial. Don't forget to change your project to also be in inches.
9. See the [`vsketch` documentation](https://vsketch.readthedocs.io/en/latest/overview.html#write-sketches-with-the-vsketch-api)
10. See the [`vsketch` reference](https://vsketch.readthedocs.io/en/latest/reference/vsketch.Vsketch.html#vsketch.Vsketch)
11. See the [`vpype`documentation](https://vpype.readthedocs.io/en/stable/)
