#!/usr/bin/python
import sys
import time
import os
import serial

# answer to <ESC>.O Output Extended Status Information [Manual: 10-42]
EXT_STATUS_BUF_EMPTY = 0x08  # buffer empty
EXT_STATUS_VIEW = 0x10  # "view" button has been pressed, plotting suspended
EXT_STATUS_LEVER = 0x20  # paper lever raised, potting suspended

ERRORS = {
    # our own code
    -1: 'Timeout',
    -2: 'Parse error of decimal return from plotter',
    # from the manual
    0: 'no error',
    10: 'overlapping output instructions',
    11: 'invalid byte after <ESC>.',
    12: 'invalid byte while parsing device control instruction',
    13: 'parameter out of range',
    14: 'too many parameters received',
    15: 'framing error, parity error or overrun',
    16: 'input buffer has overflowed'
}


class HPGLError(Exception):
    def __init__(self, n, cause=None):
        self.errcode = n
        if cause:
            self.causes = [cause]
        else:
            self.causes = []

    def add_cause(self, cause):
        self.causes.append(cause)

    def __repr__(self):
        if type(self.errcode) is str:
            errstr = self.errcode
        else:
            errstr = f'Error {self.errcode}: {ERRORS.get(self.errcode)}'

        if self.causes:
            cstr = ', '.join(self.causes)
            return f'HPGLError: {errstr}, caused by {cstr}'
        return f'HPGLError: {errstr}'

    def __str__(self):
        return repr(self)


# read decimal number, followed by carriage return from plotter
def read_answer(tty):
    buf = bytearray()
    while True:
        c = tty.read(1)
        if not c:  # timeout
            raise HPGLError(-1)  # timeout
        if c == b'\r':
            break
        buf += c
    try:
        return int(buf)
    except ValueError as e:
        print(repr(e))
        raise HPGLError(-2)


def chk_error(tty):
    tty.write(b'\033.E')
    ret = None
    try:
        ret = read_answer(tty)
    except HPGLError as e:
        e.add_cause('ESC.E (Output extended error code).')
        raise e
    if ret:
        raise HPGLError(ret)


def plotter_cmd(tty, cmd, get_answer=False):
    tty.write(cmd)
    try:
        if get_answer:
            answ = read_answer(tty)
        chk_error(tty)
        if get_answer:
            return answ
    except HPGLError as e:
        e.add_cause(f'after sending {repr(cmd)[1:]}')
        raise e


def main():
    import argparse

    parser = argparse.ArgumentParser()
    parser.add_argument('-p', '--port', type=str, default='/dev/ttyS0',
                        metavar='TTY', help='Serial port (default: /dev/ttyS0)')
    parser.add_argument('-b', '--baud', type=int, default=9600,
                        metavar='N', help='Baudrate (default: 9600)')

    parser.add_argument('hpglfile')

    args = parser.parse_args()

    input_bytes = None
    try:
        ss = os.stat(args.hpglfile)
        if ss.st_size != 0:
            input_bytes = ss.st_size
    except Exception as e:
        print('Error stat\'ing file', args.hpglfile, str(e))

    hpgl = open(args.hpglfile, 'rb')

    tty = serial.Serial(args.port, args.baud, timeout=2.0)

    # <ESC>.@<dec>;<dec>:
    #  1st parameter is buffer size 0..1024, optional
    #  2nd parameter is bit flags for operation mode
    #     0x01 : enable HW handhaking
    #     0x02 : ignored
    #     0x04 : monitor mode 1 if set, mode 0 if unset (for terminal)
    #     0x08 : 0: disable monitor mode, 1: enable monitor mode
    #     0x10 : 0: normal mode, 1: block mode
    try:
        plotter_cmd(tty, b'\033.@;0:')  # Plotter Configuration [Manual 10-27]
        plotter_cmd(tty, b'\033.Y')  # Plotter On [Manual 10-26]
        plotter_cmd(tty, b'\033.K')  # abort graphics
        plotter_cmd(tty, b'IN;')  # HPGL initialize
#        plotter_cmd(tty, b'\033.0')  # raise error
        # Output Buffer Size [Manual 10-36]
        bufsz = plotter_cmd(tty, b'\033.L', True)
    except HPGLError as e:
        print('*** Error initializing the plotter!')
        print(e)
        sys.exit(1)

    print('Buffer size of plotter is', bufsz, 'bytes.')

    total_bytes_written = 0

    while True:
        status = plotter_cmd(tty, b'\033.O', True)
        if (status & (EXT_STATUS_VIEW | EXT_STATUS_LEVER)):
            print('*** Printer is viewing plot, pausing data.')
            time.sleep(5.0)
            continue

        bufsz = plotter_cmd(tty, b'\033.B', True)
        if bufsz < 192:
            print(f'Only {bufsz} bytes free. :-(', end='\r')
            sys.stdout.flush()
            time.sleep(0.25)
            continue

        data = hpgl.read(bufsz - 128)
        bufsz_read = len(data)

        if bufsz_read == 0:
            print('*** EOF reached, exiting.')
            break

        if input_bytes != None:
            percent = 100.0 * total_bytes_written/input_bytes
            print(
                f'{percent:.2f}%, {total_bytes_written} byte written. Adding {bufsz_read} ({bufsz} free).')
        else:
            print(
                f'{total_bytes_written} byte written. Adding {bufsz_read} ({bufsz} free).')
        tty.write(data)
        total_bytes_written += bufsz_read


if __name__ == '__main__':
    main()
