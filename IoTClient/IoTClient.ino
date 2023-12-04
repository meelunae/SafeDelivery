#include "config.h"
#include <SPI.h>
#include <MFRC522.h>
#include <WiFi.h>
#include <WiFiClientSecure.h>

MFRC522 rfid(SS_PIN, RST_PIN);

void setup() {
  Serial.begin(115200);
  delay(2000);
  SPI.begin(); // init bus SPI
  rfid.PCD_Init(); // init modulo FRC522
  initializeWiFi();
  Serial.println("Tap an RFID/NFC tag on the RFID-RC522 reader");
}

void loop(){
  // Nuovo tag disponibile
  if (rfid.PICC_IsNewCardPresent()) { 
    if (rfid.PICC_ReadCardSerial()) {
      MFRC522::PICC_Type piccType = rfid.PICC_GetType(rfid.uid.sak);
      Serial.print("RFID/NFC Tag Type: ");
      Serial.println(rfid.PICC_GetTypeName(piccType));

      // stampa dell'UID del tag in formato esadecimale
      Serial.print("UID:");
      for (int i = 0; i < rfid.uid.size; i++) {
        Serial.print(rfid.uid.uidByte[i] < 0x10 ? " 0" : " ");
        Serial.print(rfid.uid.uidByte[i], HEX);
      }
      Serial.println();
      rfid.PICC_HaltA();
      rfid.PCD_StopCrypto1();
    }
  }
}