import RPi.GPIO as GPIO
import time
import uinput
GPIO.setmode(GPIO.BCM)

# SETUP
buttonPin = 21
prev_input = 0
GPIO.setup(buttonPin, GPIO.IN)

# LOOP
while True:
  # take a reading
  input = GPIO.input(buttonPin)
  if ((not prev_input) and input):
    print("Button Pressed")
    with uinput.Device([uinput.KEY_SPACE]) as device:
      device.emit_click(uinput.KEY_SPACE)
  prev_input = input
  # slight pause to debounce
  time.sleep(0.05)
