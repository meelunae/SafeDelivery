import { Web3 } from 'web3';
import * as fs from 'fs';
import {getEnvVar} from "./config/environment.conf";

// Connection to the Ganache local Ethereum node
const web3 = new Web3('http://localhost:7545');

const contractABI = JSON.parse(fs.readFileSync(getEnvVar("ABI_PATH"), 'utf8'));
const contractAddress = getEnvVar( "CONTRACT_ADDRESS");
export const contractInstance = new web3.eth.Contract(contractABI.abi, contractAddress);

