import { defineConfig } from 'vite';
import { readFileSync } from 'node:fs';
import path from 'node:path';

// Serves pre-rendered HTML for every route during `vite dev`, mirroring what
// scripts/prerender.mjs writes into dist/ at build time.
function ssgDevPlugin() {
  return {
    name: 'ssg-dev',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        try {
          const url = (req.url || '').split('?')[0];
          if (url.includes('.')) return next();
          const routesMod = await server.ssrLoadModule('/src/routes.js');
          const routePath = url.endsWith('/') ? url : `${url}/`;
          const route = routesMod.findRoute(routePath);
          if (!route) return next();
          const template = readFileSync(path.resolve(server.config.root, 'index.html'), 'utf8');
          let html = routesMod.renderDocument(route, template);
          html = await server.transformIndexHtml(req.url, html);
          res.statusCode = 200;
          res.setHeader('Content-Type', 'text/html');
          res.end(html);
        } catch (err) {
          next(err);
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [ssgDevPlugin()],
});
