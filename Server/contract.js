"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.contractInstance = void 0;
const web3_1 = require("web3");
const fs = __importStar(require("fs"));
const environment_conf_1 = require("./config/environment.conf");
// Connection to the Ganache local Ethereum node
const web3 = new web3_1.Web3('http://localhost:7545');
const contractABI = JSON.parse(fs.readFileSync((0, environment_conf_1.getEnvVar)("ABI_PATH"), 'utf8'));
const contractAddress = (0, environment_conf_1.getEnvVar)("CONTRACT_ADDRESS");
exports.contractInstance = new web3.eth.Contract(contractABI.abi, contractAddress);
