#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <ArduinoJson.h>
#include <PubSubClient.h>


#define GreenLed 4   //Led per indicare che il parcheggio è libero
#define RedLed 2     //Led per indicare che il parcheggio è occupato
#define YellowLed 15 //Led per indicare che il parcheggio è in manutenzione

#define TrigPin 18 //Collegamento fra ESP32 e sensore ad Ultrasuoni (TRIG)
#define EchoPin 5  //Collegamento fra ESP32 e sensore ad Ultrasuoni (ECHO)


//Wi-Fi part
const char* ssid = "Wokwi-GUEST";
const char* psw = "";

//MQTT part
const char* mqttServer = "a3gozzilrkv83v-ats.iot.us-east-1.amazonaws.com";
const int mqttPort = 8883;
const char* mqttTopic = "test";
const char* mqttTopicManutenzione = "disabled";
const char* mqttUsername = "admin";
const char* mqttPassword = "password";
const char* ESPname = "ParcheggioONE";

int workInProgress = 0; //Indica se l'ESP deve smettere di mandare msg

// Amazon Root CA 1
static const char AWS_CERT_CA[] PROGMEM = R"EOF(
-----BEGIN CERTIFICATE-----
<rootCA.pem>
-----END CERTIFICATE-----
)EOF";

// Device Certificate
static const char AWS_CERT_CRT[] PROGMEM = R"KEY(
-----BEGIN CERTIFICATE-----
<cert.crt>
-----END CERTIFICATE-----
)KEY";

// Device Private Key
static const char AWS_CERT_PRIVATE[] PROGMEM = R"KEY(
-----BEGIN RSA PRIVATE KEY-----
<private.key>
-----END RSA PRIVATE KEY-----
)KEY";

//parametri per evitare blocchi
unsigned long previousMillis = 0;
const long interval = 1000;


WiFiClientSecure espClient;
PubSubClient client(espClient);


#define MSG_BUFFER_SIZE (50)
char msg[MSG_BUFFER_SIZE];


//Controllo se c'è un'auto parcheggiata (Rileva un oggetto a meno di 50 cm)
bool isParked() {

  //Trigger per il pin TRIG
  digitalWrite(TrigPin, LOW);
  delayMicroseconds(2);
  digitalWrite(TrigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(TrigPin, LOW);

  //Calcolo distanza
  float durata = pulseIn(EchoPin, HIGH);
  int distanza = durata / 58;
  Serial.println("Distanza calcolata:");
  Serial.println(distanza);

  //La divisione serve per avere la distanza in centimetri
  if((distanza) < 50){
    return true;
  }else{
    return false;
  }
}

//Connessione al Wi-Fi
void WIFIconnect(){
  WiFi.begin(ssid, psw);
  Serial.println("Connessione...");
  while(WiFi.status() != WL_CONNECTED) {
    Serial.println(".");
    delay(1000);
  }
  Serial.println("Connessione riuscita");
  Serial.println("indirizzo IP: ");
  Serial.println(WiFi.localIP());
}

//Connessione MQTT
void MQTTconnect(){
  while (!client.connected()) {
    Serial.println("Connessione a MQTT…");
    String clientId = "ESP32Client-"; //Creazione ID client random
    clientId += String(random(0xffff), HEX);
    
    //Connessione
    if (client.connect(clientId.c_str(), mqttUsername, mqttPassword)) {
      Serial.println("Connesso");

      client.subscribe(mqttTopic);
      client.subscribe(mqttTopicManutenzione);
    } else {
      Serial.print("FAIL, rc=");
      Serial.print(client.state());
      Serial.println("Ri-connessione fra 3 secondi");
      delay(3000);
    }
  }
}

//In caso di arrivo di messaggi dal broker
void callback(char* topic, byte* payload, unsigned int length) {
  String incomingMessage = "";
  for (int i = 0; i < length; i++) {
    incomingMessage += (char)payload[i];
  }
  Serial.println("Messaggio da MQTT ["+String(topic)+"] " + incomingMessage);

  if (String(topic) == mqttTopicManutenzione) { //Se dal topic di manutenzione ci viene detto di disattivare/attivare il parcheggio lo facciamo
    Serial.println("Check0");
    if (incomingMessage.endsWith(ESPname)){ //Ovviamente facciamo le operazioni solo se il nome dell'ESP corrisponde al nostro
      Serial.println("Check1");
      if (incomingMessage.startsWith("disable-")) {
        Serial.println("!!! Parcheggio in manutenzione !!!");
        digitalWrite(YellowLed, HIGH);
        digitalWrite(GreenLed, LOW);
        digitalWrite(RedLed, LOW);

        client.unsubscribe(mqttTopic); //Togliamo l'iscrizione al topic
        workInProgress = 1;

      } else if (incomingMessage.startsWith("enabled-")) {
        Serial.println("!!! Parcheggio riattivato !!!");
        digitalWrite(YellowLed, LOW);

        client.subscribe(mqttTopic); //Riscrizione al topic
        workInProgress = 0;
      }
    }
  }
}

//Metiamo i dati in un JSON e li inviamo
void publisJSON(){
  StaticJsonDocument<200> data;
  char dataJSON[512];

  data["ESPname"] = ESPname;
  data["isParked"] = isParked();
  serializeJson(data, dataJSON);

  if(workInProgress == 0){
    client.publish(mqttTopic, dataJSON);
  }else{
    Serial.println("!!! Messaggio non inviato, WORK IN PROGRESS IN THE PARKING !!!");
  }
}


void setup() {
  Serial.begin(115200);


  //START Wi-Fi connection
  WIFIconnect();
  //END Wi-Fi connection


  //START MQTT init
  espClient.setCACert(AWS_CERT_CA);
  espClient.setCertificate(AWS_CERT_CRT);
  espClient.setPrivateKey(AWS_CERT_PRIVATE);
  client.setServer(mqttServer, mqttPort);
  client.setCallback(callback);
  //END MQTT init


  pinMode(GreenLed, OUTPUT);
  pinMode(RedLed, OUTPUT);
  pinMode(YellowLed, OUTPUT);
  pinMode(TrigPin, OUTPUT);
  pinMode(EchoPin, INPUT);


  Serial.println("!!! Inizializzazione parcheggio !!!");
  digitalWrite(GreenLed, HIGH);
  Serial.println("!!! Parcheggio libero !!!");
}

void loop() {
  if(!client.connected()){
    MQTTconnect();
  }
  client.loop();

  unsigned long currentMillis = millis();
  if(currentMillis - previousMillis >= interval){
    previousMillis = currentMillis;
    if(isParked()){
      digitalWrite(GreenLed, LOW);
      digitalWrite(RedLed, HIGH);
      Serial.println("!!! Parcheggio occupato !!!");
      Serial.println("Invio dati al server...");
    }else{
      digitalWrite(GreenLed, HIGH);
      digitalWrite(RedLed, LOW);
      Serial.println("!!! Parcheggio libero !!!");
      Serial.println("Invio dati al server...");
    }
    publisJSON();
  }
}
