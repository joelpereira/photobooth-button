# https://learn.sparkfun.com/tutorials/raspberry-gpio/python-rpigpio-api

import uinput
import time
import RPi.GPIO as GPIO
GPIO.setmode(GPIO.BCM)

# SETUP
buttonPin  = 21
LED        = 20
prev_input = 0
GPIO.setup(buttonPin, GPIO.IN)
GPIO.setup(LED, GPIO.OUT)
GPIO.output(LED, GPIO.LOW)

# LOOP
try:
   while True:
    # start LED
    GPIO.output(LED, GPIO.HIGH)
    # take a reading
    input = GPIO.input(buttonPin)
    if ((not prev_input) and input):
      GPIO.output(LED, GPIO.LOW)
      print("Button Pressed")
      #with uinput.Device([uinput.KEY_SPACE]) as device:
        #device.emit_click(uinput.KEY_SPACE)
    prev_input = input
    # slight pause to debounce
    time.sleep(0.05)

# stop on Ctrl+C and cleanup
except KeyboardInterrupt:
  GPIO.cleanup()
