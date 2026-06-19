const http = require('http');
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;

// Bare-minimum health server that starts BEFORE loading NestJS
const healthServer = http.createServer((_req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ status: 'ok', service: 'KilimoLink API', health: 'up' }));
});

healthServer.listen(PORT, () => {
  console.log('Health server listening on port', PORT);
});

// Now load the NestJS app — if it fails, health server keeps running
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception (health server still up):', err.message);
});
process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection (health server still up):', err);
});

try {
  require('./dist/main');
} catch (err) {
  console.error('Failed to load NestJS app (health server still up):', err.message);
}
