const http = require('http');
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

let nestApp = null;

const server = http.createServer((req, res) => {
  if (nestApp) {
    nestApp(req, res);
  } else {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', service: 'KilimoLink API', health: 'up' }));
  }
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught exception (health server still up):', err.message);
});
process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection (health server still up):', err);
});

server.listen(PORT, () => {
  console.log('Health server listening on port', PORT);
  try {
    const { boot } = require('./dist/main');
    boot(server).then((expressApp) => {
      nestApp = expressApp;
      console.log('NestJS ready, delegating to Express');
    }).catch((err) => {
      console.error('NestJS bootstrap failed (health server still up):', err);
    });
  } catch (err) {
    console.error('Failed to load NestJS (health server still up):', err.message);
  }
});
