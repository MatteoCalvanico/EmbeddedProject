# Web Application

stack utilizzato:

- front-end: React
- back-end: expressJs

## Set-up

Installare i pacchetti necessari lanciando il comando 'npm install' in entrambe le cartelle: fron-end/ e back-end/

### Front-end

Il front-end è una semplice applicazione React.

Per avviare il front-end lanciare il comando 'npm run start' una volta terminata l'installazione dei pacchetti.

L'applicativo:

- permette la visuallizzazione dello stato dei parcheggi, quindi la lettura dei messaggi condivisi dagli esp collegati;
- da la possibilità all'utente di mandare dei messaggi per attivare o disattivare gli esp (modalità manutenzione)

### Back-end

il back-end è composto da due servizi:

- api endpoints creati usando express js
- script .sh per l'iscrizione e la pubblicazione nei topic del server MQTT

Il back-end dispone di tre diversi script di avvio:

1. 'npm run start' : lancia la applicazione express.
2. 'npm run subscribe' : lancia lo script subscriber.sh per l'iscrizione al server mqtt.
3. 'npm run run-both ' : lancia contemporaneamente i due script precedenti.

#### Il server express espone due api:

1. get('/') permette ad i client web di leggere i messaggi condivisi dagli esp

2. post('/set-esp-status') permette ad i client di attivare o disabilitare gli esp

#### Script .sh

Inizialmente abbiamo provato a creare la connessione fra l'applicazione web ed il server mqtt tramite la libreria mqtt.js.

Data la scarsa documentazione riguardo all'inizializzazione di connessioni sicure tramite un contesto TLS non siamo riusciti ad inizializzare una connessione utilizzato questa, ma anche altre librerie javascript.

Abbiamo quindi raggirato il problema facendo leva sugli script sh che sfruttano mosquitto per creare una connessione tra il server express ed il server MQTT.

Lo script subscriber, rimane in ascolto sul topic 'test' e reindirizza i messaggi ricevuti su un file di testo 'output.txt'. Il contenuto di tale file viene letto e condiviso dalla api di get della applicazione express.

La api di post, ricevuta una richiesta, lancia lo script publisher.sh passandogli come argomento il messaggio che poi verrà pubblicato nel topic dedicato del server mqtt
