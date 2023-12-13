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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const pino_1 = __importDefault(require("pino"));
const JSONbig = __importStar(require("json-bigint"));
const contract_1 = require("./contract");
const env = __importStar(require("./config/environment.conf"));
const requiredVariables = ["ABI_PATH", "CONTRACT_ADDRESS"];
env.checkRequiredEnvVariables(requiredVariables);
const server = (0, fastify_1.default)({
    logger: (0, pino_1.default)({ level: "info" }),
    http2: true,
    https: {
        allowHTTP1: true,
        key: node_fs_1.default.readFileSync(node_path_1.default.join(__dirname, '..', 'certs', 'Server', 'server.key')),
        cert: node_fs_1.default.readFileSync(node_path_1.default.join(__dirname, '..', 'certs', 'Server', 'server.crt'))
    }
});
server.get('/ping', async (request, reply) => {
    return 'pong\n';
});
server.get('/', async (request, response) => {
    try {
        const { packageID } = request.query;
        console.log(`Received ${packageID} from client`);
        return `The package ${packageID} has been successfully scanned.`;
    }
    catch (e) {
        console.log("SSL error: " + e);
    }
});
server.get('/getAllPackages', async (request, reply) => {
    try {
        const response = await contract_1.contractInstance.methods['getAllPackages']().call({ from: '0x4B9B09c6950a3184b00064196c58023BC22d528e' });
        const parsedResponse = JSONbig.stringify(response, null, 2);
        reply.send(parsedResponse);
    }
    catch (e) {
        console.error("An error has occurred: " + e);
        reply.code(400).send(e);
    }
});
server.get('/getPackageInfo', async (request, reply) => {
    try {
        const { packageID } = request.query;
        const response = await contract_1.contractInstance.methods.getPackageById(packageID).call({ from: '0x4B9B09c6950a3184b00064196c58023BC22d528e' });
        const parsedResponse = JSONbig.stringify(response, null, 2);
        reply.send(parsedResponse);
    }
    catch (e) {
        console.error("An error has occurred: " + e);
        reply.code(400).send(e);
    }
});
server.listen({ port: 8000, host: '0.0.0.0' }, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Cert path is: ${node_path_1.default.join(__dirname, '..', 'certs', 'Server', 'server.crt')}`);
    console.log(`Key path is: ${node_path_1.default.join(__dirname, '..', 'certs', 'Server', 'server.key')}`);
    console.log(`Server is listening at ${address}`);
});
