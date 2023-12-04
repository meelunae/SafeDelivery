void initializeWiFi() {
  if (!WiFi.config(local_IP, gateway, subnet)) {
    Serial.println("Error during static IP configuration");
  }
  if (WiFi.status() != WL_CONNECTED) {
    WiFi.mode(WIFI_STA);
    WiFi.begin(ssid, password);
    Serial.println("\nConnecting to WiFi");
  }
  Serial.println("\nConnected to the WiFi network");
  Serial.print("Local ESP32 IP: ");
  Serial.println(WiFi.localIP());
}