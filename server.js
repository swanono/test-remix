import Fastify from 'fastify';
import { createRequestHandler } from '@mcansh/remix-fastify';

const viteDevServer =
  process.env.NODE_ENV === 'production'
    ? null
    : await import('vite').then((vite) =>
        vite.createServer({ server: { middlewareMode: true } })
      );

const app = Fastify({
  logger: true,
});

app.addHook('onRequest', async (request, reply) => {
  if (viteDevServer) {
    await new Promise((resolve, reject) => {
      viteDevServer.middlewares(request.raw, reply.raw, (err) => {
        if (err) reject(err);
        resolve();
      });
    });
  }
});

const build = viteDevServer
  ? () => viteDevServer.ssrLoadModule('virtual:remix/server-build')
  : await import('./build/server/index.js');

app.all('*', createRequestHandler({ build }));

try {
  await app.listen({ port: 3000 });
} catch (error) {
  app.log.error(err);
  process.exit(1);
}
