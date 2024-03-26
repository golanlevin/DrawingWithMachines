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


echo "Updating all software..."
apt-get update -y -q
apt-get upgrade -y -q
echo "Done updating all software!?"


echo "Installing system tools..."
apt-get install -y -q git htop rsync nano wget curl vim strace unzip usbutils pciutils xz-utils gnupg2 lsb-release netcat screen cowsay exfat-fuse exfat-utils
/usr/games/cowsay "Done installing system tools!"


echo -n "Rotating touchscreen at next reboot..."
grep -qxF "lcd_rotate=2" /boot/config.txt || echo "
# sfci-pi_axidraw_installer.sh
[all]
lcd_rotate=2" >> /boot/config.txt
echo '<monitors version="2">
  <configuration>
    <logicalmonitor>
      <x>0</x>
      <y>0</y>
      <primary>yes</primary>
      <monitor>
        <monitorspec>
          <connector>DSI-1</connector>
          <vendor>unknown</vendor>
          <product>unknown</product>
          <serial>unknown</serial>
        </monitorspec>
        <mode>
          <width>800</width>
          <height>480</height>
          <rate>59.928</rate>
        </mode>
      </monitor>
      <transform>
        <rotation>upside_down</rotation>
      </transform>
    </logicalmonitor>
  </configuration>
</monitors>' > /usr/local/share/monitors.xml
echo '[Unit]
Description=Rotate screens.

[Service]
Type=oneshot
ExecStart=/usr/local/bin/sfci-pi_axidraw_installer_monitors

[Install]
WantedBy=multi-user.target' > /etc/systemd/system/sfci-pi_axidraw_installer_monitors.service
echo '#!/bin/bash
ln -sf /usr/local/share/monitors.xml /var/lib/lightdm/.config/monitors.xml
for d in /home/*/ ; do
ln -sf /usr/local/share/monitors.xml "$d/.config/monitors.xml"
done
mkdir -p /etc/skel/.config
ln -sf /usr/local/share/monitors.xml /etc/skel/.config/monitors.xml' > /usr/local/bin/sfci-pi_axidraw_installer_monitors
chmod 755 /usr/local/bin/sfci-pi_axidraw_installer_monitors
systemctl daemon-reload
systemctl enable sfci-pi_axidraw_installer_monitors
echo "done!"


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


echo -n "Setting screen to stay on..."
echo 'Section "ServerLayout"
    Identifier "ServerLayout0"
    Option "StandbyTime" "0"
    Option "SuspendTime" "0"
    Option "OffTime"     "0"
    Option "BlankTime"   "0"
EndSection' > /etc/X11/xorg.conf.d/99_sfci-pi_axidraw_installer.conf
echo "done!"


# Ensure axidraw user in dialout group
echo -n "Ensure axidraw user in dialout group..."
usermod -a -G dialout axidraw
echo "done!"


echo "Installing Flatpak (for Inkscape)..."
apt-get -y -q install flatpak
echo "Done installing Flatpak (for Inkscape)!"


echo "Adding Flatpak Flathub repo..."
flatpak remote-add --system --if-not-exists flathub "https://flathub.org/repo/flathub.flatpakrepo"
echo "Done adding Flatpak Flathub repo!"


echo "Installing Inkscape (from Flatpak)...THIS MAY TAKE A WHILE..."
flatpak install --system --noninteractive flathub org.inkscape.Inkscape
echo "Done installing Inkscape (from Flatpak)!"


echo "Installing Inkscape Axidraw extension..."
TMP_INKSCAPE_AXIDRAW_ZIP=`mktemp`
TMP_INKSCAPE_AXIDRAW_DIR=`mktemp -d`
wget "https://cdn.evilmadscientist.com/dl/ad/public/ad-ink_322_r0-ink12.zip" -O "$TMP_INKSCAPE_AXIDRAW_ZIP"
unzip -q -d "$TMP_INKSCAPE_AXIDRAW_DIR" "$TMP_INKSCAPE_AXIDRAW_ZIP"
rm -f "$TMP_INKSCAPE_AXIDRAW_ZIP"
rsync -a "$TMP_INKSCAPE_AXIDRAW_DIR/ad-ink_322_r0-ink12/"* "/home/axidraw/test2"
rm -rf "$TMP_INKSCAPE_AXIDRAW_DIR"
echo "Done installing Inkscape Axidraw extension!"


echo "Installing Python 3.9..."
apt-get install -y -q python3.9 python3.9-dev python3.9-venv python3-pip
echo "Done installing Python 3.9!"


echo "Installing Axidraw package requirements..."
apt-get install -y -q libxslt1.1
echo "Done installing Axidraw package requirements!"


echo "Creating axidraw venv and updating it..."
if [ ! -d "$DIR" ]; then
python3.9 -m venv /usr/local/share/venv-axidraw
fi
/usr/local/share/venv-axidraw/bin/python3 -m pip install --upgrade pip wheel setuptools
echo "Done creating axidraw venv and updating it!"


echo "Installing axidraw in venv..."
/usr/local/share/venv-axidraw/bin/python3 -m pip install --upgrade --upgrade-strategy eager "https://cdn.evilmadscientist.com/dl/ad/public/ad_api/AxiDraw_API_396.zip"
ln -sf /usr/local/share/venv-axidraw/bin/axicli /usr/local/bin/axicli
echo "Done installing axidraw in venv!"


# Setting up the axidraw terminal
echo -n "Setting up the axidraw terminal..."
echo 'if [[ -z ${AXIDRAW_CONSOLE+x} ]]; then
AXIDRAW_CLI_COLOR_CYAN="\033[0;36m"
AXIDRAW_CLI_COLOR_RED="\033[0;31m"
AXIDRAW_CLI_COLOR_NONE="\033[0m"

# ls colors"
export LS_OPTIONS="--color=auto"
eval "$(dircolors)"
alias ls="ls $LS_OPTIONS"
alias ll="ls $LS_OPTIONS -l"
alias l="ls $LS_OPTIONS -lA"

# Some more alias to avoid making mistakes:
alias rm="rm -i"
alias cp="cp -i"
alias mv="mv -i"

echo -e "${AXIDRAW_CLI_COLOR_CYAN}Welcome to ${USER} on ${HOSTNAME}${AXIDRAW_CLI_COLOR_NONE}
"
echo -e "For the Axidraw V2 or V3, use ${AXIDRAW_CLI_COLOR_CYAN}axicli${AXIDRAW_CLI_COLOR_NONE}.
For the Axidraw V3/A3 or SE/A3, use ${AXIDRAW_CLI_COLOR_CYAN}axicli --model 2${AXIDRAW_CLI_COLOR_NONE}.
For the Axidraw V3 XLX, use ${AXIDRAW_CLI_COLOR_CYAN}axicli --model 3${AXIDRAW_CLI_COLOR_NONE}.
For the Axidraw MiniKit, use ${AXIDRAW_CLI_COLOR_CYAN}axicli --model 4${AXIDRAW_CLI_COLOR_NONE}.
For the Axidraw SE/A1, use ${AXIDRAW_CLI_COLOR_CYAN}axicli --model 5${AXIDRAW_CLI_COLOR_NONE}.
For the Axidraw SE/A2, use ${AXIDRAW_CLI_COLOR_CYAN}axicli --model 6${AXIDRAW_CLI_COLOR_NONE}.

Run ${AXIDRAW_CLI_COLOR_CYAN}axicli --help${AXIDRAW_CLI_COLOR_NONE} for complete usage information.${AXIDRAW_CLI_COLOR_NONE}"
cd ~/Desktop
AXIDRAW_CONSOLE=true
fi' > /etc/profile.d/99_sfci-pi_axidraw_installer.sh
chmod 0644 /etc/profile.d/99_sfci-pi_axidraw_installer.sh
grep -qxF '. /etc/profile.d/99_sfci-pi_axidraw_installer.sh' /etc/bash.bashrc || echo '
if [[ -z ${AXIDRAW_CONSOLE+x} ]]; then    # otherwise /etc/profile.d/* will run too
. /etc/profile.d/99_sfci-pi_axidraw_installer.sh
fi' >> /etc/bash.bashrc
echo 'axidraw ALL=(ALL) PASSWD: ALL' > /etc/sudoers.d/011_pi-nopasswd-override
chmod 0440 /etc/sudoers.d/011_pi-nopasswd-override
echo 'Defaults        insults' > /etc/sudoers.d/099_insults
chmod 0440 /etc/sudoers.d/099_insults
echo "done!"

echo "Installing STUDIO theme..."
if [ ! -f /usr/local/share/axidraw-background.orig.png ]; then
wget "https://github.com/golanlevin/DrawingWithMachines/raw/main/rpi/srv/salt/axidraw-kiosk/etc/axidraw-background.orig.png" -O /usr/local/share/axidraw-background.orig.png
fi
chmod 0644 /usr/local/share/axidraw-background.orig.png
grep -qxF 'wallpaper=/usr/local/share/axidraw-background.orig.png' /etc/lightdm/pi-greeter.conf || echo 'wallpaper=/usr/local/share/axidraw-background.orig.png
wallpaper_mode=center
desktop_bg=#ffffff' >> /etc/lightdm/pi-greeter.conf
grep -qxF 'wallpaper=/usr/local/share/axidraw-background.orig.png' /etc/xdg/pcmanfm/LXDE-pi/desktop-items-0.conf || echo 'wallpaper=/usr/local/share/axidraw-background.orig.png
wallpaper_mode=center
desktop_bg=#ffffff
desktop_fg=#000000' >> /etc/xdg/pcmanfm/LXDE-pi/desktop-items-0.conf
grep -qxF 'wallpaper=/usr/local/share/axidraw-background.orig.png' /etc/xdg/pcmanfm/LXDE-pi/desktop-items-1.conf || echo 'wallpaper=/usr/local/share/axidraw-background.orig.png
wallpaper_mode=center
desktop_bg=#ffffff
desktop_fg=#000000' >> /etc/xdg/pcmanfm/LXDE-pi/desktop-items-1.conf
echo "Done installing STUDIO background!"


echo -n "Resetting axidraw user settings..."
rm -rf /home/axidraw/.config
echo "done!"

echo "COMPELTE! Rebooting..."
reboot
