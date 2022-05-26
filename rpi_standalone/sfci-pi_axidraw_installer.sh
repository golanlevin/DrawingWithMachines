#!/bin/bash


# Ensure running as root
echo -n "Ensuring running as root..."
if [ "$EUID" -ne 0 ]; then
  printf "\nPlease run as root!\n"
  exit
fi
echo "done!"


# Check for internet connectivity
echo -n "Check for internet connectivity..."
echo -e "GET http://studioforcreativeinquiry.org HTTP/1.0\n\n" | nc google.com 80 > /dev/null 2>&1
if [ $? -ne 0 ]; then
  printf "\nPlease join a WiFi network or connect Ethernet with internet during installation!\n"
  exit
fi
echo "done!"

echo "
====================================
Setting up this machine for axidraw!
====================================
"


# Update all software
echo "Updating all software..."
apt-get update -y -q
apt-get upgrade -y -q
echo "Done updating all software!?"


# Installing system tools
echo "Installing system tools..."
apt-get install -y -q git htop rsync nano wget curl vim strace unzip usbutils pciutils xz-utils gnupg2 lsb-release netcat screen cowsay
/usr/games/cowsay "Done installing system tools!"


# Rotate touchscreen
echo -n "Rotating touchscreen at next reboot..."
grep -qxF "lcd_rotate=2" /boot/config.txt || echo "
# sfci-pi_axidraw_installer.sh
[all]
lcd_rotate=2" >> /boot/config.txt
echo "done!"


# Install xssstart and clicklock
echo -n "Installing xssstart and clicklock..."
if [ ! -f /usr/local/bin/xssstart ]; then
wget -q https://github.com/golanlevin/DrawingWithMachines/raw/main/rpi/srv/salt/axidraw-kiosk/usr/local/bin/xssstart-armhf -O /usr/local/bin/xssstart
fi
chmod 0755 /usr/local/bin/xssstart
if [ ! -f /usr/local/bin/clocklock ]; then
wget -q https://github.com/golanlevin/DrawingWithMachines/raw/main/rpi/srv/salt/axidraw-kiosk/usr/local/bin/clicklock-armhf -O /usr/local/bin/clicklock
fi
chmod 0755 /usr/local/bin/clicklock
echo "done!"


# Set screen to stay on
echo -n "Setting screen to stay on..."
if [ ! -f /etc/X11/xorg.conf.d/99_sfci-pi_axidraw_installer.conf ]; then
touch /etc/X11/xorg.conf.d/99_sfci-pi_axidraw_installer.conf
fi
grep -qxF 'Section "ServerLayout"' /etc/X11/xorg.conf.d/99_sfci-pi_axidraw_installer.conf || echo 'Section "ServerLayout"
    Identifier "ServerLayout0"
    Option "StandbyTime" "0"
    Option "SuspendTime" "0"
    Option "OffTime"     "0"
    Option "BlankTime"   "0"
EndSection' >> /etc/X11/xorg.conf.d/99_sfci-pi_axidraw_installer.conf
echo "done!"


# Ensure axidraw user in dialout group
echo -n "Ensure axidraw user in dialout group..."
usermod -a -G dialout axidraw
echo "done!"


# Installing Flatpak (for Inkscape)
echo "Installing Flatpak (for Inkscape)..."
apt-get -y -q install flatpak
echo "Done installing Flatpak (for Inkscape)!"

# Adding Flatpak Flathub repo
echo "Adding Flatpak Flathub repo..."
flatpak remote-add --system --if-not-exists flathub "https://flathub.org/repo/flathub.flatpakrepo"
echo "Done adding Flatpak Flathub repo!"

# Installing Inkscape (from Flatpak)
echo "Installing Inkscape (from Flatpak)...THIS MAY TAKE A WHILE..."
flatpak install --system --noninteractive flathub org.inkscape.Inkscape
echo "Done installing Inkscape (from Flatpak)!"

# Installing Inkscape Axidraw extension
echo "Installing Inkscape Axidraw extension..."
TMP_INKSCAPE_AXIDRAW_ZIP=`mktemp`
TMP_INKSCAPE_AXIDRAW_DIR=`mktemp -d`
wget "https://cdn.evilmadscientist.com/dl/ad/public/ad-ink_322_r0-ink12.zip" -O "$TMP_INKSCAPE_AXIDRAW_ZIP"
unzip -q -d "$TMP_INKSCAPE_AXIDRAW_DIR" "$TMP_INKSCAPE_AXIDRAW_ZIP"
rm -f "$TMP_INKSCAPE_AXIDRAW_ZIP"
rsync -a "$TMP_INKSCAPE_AXIDRAW_DIR/ad-ink_322_r0-ink12/"* "/home/axidraw/test2"
rm -rf "$TMP_INKSCAPE_AXIDRAW_DIR"
echo "Done installing Inkscape Axidraw extension!"


# Installing Python
echo "Installing Python 3.9..."
apt-get install -y -q python3.9 python3.9-dev python3.9-venv python3-pip
echo "Done installing Python 3.9!"


# Installing Axidraw package requirements
echo "Installing Axidraw package requirements..."
apt-get install -y -q libxslt1.1
echo "Done installing Axidraw package requirements!"

# Creating axidraw venv and updating it
echo "Creating axidraw venv and updating it..."
if [ ! -d "$DIR" ]; then
python3.9 -m venv /usr/local/share/venv-axidraw
fi
/usr/local/share/venv-axidraw/bin/python3 -m pip install --upgrade pip wheel setuptools
echo "Done creating axidraw venv and updating it!"

# Creating axidraw venv and updating it
echo "Installing axidraw in venv..."
/usr/local/share/venv-axidraw/bin/python3 -m pip install --upgrade --upgrade-strategy eager "https://cdn.evilmadscientist.com/dl/ad/public/ad_api/AxiDraw_API_321.zip"
echo "Done installing axidraw in venv!"


# Setting up the axidraw terminal
ln -sf /usr/local/share/venv-axidraw/bin/axicli /usr/local/bin/axicli
echo -n "Setting up the axidraw terminal..."
if [ ! -f /etc/profile.d/99_sfci-pi_axidraw_installer.sh ]; then
touch /etc/profile.d/99_sfci-pi_axidraw_installer.sh
fi
grep -qxF 'AXIDRAW_CONSOLE=true' /etc/profile.d/99_sfci-pi_axidraw_installer.sh || echo 'if [[ -z ${AXIDRAW_CONSOLE+x} ]]; then
AXIDRAW_CLI_COLOR_CYAN="\033[0;36m"
AXIDRAW_CLI_COLOR_RED="\033[0;31m"
AXIDRAW_CLI_COLOR_NONE="\033[0m"
echo -e "${AXIDRAW_CLI_COLOR_CYAN}Welcome to ${USER} on ${HOSTNAME}${AXIDRAW_CLI_COLOR_NONE}
"
echo -e "For the Axidraw V2 or V3, use ${AXIDRAW_CLI_COLOR_CYAN}axicli${AXIDRAW_CLI_COLOR_NONE}.
For the Axidraw V3/A3 or SE/A3, use ${AXIDRAW_CLI_COLOR_CYAN}axicli --model 2${AXIDRAW_CLI_COLOR_NONE}.
For the Axidraw V3 XLX, use ${AXIDRAW_CLI_COLOR_CYAN}axicli --model 3${AXIDRAW_CLI_COLOR_NONE}.
For the Axidraw MiniKit, use ${AXIDRAW_CLI_COLOR_CYAN}axicli --model 4${AXIDRAW_CLI_COLOR_NONE}.
For the Axidraw SE/A1, use ${AXIDRAW_CLI_COLOR_CYAN}axicli --model 5${AXIDRAW_CLI_COLOR_NONE}.
For the Axidraw SE/A2, use ${AXIDRAW_CLI_COLOR_CYAN}axicli --model 6${AXIDRAW_CLI_COLOR_NONE}.

Run axicli --help for complete usage information.${AXIDRAW_CLI_COLOR_NONE}"
cd ~/Desktop
AXIDRAW_CONSOLE=true
fi' >> /etc/profile.d/99_sfci-pi_axidraw_installer.sh
grep -qxF '. /etc/profile.d/99_sfci-pi_axidraw_installer.sh' /etc/bash.bashrc || echo '
if [[ -z ${AXIDRAW_CONSOLE+x} ]]; then    # otherwise /etc/profile.d/* will run too
. /etc/profile.d/99_sfci-pi_axidraw_installer.sh
fi' >> /etc/bash.bashrc
echo "done!"
