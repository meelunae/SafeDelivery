#include "config.h"
#include <SPI.h>
#include <MFRC522.h>
#include <WiFi.h>
#include <WiFiClientSecure.h>

MFRC522 rfid(SS_PIN, RST_PIN);
WiFiClientSecure client;

void setup() {
  Serial.begin(115200);
  Serial.setDebugOutput(true);
  delay(2000);
  SPI.begin();      // init bus SPI
  rfid.PCD_Init();  // init modulo FRC522
  initializeWiFi();
  Serial.println("Tap an RFID/NFC tag on the RFID-RC522 reader");
}

void loop() {
  // Nuovo tag disponibile
  if (rfid.PICC_IsNewCardPresent() && rfid.PICC_ReadCardSerial()) {
        String tagID = "";
        for (byte i = 0; i < rfid.uid.size; i++) {
            tagID += String(rfid.uid.uidByte[i] < 0x10 ? "0" : "");
            tagID += String(rfid.uid.uidByte[i], HEX);
        }
        sendToServer(tagID);
        delay(1000); // Prevent multiple readings in a short time
    }
}

void sendToServer(String tagID) {
        delay(1000);
        Serial.println("Sending tag ID:  " + tagID);
        client.println("GET /?packageID=" + tagID + " HTTP/1.0");
        client.println("Host: " + String(hostname));
        client.println("Connection: keep-alive");
        client.println();
        Serial.println("Message sent to server");
}