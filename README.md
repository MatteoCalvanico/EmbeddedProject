# Embedded Project
## by Matteo Calvanico, Giacomo Ghinelli, Filippo Monti

### Traccia
Gestore di parcheggi che permette, tramite un’interfaccia web, di vedere quanti sono i parcheggi liberi all’interno dell’area apposita. Ogni parcheggio è provvisto di un sensore di prossimità che rileva l'auto e ogni volta che arriva/parte lo comunica al server.
Possibile anche disattivare un parcheggio a distanza mandandolo in manutenzione.

### Suddivisione cartelle
* ESP32: contiene il file .ino per far funzionare il circuito, il link del progetto su Wokwi, le varie liberie e il diagrama del circuito;
* MqttServer: contiene tutto quello da sapere per far funzionare e usare il broker MQTT, come certificati e comandi;
* web-app: contiene la parte back e front end della pagina per gestire e visualizzare i parcheggi.