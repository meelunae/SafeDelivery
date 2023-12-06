"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const server = (0, fastify_1.default)({
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
server.listen({ port: 8000, host: '0.0.0.0' }, (err, address) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`Cert path is: ${node_path_1.default.join(__dirname, '..', 'certs', 'Server', 'server.crt')}`);
    console.log(`Key path is: ${node_path_1.default.join(__dirname, '..', 'certs', 'Server', 'server.key')}`);
    console.log(`Server is listening at ${address}`);
});
