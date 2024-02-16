# MQTT server

Il server mqtt è in ascolto in un istanza Ec2 di AWS

All'interno di 'ConnectionInfo/' sono condivise le informazioni ed i file necessari per la connessione al al broker mqtt

E' possibile consultare la documentazione aws per l'inizializzazione del server al link:
https://aws.amazon.com/it/blogs/iot/how-to-bridge-mosquitto-mqtt-broker-to-aws-iot/

## Utilizzo degli script per testare il funzionamento del servizio mqtt

Affichè gli script bash con suffisso '.test' funzionino correttamente è necessario lanciarli dalla cartella contenente le chiavi di connessione.

Altrimenti, è necessario modificare gli script specificando il path ad i rispettivi file contenenti le chiavi.

## Files .ino

- secrets/secrets.ino contiene un esempio per la configurazione della connessione tra esp ed broker mqtt

- usageExample.ino contiene un esempio di pubblicazione e lettura messaggi

E' possibile consultare la documentazione aws per i dettagli dei file di esempio al link:
https://aws.amazon.com/it/blogs/compute/building-an-aws-iot-core-device-using-aws-serverless-and-an-esp32/
