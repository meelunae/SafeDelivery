import fastify from 'fastify';
import fs from 'node:fs';
import path from 'node:path';


interface IPackageQuerystring {
  packageID: string;
}

const server = fastify({
  http2: true,
  https: {
    allowHTTP1: true,
    key: fs.readFileSync(path.join(__dirname, '..', 'certs', 'Server', 'server.key')),
    cert: fs.readFileSync(path.join(__dirname, '..', 'certs', 'Server', 'server.crt'))
  }
});

server.get('/ping', async (request, reply) => {
    return 'pong\n';
});

server.get<{Querystring: IPackageQuerystring}>('/', async (request, response) => {
  try {
  const { packageID } = request.query;
  console.log(`Received ${packageID} from client`)
  return `The package ${packageID} has been successfully scanned.`;
  } catch (e) {
    console.log("SSL error: " + e);
  }
  });


server.listen({port: 8000, host: '0.0.0.0'}, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Cert path is: ${path.join(__dirname, '..', 'certs', 'Server', 'server.crt')}`)
  console.log(`Key path is: ${path.join(__dirname, '..', 'certs', 'Server', 'server.key')}`)

  console.log(`Server is listening at ${address}`);
})
