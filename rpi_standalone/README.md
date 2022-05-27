WIP
===
Download standard Pi
Important: Plug in a standard keyboard during entire installation

Set Country Page
Country: United States
Language: American English
Timezone: Eastern
Check "Use English Language"
Check "Use US Keyboard"
Next

Create User page
Username: axidraw
Password:
Next

Set Up Screen Page
Check "Reduce the size of the desktop on this monitor"
Next

Wifi Page
Click "Skip"

Update Software Page
Click "Next" (do not click "Skip")

Click OK when done
Restart

Open a terminal
Set the hostname (change the number for the correct Pi), part 1: `sudo nano /etc/hosts` and replace `raspberry` with `sfci-pi1.cfa.cmu.edu`.
Then run `sudo raspi-config nonint do_hostname sfci-pi1.cfa.cmu.edu`.
