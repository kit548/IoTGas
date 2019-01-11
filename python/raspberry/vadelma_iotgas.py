from __future__ import absolute_import, division, print_function, unicode_literals

import time
import os
import math
import statistics
import Vadelmavakka

# Raspberry Pi & acd muunnin (valmistajan koodia)
try:
    from ADCPi import ADCPi
except ImportError:
    print("Failed to import ADCPi from python system path")
    print("Importing from parent folder instead")
    try:
        import sys
        sys.path.append('..')
        from ADCPi import ADCPi
    except ImportError:
        raise ImportError(
            "Failed to import library from parent folder")

# kasa tietoja konsolille
def konsolitulostus(laskuri, mittausaika, mitattu_arvo, hajonta, lampo, hajonta_temp, lisatieto = ""):
    if lisatieto != "":
        lisatieto = '   aikatallennus: ' + str(lisatieto) + ' min.'
    print(str(laskuri) + ' ' + time.ctime(mittausaika/1000) + lisatieto)
    print("mitattu: %02f" % mitattu_arvo + "   hajonta: %02f" % hajonta + "   kanta-aika: " + str(mittausaika))
    print("lampotila: %02f" % lampo + "   hajonta: %02f" % hajonta_temp)
    print(' ')

# kalibraation tarkkuus noin 0,5 astetta lampotiloissa 20-25 astetta - analog temp Rs sensor
# https://www.aliexpress.com/item/37-Sensor-Module-Kit-For-Arduino-For-Raspberry-Pi-Model-B-With-GPIO-Extension-Jumper-for/32816585549.html?spm=a2g0s.9042311.0.0.76f24c4d4GQXz9
def analog_temp_Rs_sensor_kali(vadc, hajonta = False):
    if hajonta:
        return (28.72667 * vadc)
    else:
        return (28.72667 * vadc - 30.05396)

def main():   
    #raspberry pi adc  
    adc = ADCPi(0x68, 0x69, 12)

    print(sys.version)
    # mittausten aluastus, hieman kovakoodia 
    # pakotettu_tallennusvali minuuteissa 
    pakotettu_tallennusvali = 5
    # tallennus raja volteissa anturilta 1 
    muutos_raja_arvo_1 = 0.03
    # mittauksen eli kaasun nimi ja muuta kovakoodausta  
    kaasunimi_1 = "Leipomo (kynnys " + str(muutos_raja_arvo_1) +")"
    gageid = "01"
    kaasuid = "01"    
    # ja sitten alustetaan anturi 1 ilmat etc. ja anturi 2 lampotila
    mittaus = Vadelmavakka.Mittausluokka(kaasunimi_1, gageid, kaasuid, muutos_raja_arvo_1, pakotettu_tallennusvali)
    analog_temp_Rs_sensor = Vadelmavakka.Mittausluokka("Lampotila", "02", "90")
    analog_temp_Rs_sensor.tallennuksen_alaraja = -30 
    
    #sleep_mittausvali_keskiarvoon sekunneissa eli pieni tauko silmukkaan -> time.sleep(secs)
    sleep_mittausvali_keskiarvoon = 0.05
    
    # laskuri mitttauksille... (just4fun)
    laskuri = 0  
    print(' ')
    print("Mittaus: " + mittaus.kaasunimi)
    print(' ')

    while True:
        i = 0 
        silmukka_lkm=10
        mitat = [] 
        lammot = [] 
        while i < silmukka_lkm: 
            mitattu_arvo_1 = adc.read_voltage(1) 
            adc_temp = adc.read_voltage(2)
            #print("Channel 1: %02f" % adc.read_voltage(1))
	    #...
	    #print("Channel 8: %02f" % adc.read_voltage(8))
            mitat.append(mitattu_arvo_1) 
            lammot.append(adc_temp) 
            time.sleep(sleep_mittausvali_keskiarvoon) 
            i += 1
	# mongodb aika millisek. 
        mittausaika_1 = int(round((time.time() - sleep_mittausvali_keskiarvoon*silmukka_lkm/2)* 1000))
        mitattu_arvo_1 = statistics.mean(mitat) 
        hajonta_1 = statistics.pstdev(mitat) 
	# mitattu_arvo_1 kalibraatio funktio...?

        adc_temp = statistics.mean(lammot) 
        lampo = analog_temp_Rs_sensor_kali(adc_temp)
	#lampo = 40 # testi 
	hajonta_temp = statistics.pstdev(lammot) 
	hajonta_temp = analog_temp_Rs_sensor_kali(hajonta_temp, True)
	
	laskuri += 1 

        if mittaus.huomattava_muutos_tullut_talleta_kantaan(mitattu_arvo_1, mittausaika_1):
            if analog_temp_Rs_sensor.edellinen_tallentamatta:
                analog_temp_Rs_sensor.talleta_edellinenmitta()
            analog_temp_Rs_sensor.talletakantaan(lampo, mittausaika_1)
            konsolitulostus(laskuri, mittausaika_1, mitattu_arvo_1, hajonta_1, lampo, hajonta_temp)
        elif mittaus.riittavan_kauvan_mennyt_talleta_kantaan(mittausaika_1, mitattu_arvo_1):
            analog_temp_Rs_sensor.talletakantaan(lampo, mittausaika_1)
            konsolitulostus(laskuri, mittausaika_1, mitattu_arvo_1, hajonta_1, lampo, hajonta_temp, pakotettu_tallennusvali)
        else:
            mittaus.edellinenmitta_jemmaan(mitattu_arvo_1, mittausaika_1)
            analog_temp_Rs_sensor.edellinenmitta_jemmaan(lampo, mittausaika_1)
            
        # wait x seconds before reading the pins again
        time.sleep(1.0)
    #while True loop end 

if __name__ == "__main__":
    main()
