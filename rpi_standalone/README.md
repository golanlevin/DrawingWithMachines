Axidraw Standalone
==================
1. Download standard Pi image (armhf, "without additional software")
   **Important: Plug in a standard keyboard during entire installation**
2. Set Country Page
   - Country: United States
   - Language: American English
   - Timezone: Eastern
   - Check "Use English Language"
   - Check "Use US Keyboard"
   - Click "Next"
3. Create User page
   - Username: axidraw
   - Password:
   - Click "Next"
4. Set Up Screen Page
   - Check "Reduce the size of the desktop on this monitor"
   - Click "Next"
5. Wifi Page
   - Click "Skip"
6. Update Software Page
   - Click "Next" (do not click "Skip")
7. Click OK when done
8. Restart
9. Open a terminal
   1. Set the hostname (change the number for the correct Pi), part 1: `sudo nano /etc/hosts` and replace `raspberry` with `sfci-pi1.cfa.cmu.edu`.
   2. Then run `sudo raspi-config nonint do_hostname sfci-pi1.cfa.cmu.edu`.
   3. Then run `curl -s -L https://github.com/golanlevin/DrawingWithMachines/raw/main/rpi_standalone/sfci-pi_axidraw_installer.sh | sudo bash -s`
