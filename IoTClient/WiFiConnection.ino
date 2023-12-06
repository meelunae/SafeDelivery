void initializeWiFi() {
  if (!WiFi.config(localIP, gateway, mask)) {
    Serial.println("Error during static IP configuration");
  }
  if (WiFi.status() != WL_CONNECTED) {
    WiFi.mode(WIFI_STA);
    WiFi.begin(ssid, password);
    Serial.println("\nConnecting to WiFi");
  }

  Serial.println("Connected to WiFi, trying to estabilish server connection.");

  if(connectToServer()) {
    Serial.print("Local ESP32 IP: ");
    Serial.println(WiFi.localIP());
  }
}