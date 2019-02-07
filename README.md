# IoTGas
## IoT-kaasumittari 
Mitataan huoneessa olevia epäpuhtauksia kuten H2, LPG, CH4, CO, alkoholi, savu ja propaani MQ-2 kaasusensorilla. Laitteisto, käytetyt palvelut/ohjelmistot ja perustoiminnot ovat tarkennettu alla olevassa peruskokoonpanossa.

Ilmassa olevan kaasun lisäksi mitataan ilman lämpötila (analoginen RS HW-483 ja digitaalinen Dallas DS18B20 sensoreina). Analoginen sensori kirjoittaa mittaustiedon suoraan MongoDB-tietokantaan, kuten tehdään MQ-2 kaasusensorin kanssa. DS18B20-sensori käyttää MQTT-protokollaa, tässä tilanteessa mittaustieto viedään MongoDB:een backendin REST rajapinnan kautta. Kosteutta mittaa DHT11-sensori, joka vie digitaali-lämpötilan tavoin vie tiedon REST-rajapinnan avulla MongoDB-tietokantaan. Raspberry Pi:n käyttöaste talletetaan kaasumittauksen tavoin Python-koodissa, jolla saadaan tietoa ohjelman ja palveluiden toiminnasta Raspberryssä. 

Kehitysvaiheen aikana selviää antureiden (sensoreiden) tarkkuudet ja Reactin ominaisuudet, jolloin muotoutuu mittarin ominaisuudet ja käyttöliittymän muoto selaimeen.   

### Anturi ja backend (peruskokoonpano)
- Laitteisto: Raspberry Pi 3+, MQ-2 kaasusensori, analoginen lämpötilamittari (Rs, HW-483), digitaalinen lämpötilamittari (Dallas DS18B20), kosteusmittari (DHT11) ja ADC Pi Plus
- Palvelut ja ohjelmistot: Raspbian GNU/Linux 9, Python, pymongo, MongoDB, Node.js, Express ja JavaScript  
-> mitattu tiedot MongoDB:n ja ym. palveluilla REST-rajapinta Raspberryyn, josta frontend hakee halutut mittaukset.  

### Frontend ja mittaukset selaimeen (peruskokoonpano)
- Laitteisto: PC (kannettava) ja Raspberry Pi 3 + 
- Palvelut ja ohjelmistot: 
  - Windows 10, GNU/Linux ja Raspbian GNU/Linux 9 (esim. frontend build Pi:llä)
  - Node.js, ReactJS, axios, reactstrap, bootstrap, react-chartjs-2, Moment, Python ja JavaScript 
- Backendin REST-rajapinnasta luetaan tarvittavat tiedot ja muodostetaan näistä mittarisivu selaimeen.
 
### ToDo
- MQ-2 mittausten kalibrointi (python) sensorivalmistajan taulukoiden avulla. 
- HTTPS: käyttö ja login (login ominaisuus työn alla)
- MongoDB ilmoittaa frontendille uudesta mittauksesta, frontend päättää mitä viestin pohjalta tehdään. 
  Tällähetkellä frontend hakee uusia mittauksia 30 sekunnin välein, joka on yksinkertainen ja toimiva ratkaisu tähän sovellukseen. 
- Mittaustietojen 'editointi' frontendistä. Nyt käytetään joko MongoDb Compass, Imsomnia ja/tai Postman työkaluja näihin tarpeisiin, (REST tukee osaksi tätä).
- Mittauksen alkuarvojen ja mittauksen ohjaaminen frontendistä.

ps. This README.md is used as a report for a course, therefore Finnish is used. 
