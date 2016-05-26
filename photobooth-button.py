# https://learn.sparkfun.com/tutorials/raspberry-gpio/python-rpigpio-api

import uinput
import time
import sys
import signal
import RPi.GPIO as GPIO
GPIO.setmode(GPIO.BCM)

# FUNCTIONS
def need_to_pulse(start, max):
  if ((time.time() - start) > max):
    return True
  else:
    return False

# catch the 'kill <process>' (SIGTERM) signal
def signal_term_handler(signal, frame):
  GPIO.cleanup()
  sys.exit(0)
signal.signal(signal.SIGTERM, signal_term_handler)


# SETUP
buttonPin	= 21
LED		= 20
led_status	= GPIO.HIGH
led_pulse_secs	= 0.5
prev_input	= 0
pulse_start	= time.time()
GPIO.setup(buttonPin, GPIO.IN)
GPIO.setup(LED, GPIO.OUT)
GPIO.output(LED, GPIO.LOW)


# LOOP
try:
  while True:
    # start LED
    GPIO.output(LED, led_status)
    prev_input = input

    # switch LED on/off
    if (need_to_pulse(pulse_start, led_pulse_secs)):
      if (led_status == GPIO.HIGH):
        led_status = GPIO.LOW
      else:
        led_status = GPIO.HIGH
      # reset variables
      GPIO.output(LED, led_status)
      pulse_start = time.time()

    # check button status
    input = GPIO.input(buttonPin)
    if ((not prev_input) and input):
      GPIO.output(LED, GPIO.LOW)
      print("Button Pressed")
      try:
        with uinput.Device([uinput.KEY_SPACE]) as device:
          device.emit_click(uinput.KEY_SPACE)
      except:
        print("Error: ", sys.exc_info()[0])
      # slight pause to debounce
      time.sleep(0.5)

# stop on Ctrl+C and cleanup
except KeyboardInterrupt:
  GPIO.cleanup()
