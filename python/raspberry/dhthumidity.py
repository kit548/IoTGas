''' 
DHT-kirjaston asennus
Varmista että tarvittavat paketit löytyy, build-essential python-dev
git clone https://github.com/adafruit/Adafruit_Python_DHT.git
sudo python setup.py install
'''
from __future__ import absolute_import, division, print_function, unicode_literals

import sys
import Adafruit_DHT

gpioPin = 10
dhtModel = Adafruit_DHT.DHT11

humidity, temperature = Adafruit_DHT.read_retry(dhtModel, gpioPin)

#Debug-tulostus
print('Ilmankosteus: {0:0.1f}%'.format(humidity))

# REST      
def _url(path):
    return 'http://localhost:3010' + path

def get_mesos():
    return requests.get(_url('/meso/gasnames'))

def add_meso(mittajson):
    return requests.post(_url('/meso/create'), mittajson)
# REST  
    
def main():
    print()
    paluu = get_mesos().content
    print("Mittaukset: " + str(paluu))
    paluu = ''
    print("REST: " , _url('/meso/gasnames'))
    print()
    mittaus = 0
    gageid = "dht11" 
    kaasuid = "humidity"
    kaasunimi = "DHT11"