Axidraw Standalone Installation
===============================
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
9. Open a terminal and run `sudo raspi-config nonint do_hostname sfci-pi1.cfa.cmu.edu`.
10. Close this terminal
11. Open another terminal and run `curl -s -L "https://github.com/golanlevin/DrawingWithMachines/raw/main/rpi_standalone/sfci-pi_axidraw_installer.sh?$RANDOM" | sudo bash -s`
