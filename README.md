# Embedded Project

## by Matteo Calvanico, Giacomo Ghinelli, Filippo Monti

### Traccia

Gestore di parcheggi che permette, tramite un’interfaccia web, di vedere quanti sono i parcheggi liberi all’interno dell’area apposita. Ogni parcheggio è provvisto di un sensore di prossimità che rileva l'auto e ogni volta che arriva/parte lo comunica al server.
Possibile anche disattivare un parcheggio a distanza mandandolo in manutenzione.

### Suddivisione cartelle

- ESP32: contiene il file .ino per far funzionare il circuito, il link del progetto su Wokwi, le varie liberie e il diagrama del circuito;
- web-app: contiene la parte back e front end della pagina per gestire e visualizzare i parcheggi.

# MQTT server

Il server mqtt è in ascolto in un istanza Ec2 di AWS.

Host endpoint: a3gozzilrkv83v-ats.iot.us-east-1.amazonaws.com

## Motivazioni scelta di utilizzare una Ec2

Un obbiettivo del progetto era la comunicazione attraverso un broker MQTT.
Dovendo usare WokWi per simulare un esp tramite la connessione wifi sarebbe stato necessario configurare un router per indirizzare il traffico rete.

Invece, avendo scelto di hostare il server su una vm cloud (ubuntu), abbiamo potuto creare una connessione tra il server ed i client tramite internet.

E' possibile consultare la documentazione aws per l'inizializzazione di un server mqtt su istanza ec2 al [link](https://aws.amazon.com/it/blogs/iot/how-to-bridge-mosquitto-mqtt-broker-to-aws-iot/)

### Connessione al server

La connessione al server necessità che il client dichiari uno user name ed una password che sono state configurate durante l'inizializzazione del server MQTT.

Inoltre per far in modo che la vm cloud accetti la connessione è necessario allegare alle richieste tre diversi certificati di sicurezza.
Questi certificati si trovano in una cartella drive condivisa tra i membri del progetto. Chiedere a giacomo.ghinelli@studio.unibo.it per l'accesso alla cartella.
Per autenticare gli applicativi web-app/back-end ed ESP32/ è necessario:

1. Copiare la cartella secrets scaricata dal drive in web-app/back-end/mqtt-subscription/
2. Copiare il contenuto dei certificati dove appositamente indicato nel file ESP32/sketch.ino
