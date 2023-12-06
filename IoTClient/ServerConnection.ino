bool connectToServer() {
  unsigned long startListeningTime = millis();
  client.setCACert(root_ca);
  client.setCertificate(client_cert); // for client verification
  client.setPrivateKey(client_key);	// for client verification

  Serial.println("\nStarting connection to server...");
  do {
    delay(1000);
    if ((millis() - startListeningTime) > 20000) {
      Serial.println("Server not responding.");
      WiFi.disconnect(true);  // Disconnect from the network
      WiFi.mode(WIFI_OFF);    //Switch WiFi off
      delay(3000);
      return false;
    }
    int cert_result = client.lastError(NULL, 0);
    if (cert_result == -1) Serial.println(F("ERR: No Server Connection"));
    else if (cert_result < 0) Serial.println(F("ERR: Certificate or Certificate-Chain Error"));
  } while (!client.connect(hostname, port));
  Serial.println("Successfully estabilished a connection with server.");
  return true;
}

