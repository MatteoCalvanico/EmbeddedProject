# ESP32 IoT sensor

## Rilevazione e spie
L'idea alla base è quella di utilizzare diversi ESP32 con sensori e led per indicare se un parcheggio è libero o meno.
Tramite il sensore di prossimità ad ultrasuoni rileviamo se una macchina si è parcheggiata e accendiamo la spia rossa, quando la macchina si allontanerà la spia verde si accenderà.

## Condivisione dati 
Oltre ad accendere le spie il sensore invierà un messaggio ad un server MQTT, con topic associato, hostato in rete. Successivamente sarà possibile visualizzare i parcheggi liberi o occupati da una pagina web che scaricherà i dati dal broker MQTT.