
# SafeDelivery

  

Proof-of-Concept on-chain parcel escrow delivery system built for our Data Security/IoT Security classes' final projectwork.

More stuff will be added as the project is developed further.

  

## Usage


### Smart Contract
The development environment assumes (as specified in **truffle-config.js**) that you are running a **Ganache** instance listening on **localhost:7545** and that you have installed **Truffle** and **solc 0.5.0**.
The project comes with a plug-and-play deployment script (**deployer.js**) that executes the following commands:
- Deploys the smart contract
- Adds funds to smart contract (1 ETH) for gas fees
- Creates a test package with the parameters specified when executing the script
- Pays for the test package from the **package receiver**'s chain account
- Marks the package as shipped from the **package sender**'s account.

An example way to call the script is as follows:
```
node deployer.js -o "0x38A330BD6aAb5f0D63c8ca36Dc2f468F5Aee37B8" -f "0xa9f575841dBfBaE5b0797c96af6cD6d6F3485465" -s "0x10C90904F08CD6978DD6C26F58E490CBA2012B9E" -r "0xD4F96A60f29161E65e48566c03127DE81a2091DC" -p "01020304"
```
This way you have an environment ready to scan your NFC tag and mark your package as delivered to easily reproduce the final result! :)

If you are interested in manually deploying the smart contract,  run `truffle migrate --reset` and proceed to update the variables in the server's .env file with the contract's ABI path and address.
You can retrieve the contract's on-chain address from the Truffle console.
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
