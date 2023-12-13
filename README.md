
# SafeDelivery

  

Proof-of-Concept on-chain parcel escrow delivery system built for our Data Security/IoT Security classes' final projectwork.

More stuff will be added as the project is developed further.

  

## Usage


### Smart Contract
The development environment assumes (as specified in **truffle-config.js**) that you are running a Ganache instance listening on localhost:7545 and that you have installed Truffle and solc 0.5.0.
To deploy the smart contract, run `truffle migrate --reset` and proceed to update the variables in the server's .env file with the contract's ABI path and address.
You can retrieve the contract's on-chain address  from the Truffle console.
### Client
The hardware used for development is an **ESP32-WROOM** (purchasable [here](https://www.amazon.it/AZDelivery-NodeMCU-Development-Arduino-gratuito/dp/B071P98VTG/)) combined with a **RC522 RFID reader** (purchasable [here](https://www.robotstore.it/Lettore-di-smart-card-contactless-RFID-13-56MHz-Mifare-RC522)).
For the client portion of the project, you **must** create a valid config.h file in the **IoTClient** directory, starting from the template provided in config.h.example.

### Server
Install the required dependencies through `npm install`, then compile the project using `npm run build` and once the project has been compiled you can start the server through `npm run start`.  
## Instructions on how to generate certificates

  

These commands assume you are inside the project root directory.

  

**Note: you need to have a different CN (common name) for your CA and your server/client, or the certificates will be recognized as self-signed!**

  

**Create a folder to store your certificates**

  
    mkdir certs && cd certs
  

**Create folders for CA, Client and Server certificates**

  

    mkdir CA
    mkdir Client
    mkdir Server

  

**Create the CA private key and certificate**

    cd CA
    openssl genpkey -algorithm RSA -out ca.key
    openssl req -x509 -new -key ca.key -out ca.crt

  

**Create the Server private key, certificate request and certificate**

  

    cd ../Server
    openssl genpkey -algorithm RSA -out server.key
    openssl req -new -key server.key -out server.csr
    openssl x509 -req -in server.csr -CA ../CA/ca.crt -CAkey ../CA/ca.key -out server.crt -CAcreateserial

  

**Create the Client private key, certificate request and certificate**

    cd ../Client
    openssl genpkey -algorithm RSA -out client.key
    openssl req -new -key client.key -out client.csr
    openssl x509 -req -in client.csr -CA ../CA/ca.crt -CAkey ../CA/ca.key -out client.crt -CAcreateserial

  

You now have a **certs** folder inside your project clone's root directory with a full certificate chain!

  

To use those certificates with your project you must add the content of the required files in your config.h file.
