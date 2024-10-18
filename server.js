import Fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import path from 'path'; // Import the path module
import { createRequestHandler } from '@mcansh/remix-fastify';
import * as build from './build/server/index.js';
import { fileURLToPath } from 'url';

// Convert the import.meta.url to a path
const __filename = fileURLToPath(import.meta.url); // Get the current file path
const __dirname = path.dirname(__filename);

const app = Fastify({
  logger: true,
});

await app.register(fastifyStatic, {
  // eslint-disable-next-line no-undef
  root: path.join(__dirname, 'build/client'),
  prefix: '/build/client/',
});

app.all('*', createRequestHandler({ build }));

app.listen({ port: 3000 }, (err, address) => {
  app.log.info(`Server listening at ${address}`);
});
