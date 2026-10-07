// Temporary verification harness for the CLIENT_URL / CORS fix.
// Reuses the real createServer.js factory, so the tested code path is exactly
// the one the app ships. No child processes (sandbox blocks spawn with pipes).
const http = require('http');

const ROOT = require('path').join(__dirname, '..', 'backend');

const ORIGINS = [
  null,
  'http://localhost:5173',
  'https://royal-bliz.vercel.app',
  'https://evil.example.com',
];

function freshModules() {
  Object.keys(require.cache)
    .filter((k) => k.startsWith(ROOT) && !k.includes('_tmp-verify'))
    .forEach((k) => delete require.cache[k]);
}

function listen(app) {
  return new Promise((resolve) => {
    const server = http.createServer(app);
    server.listen(0, '127.0.0.1', () => resolve({ server, port: server.address().port }));
  });
}

async function probe(port, origin, path = '/api/products') {
  const res = await fetch(`http://127.0.0.1:${port}${path}`, {
    headers: origin ? { Origin: origin } : {},
  });
  return {
    sent: origin || '(none)',
    status: res.status,
    acao: res.headers.get('access-control-allow-origin') || '(absent)',
  };
}

(async () => {
  const cases = [
    'https://royal-bliz.vercel.app,http://localhost:5173',
    'royal-bliz.vercel.app/',
    '',
  ];
  for (const clientUrl of cases) {
    process.env.CLIENT_URL = clientUrl;
    freshModules(); // must happen BEFORE createServer is required
    const { allowedOrigins, primaryOrigin } = require('../backend/utils/clientOrigin');
    const createServer = require('../backend/createServer');
    const { server, port } = await listen(createServer());

    console.log(`\n=== CLIENT_URL=${JSON.stringify(clientUrl)} ===`);
    console.log(`  allowedOrigins: [${allowedOrigins.join(', ')}]`);
    console.log(`  primaryOrigin : ${primaryOrigin}`);
    for (const origin of ORIGINS) {
      const r = await probe(port, origin, '/'); // "/" needs no DB, so status is meaningful
      console.log(`    origin ${r.sent.padEnd(30)} status=${r.status} acao=${r.acao}`);
    }
    await new Promise((r) => server.close(r));
  }

  // The Vercel handler must connect before touching a model. Point it at an
  // unreachable server and confirm it fails fast with 503 instead of hanging
  // on Mongoose's 10s buffer timeout.
  console.log('\n=== api/index.js handler with unreachable Mongo ===');
  process.env.CLIENT_URL = 'http://localhost:5173';
  process.env.MONGO_URI =
    'mongodb://127.0.0.1:1/nope?serverSelectionTimeoutMS=700&connectTimeoutMS=700';
  freshModules();
  const handler = require('../backend/api/index.js');
  // Wrap the handler in Express so req/res have the Express extensions
  // (res.status/json) that Vercel's runtime provides.
  const express = require('../backend/node_modules/express');
  const wrapped = express();
  wrapped.use(handler);
  const { server, port } = await listen(wrapped);
  const started = Date.now();
  const r = await probe(port, 'http://localhost:5173');
  console.log(`  status=${r.status} in ${Date.now() - started}ms acao=${r.acao}`);
  await new Promise((res) => server.close(res));

  console.log('\nDONE');
  process.exit(0);
})();
