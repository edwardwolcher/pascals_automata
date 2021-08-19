#include "Adafruit_Thermal.h"
#include "SoftwareSerial.h"
#include <avr/pgmspace.h>
#include "Text.h"
#define TX_PIN 6 
#define RX_PIN 5 

SoftwareSerial mySerial(RX_PIN, TX_PIN); 
Adafruit_Thermal printer(&mySerial);     

char nounBuffer[17];
char verbBuffer[17];
const int motorPin = 9;



void spinPlate(int time) {
    analogWrite(motorPin, 100);
    delay(time);
    analogWrite(motorPin, 0);
}

void newPrayer() {
    int noun = int(random(128));
    int verb = int(random(128));
    strcpy_P(nounBuffer, (char *)pgm_read_word(&(noun_table[noun])));
    strcpy_P(verbBuffer, (char *)pgm_read_word(&(verb_table[noun])));
}

void prayerCycle(int reps, int gap = 5000) {
  analogWrite(motorPin, 100);
  printer.wake();
  printer.setDefault();
  for (int i = 0; i < reps; i++) {
    pray();
    delay(gap);
  }
  int time = millis();
  char tstr[16];
  itoa(time, tstr, 10);
  printer.printBarcode(tstr, CODE39);
  printer.feed(4);
  printer.sleep();
  analogWrite(motorPin, 0);
  delay(4000);
}

void pray() {
    newPrayer();
    printer.setSize('L');
    printer.justify('C');       
    printer.println(nounBuffer);
    printer.println(verbBuffer);
    printer.feed(2);
  
}

void setup() {
  randomSeed(analogRead(0));
  pinMode(motorPin, OUTPUT);
  mySerial.begin(19200);  
  printer.begin();        

}

void loop() {
  prayerCycle(8);
  spinPlate(10000);
}