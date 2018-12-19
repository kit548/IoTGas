# IoTGas
## IoT-kaasumittari 
Mitataan huoneessa olevia epäpuhtauksia kuten H2, LPG, CH4, CO, alkoholi, savu ja propaani (MQ-2 Gas sensori). Laitteisto,  käytetyt palvelut/ohjelmistot ja perustoiminnot ovat tarkennettu alla olevassa peruskokoonpanossa.

Lisäämme laitteistoon lämpötilan ja kosteuden mittaamisen. Näiden ja kehitysvaiheen käyttön aikana selviää antureiden (sensoreiden) tarkkuudet, jolloin muotoutuu mittarin ominaisuudet ja käyttöliittymän muoto selaimeen.    

### Sensori ja backend (peruskokonpano)
- Laitteisto: Raspberry Pi 3+, MQ-2 Gas sensor ja ADC Pi Plus
- Palvelut ja ohjelmistot: Raspbian GNU/Linux 9, Python, pymongo, MongoDB, Node.js, Express, JavaScript  
-> mitattu tiedot MongoDB:n ja ym. palveluilla REST rajapinta Raspberryyn (wlan), josta halutut arvot voi hakea  

### Frontend ja mittaukset selaimeen (peruskokonpano)
- Laitteisto: PC (kannettava)
- Palvelut ja ohjelmistot: 
  - Windows 10 ja/tai GNU/Linux
  - Node.js, ReactJS, axios, react-chartjs-2, moment, python, JavaScript 
- backendin REST rajapinnasta luetaan tarvittavat tiedot ja muodostetaan näistä mittarisivu selaimeen
 
### ToDo
- Mittaustulosten kalibrointi (python) sensorivalmistajan taulukoiden avulla. Tämän harjoituksen tarkoitus ei ole saada aikaan tarkkaa mittaria, riittää "about" arvot.  
- Lisätään lämpötilan ja kosteuden anturit/mittaaminen.  
- Mittaustieto MongoDB:n backendin REST-rajapinnan kautta. Nyt python käyttää pymongo:a, jolla mittaukset kirjoitetaan 'suoraan' tietokantaan. 
- Siirretään mittaustietoja sensorista MQTT protokollalla backendiin, tässä tilanteessa backend ei ole Raspberryssä. 
- Siirretään backend erilliselle linux-palvelimelle (...itseasiassa kumpikin, sekä backend ja frontend pilven nurkalle?)
- Toisaalta laitetaan frontend pyörimään Raspberry Pi:lle, tällöin laittetaan Raspberryn cpu:n käyttöaste yhdeksi mitattavaksi suureeksi (ja pistää Raspberry tiukille).
-> edelliset ominaisuudet pistää eri palveluiden löytämään toisensa, ainakin tämän konfiguroiminen pitää olla helppo  

- https: käyttö ja login (login ominaisuus työn alla)
- MongoDB ilmoittaa frontendille uudesta mittaustuksesta, frontend päättää mitä viestin pohjalta tehdään. 
- Mittaustietojen 'editointi' frontendistä.  Nyt käytetään joko MongoDb Compass, Imsomnia ja/tai Postman työkaluja näihin tarpeisiin. 
- Sensoridatan luku ohjelman siistiminen (python) ja siirto githubiin.  
- Mittaustulosten (kuvaajan) zoomaus ja aikaikkuna siirto frontendissä.  I


### Done: 
- ensimmäinen mittaus tehty, katso raspberry_eka_savu.jpg (pymongo)
- GitHub käyttö: kit, Aapo, and Lassi  
- frontend ja backend githubissa
- sensorilta tulevaa mittaustietoa analysoidaan eli talletaan tietokantaan halutun muutoksen ylittävät lukemat ja/tai vähintään tietyllä aikavälillä (esim. vähintään puolen tunnin välein, jos mittausarvot pysyvät muuttumattomanan)
