#define GreenLed 4 //Led per indicare che il parcheggio è libero
#define RedLed 2   //Led per indicare che il parcheggio è occupato

#define TrigPin 18 //Collegamento fra ESP32 e sensore ad Ultrasuoni (TRIG)
#define EchoPin 5  //Collegamento fra ESP32 e sensore ad Ultrasuoni (ECHO)


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

void setup() {
  Serial.begin(115200);
  pinMode(GreenLed, OUTPUT);
  pinMode(RedLed, OUTPUT);
  pinMode(TrigPin, OUTPUT);
  pinMode(EchoPin, INPUT);


  Serial.println("!!! Inizializzazione parcheggio !!!");

  digitalWrite(GreenLed, HIGH);
  Serial.println(("!!! Parcheggio libero !!!"));
}

void loop() {
  if(isParked()){
    digitalWrite(GreenLed, LOW);
    digitalWrite(RedLed, HIGH);
    Serial.println(("!!! Parcheggio occupato !!!"));
  }else{
    digitalWrite(GreenLed, HIGH);
    digitalWrite(RedLed, LOW);
    Serial.println(("!!! Parcheggio libero !!!"));
  }


  delay(1000);
}
