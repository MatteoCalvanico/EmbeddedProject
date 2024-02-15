#include <WiFi.h>
#include <WiFiClientSecure.h>
#include <PubSubClient.h>


#define GreenLed 4 //Led per indicare che il parcheggio è libero
#define RedLed 2   //Led per indicare che il parcheggio è occupato

#define TrigPin 18 //Collegamento fra ESP32 e sensore ad Ultrasuoni (TRIG)
#define EchoPin 5  //Collegamento fra ESP32 e sensore ad Ultrasuoni (ECHO)


//Wi-Fi part
const char* ssid = "Wokwi-GUEST";
const char* psw = "";

//MQTT part
const char* mqttServer = "broker.emqx.io";
const int mqttPort = 1883;
const char* mqttTopic = "topic";
const char* mqttUsername = "parcheggio1";
const char* mqttPassword = "";

//parametri per evitare blocchi
unsigned long previousMillis = 0;
const long interval = 1000;


WiFiClient espClient;
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
  String incommingMessage = "";
  for (int i = 0; i < length; i++) {
    incommingMessage+=(char)payload[i];
  }
  Serial.println("Messaggio da MQTT ["+String(topic)+"] " + incommingMessage);
}

void setup() {
  Serial.begin(115200);


  //START Wi-Fi connection
  WIFIconnect();
  //END Wi-Fi connection


  //START MQTT connection
  client.setServer(mqttServer, mqttPort);
  client.setCallback(callback);
  //END MQTT connection


  pinMode(GreenLed, OUTPUT);
  pinMode(RedLed, OUTPUT);
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
      client.publish(mqttTopic, "true"); //Indico al server che il parcheggio è occupato
    }else{
      digitalWrite(GreenLed, HIGH);
      digitalWrite(RedLed, LOW);
      Serial.println("!!! Parcheggio libero !!!");

      Serial.println("Invio dati al server...");
      client.publish(mqttTopic, "false"); //Indico al server che il parcheggio è libero
    }
  }
}
