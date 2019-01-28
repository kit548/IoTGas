# IoTGas
## IoT-kaasumittari 
Mitataan huoneessa olevia epäpuhtauksia kuten H2, LPG, CH4, CO, alkoholi, savu ja propaani (MQ-2-kaasusensori). Lisäksi mitataan ilman lämpötila. Laitteisto, käytetyt palvelut/ohjelmistot ja perustoiminnot ovat tarkennettu alla olevassa peruskokoonpanossa.

Saatamme lisätä laitteistoon toisen lämpötila-anturin (DS18B20) ja kosteuden mittaamisen. Raspberry Pi:n käyttöaste talletetaan kaasumittauksen tavoin python koodissa, jolla saadaan tietoa ko. koodian/palveluiden toiminnasta.     

Kehitysvaiheen aikana selviää antureiden (sensoreiden) tarkkuudet, jolloin muotoutuu mittarin ominaisuudet ja käyttöliittymän muoto selaimeen.  

### Anturi ja backend (peruskokoonpano)
- Laitteisto: Raspberry Pi 3+, MQ-2 kaasusensori, analoginen lämpötilamittari (RS xxx) ja ADC Pi Plus
- Palvelut ja ohjelmistot: Raspbian GNU/Linux 9, Python, pymongo, MongoDB, Node.js, Express, JavaScript  
-> mitattu tiedot MongoDB:n ja ym. palveluilla REST rajapinta Raspberryyn (wlan), josta frontend hakee halutut mittaukset  

### Frontend ja mittaukset selaimeen (peruskokoonpano)
- Laitteisto: PC (kannettava)
- Palvelut ja ohjelmistot: 
  - Windows 10, GNU/Linux tai Raspberry Pi (esim. frontend build Pi:llä)
  - Node.js, ReactJS, axios, reactstrap, bootstrap, react-chartjs-2, moment, python, JavaScript 
- Backendin REST rajapinnasta luetaan tarvittavat tiedot ja muodostetaan näistä mittarisivu selaimeen
 
### ToDo
- MQ-2 mittausten kalibrointi (python) sensorivalmistajan taulukoiden avulla. 
- Lisätään DS18B20 ja kosteuden anturit/mittaaminen.  
- Siirretään mittaustietoja anturista MQTT protokollalla backendiin (DS18B20). 
- Mittaustieto MongoDB:n backendin REST-rajapinnan kautta. Nyt mittaukset kirjoitetaan mongopy:llä 'suoraan' tietokantaan. 
- Siirretään backend erilliselle Linux-palvelimelle (sekä backend ja frontend pilven nurkalle?)
- Edelliset siirto-ominaisuudet: tehdään antureiden, backendin ja frontendin konfiguroiminen helppoksi ja siirrettäväksi. 
- Https: käyttö ja login (login ominaisuus työn alla)
- MongoDB ilmoittaa frontendille uudesta mittauksesta, frontend päättää mitä viestin pohjalta tehdään.  
- Mittaustietojen 'editointi' frontendistä.  Nyt käytetään joko MongoDb Compass, Imsomnia ja/tai Postman työkaluja näihin tarpeisiin, (REST tukee osaksi tätä) 

ps. This README.md is used as a report for a course, threfore Finnish is used. 
