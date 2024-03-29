import fastify from 'fastify';
import fs from 'node:fs';
import path from 'node:path';
import pino from "pino";
import * as JSONbig from 'json-bigint';
import { contractInstance } from './contract';
import * as env from "./config/environment.conf";
import {ReceiptOutput, TransactionHash, Web3ContractError, Web3Error} from "web3";
import * as web3 from 'web3';


const requiredVariables = ["ABI_PATH", "CONTRACT_ADDRESS"];
env.checkRequiredEnvVariables(requiredVariables);

interface IPackageQuerystring {
  packageID: string;
}

interface IFetchAllPackagesQuerystring {
  callerAddress: string;
}

const server = fastify({
  logger: pino({level : "info"}),
  http2: true,
  https: {
    allowHTTP1: true,
    key: fs.readFileSync(path.join(__dirname, '..', 'certs', 'Server', 'server.key')),
    cert: fs.readFileSync(path.join(__dirname, '..', 'certs', 'Server', 'server.crt'))
  }
});

server.get('/', async (request, reply) => {
    return 'pong\n';
});

server.get<{Querystring: IFetchAllPackagesQuerystring}>('/getAllPackages', async (request, reply) => {
  try {
    const { callerAddress } = request.query;
    const response = await contractInstance.methods['getAllPackages']().call({from: callerAddress})
    const parsedResponse = JSONbig.stringify(response, null, 2);
    reply.send(parsedResponse)
  } catch (e) {
    console.error("An error has occurred: " + e);
    reply.code(400).send(e);
  }
})

server.get<{Querystring: IPackageQuerystring}>('/getPackageInfo', async (request, reply) => {
  try {
    const { packageID } = request.query;
    const response = await (contractInstance.methods.getPackageById as any)(packageID).call({from: env.getEnvVar('CONTRACT_OWNER')});
    const parsedResponse = JSONbig.stringify(response, null, 2);
    reply.send(parsedResponse)
  } catch (e) {
    console.error("An error has occurred: " + e);
    reply.code(400).send(e);
  }
})

server.get<{Querystring: IPackageQuerystring}>('/markAsDelivered', async (request, reply) => {

  const confirmationNumber = await new Promise((resolve, reject) => {
    try {
      const { packageID } = request.query;
      (contractInstance.methods.deliverPackage as any)(packageID)
          .send({
            from: env.getEnvVar("FROM_ADDRESS")
          })
          .on('transactionHash', (hash: TransactionHash) => {
            console.log('Transaction Hash:', hash);
          })
          .on('confirmation', (confirmationNumber: any, receipt: ReceiptOutput) => {
            resolve(JSONbig.stringify(confirmationNumber, null, 2));
          })
          .on('error', (error: Web3ContractError) => {
            reject(error.toJSON())
          })
    } catch (e) {
      console.error("An error has occurred: " + e);
      reject(e)
    }
  })
  reply.send(confirmationNumber)
})

server.listen({port: 8000, host: '0.0.0.0'}, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  // console.log(`Cert path is: ${path.join(__dirname, '..', 'certs', 'Server', 'server.crt')}`)
  // console.log(`Key path is: ${path.join(__dirname, '..', 'certs', 'Server', 'server.key')}`)

  console.log(`Server is listening at ${address}`);
})
