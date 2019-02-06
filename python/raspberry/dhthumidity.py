''' 
DHT-kirjaston asennus
Varmista että tarvittavat paketit löytyy, build-essential python-dev
git clone https://github.com/adafruit/Adafruit_Python_DHT.git
sudo python setup.py install

DHT11-pinout edestä
Signal, VCC, Ground
'''
from __future__ import absolute_import, division, print_function, unicode_literals

import sys
import requests
import time
import Adafruit_DHT
import restpinta

# Sensorin datapinni Raspissa & mallin määritys
gpioPin = 17
dhtModel = Adafruit_DHT.DHT11

# Yrittää lukea DHT-anturin arvot 15 kertaa kahden sekunnin välein
humidity, temperature = Adafruit_DHT.read_retry(dhtModel, gpioPin)

# Debug-tulostus
print('Ilmankosteus: {0:0.1f}%'.format(humidity))

