# Debian 12 Plotter Machine Configuration Summary

This guide outlines the steps needed to prepare a Debian 12 machine for use in the *Drawing with Machines* classroom. It includes setup for HDMI underscan, CoolTerm with root access, screen lock disabling, and SVG plotting via `vpype`.

---

## Fix underscan on display

Create or edit `~/.xprofile` file:

```
nano ~/.xprofile
```

Add this command to the file, to turn on underscan:

```
xrandr --output HDMI-1 --set underscan on

```
Save the file: `Ctrl + O, enter, Ctrl + X`

Make sure the script is executable:

```
chmod +x ~/.xprofile
```

File should be saved to `/home/administrator/.xprofile`. 

---

## Launch CoolTerm with sudo from a desktop icon 

Download [CoolTerm](https://freeware.the-meiers.org/) for Linux: 

```
https://freeware.the-meiers.org/CoolTermLinux64Bit.zip
```

Unzip the install bundle to `/opt/CoolTerm/`. The app should now be located at `/opt/CoolTerm/CoolTerm`. 

Copy the CoolTerm `AboutIcon.png` to `/usr/share/pixmaps/`:

```
sudo cp /opt/CoolTerm/CoolTerm\ Resources/AboutIcon.png /usr/share/pixmaps/coolterm.png

```

configure `sudo` to allow the user to run just CoolTerm as root with no password. Run: 

```
sudo visudo
```

Scroll to the bottom and add:

```
administrator ALL=(ALL) NOPASSWD: /opt/CoolTerm/CoolTerm

```

Create a desktop shortcut:

```
nano ~/Desktop/CoolTerm.desktop
```

Paste in this content:

```
[Desktop Entry]
Type=Application
Name=CoolTerm
Exec=sudo /opt/CoolTerm/CoolTerm
Icon=coolterm
Terminal=true
Categories=Utility;
```

Make the shortcut executable:

```
chmod +x ~/Desktop/CoolTerm.desktop
```

---

## Disable the screen lock

Run this in the terminal as your regular user (not root). These commands disable the lock screen, the idle timeout that triggers blanking, and sleep when idle on AC or battery:

```
gsettings set org.gnome.desktop.screensaver lock-enabled false
gsettings set org.gnome.desktop.session idle-delay 0
gsettings set org.gnome.settings-daemon.plugins.power sleep-inactive-ac-type 'nothing'
```

---

## Install vpype

We will install `vpype` -- detailed instructions are [here](https://github.com/golanlevin/DrawingWithMachines/tree/main/machines/hp7475a#4-convert-svg-to-hpgl-with-vpype). 

Install `pip`: 

```
sudo apt install python3-pip
pip install --upgrade pip setuptools wheel

```

Install vpype:

```
pip install vpype[all]
```

You should now be able to run vpype: `vpype --help`. This may take a moment the first time.

Install missing Qt dependency:

```
sudo apt install libxcb-cursor0
```

Install the missing Mesa OpenGL runtime libraries:

```
sudo apt install libgl1-mesa-dev libegl-dev
```



