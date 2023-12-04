# IoT Security Project

This is a temporary README for our IoT Security project.
More stuff will be added as the project is developed further.

## Usage
For the client portion of the project, you **must** create a valid config.h file in the **IoTClient** directory, starting from the template provided in config.h.example.
## Instructions on how to generate certificates

These commands assume you are inside the project root directory.

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

    cd .. /Client
    openssl genpkey -algorithm RSA -out client.key
    openssl req -new -key client.key -out client.csr
    openssl x509 -req -in client.csr -CA ../CA/ca.crt -CAkey ../CA/ca.key -out client.crt -CAcreateserial

You now have a **certs** folder inside your project clone's root directory with a full certificate chain!

To use those certificates with your project you must add the content of the required files in your config.h file.


