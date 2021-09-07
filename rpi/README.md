Plotter Station Configs
=======================
We are using a number of Raspberry Pi computers to manage our AxiDraw plotters. This is helpful, especially for time-consuming plots, as it frees up your own laptop :)

The system consists of a master and minions running Debian stable and Saltstack. Any device that can run Debian, with or without a touchscreen, will work.

The master performs these functions:
 - SaltStack master
 - Guacamole VNC server
 - NFS file server and web file upload
 - Central web server with authentication
 - HTTPS via certbot and Let's Encrypt

The minions perform these functions:
 - Run Inkscape w/ Axidraw plugin, Axidraw CLI, and Taxi
 - Axidraw CLI automatically selects device based on user/machine
 - One user account per each axidraw so that multiple machines may be used simultaneously
 - Stripped-down and locked-in desktop and window manager that is consistent and touchscreen-friendly
 - Management of multiple axidraw machines per machine (i.e. an exact USB port is always used per each machine for consistency)
 - On-screen keyboard button for touchscreen accessibility with Onboard
 - Central NFS file server and web interface for uploading with Filebrowser
 - Remote desktop connections to each machine through the master with x11vnc and Guacamole

## TODO
 - License
 - Control screen timeout via SaltStack variable
 - Lock down XFCE a bit more
 - Some sort of interface (maybe) on the master machine

## Usage

### Managing Files

### Using the CLI

### Controlling Remotely

## Setup Instructions

1. If using a Raspberry Pi, install Raspbian Lite to get started. Also remember to change the `pi` user password. If using an x86 machine, install Debian stable with the CLI installer (do not install any additional packages, services, or GUIs).
2. TBD

Grain example:
```yaml
roles:
  - axidraw
axidraws:
  - name: axidraw7           # Should be accross all machines
    id: 7                    # Should be accross all machines
    kernel_port: '1-1.3:1.0' # Linux USB port address. Can also address USB hubs if needed
    kernel_type: 'ttyACM*'   # How it shows up normal in /dev/tty...
  - name: axidraw8
    id: 8
    kernel_port: '1-1.4:1.0'
    kernel_type: 'ttyACM*'
```

## Notes

This system was originally created by [Perry Naseck](https://perrynaseck.com/) in 2021 for the F21 _Drawing with Machines_ course at CMU.
