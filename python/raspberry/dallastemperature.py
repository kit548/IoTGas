from __future__ import absolute_import, division, print_function, unicode_literals

import requests
import os
import time
import statistics

# dallas ds18b20 
os.system('modprobe w1-gpio')
os.system('modprobe w1-therm') 

temperature_sensor = '/sys/bus/w1/devices/28-acde2b126461/w1_slave'

def sensor_lines():
    sensor = open(temperature_sensor, 'r')
    lines = sensor.readlines()
    sensor.close()
    return lines
    
def read_temperature():
    lines = sensor_lines()
    while lines[0].strip()[-3:] != 'YES':
        print(lines)
        time.sleep(0.2)
        lines = sensor_lines()
        
    #print(lines)
    temperature_output = lines[1].find('t=')
    if temperature_output != -1:
        temp_string = lines[1].strip()[temperature_output+2:]
        temperature = float(temp_string) / 1000.0
        return temperature
# dallas ds18b20
        
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
    print("Mittaukset kannassa: " + str(paluu))
    paluu = ''
    print("REST: " , _url('/meso/gasnames'))
    print()
    mittaus = 0
    gageid = 20 #reserverd for DS18B20 
    kaasuid = 90 #temparature
    kaasunimi = "DS18B20"  
    sleep_mittausvali_keskiarvoon = 0.05
    mittausten_vali = 10 
    print("Mittausnimi: " + kaasunimi)
    mittausaika = int(round(time.time() * 1000))
    print("startti: " + str(mittausaika))
    print("mittaan: " + str(mittausten_vali) + " s ka.")
    print()
    while True:
        i = 0 
        silmukka_lkm=10
        mitat = []
        while i < silmukka_lkm: 
            mittaus = read_temperature()
            mitat.append(mittaus) 
            time.sleep(sleep_mittausvali_keskiarvoon) 
            i += 1
        # mongodb aika millisek. 
        mittausaika = int(round((time.time() - sleep_mittausvali_keskiarvoon*silmukka_lkm/2)* 1000))
        mittaus = statistics.mean(mitat) 
        mittajson = {"gageid": gageid, "kaasuid": kaasuid, "kaasunimi": kaasunimi, "arvo": mittaus, "gagetime": mittausaika}
        print("mitattu: %.02f" % mittaus + "  kanta-aika: " + str(mittausaika))
        paluu = add_meso(mittajson)
        if str(paluu) != '<Response [200]>':
            print(paluu)
        time.sleep(mittausten_vali)
        
if __name__ == "__main__":
    main()



