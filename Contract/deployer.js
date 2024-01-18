const { exec } = require('child_process');
const { Web3 } = require('web3');
const { program } = require('commander');


program
  .version('1.0.0')
  .description('Script to automate a working setup for a demo SafeDelivery deploy.');

  program
  .requiredOption('-o, --contract-owner <owner>', 'Specify the contract owner')
  .requiredOption('-f, --contract-funder <funder>', 'Specify the contract funder')
  .requiredOption('-s, --sender <sender>', 'Specify the sender')
  .requiredOption('-r, --receiver <receiver>', 'Specify the receiver')
  .requiredOption('-p, --package-id <packageId>', 'Specify the package ID');

program.parse(process.argv);

const options = program.opts();

// Access the values of the options
const {
  contractOwner,
  contractFunder,
  sender,
  receiver,
  packageId
} = options;

// Your script logic here...
console.log('Contract Owner:', contractOwner);
console.log('Contract Funder:', contractFunder);
console.log('Sender:', sender);
console.log('Receiver:', receiver);
console.log('Package ID:', packageId);


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

    console.log('[i] Contract Address:', await Shipment.options.address);
    console.log('[i] Balance:', await web3.eth.getBalance(Shipment.options.address));
    
    console.log("[i] Funding Smart Contract...");
    await web3.eth.sendTransaction({
      from: contractFunder,
      to: Shipment.options.address,
      value: web3.utils.toWei("10", "ether"),
    });
    console.log('[+] New balance:', await web3.eth.getBalance(Shipment.options.address));

    console.log('[i] Executing commands...\n');
    console.log("[i] Creating a new package...");
    await Shipment.methods.createPackage(packageId, receiver, web3.utils.toWei("2.3", "ether")).send({ from: sender, gas: 500000});
    console.log("[i] Package creation should be completed. Trying to fetch all packages.");
    const result = await Shipment.methods.getAllPackages().call({from: contractOwner});
    console.log("[+] Output is:", result);
    console.log("\n");
    console.log("[i] Paying for package using the receiver's chain account...");
    await Shipment.methods.payForPackage(packageId).send({from: receiver, value: web3.utils.toWei("2.3", "ether"), gas: 500000});
    console.log("[+] Package should be paid for, new output for getAllPackages is: ", await Shipment.methods.getAllPackages().call({from: contractOwner}));
    console.log("[i] Marking package as shipped through the sender's account...");
    await Shipment.methods.shipPackage(packageId).send({from: sender, gas: 500000});
    console.log("[+] Package should be now marked as shipped, new output for getAllPackages is: ", await Shipment.methods.getAllPackages().call({from: contractOwner}));
    console.log('[+] All commands executed successfully! Scan the package NFC tag with the IoT device to mark it as delivered.');
  } catch (error) {
    console.error("[-] ", error);
  }
};

runTruffleCommands(contractOwner, contractFunder, sender, receiver, contractFunder, packageId);
