import pymongo
import sys

# ruma mittausluokka, ToDo: kalibraatio  
class MittausLuokka:
    def __init__(self, kaasunimi, gageid = "99", kaasuid = "99", muutos_raja_arvo = sys.float_info.max, pakotettu_tallennusvali = sys.float_info.max):
        self.kaasunimi = kaasunimi
        self.gageid = gageid
        self.kaasuid = kaasuid 
        self.muutos_raja_arvo = float(muutos_raja_arvo)
        self.pakotettu_tallennusvali = float(pakotettu_tallennusvali)
        self.tallennuksen_alaraja = -sys.float_info.max
        self.talletettuarvo = 0.0
        self.talletus_aika = 0.0
        self.edellinen_tallentamatta = False
        #mongo db asetuksia
        myclient = pymongo.MongoClient("mongodb://localhost:27017/")
        mydb = myclient["IoTGas"]
        self.mycol = mydb["gasgage"]
        
    def tallennuksen_alaraja(self,raja):
        self.tallennuksen_alaraja = float(raja)

    def talletakantaan(self, mitattu_arvo, mittausaika):
        if mitattu_arvo > self.tallennuksen_alaraja:
            self.edellinen_tallentamatta = False 
            self.talletettuarvo = mitattu_arvo
            self.talletus_aika = mittausaika
            mittajson = {"gageid": self.gageid , "kaasuid": self.kaasuid , "kaasunimi": self.kaasunimi, "arvo": mitattu_arvo, "gagetime": mittausaika}
            x = self.mycol.insert(mittajson)
        else:
            print("Arvo " + str(mitattu_arvo) + " alle alarajan " + str(self.tallennuksen_alaraja))

    def edellinenmitta_jemmaan(self, mitattu_arvo, mittausaika):
        if mitattu_arvo > self.tallennuksen_alaraja: 
            self.edellinen_tallentamatta = True
            self.edellinenmittajson = {"gageid": self.gageid , "kaasuid": self.kaasuid , "kaasunimi": self.kaasunimi, "arvo": mitattu_arvo, "gagetime": mittausaika }
        
    def talleta_edellinenmitta(self):
        if self.edellinenmittajson["arvo"] > self.tallennuksen_alaraja: 
            print("edellinen " + self.kaasunimi + " kantaan " + str(self.edellinenmittajson["arvo"]))
            # kaikenvaralta false :-) 
            self.edellinen_tallentamatta = False
            x = self.mycol.insert(self.edellinenmittajson)
            
    def huomattava_muutos_tullut_talleta_kantaan(self, mitattu_arvo, mittausaika):
        if abs(mitattu_arvo - self.talletettuarvo) > self.muutos_raja_arvo:
            if self.edellinen_tallentamatta:
                self.talleta_edellinenmitta()
            self.talletakantaan(mitattu_arvo, mittausaika)
            return True
        else:
            return False
    
    def riittavan_kauvan_mennyt_talleta_kantaan(self, mittausaika, mitattu_arvo):
        if (mittausaika - self.talletus_aika) > self.pakotettu_tallennusvali*1000*60:
            self.talletakantaan(mitattu_arvo, mittausaika)
            return True
        else:
            return False
          
# mitta = {"gageid": "01", "kaasuid":"01", "kaasunimi": kaasunimi, "arvo": arvo_1, "gagetime": mittausaika }
