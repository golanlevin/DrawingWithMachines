#!/usr/bin/env python3
#
# Very simple serial terminal
#
# This file is part of pySerial. https://github.com/pyserial/pyserial
# (C)2002-2020 Chris Liechti <cliechti@gmx.net>
#
# SPDX-License-Identifier:    BSD-3-Clause

from __future__ import absolute_import

import contextlib
VERSION = 'v1.2.0'

import codecs
import os
from re import split
import sys
import threading
import logging
import platform

if platform.system() == 'Darwin':
    import subprocess
else:
    try:
        from tkinter import *
        from tkinter import filedialog
        from tkinter import simpledialog
    except:
        pass

import time

import serial
from serial.tools.list_ports import comports
from serial.tools import hexlify_codec

from xmodem import XMODEM

# Uncomment this line to debug XModem
# logging.basicConfig(level=logging.DEBUG)

# pylint: disable=wrong-import-order,wrong-import-position

codecs.register(lambda c: hexlify_codec.getregentry() if c == 'hexlify' else None)

try:
    raw_input
except NameError:
    # pylint: disable=redefined-builtin,invalid-name
    raw_input = input   # in python3 it's "raw"
    unichr = chr


def key_description(character):
    """generate a readable description for a key"""
    ascii_code = ord(character)
    if ascii_code < 32:
        return 'Ctrl+{:c}'.format(ord('@') + ascii_code)
    else:
        return repr(character)


# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
class ConsoleBase:
    """OS abstraction for console (input/output codec, no echo)"""

    def __init__(self):
        if sys.version_info >= (3, 0):
            self.byte_output = sys.stdout.buffer
        else:
            self.byte_output = sys.stdout
        self.output = sys.stdout

    def setup(self):
        """Set console to read single characters, no echo"""

    def cleanup(self):
        """Restore default console settings"""

    def getkey(self):
        """Read a single key from the console"""
        return None

    def write_fluid(self, byte_string):
        """Write bytes (already encoded)"""
        self.byte_output.write(byte_string)
        self.byte_output.flush()

    def write(self, text):
        """Write string"""
        self.output.write(text)
        self.output.flush()

    def cancel(self):
        """Cancel getkey operation"""

    #  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -  -
    # context manager:
    # switch terminal temporary to normal mode (e.g. to get user input)

    def __enter__(self):
        self.cleanup()
        return self

    def __exit__(self, *args, **kwargs):
        self.setup()

if os.name == 'nt':  # noqa
    import msvcrt
    import ctypes
    import platform

    class Out(object):
        """file-like wrapper that uses os.write"""

        def __init__(self, fd):
            self.fd = fd

        def flush(self):
            pass

        def write(self, s):
            os.write(self.fd, s)

    class Console(ConsoleBase):
        fncodes = {
            ';': '\x1bOP',  # F1
            '<': '\x1bOQ',  # F2
            '=': '\x1bOR',  # F3
            '>': '\x1bOS',  # F4
            '?': '\x1b[15~',  # F5
            '@': '\x1b[17~',  # F6
            'A': '\x1b[18~',  # F7
            'B': '\x1b[19~',  # F8
            'C': '\x1b[20~',  # F9
            'D': '\x1b[21~',  # F10
            'H': '\x1b[A',  # UP
            'P': '\x1b[B',  # DOWN
            'K': '\x1b[D',  # LEFT
            'M': '\x1b[C',  # RIGHT
            'G': '\x1b[H',  # HOME
            'O': '\x1b[F',  # END
            'R': '\x1b[2~',  # INSERT
            'S': '\x1b[3~',  # DELETE
            'I': '\x1b[5~',  # PGUP
            'Q': '\x1b[6~',  # PGDN
        }
        navcodes = {
            'H': '\x1b[A',  # UP
            'P': '\x1b[B',  # DOWN
            'K': '\x1b[D',  # LEFT
            'M': '\x1b[C',  # RIGHT
            'G': '\x1b[H',  # HOME
            'O': '\x1b[F',  # END
            'R': '\x1b[2~',  # INSERT
            'S': '\x1b[3~',  # DELETE
            'I': '\x1b[5~',  # PGUP
            'Q': '\x1b[6~',  # PGDN        
        }
        
        def __init__(self):
            super(Console, self).__init__()
            self._saved_ocp = ctypes.windll.kernel32.GetConsoleOutputCP()
            self._saved_icp = ctypes.windll.kernel32.GetConsoleCP()
            ctypes.windll.kernel32.SetConsoleOutputCP(65001)
            ctypes.windll.kernel32.SetConsoleCP(65001)
            # ANSI handling available through SetConsoleMode since Windows 10 v1511 
            # https://en.wikipedia.org/wiki/ANSI_escape_code#cite_note-win10th2-1
            if platform.release() == '10' and int(platform.version().split('.')[2]) > 10586:
                ENABLE_VIRTUAL_TERMINAL_PROCESSING = 0x0004
                import ctypes.wintypes as wintypes
                if not hasattr(wintypes, 'LPDWORD'): # PY2
                    wintypes.LPDWORD = ctypes.POINTER(wintypes.DWORD)
                SetConsoleMode = ctypes.windll.kernel32.SetConsoleMode
                GetConsoleMode = ctypes.windll.kernel32.GetConsoleMode
                GetStdHandle = ctypes.windll.kernel32.GetStdHandle
                mode = wintypes.DWORD()
                GetConsoleMode(GetStdHandle(-11), ctypes.byref(mode))
                if (mode.value & ENABLE_VIRTUAL_TERMINAL_PROCESSING) == 0:
                    SetConsoleMode(GetStdHandle(-11), mode.value | ENABLE_VIRTUAL_TERMINAL_PROCESSING)
                    self._saved_cm = mode
            self.output = codecs.getwriter('UTF-8')(Out(sys.stdout.fileno()), 'replace')
            # the change of the code page is not propagated to Python, manually fix it
            sys.stderr = codecs.getwriter('UTF-8')(Out(sys.stderr.fileno()), 'replace')
            sys.stdout = self.output
            self.output.encoding = 'UTF-8'  # needed for input
            os.system('color 0f') # sets the background to blue

            #if os.name == 'nt':
            #    os.system('color 0f') # sets the background to blue
            #else:
            #    os.system('setterm -background white -foreground white -store')

        def __del__(self):
            ctypes.windll.kernel32.SetConsoleOutputCP(self._saved_ocp)
            ctypes.windll.kernel32.SetConsoleCP(self._saved_icp)
            with contextlib.suppress(AttributeError):
                ctypes.windll.kernel32.SetConsoleMode(ctypes.windll.kernel32.GetStdHandle(-11), self._saved_cm)

        def getkey(self):
            while True:
                z = msvcrt.getwch()
                if z == unichr(13):
                    return unichr(10)
                elif z is unichr(0) or z is unichr(0xe0):
                    with contextlib.suppress(KeyError):
                        code = msvcrt.getwch()
                        # The z value is somewhat context-dependent
                        # When running PowerShell in its own window,
                        # arrow keys return z as 0xe0, but when PowerShell
                        # is in a VsCode terminal, arrow keys give z as 0.
                        # with the same code value in either case.
                        # The solution is to duplicate the navcodes values
                        # in fncodes.
                        return self.fncodes[code] if z is unichr(0) else self.navcodes[code]
                else:
                    return z

        def cancel(self):
            # CancelIo, CancelSynchronousIo do not seem to work when using
            # getwch, so instead, send a key to the window with the console
            hwnd = ctypes.windll.kernel32.GetConsoleWindow()
            ctypes.windll.user32.PostMessageA(hwnd, 0x100, 0x0d, 0)

        def clear_screen(self):
            os.system('cls')

elif os.name == 'posix':
    import atexit
    import termios
    import fcntl

    class Console(ConsoleBase):
        def __init__(self):
            super().__init__()
            self.fd = sys.stdin.fileno()
            self.old = termios.tcgetattr(self.fd)
            atexit.register(self.cleanup)
            if sys.version_info < (3, 0):
                self.enc_stdin = codecs.getreader(sys.stdin.encoding)(sys.stdin)
            else:
                self.enc_stdin = sys.stdin

        def setup(self):
            new = termios.tcgetattr(self.fd)
            new[0] = new[0] & ~termios.IXON
            new[3] = new[3] & ~termios.ICANON & ~termios.ECHO & ~termios.ISIG
            new[6][termios.VMIN] = 1
            new[6][termios.VTIME] = 0
            termios.tcsetattr(self.fd, termios.TCSANOW, new)

        def getkey(self):
            c = self.enc_stdin.read(1)
            if c == unichr(0x7f):
                c = unichr(8)    # map the BS key (which yields DEL) to backspace
            return c

        def cancel(self):
            fcntl.ioctl(self.fd, termios.TIOCSTI, b'\0')

        def cleanup(self):
            termios.tcsetattr(self.fd, termios.TCSAFLUSH, self.old)

        def clear_screen(self):
            self.write('\x1b[2J')

else:
    raise NotImplementedError(
        'Sorry no implementation for your platform ({}) available.'.format(sys.platform))


# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

class Transform(object):
    """do-nothing: forward all data unchanged"""
    def rx(self, text):
        """text received from serial port"""
        return text

    def tx(self, text):
        """text to be sent to serial port"""
        return text

    def echo(self, text):
        """text to be sent but displayed on console"""
        return text


class CRLF(Transform):
    """ENTER sends CR+LF"""

    def tx(self, text):
        return text.replace('\n', '\r\n')


class CR(Transform):
    """ENTER sends CR"""

    def rx(self, text):
        return text.replace('\r', '\n')

    def tx(self, text):
        return text.replace('\n', '\r')


class LF(Transform):
    """ENTER sends LF"""


class NoTerminal(Transform):
    """remove typical terminal control codes from input"""

    REPLACEMENT_MAP = dict((x, 0x2400 + x) for x in range(32) if unichr(x) not in '\r\n\b\t')
    REPLACEMENT_MAP.update(
        {
            0x7F: 0x2421,  # DEL
            0x9B: 0x2425,  # CSI
        })

    def rx(self, text):
        return text.translate(self.REPLACEMENT_MAP)

    echo = rx


class NoControls(NoTerminal):
    """Remove all control codes, incl. CR+LF"""

    REPLACEMENT_MAP = dict((x, 0x2400 + x) for x in range(32))
    REPLACEMENT_MAP.update(
        {
            0x20: 0x2423,  # visual space
            0x7F: 0x2421,  # DEL
            0x9B: 0x2425,  # CSI
        })


class Printable(Transform):
    """Show decimal code for all non-ASCII characters and replace most control codes"""

    def rx(self, text):
        r = []
        for c in text:
            if ' ' <= c < '\x7f' or c in '\r\n\b\t':
                r.append(c)
            elif c < ' ':
                r.append(unichr(0x2400 + ord(c)))
            else:
                r.extend(unichr(0x2080 + ord(d) - 48) for d in '{:d}'.format(ord(c)))
                r.append(' ')
        return ''.join(r)

    echo = rx


gray = '\x1b[0;37;40m'
red = '\x1b[31m'
bright_green = '\x1b[92m'
bright_blue = '\x1b[94m'
bright_yellow = '\x1b[93m'
bright_red = '\x1b[91m'
bold_yellow = '\x1b[1;33;40m'
bold_cyan = '\x1b[1;36;40m'
bold_magenta = '\x1b[1;36;40m'
bold_white = '\x1b[1;37;40m'
class Colorize(Transform):
    """Apply different colors for received and echo"""

    def __init__(self):
        # XXX make it configurable, use colorama?
        self.input_color = gray
        self.echo_color = red

    def rx(self, text):
        return self.input_color + text

    def echo(self, text):
        return self.echo_color + text

collecting_input_line = False

class FluidNC(Transform):
    """Apply different colors for received and echo"""
    buffy = '' # buffer the rx chars until we get a full line to analyze and color

    def __init__(self):
        # XXX make it configurable, use colorama?
        self.input_color = gray
        self.echo_color = bright_blue
        self.good_color = bright_green
        self.warn_color = bright_yellow
        self.error_color = bright_red
        self.debug_color = bright_yellow
        self.white_color = bold_white
        self.purple_color = bold_magenta
        self.cyan_color = bold_cyan
        self.yellow_color = bold_yellow


    def rx(self, text):
        self.buffy = self.buffy + text.replace('\r','')
        retval = ''

        if '\n' not in self.buffy:
            return ''
        rx_lines = self.buffy.split('\n')

        if self.buffy[-1] in '\n': # is the last character is a new line
            #everything in the split is ready to be parsed
            for a_line in rx_lines:
                retval = retval + self.rx_color(a_line) + '\r\n'
            self.buffy = '' ## clear the buffer
            retval = retval[:-2] #remove extra line end
        else:
            #last in the split does not have a crlf
            for a_line in rx_lines:
                if a_line == rx_lines[-1]: # if last in array
                    self.buffy = rx_lines[-1]
                else:
                    retval = retval + self.rx_color(a_line) + '\r\n'

        return self.input_color + retval
        

    def echo(self, text):
        return self.cyan_color + text # no need to buffer RX right now

    def rx_color(self, text):        
        if len(text) == 0:
            return text
            
        if text[0] == '$': #colorize settings
            rx_lines = text.split('=')
            if len(rx_lines) == 2:
                rx_lines[0] = self.cyan_color + rx_lines[0] + self.white_color + '='
                rx_lines[1] = self.yellow_color + rx_lines[1] + self.input_color
                return rx_lines[0] + rx_lines[1]
            
        text = text.replace('MSG:ERR',  self.error_color + 'MSG:ERR' + self.input_color)
        text = text.replace('MSG:INFO',  self.good_color + 'MSG:INFO' + self.input_color)
        text = text.replace('MSG:WARN',  self.warn_color + 'MSG:WARN' + self.input_color)
        text = text.replace('MSG:DBG',  self.debug_color + 'MSG:DBG' + self.input_color)

        text = text.replace('<Alarm',  "<" + self.warn_color + 'Alarm' + self.input_color)
        text = text.replace('<Idle',  "<" + self.good_color + 'Idle' + self.input_color)
        text = text.replace('<Run',  "<" + self.good_color + 'Run' + self.input_color)

        text = text.replace('error:',  self.error_color + 'error:' + self.input_color)

        return text




class DebugIO(Transform):
    """Print what is sent and received"""

    def rx(self, text):
        sys.stderr.write(' [RX:{!r}] '.format(text))
        sys.stderr.flush()
        return text

    def tx(self, text):
        sys.stderr.write(' [TX:{!r}] '.format(text))
        sys.stderr.flush()
        return text


# other ideas:
# - add date/time for each newline
# - insert newline after: a) timeout b) packet end character

EOL_TRANSFORMATIONS = {
    'crlf': CRLF,
    'cr': CR,
    'lf': LF,
}

TRANSFORMATIONS = {
    'direct': Transform,    # no transformation
    'default': NoTerminal,
    'nocontrol': NoControls,
    'printable': Printable,
    'colorize': Colorize,
    'fluidNC': FluidNC,
    'debug': DebugIO,
}

# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
def ask_for_port():
    """\
    Show a list of ports and ask the user for a choice. To make selection
    easier on systems with long device names, also allow the input of an
    index.
    """
    ports = []
    port_info = []
    
    # Collect all COM ports
    for port, desc, hwid in sorted(comports()):
        ports.append(port)
        port_info.append((port, desc, hwid))
    
    # On Windows, ALWAYS try to find USB Serial devices (not just when no COM ports)
    usb_devices = []
    if sys.platform == 'win32':
        sys.stderr.write('\n--- Searching for USB devices...\n')
        try:
            # Try using WMI to find USB devices
            import subprocess
            result = subprocess.run(
                ['wmic', 'path', 'Win32_PnPEntity', 'where', 
                 "PNPClass='USB' or Name like '%serial%' or Name like '%UART%' or Name like '%JTAG%' or Name like '%USB%'", 
                 'get', 'Name,DeviceID', '/format:csv'], 
                capture_output=True, text=True
            )
            
            if result.returncode == 0:
                lines = result.stdout.strip().split('\n')[2:]  # Skip header lines
                for line in lines:
                    if line.strip():
                        parts = line.split(',', 2)
                        if len(parts) >= 3:
                            device_id = parts[1]
                            name = parts[2]
                            # Filter for relevant devices
                            if any(keyword in name.upper() for keyword in ['JTAG', 'SERIAL', 'UART', 'CDC', 'ACM']):
                                # Skip if it's already in our COM ports
                                if not any(device_id in str(hwid) for _, _, hwid in port_info):
                                    usb_devices.append((device_id, name))
                                    sys.stderr.write(f'--- Found USB device: {name}\n')
        except Exception as e:
            sys.stderr.write(f'--- Could not enumerate USB devices: {e}\n')
    
    # Display all found devices
    sys.stderr.write('\n--- Available ports:\n')
    all_devices = []
    
    # First list COM ports
    if port_info:
        sys.stderr.write('--- Standard COM Ports:\n')
        for n, (port, desc, hwid) in enumerate(port_info, 1):
            sys.stderr.write('--- {:2}: {:20} {!r}\n'.format(n, port, desc))
            sys.stderr.write('       Hardware ID: {}\n'.format(hwid))
            all_devices.append(('COM', port, desc, hwid))
    
    # Then list USB devices that aren't COM ports
    if usb_devices:
        sys.stderr.write('\n--- Other USB Devices (may require special handling):\n')
        start_index = len(port_info) + 1
        for n, (device_id, name) in enumerate(usb_devices, start_index):
            sys.stderr.write('--- {:2}: {}\n'.format(n, name))
            sys.stderr.write('       Device ID: {}\n'.format(device_id))
            all_devices.append(('USB', device_id, name, ''))
    
    if not all_devices:
        sys.stderr.write('--- No devices detected!\n')
    
    sys.stderr.write('\n--- Notes:\n')
    sys.stderr.write('--- - Enter the number for your selection\n')
    sys.stderr.write('--- - Or manually enter: COM1-COM256, \\\\.\\USBSER000, etc.\n\n')
    
    while True:
        port = raw_input('--- Enter port index, full name, or custom path: ')
        try:
            index = int(port) - 1
            if 0 <= index < len(all_devices):
                device_type, device_id, device_name, _ = all_devices[index]
                if device_type == 'COM':
                    return device_id  # Return the COM port directly
                else:
                    # For USB JTAG devices, we need to find the right connection string
                    sys.stderr.write('--- Selected: {}\n'.format(device_name))
                    
                    if 'JTAG' in device_name and '303A' in device_id and 'MI_02' in device_id:
                        sys.stderr.write('--- ESP32 USB-JTAG interface detected.\n')
                        
                        # Try to find all possible COM ports, including hidden ones
                        sys.stderr.write('--- Searching for associated COM port...\n')
                        
                        # Try higher COM port numbers that might not be enumerated
                        for com_num in range(1, 256):
                            com_name = f'COM{com_num}'
                            try:
                                import serial
                                test_port = serial.Serial(com_name, 9600, timeout=0.1)
                                test_port.close()
                                sys.stderr.write(f'--- Found accessible port: {com_name}\n')
                                
                                # Check if this might be our JTAG interface
                                # Sometimes Windows assigns high COM numbers to JTAG interfaces
                                if com_num > 10:  # JTAG interfaces often get high numbers
                                    use_this = raw_input(f'--- Try {com_name}? (Y/n): ')
                                    if use_this.lower() != 'n':
                                        return com_name
                            except:
                                pass
                        
                        # If no hidden COM port found, try alternative approaches
                        sys.stderr.write('\n--- Windows may require special configuration for USB-JTAG.\n')
                        sys.stderr.write('--- Options:\n')
                        sys.stderr.write('--- 4. Manually enter a device path\n')
                        
                        custom = raw_input('\n--- Enter custom path (or press Enter to go back): ')
                        if custom:
                            return custom
                    else:
                        # For other USB devices
                        custom = raw_input('--- Enter custom connection string (or press Enter to go back): ')
                        if custom:
                            return custom
                    continue
            else:
                sys.stderr.write('--- Invalid index!\n')
                continue
        except ValueError:
            # Not a number, treat as port name/path
            # This allows direct entry of paths like \\.\USBJTAG1
            pass
        return port

class Miniterm(object):
    """\
    Terminal application. Copy data from serial port to console and vice versa.
    Handle special keys from the console to show menu etc.
    """

    def __init__(self, serial_instance, echo=False, eol='lf', filters=()):
        self.rx_transformations = None
        self.tx_transformations = None
        self.console = Console()
        self.serial = serial_instance
        self.echo = False
        self.raw = False
        self.input_encoding = 'UTF-8'
        self.output_encoding = 'UTF-8'
        self.eol = eol
        self.filters = ['fluidNC']

        self.exit_character = unichr(0x1d)  # GS/CTRL+]
        self.exit_character2 = unichr(0x11)  # GS/CTRL+Q
        self.menu_character = unichr(0x14)  # Menu: CTRL+T
        self.alive = None
        self._reader_alive = None
        self.receiver_thread = None
        self.rx_decoder = None
        self.tx_decoder = None
        self._xmodem_stream = None
        self._pushback = None
        
        # FIX: Add streaming_mode flag to prevent reader/writer conflicts
        # This flag is used to pause the reader thread while streaming files
        self.streaming_mode = False

    def _start_reader(self):
        """Start reader thread"""
        self._reader_alive = True
        # start serial->console thread
        self.receiver_thread = threading.Thread(target=self.reader, name='rx')
        self.receiver_thread.daemon = True
        self.receiver_thread.start()

    def _stop_reader(self):
        """Stop reader thread only, wait for clean exit of thread"""
        self._reader_alive = False
        if hasattr(self.serial, 'cancel_read'):
            self.serial.cancel_read()
        self.receiver_thread.join()

    def start(self):
        """start worker threads"""
        self.alive = True
        self._start_reader()
        # enter console->serial loop
        self.transmitter_thread = threading.Thread(target=self.writer, name='tx')
        self.transmitter_thread.daemon = True
        self.transmitter_thread.start()
        self.console.setup()
        self.update_transformations()

    def stop(self):
        """set flag to stop worker threads"""
        self.alive = False

    def join(self, transmit_only=False):
        """wait for worker threads to terminate"""
        self.transmitter_thread.join()
        if not transmit_only:
            if hasattr(self.serial, 'cancel_read'):
                self.serial.cancel_read()
            self.receiver_thread.join()

    def close(self):
        self.serial.close()

    def update_transformations(self):
        """take list of transformation classes and instantiate them for rx and tx"""
        transformations = [EOL_TRANSFORMATIONS[self.eol]] + [TRANSFORMATIONS[f]
                                                             for f in self.filters]
        self.tx_transformations = [t() for t in transformations]
        self.rx_transformations = list(reversed(self.tx_transformations))

    def set_rx_encoding(self, encoding, errors='replace'):
        """set encoding for received data"""
        self.input_encoding = encoding
        self.rx_decoder = codecs.getincrementaldecoder(encoding)(errors)

    def set_tx_encoding(self, encoding, errors='replace'):
        """set encoding for transmitted data"""
        self.output_encoding = encoding
        self.tx_encoder = codecs.getincrementalencoder(encoding)(errors)

    def dump_port_settings(self):
        """Write current settings to sys.stderr"""
        sys.stderr.write("\n--- Settings: {p.name}  {p.baudrate},{p.bytesize},{p.parity},{p.stopbits}\n".format(
            p=self.serial))
        sys.stderr.write('--- RTS: {:8}  DTR: {:8}  BREAK: {:8}\n'.format(
            ('active' if self.serial.rts else 'inactive'),
            ('active' if self.serial.dtr else 'inactive'),
            ('active' if self.serial.break_condition else 'inactive')))
        with contextlib.suppress(serial.SerialException):
            sys.stderr.write('--- CTS: {:8}  DSR: {:8}  RI: {:8}  CD: {:8}\n'.format(
                ('active' if self.serial.cts else 'inactive'),
                ('active' if self.serial.dsr else 'inactive'),
                ('active' if self.serial.ri else 'inactive'),
                ('active' if self.serial.cd else 'inactive')))
        sys.stderr.write('--- software flow control: {}\n'.format('active' if self.serial.xonxoff else 'inactive'))
        sys.stderr.write('--- hardware flow control: {}\n'.format('active' if self.serial.rtscts else 'inactive'))
        sys.stderr.write('--- serial input encoding: {}\n'.format(self.input_encoding))
        sys.stderr.write('--- serial output encoding: {}\n'.format(self.output_encoding))
        sys.stderr.write('--- EOL: {}\n'.format(self.eol.upper()))
        sys.stderr.write('--- filters: {}\n'.format(' '.join(self.filters)))

    def reader(self):
        """loop and copy serial->console"""
        for _ in range(5):
            time.sleep(.1)
            self.console.write('.')
        self.console.write('\n')
        try:
            while self.alive and self._reader_alive:
                # FIX: Skip reading if in streaming mode to avoid conflicts
                # This prevents the reader from consuming serial data while
                # stream_file() is trying to read acknowledgments
                if self.streaming_mode:
                    time.sleep(0.1)
                    continue
                    
                # read all that is there or wait for one byte
                try:
                    data = self.serial.read(self.serial.in_waiting or 1)
                except:
                    print("Connection lost")
                    self.stop()
                    break
                if data:
                    if self._xmodem_stream:
                        self.console.write_fluid(data)
                        self.serial.timeout = 0.5
                        while True:
                            data1 = self.serial.read_until()
                            if len(data1):
                                self.console.write_fluid(data1)
                            else:
                                break

                        modem = XMODEM(self.getc, self.putc, mode='xmodem')
                        if not modem.send(self._xmodem_stream, callback=self.progress):
                            self.console.write("XModem reception cancelled\n")
                        modem = None
                        self._xmodem_stream = None
                    elif self.raw or collecting_input_line:
                        self.console.write_fluid(data)
                    else:
                        text = self.rx_decoder.decode(data)
                        for transformation in self.rx_transformations:
                            text = transformation.rx(text)
                        self.console.write(text)
        except serial.SerialException:
            self.alive = False
            self.console.cancel()
            raise       # XXX handle instead of re-raise?

    def writer(self):
        """\
        Loop and copy console->serial until self.exit_character character is
        found. When self.menu_character is found, interpret the next key
        locally.
        """
        menu_active = False

        # Sending an editing command triggers FluidNC interactive mode
        # Right Arrow is an innocuous one
        # If you restart FluidNC with $bye or the reset switch, you
        # will have to trigger interactive mode manually
        time.sleep(2) # Time for FluidNC to be ready for input
        self.enable_fluid_echo()

        try:
            while self.alive:
                try:
                    data = self.console.getkey()
                except:
                    data = self.exit_character  # Map ^C to exit
                for c in data:
                    if not self.alive:
                        break
                    if c == '\x17':     # CTRL+W -> clear screen
                        self.console.clear_screen()
                    if c == '\x15':     # CTRL+U -> upload file with XModem
                        self.upload_xmodem()
                    elif c == '\x13':   # CTRL+S -> stream file line by line
                        self.stream_file()
                    elif c == '\x12':   # CTRL+R -> reset FluidNC
                        self.reset_fluidnc()
                    elif c in [self.exit_character, self.exit_character2, unichr(3)]:
                        self.stop()             # exit app
                        break
                    else:
                        global collecting_input_line
                        collecting_input_line = c != '\n'
                        self.serial.write(self.tx_encoder.encode(c))
                        if self.echo:
                            echo_text = c
                            for transformation in self.tx_transformations:
                                echo_text = transformation.echo(echo_text)
                            self.console.write(echo_text)
        except:
            self.alive = False
            raise
        self.disable_fluid_echo()

    def handle_menu_key(self, c):
        """Implement a simple menu / settings"""
        if c in [self.menu_character, self.exit_character, self.exit_character2]:
            # Menu/exit character again -> send itself
            self.serial.write(self.tx_encoder.encode(c))
            if self.echo:
                self.console.write(c)
        elif c == '\x18':                       # CTRL+X -> upload xmodem
            self.upload_xmodem()
        elif c == '\x15':                       # CTRL+U -> upload file
            self.upload_file()
        elif c in '\x08hH?':                    # CTRL+H, h, H, ? -> Show help

            sys.stderr.write(self.get_help_text())
        elif c == '\x12':                   # CTRL+R -> Toggle RTS
            self.serial.rts = not self.serial.rts
            sys.stderr.write(
                f"--- RTS {'active' if self.serial.rts else 'inactive'} ---\n"
            )
        elif c == '\x04':                   # CTRL+D -> Toggle DTR
            self.serial.dtr = not self.serial.dtr
            sys.stderr.write(
                f"--- DTR {'active' if self.serial.dtr else 'inactive'} ---\n"
            )
        elif c == '\x02':                   # CTRL+B -> toggle BREAK condition
            self.serial.break_condition = not self.serial.break_condition
            sys.stderr.write(
                f"--- BREAK {'active' if self.serial.break_condition else 'inactive'} ---\n"
            )
        elif c == '\x05':                   # CTRL+E -> toggle local echo
            self.echo = not self.echo
            sys.stderr.write(
                f"--- local echo {'active' if self.echo else 'inactive'} ---\n"
            )
        elif c == '\x06':                       # CTRL+F -> edit filters
            self.change_filter()
        elif c == '\x0c':                   # CTRL+L -> EOL mode
            self.eol_mode()
        elif c == '\x01':                       # CTRL+A -> set encoding
            self.change_encoding()
        elif c == '\x09':                       # CTRL+I -> info
            self.dump_port_settings()
        elif c in 'pP':                         # P -> change port
            self.change_port()
        elif c in 'zZ':                         # S -> suspend / open port temporarily
            self.suspend_port()
        elif c in 'bB':                         # B -> change baudrate
            self.change_baudrate()
        elif c == '8':                          # 8 -> change to 8 bits
            self.serial.bytesize = serial.EIGHTBITS
            self.dump_port_settings()
        elif c == '7':                          # 7 -> change to 8 bits
            self.serial.bytesize = serial.SEVENBITS
            self.dump_port_settings()
        elif c in 'eE':                         # E -> change to even parity
            self.serial.parity = serial.PARITY_EVEN
            self.dump_port_settings()
        elif c in 'oO':                         # O -> change to odd parity
            self.serial.parity = serial.PARITY_ODD
            self.dump_port_settings()
        elif c in 'mM':                         # M -> change to mark parity
            self.serial.parity = serial.PARITY_MARK
            self.dump_port_settings()
        elif c in 'sS':                         # S -> change to space parity
            self.serial.parity = serial.PARITY_SPACE
            self.dump_port_settings()
        elif c in 'nN':                         # N -> change to no parity
            self.serial.parity = serial.PARITY_NONE
            self.dump_port_settings()
        elif c == '1':                          # 1 -> change to 1 stop bits
            self.serial.stopbits = serial.STOPBITS_ONE
            self.dump_port_settings()
        elif c == '2':                          # 2 -> change to 2 stop bits
            self.serial.stopbits = serial.STOPBITS_TWO
            self.dump_port_settings()
        elif c == '3':                          # 3 -> change to 1.5 stop bits
            self.serial.stopbits = serial.STOPBITS_ONE_POINT_FIVE
            self.dump_port_settings()
        elif c in 'xX':                         # X -> change software flow control
            self.serial.xonxoff = (c == 'X')
            self.dump_port_settings()
        elif c in 'rR':                         # R -> change hardware flow control
            self.serial.rtscts = (c == 'R')
            self.dump_port_settings()
        elif c in 'qQ':
            self.stop()                         # Q -> exit app
        else:
            sys.stderr.write(f'--- unknown menu character {key_description(c)} --\n')

    def eol_mode(self):
        """change the i/o transformations"""
        modes = list(EOL_TRANSFORMATIONS)   # keys
        eol = modes.index(self.eol) + 1
        if eol >= len(modes):
            eol = 0
        self.eol = modes[eol]
        sys.stderr.write(f'--- EOL: {self.eol.upper()} ---\n')
        self.update_transformations()
            
    # Support functions for XModem file upload
    def getc(self, length, timeout=1):
        if self._pushback:
            gdata = self._pushback
            self._pushback = None
            return gdata
        # try:
        #    gdata = q.get(timeout=timeout)
        # except:
        #    gdata = None
        self.serial.timeout = timeout
        gdata = self.serial.read(length)
        return gdata or None

    def flush_getc(self, limit):
        # while q.qsize() > limit:
        #    dummy = q.get()
        self.serial.timeout = 0.01
        while True:
            gdata = self.serial.read(1)
            if not len(gdata):
                break

    def putc(self, data, timeout=1):
        pbytes = self.serial.write(data)
        # print(f'write {pbytes}')
        return pbytes or None

    def progress(self, packets, good, bad):
        print(packets, end='\r')

    if platform.system() == 'Darwin':
        def mac_askstring(self, initial):
            ascript = '''
            -- iname - default file name
            on run argv
                set iname to item 1 of argv
                try
                    set theResponse to display dialog "Destination name" default answer iname with icon note buttons {"Cancel", "Continue"} default button "Continue"
                   return text returned of theResponse as text
                on error number -128
                    return "" as text
                end try
            end run
            '''
            try:
               proc = subprocess.check_output(['osascript', '-e', ascript, initial])
               return proc.decode('utf-8').strip()
            except subprocess.CalledProcessError as e:
                print('Python error: [%d]\n' % e.returncode)

        def mac_file_dialog(self, initial):
            ascript = '''
            -- apath - default path for dialogs to open to
            on run argv
                set apath to POSIX file (item 1 of argv)
                try
                    set fpath to POSIX path of (choose file with prompt "File to Upload" without invisibles)
                    return fpath as text
                on error number -128
                    return "" as text
                end try
            end run
            '''
            try:
               proc = subprocess.check_output(['osascript', '-e', ascript, initial])
               return proc.decode('utf-8').strip()
            except subprocess.CalledProcessError as e:
                print('Python error: [%d]\n' % e.returncode)

    def file_dialog(self, initial):
        if platform.system() == 'Darwin':
            # pathname = raw_input('--- Enter file name to send: ')
            pathname = self.mac_file_dialog(initial)
            print(pathname)
            destname = self.mac_askstring(os.path.split(pathname)[1])
            return pathname, destname
        else:
            try:
                window = Tk()
            except:
                pathname = raw_input("Local file to send: ")
                destname = raw_input("File on FluidNC: ")
                return pathname, destname
            else:
                pathname = filedialog.askopenfilename(title="File to Upload", initialfile=initial, filetypes=[("FluidNC Config", "*.yaml *.flnc *.txt"), ("All files", "*")])
                print("path",pathname)
                destname = simpledialog.askstring("Uploader", "Destination Filename", initialvalue=os.path.split(pathname)[1])
                window.destroy()
                return pathname, destname

    def enable_fluid_echo(self):
        right_arrow = '\x1b[C'
        self.serial.write(self.tx_encoder.encode(right_arrow))

    def disable_fluid_echo(self):
        ctrl_l = '\x0c'
        self.serial.write(self.tx_encoder.encode(ctrl_l))

    def reset_fluidnc(self):
        """Pulse the reset line for FluidNC"""
        self.console.write("Resetting MCU\n")
        self.serial.rts = True
        self.serial.dtr = False
        time.sleep(1)
        self.serial.rts = False
        time.sleep(1)
        self.enable_fluid_echo()

    def stream_file(self):
        """Stream a gcode/text file line by line to FluidNC"""
        with self.console:
            (filename, _) = self.file_dialog("program.gcode")
            if not filename:
                return
                
            try:
                # FIX: Set streaming mode to pause the reader thread
                # This prevents the reader from consuming serial data that
                # stream_file needs to read for acknowledgments
                self.streaming_mode = True
                time.sleep(0.1)  # Give reader time to pause
                
                with open(filename, 'r') as f:
                    self.console.write(f'--- Streaming file {filename} ---\n')
                    
                    # Save original timeout and set new one for streaming
                    original_timeout = self.serial.timeout
                    self.serial.timeout = 0.1  # Short timeout for non-blocking reads
                    
                    line_count = 0
                    error_count = 0
                    lines_skipped = 0
                    
                    # FIX: Buffer for accumulating partial responses
                    # FluidNC may send multiple lines (debug messages, status reports)
                    # before sending the "ok" acknowledgment
                    response_buffer = ""
                    
                    # FIX: Clear any pending data in the serial buffer
                    # This ensures we don't read old data from previous commands
                    self.serial.reset_input_buffer()
                    
                    # Use FluidNC's streaming protocol
                    # Each line is sent, then we wait for an 'ok' or 'error' response
                    for line in f:
                        original_line = line
                        # Skip empty lines and comments
                        line = line.strip()
                        if not line or line.startswith(';') or line.startswith('('):
                            lines_skipped += 1
                            continue
                            
                        # Remove inline comments
                        if ';' in line:
                            line = line[:line.find(';')].strip()
                        
                        # Remove ALL comments in parentheses (handles multiple comment blocks)
                        while '(' in line and ')' in line:
                            start = line.find('(')
                            end = line.find(')', start)
                            if start < end:  # Ensure we have a valid comment block
                                line = line[:start] + line[end+1:]
                                line = line.strip()
                            else:
                                break  # Prevent infinite loop if parentheses are malformed
                        
                        if not line:
                            lines_skipped += 1
                            continue
                        
                        # Skip M0 commands - as specifically requested
                        if line.upper() == 'M0' or line.upper().startswith('M0 '):
                            self.console.write(f'Skipping M0 command: {original_line.strip()}\n')
                            lines_skipped += 1
                            continue
                            
                        # Send the line with a newline
                        line_to_send = line + '\n'
                        self.serial.write(self.tx_encoder.encode(line_to_send))
                        
                        # Wait for acknowledgment (ok or error)
                        acknowledged = False
                        wait_time = 0
                        max_wait_time = 5.0  # 5 seconds maximum
                        
                        while not acknowledged and wait_time < max_wait_time:
                            # Try to read available data
                            bytes_to_read = self.serial.in_waiting
                            if bytes_to_read > 0:
                                data = self.serial.read(bytes_to_read)
                                if data:
                                    try:
                                        decoded = data.decode(self.output_encoding, errors='replace')
                                        response_buffer += decoded
                                        
                                        # FIX: Process complete lines in the buffer
                                        # We look for newline characters to identify complete lines
                                        while '\n' in response_buffer:
                                            line_end = response_buffer.find('\n')
                                            complete_line = response_buffer[:line_end].strip()
                                            response_buffer = response_buffer[line_end + 1:]
                                            
                                            # Process the complete line
                                            if complete_line:
                                                # FIX: Check for acknowledgment
                                                # "ok" must be on its own line, not part of another message
                                                if complete_line == 'ok':
                                                    acknowledged = True
                                                    break
                                                elif complete_line.startswith('error:') or complete_line.startswith('ALARM:'):
                                                    acknowledged = True
                                                    error_count += 1
                                                    self.console.write(f'\nError at line {line_count+1}: {line}\n')
                                                    self.console.write(f'Response: {complete_line}\n')
                                                    break
                                                else:
                                                    # FIX: Other messages (debug, status, etc.)
                                                    # Only display certain types to avoid clutter
                                                    # Don't display status reports (<Idle|MPos:...>)
                                                    # as they create too much noise
                                                    if (complete_line.startswith('MSG:') or 
                                                        complete_line.startswith('[') or
                                                        complete_line.startswith('$') or
                                                        'error' in complete_line.lower() or
                                                        'alarm' in complete_line.lower()):
                                                        # Apply colorization to these messages
                                                        colored_line = complete_line
                                                        for transformation in self.rx_transformations:
                                                            colored_line = transformation.rx(colored_line)
                                                        if colored_line:  # Only print if transformation didn't filter it
                                                            self.console.write('\n' + colored_line)
                                                    # Status reports and other noise are silently consumed
                                                    
                                    except Exception as e:
                                        self.console.write(f'Decode error: {e}\n')
                            else:
                                # No data available, wait a bit
                                time.sleep(0.01)  # 10ms
                                wait_time += 0.01
                        
                        if not acknowledged:
                            self.console.write(f'\nTimeout waiting for response to: {line}')
                            if response_buffer.strip():
                                self.console.write(f' (partial: {response_buffer.strip()})')
                            self.console.write('\n')
                            error_count += 1
                            # Clear the buffer to avoid confusion with next command
                            response_buffer = ""
                        
                        line_count += 1
                        
                        # Provide some feedback on progress every 10 lines
                        if line_count % 10 == 0:
                            self.console.write(f'Sent {line_count} lines\r')
                    
                    # Restore original timeout
                    self.serial.timeout = original_timeout
                    
                    # Final status message
                    self.console.write(f'\n--- Streaming complete: {line_count} lines sent, {lines_skipped} lines skipped, {error_count} errors ---\n')
                    
            except IOError as e:
                sys.stderr.write(f'--- ERROR opening/reading file {filename}: {e} ---\n')
            except Exception as e:
                sys.stderr.write(f'--- ERROR during streaming: {e} ---\n')
            finally:
                # FIX: Always clear streaming mode to re-enable reader
                # This ensures the reader thread resumes even if an error occurs
                self.streaming_mode = False

    def upload_xmodem(self):
        """Ask user for filename and send its contents"""
        with self.console:
            (filename, destname) = self.file_dialog("config.flnc")
            if filename:
                try:
                    self._xmodem_stream = open(filename, 'rb')
                    #show what is happening in the console.
                    self.console.write(f'--- Sending file {filename} as {destname} ---\n')
                    #send the command to put FluidNC in receive mode
                    self.serial.write(self.tx_encoder.encode(f'$Xmodem/Receive={destname}\n'))
                except IOError as e:
                    sys.stderr.write(f'--- ERROR opening file {filename}: {e} ---\n')
        # self._uploading = False

    def upload_file(self, name="config.flnc"):
        """Ask user for filename and send its contents"""
        sys.stderr.write('\n--- File to upload: ')
        sys.stderr.flush()
        with self.console:
            filename = sys.stdin.readline().rstrip('\r\n')
            if filename:
                try:
                    with open(filename, 'rb') as f:
                        sys.stderr.write(f'--- Sending file {filename} ---\n')
                        while True:
                            block = f.read(1024)
                            if not block:
                                break
                            self.serial.write(block)
                            # Wait for output buffer to drain.
                            self.serial.flush()
                            sys.stderr.write('.')   # Progress indicator.
                    sys.stderr.write(f'\n--- File {filename} sent ---\n')
                except IOError as e:
                    sys.stderr.write(f'--- ERROR opening file {filename}: {e} ---\n')
        # self._uploading = False

    def change_filter(self):
        """change the i/o transformations"""
        sys.stderr.write('\n--- Available Filters:\n')
        sys.stderr.write('\n'.join(
            '---   {:<10} = {.__doc__}'.format(k, v)
            for k, v in sorted(TRANSFORMATIONS.items())))
        sys.stderr.write(
            f"\n--- Enter new filter name(s) [{' '.join(self.filters)}]: "
        )
        with self.console:
            new_filters = sys.stdin.readline().lower().split()
        if new_filters:
            for f in new_filters:
                if f not in TRANSFORMATIONS:
                    sys.stderr.write('--- unknown filter: {!r}\n'.format(f))
                    break
            else:
                self.filters = new_filters
                self.update_transformations()
        sys.stderr.write(f"--- filters: {' '.join(self.filters)}\n")

    def change_encoding(self):
        """change encoding on the serial port"""
        sys.stderr.write(f'\n--- Enter new encoding name [{self.input_encoding}]: ')
        with self.console:
            new_encoding = sys.stdin.readline().strip()
        if new_encoding:
            try:
                codecs.lookup(new_encoding)
            except LookupError:
                sys.stderr.write(f'--- invalid encoding name: {new_encoding}\n')
            else:
                self.set_rx_encoding(new_encoding)
                self.set_tx_encoding(new_encoding)
        sys.stderr.write(f'--- serial input encoding: {self.input_encoding}\n')
        sys.stderr.write(f'--- serial output encoding: {self.output_encoding}\n')

    def change_baudrate(self):
        """change the baudrate"""
        sys.stderr.write('\n--- Baudrate: ')
        sys.stderr.flush()
        with self.console:
            backup = self.serial.baudrate
            try:
                self.serial.baudrate = int(sys.stdin.readline().strip())
            except ValueError as e:
                sys.stderr.write(f'--- ERROR setting baudrate: {e} ---\n')
                self.serial.baudrate = backup
            else:
                self.dump_port_settings()

    def change_port(self):
        """Have a conversation with the user to change the serial port"""
        with self.console:
            try:
                port = ask_for_port()
            except KeyboardInterrupt:
                port = None
        if port and port != self.serial.port:
            # reader thread needs to be shut down
            self._stop_reader()
            # save settings
            settings = self.serial.getSettingsDict()
            try:
                new_serial = serial.serial_for_url(port, do_not_open=True)
                # restore settings and open
                new_serial.applySettingsDict(settings)
                new_serial.rts = self.serial.rts
                new_serial.dtr = self.serial.dtr
                new_serial.open()
                new_serial.break_condition = self.serial.break_condition
            except Exception as e:
                sys.stderr.write('--- ERROR opening new port: {} ---\n'.format(e))
                new_serial.close()
            else:
                self.serial.close()
                self.serial = new_serial
                sys.stderr.write('--- Port changed to: {} ---\n'.format(self.serial.port))
            # and restart the reader thread
            self._start_reader()

    def suspend_port(self):
        """\
        open port temporarily, allow reconnect, exit and port change to get
        out of the loop
        """
        # reader thread needs to be shut down
        self._stop_reader()
        self.serial.close()
        sys.stderr.write('\n--- Port closed: {} ---\n'.format(self.serial.port))
        do_change_port = False
        while not self.serial.is_open:
            sys.stderr.write('--- Quit: {} or {} | p: port change | any other key to reconnect ---\n'.format(
                key_description(self.exit_character),
                key_description(self.exit_character2)))
            k = self.console.getkey()
            if k == self.exit_character or k == self.exit_character2:
                self.stop()             # exit app
                break
            elif k in 'pP':
                do_change_port = True
                break
            try:
                self.serial.open()
            except Exception as e:
                sys.stderr.write('--- ERROR opening port: {} ---\n'.format(e))
        if do_change_port:
            self.change_port()
        else:
            # and restart the reader thread
            self._start_reader()
            sys.stderr.write('--- Port opened: {} ---\n'.format(self.serial.port))

    def get_help_text(self):
        """return the help text"""
        # help text, starts with blank line!
        return """
--- pySerial ({version}) - Fluidterm 1.1 (miniterm) - help
---
--- {exit:8} Exit program (alias {menu} Q)
--- {menu:8} Menu escape key, followed by:
--- Menu keys:
---    {menu:7} Send the menu character itself to remote
---    {exit:7} Send the exit character itself to remote
---    {info:7} Show info
---    {upload:7} Upload file (prompt will be shown)
---    {xmodem:7} Upload file via XMODEM (prompt will be shown)
---    {repr:7} encoding
---    {filter:7} edit filters
--- Toggles:
---    {rts:7} RTS   {dtr:7} DTR   {brk:7} BREAK
---    {echo:7} echo  {eol:7} EOL
---
--- Port settings ({menu} followed by the following):
---    p          change port
---    7 8        set data bits
---    N E O S M  change parity (None, Even, Odd, Space, Mark)
---    1 2 3      set stop bits (1, 2, 1.5)
---    b          change baud rate
---    x X        disable/enable software flow control
---    r R        disable/enable hardware flow control
""".format(version=getattr(serial, 'VERSION', 'unknown version'),
           exit=key_description(self.exit_character),
           exit2=key_description(self.exit_character2),
           menu=key_description(self.menu_character),
           rts=key_description('\x12'),
           dtr=key_description('\x04'),
           brk=key_description('\x02'),
           echo=key_description('\x05'),
           info=key_description('\x09'),
           upload=key_description('\x15'),
           xmodem=key_description('\x18'),
           repr=key_description('\x01'),
           filter=key_description('\x06'),
           eol=key_description('\x0c'))


# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
# default args can be used to override when calling main() from an other script
# e.g to create a miniterm-my-device.py
def main(default_port=None, default_baudrate=115200, default_rts=None, default_dtr=None, serial_instance=None):
    """Command line tool, entry point"""

    import argparse

    parser = argparse.ArgumentParser(
        description='Fluidterm (Miniterm) - A simple terminal program for the serial port.')

    parser.add_argument(
        'port',
        nargs='?',
        help='serial port name ("-" to show port list)',
        default=default_port)

    parser.add_argument(
        'baudrate',
        nargs='?',
        type=int,
        help='set baud rate, default: %(default)s',
        default=default_baudrate)

    group = parser.add_argument_group('port settings')

    group.add_argument(
        '--parity',
        choices=['N', 'E', 'O', 'S', 'M'],
        type=lambda c: c.upper(),
        help='set parity, one of {N E O S M}, default: N',
        default='N')

    group.add_argument(
        '--rtscts',
        action='store_true',
        help='enable RTS/CTS flow control (default off)',
        default=False)

    group.add_argument(
        '--xonxoff',
        action='store_true',
        help='enable software flow control (default off)',
        default=False)

    group.add_argument(
        '--rts',
        type=int,
        help='set initial RTS line state (possible values: 0, 1)',
        default=default_rts)

    group.add_argument(
        '--dtr',
        type=int,
        help='set initial DTR line state (possible values: 0, 1)',
        default=default_dtr)

    group.add_argument(
        '--non-exclusive',
        dest='exclusive',
        action='store_false',
        help='disable locking for native ports',
        default=True)

    group.add_argument(
        '--ask',
        action='store_true',
        help='ask again for port when open fails',
        default=False)

    group = parser.add_argument_group('data handling')

    group.add_argument(
        '-e', '--echo',
        action='store_true',
        help='enable local echo (default off)',
        default=True)

    group.add_argument(
        '--encoding',
        dest='serial_port_encoding',
        metavar='CODEC',
        help='set the encoding for the serial port (e.g. hexlify, Latin1, UTF-8), default: %(default)s',
        default='UTF-8')

    group.add_argument(
        '-f', '--filter',
        action='append',
        metavar='NAME',
        help='add text transformation',
        default=[])

    group.add_argument(
        '--eol',
        choices=['CR', 'LF', 'CRLF'],
        type=lambda c: c.upper(),
        help='end of line mode',
        default='LF')

    group.add_argument(
        '--raw',
        action='store_true',
        help='Do no apply any encodings/transformations',
        default=False)

    group = parser.add_argument_group('hotkeys')

    group.add_argument(
        '--exit-char',
        type=int,
        metavar='NUM',
        help='Unicode of special character that is used to exit the application, default: %(default)s',
        default=0x1d)  # GS/CTRL+]

    group.add_argument(
        '--menu-char',
        type=int,
        metavar='NUM',
        help='Unicode code of special character that is used to control Fluidterm (menu), default: %(default)s',
        default=0x14)  # Menu: CTRL+T

    group = parser.add_argument_group('diagnostics')

    group.add_argument(
        '-q', '--quiet',
        action='store_true',
        help='suppress non-error messages',
        default=False)

    group.add_argument(
        '--develop',
        action='store_true',
        help='show Python traceback on error',
        default=False)

    args = parser.parse_args()

    if args.menu_char == args.exit_char:
        parser.error('--exit-char can not be the same as --menu-char')

    if args.filter:
        if 'help' in args.filter:
            sys.stderr.write('Available filters:\n')
            sys.stderr.write('\n'.join(
                '{:<10} = {.__doc__}'.format(k, v)
                for k, v in sorted(TRANSFORMATIONS.items())))
            sys.stderr.write('\n')
            sys.exit(1)
        filters = args.filter
    else:
        filters = ['default']

    while serial_instance is None:
        # no port given on command line -> ask user now
        if args.port is None or args.port == '-':
            try:
                args.port = ask_for_port()
            except KeyboardInterrupt:
                sys.stderr.write('\n')
                parser.error('user aborted and port is not given')
            else:
                if not args.port:
                    parser.error('port is not given')
        try:
            serial_instance = serial.serial_for_url(
                args.port,
                args.baudrate,
                parity=args.parity,
                rtscts=args.rtscts,
                xonxoff=args.xonxoff,
                do_not_open=True)

            if not hasattr(serial_instance, 'cancel_read'):
                # enable timeout for alive flag polling if cancel_read is not available
                serial_instance.timeout = 1

            if args.dtr is not None:
                if not args.quiet:
                    sys.stderr.write('--- forcing DTR {}\n'.format('active' if args.dtr else 'inactive'))
                serial_instance.dtr = args.dtr
            if args.rts is not None:
                if not args.quiet:
                    sys.stderr.write('--- forcing RTS {}\n'.format('active' if args.rts else 'inactive'))
                serial_instance.rts = args.rts

            if isinstance(serial_instance, serial.Serial):
                serial_instance.exclusive = args.exclusive

            serial_instance.open()
        except serial.SerialException as e:
            sys.stderr.write('could not open port {!r}: {}\n'.format(args.port, e))
            if args.develop:
                raise
            if not args.ask:
                sys.exit(1)
            else:
                args.port = '-'
        else:
            break

    miniterm = Miniterm(
        serial_instance,
        echo=args.echo,
        eol=args.eol.lower(),
        filters=filters)
    miniterm.exit_character = unichr(args.exit_char)
    miniterm.menu_character = unichr(args.menu_char)
    miniterm.raw = args.raw
    miniterm.set_rx_encoding(args.serial_port_encoding)
    miniterm.set_tx_encoding(args.serial_port_encoding)

    if not args.quiet:
        sys.stderr.write('--- FluidTerm ' + VERSION + ' on {p.name}  {p.baudrate},{p.bytesize},{p.parity},{p.stopbits} ---\n'.format(
            p=miniterm.serial))
        sys.stderr.write('--- Quit: {} or {} | Upload: {} | Stream: {} | Reset: {} | ClearScreen: Ctrl+W ---\n'.format(
            key_description(miniterm.exit_character),
            key_description(miniterm.exit_character2),
            key_description('\x15'),
            key_description('\x13'),
            key_description('\x12')))

    miniterm.start()
    with contextlib.suppress(KeyboardInterrupt):
        miniterm.join(True)
    if not args.quiet:
        sys.stderr.write('\n--- exit ---\n')
    miniterm.join()
    miniterm.close()

# - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
if __name__ == '__main__':
    main()