const { exec } = require('child_process');
const { Web3 } = require('web3');

const truffleMigrate = () => {
  return new Promise((resolve, reject) => {
    exec('truffle migrate --reset', (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve(stdout);
      }
    });
  });
};

const runTruffleCommands = async (data) => {
  try {
    // Run Truffle migrations
    console.log('Running Truffle migrations...');
    await truffleMigrate();
    console.log('Truffle migrations completed.');

    const ShipmentArtifact = require('./build/contracts/Shipment.json');

    // Connect to the local Ethereum node
    const web3 = new Web3('http://localhost:7545');
    const Shipment = new web3.eth.Contract(ShipmentArtifact.abi, ShipmentArtifact.networks['5777'].address);

    console.log('Contract Address:', await Shipment.options.address);
    console.log('Balance:', await web3.eth.getBalance(Shipment.options.address));
    
    console.log("Funding Smart Contract...");
    const valueToSend = web3.utils.toWei("10", "ether");
    await web3.eth.sendTransaction({
      from: contractFunder,
      to: Shipment.options.address,
      value: valueToSend,
    });
    console.log('New balance:', await web3.eth.getBalance(Shipment.options.address));

    console.log('Executing commands...');
    await Shipment.methods.shipPackage(packageId, receiver, web3.utils.toWei("2.3", "ether")).send({ from: contractOwner, gas: 500000});
    console.log("Package shipped successfully.");
    const result = await Shipment.methods.getAllPackages().call({from: contractOwner});
    console.log("Fetched all packages. Output is: ", result);
    console.log('Commands executed successfully.');
  } catch (error) {
    console.error(error);
  }
};

const [, , contractOwner, contractFunder, receiver, packageId] = process.argv;
runTruffleCommands(contractOwner, receiver, contractFunder, packageId);
