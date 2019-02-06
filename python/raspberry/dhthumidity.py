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

# Sensorin datapinni Raspissa, mallin määritys & mittausten välillä odotettava aika sekunteina.
gpioPin = 17
dhtModel = Adafruit_DHT.DHT11
dhtSleep = 5

def readDHTData():
    # Yrittää lukea DHT-anturin arvot 15 kertaa kahden sekunnin välein kunnes saadaan data luettua
    humidity, temperature = Adafruit_DHT.read_retry(dhtModel, gpioPin)
    # Mikäli dataa ei saatu luettua, odotetaan dhtSleep-muuttujassa määritetty aika
    # ja käynnistetään luku uudestaan ajamalla funktio uudestaan.
    if humidity is None and temperature is None:
        print("Datan luku epäonnistui, yritetään uudestaan ", dhtSleep, " sekunnin päästä.")
        time.sleep(dhtSleep)
        readDHTData()
    else:
        return (humidity, temperature)

# Ota sensoridata muuttujaan ja lue siitä ilmankosteusarvo erilliseen muuttujaan
dhtValues = readDHTData()
humidity = dhtValues[0]
# Debug-tulostus
print("Ilmankosteus prosenteissa: %f " % humidity)



