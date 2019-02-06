''' 
DHT11-pinout edesta
Signal, VCC (3-5V), Ground
'''
from __future__ import absolute_import, division, print_function, unicode_literals

import sys
import requests
import time
import Adafruit_DHT
#import restpinta

# Sensorin datapinni Raspissa, mallin maaritys & mittausten valilla odotettava aika sekunteina.
gpioPin = 17
# Adafruitin kirjasto tukee sensoreita DHT11, DHT22, AM2302
dhtModel = Adafruit_DHT.DHT11
dhtSleep = 5

def readDHTData(temp=False):
    # Yrittaa lukea DHT-anturin arvot 15 kertaa kahden sekunnin valein kunnes saadaan data luettua
    humidity, temperature = Adafruit_DHT.read_retry(dhtModel, gpioPin)
    # Mikali dataa ei saatu luettua, odotetaan dhtSleep-muuttujassa maaritetty aika
    # ja kaynnistetaan luku uudestaan ajamalla funktio uudestaan.
    if humidity is None and temperature is None:
        print("Datan luku epaonnistui, yritetaan uudestaan ", dhtSleep, " sekunnin paasta.")
        time.sleep(dhtSleep)
        readDHTData()
    else:
        # Mikali vapaaehtoinen funktio-argumentti asetetaan todeksi, palauta myos lampotila
        # Muulloin palauta vain ilmankosteus
        if temp:
            return (humidity, temperature)
        else:
            return humidity

# Ota sensoridata muuttujaan ja lue siita ilmankosteusarvo erilliseen muuttujaan
humidity = readDHTData(False)
# Debug-tulostus
print("Ilmankosteus prosenteissa: %f " % humidity)

# REST, yrita siirtaa omaan luokkaan
def _url(path):
    return 'http://localhost:3010' + path

def get_mesos():
    return requests.get(_url('/meso/gasnames'))

def add_meso(mittajson):
    return requests.post(_url('/meso/create'), mittajson)

def main():
