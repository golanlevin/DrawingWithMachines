# Debianization of Mac Mini A1347

*This document lists instructions and notes for converting a 2010-era Mac Mini (4,1) into a Debian 12 (Bookworm) computer for running an AxiDraw or HP7475A pen plotter.*

Golan Levin, August 2025

---

## A. Preparation and Installation of Debian OS


### 1. Preparation

- Download the Debian ISO `debian-live-12.11.0-amd64-xfce.iso` (3.2GB), for example from [here](https://cdimage.debian.org/images/archive/12.11.0-live/amd64/iso-hybrid/debian-live-12.11.0-amd64-xfce.iso) on [this server](https://cdimage.debian.org/images/archive/12.11.0-live/amd64/iso-hybrid/).
- Burn `debian-live-12.11.0-amd64-xfce.iso` onto a USB thumb drive using [balenaEtcher.app](https://etcher.balena.io/)
- Insert the thumb drive, and boot the Mac Mini while holding the **Option (⌥)** key.
- Select the first (left-hand) **EFI Boot** drive (orange USB icon).


### 2. Boot Menu
- Choose **Start Installer** (not the “Live system”).
- Follow the Debian installer prompts.


### 3. Language, Keyboard, and Network Setup

- Select **English** (or desired language) and keyboard layout.
- On “Choose a network interface”:
  - Select **wlp3s0b1** (wireless).
  - Chose **WPA/WPA2 PSK** for home Wi-Fi.
  - Enter the Wi-Fi password.
  - If the connection fails, use the wired network instead, and fix Wifi later. This could happen on some older Mac Minis.
- When asked for the **domain name**, leave it blank (not on a domain now).


### 4. User Accounts

- Set the **root password**.
- Also create a normal user account + password.


### 5. Disk Partitioning

- Select **Guided – use entire disk** (for example: 1.0 TB ATA WDC internal drive).
- Chose **All files in one partition**.
- Accept warning that this will erase the disk.


### 6. Package Installation
- Select **Yes** for “Use a network mirror” (enables up-to-date packages during install).
- Let the installer fetch and install the base system + desktop environment.
- Wait for installation to complete.


### 7. Boot into Debian
- Remove USB thumb drive when prompted.
- Reboot: Debian should be loaded cleanly from the internal drive.


---

## B. Post-Install Setup for Debian Mac Mini

*This guide documents all steps performed after the base Debian installation, including package installs, Python virtual environment setup, account changes, symlinks, and serial port permissions.*


### 1. Give your user `sudo` privileges

```
su -  # login as root if not already
usermod -aG sudo administrator
```


### 2. Update and upgrade the system

`sudo apt update && sudo apt upgrade -y`

### 3. Install hardware information tools

These are useful for inspecting hardware and USB devices.

```
sudo apt install -y \
    usbutils \        # lsusb
    pciutils \        # lspci
    lshw \            # hardware listing
    hwinfo \          # detailed hardware info
    dmidecode         # BIOS/firmware/hardware data
```

### 4. Install everyday utilities

This set includes common tools, compilers, and media utilities.

```
sudo apt install -y \
    curl \
    wget \
    git \
    htop \
    nano \
    unzip \
    zip \
    build-essential \
    python3-venv \
    smartmontools \
    ffmpeg

```

And also these apps: 

```
sudo apt install cutecom
sudo apt install vlc
```


### 5. Create a Python virtual environment for *vpype* and the AxiDraw CLI

```
# Create and activate the venv
python3 -m venv ~/vpype-venv
source ~/vpype-venv/bin/activate

# Install vpype
pip install --upgrade pip
pip install vpype
vpype --version

# Install the AxiDraw API from its zip file.
# Download it from https://cdn.evilmadscientist.com/dl/ad/public/AxiDraw_API.zip
pip install /path/to/AxiDraw_API.zip

# Create global symlinks so vpype and axicli commands work outside the venv
sudo ln -s ~/vpype-venv/bin/vpype /usr/local/bin/vpype
sudo ln -s ~/vpype-venv/bin/axicli /usr/local/bin/axicli

# Deactivate the venv
deactivate
```


### 6. Add your user to the `dialout` group for serial/USB access

This grants permission to the account called `administrator` to access the serial port:

```
sudo usermod -aG dialout administrator
```

or more generally, 
```
sudo usermod -aG dialout $(whoami)
```

Log out and back in (or reboot) for the change to take effect. Check that you're in the `dialout` group using the command: 

```
groups
```


To check device permissions:

```
ls -l /dev/ttyUSB*
# Should show group "dialout"
```

At this point you have:

* administrator account with `sudo` privileges
* Core everyday utilities installed (`curl`, `wget`, `git`, etc.)
* Hardware inspection tools installed (`lsusb`, `lshw`, etc.)
* Python venv containing `vpype` and `axicli`, symlinked globally
* Serial port permissions fixed for AxiDraw and other USB/serial devices

---

## C. Application Installs

### 1. Install Google Chrome

1. Download the Debian Chrome `.deb` package from: [https://www.google.com/chrome/](https://www.google.com/chrome/).
2. Install Chrome via terminal:
   ```
   sudo apt install ~/Downloads/google-chrome-stable_current_amd64.deb
   ```
3. Add shortcuts to the Desktop and taskbar Panel via right-click on the Chrome icon in the launcher, or by dragging copies to them (this depends on the display manager). 


### 2. Install Inkscape 1.3, and add AxiDraw Extensions to it

A. Download the **Inkscape 1.3 AppImage** from this page, [https://inkscape.org/release/1.3/gnulinux/](https://inkscape.org/release/1.3/gnulinux/) or from [https://inkscape.org/release/inkscape-1.3/gnulinux/appimage/dl/](https://inkscape.org/release/inkscape-1.3/gnulinux/appimage/dl/). The file name of the AppImage I'm using is **Inkscape-0e150ed-x86_64.AppImage** (124MB). 

B. Move the AppImage to `/opt/inkscape` and make it executable:

```
sudo mkdir /opt/inkscape
sudo mv ~/Downloads/Inkscape-0e150ed-x86_64.AppImage /opt/inkscape/inkscape.AppImage
sudo chmod +x /opt/inkscape/inkscape.AppImage
```

C. Download a copy of the Inkscape logo, and move it to `/opt/inkscape/` as well:

```
sudo wget -O /opt/inkscape/inkscape-logo.svg "https://upload.wikimedia.org/wikipedia/commons/0/0d/Inkscape_Logo.svg"
sudo mv ~/Downloads/Inkscape_Logo.svg /opt/inkscape/inkscape-logo.svg
```

D. Create the `inkscape.desktop` launcher for Debian:

```
sudo nano /usr/share/applications/inkscape.desktop
```

Paste the following contents into the `inkscape.desktop` file: 

```
[Desktop Entry]
Name=Inkscape
Comment=Vector Graphics Editor
Exec=/opt/inkscape/inkscape.AppImage
Icon=/opt/inkscape/inkscape-logo.svg
Terminal=false
Type=Application
Categories=Graphics;2DGraphics;VectorGraphics;GTK;
StartupNotify=true
```
Then, 

```
sudo chmod +x /usr/share/applications/inkscape.desktop
```

*Now it's time to install the AxiDraw control extensions for Inkscape.*

E. Locate the Inkscape user extensions directory:

* Launch Inkscape → Edit → Preferences → System.
* Look for the user extensions directory path. Ignore the one that begins with `/tmp`.
* It's probably something like `~/.config/inkscape/extensions/`

F. Download AxiDraw extensions for Linux x86:

From here, [https://wiki.evilmadscientist.com/Axidraw_Software_Installation#Linux](https://wiki.evilmadscientist.com/Axidraw_Software_Installation#Linux), you want to download the file labeled "For x86, download the software in this ZIP archive (39 MB)", it is most likely  the file: [https://cdn.evilmadscientist.com/dl/ad/public/395/AxiDraw_395_LinX86.zip](https://cdn.evilmadscientist.com/dl/ad/public/395/AxiDraw_395_LinX86.zip), i.e. file name: `AxiDraw_395_LinX86.zip`.

G. Unzip this into the Inkscape user extensions directory:

```
unzip ~/Downloads/AxiDraw_395_LinX86.zip -d ~/.config/inkscape/extensions/
```

H. Log out/in, you should now see "AxiDraw Control" in the Inkscape UI under "Extensions".


### 3. Sublime Text

To install Sublime Text, follow the official `apt` install instructions from:
[https://www.sublimetext.com/docs/linux_repositories.html](https://www.sublimetext.com/docs/linux_repositories.html):

```
wget -qO - https://download.sublimetext.com/sublimehq-pub.gpg | sudo tee /etc/apt/keyrings/sublimehq-pub.asc > /dev/null
echo -e 'Types: deb\nURIs: https://download.sublimetext.com/\nSuites: apt/stable/\nSigned-By: /etc/apt/keyrings/sublimehq-pub.asc' | sudo tee /etc/apt/sources.list.d/sublime-text.sources
sudo apt-get update
sudo apt-get install sublime-text
```

### 4. CoolTerm

*Currently CoolTerm is a little glitchy on Debian, so we'll be using `cutecom` instead. These instructions are presented for legacy purposes.*

Download CoolTermLinux64Bit.zip from:
[https://freeware.the-meiers.org/](https://freeware.the-meiers.org/)

Unzip to /opt:

```
sudo mkdir /opt/coolterm
sudo unzip ~/Downloads/CoolTermLinux64Bit.zip -d /opt/coolterm
```

Ensure the CoolTerm binary is executable:

```
sudo chmod +x /opt/coolterm/CoolTermLinux64Bit/CoolTerm
```

Download or create an icon (optional), and put it in `/opt/coolterm/CoolTermLinux64Bit/coolterm-icon.png`.

Create the `coolterm.desktop` Launcher file:

```
nano ~/.local/share/applications/coolterm.desktop
```

The contents of this file should be:

```
[Desktop Entry]
Name=CoolTerm
Comment=Serial Port Terminal
Exec=/opt/coolterm/CoolTermLinux64Bit/CoolTerm
Icon=/opt/coolterm/CoolTermLinux64Bit/coolterm-icon.png
Terminal=false
Type=Application
Categories=Utility;Communication;
StartupNotify=true
```

Make the `coolterm.desktop` file executable:
```
chmod +x ~/.local/share/applications/coolterm.desktop
```

Log out/in if CoolTerm does not appear in the launcher.

---

## D. Other Debian OS Settings Installs

* Turn off the screensaver in the Settings Manager -> Power Settings. 
* Map .hpgl files to the sublime-text app. Make an .hpgl file, right-click to choose which app to open it with, select Sublime Text and make sure to check "always use this app for this type of file". 




