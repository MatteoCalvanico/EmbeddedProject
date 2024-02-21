# ESP32 IoT sensor

## Rilevazione e spie
L'idea alla base è quella di utilizzare diversi ESP32 con sensori e led per indicare se un parcheggio è libero o meno.
Tramite il sensore di prossimità ad ultrasuoni rileviamo se una macchina si è parcheggiata e accendiamo la spia rossa, quando la macchina si allontanerà la spia verde si accenderà.

## Condivisione dati 
Oltre ad accendere le spie il sensore invierà un messaggio ad un server MQTT, con topic associato, hostato in rete. Successivamente sarà possibile visualizzare i parcheggi liberi o occupati da una pagina web che scaricherà i dati dal broker MQTT.

## Implementazione nel dettaglio
### isParked()
Come dice il nome della funzione il suo compito è controllare se una macchina è presente o meno nel parcheggio, per farlo calcola la distanza dell'oggetto rilevato dal sensore di prossimità e se minore di 50cm ritorna true (macchina presente) altrimenti falso (macchina assente).

### WIFIconnect()
Funzione di utilità per gestire la connessione al WiFi, blocca il proseguimento del codice finchè non ci colleghiamo, al collegamento condivide l'indirizzo IP e un messaggio di riuscita.

### MQTTconnect()
Funzione per la connessione al server MQTT, blocca il codice finchè non ci colleghiamo al server MQTT, un id random temporaneo e si connette al server (che abbiamo passato al client nel setup insieme ai certificati) utilizzando le credenziali date, se la connessione riesce ci iscriviamo a due topic uno per inviare i dati al server e uno per ricevere i messaggi di manutenzione; se la connessione non riesce ci riprova.

### callback(char* topic, byte* payload, unsigned int length)
Funzione che gestisce i messaggi in arrivo dal broker, li prende dal payload e li mette in una variabile, successivamente li stampa in seriale. Lo scopo principale è quello della gestione dei messaggi di manutenzione, infatti se ci arriva un messaggio dal topic a cui ci siamo iscritti prima ed è diretto al nostro ESP, entriamo o usciamo dalla modalità manutenzione che blocca l'invio dei messaggi al broker (disiscrizione al topic).

### publisJSON()
Usiamo il seguente metodo per formattare bene il messaggio da inviare in formato JSON, grazie ad una libreria, e poi li inviamo al broker.



#### Wokwi
Il progetto è stato fatto su [Wokwi](https://wokwi.com/), il link al progetto è nel file 'wokwi-project.txt' oppure [QUI](https://wokwi.com/projects/389703246864781313).