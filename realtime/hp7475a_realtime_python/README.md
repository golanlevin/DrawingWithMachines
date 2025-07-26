# Realtime control of HP7475A with Python

*This directory hosts a mirror of [hp7475a-send](https://github.com/vogelchr/hp7475a-send/tree/master) by [Christian Vogel](https://github.com/vogelchr) (@vogelchr). The [`hp7475a_send.py`](hp7475a_send.py) code is primarily intended to stream an HPGL file to the plotter.*

---

To send HPGL files to a HP7475a plotter, one has to be careful not to overrun its serial buffer, otherwise it will just stop plotting (or produce garbage) after a short while.

[This script](hp7475a_send.py) regularly asks the plotter for its status, being careful not to send it data when it's not ready. (Yes, it should work with pin 20 hardware-handshaking which I initially tried and failed, and also xon/xoff, but for some reason I was too stupid to make it work that way, so I choose the way outlined in the [manual](https://archive.org/details/HP7475AInterfacingandProgrammingManual/page/n191), flow diagram on page 10-19.)


## Usage 

usage: `hp7475a_send.py [-h] [-p TTY] [-b N] hpglfile`

positional arguments: `hpglfile`

optional arguments:

* `-h`, `--help` *Show this help message and exit*
* `-p TTY`, `--port TTY` *Serial port (default: `/dev/ttyS0`)*
* `-b N`, `--baud N` *Baudrate (default: 9600)*


---

## Serial Cable

See the [HP7475A interconnection manual](https://www.pearl-hifi.com/06_Lit_Archive/15_Mfrs_Publications/20_HP_Agilent/HP_7475A_Plotter/HP_7475A_Op_Interconnect.pdf)
(upper half of page A6, only using pins 2,3,5 on PC side)

```
25pin DSub, female     9pin DSub, male
HP7475a                 Computer (PC)
 |                           |
Pin  Function               Pin  Signal
---:-----------------------:----:------
 1 : Cable Shield / Common :body: GND (Case)
 2 : --> data from plotter : 2  : RxD
 3 : <-- data to plotter   : 3  : TxD
 7 : Signal Ground         : 5  : GND
```