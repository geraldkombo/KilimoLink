// Try to start NestJS directly, fall back to health server on failure
try {
  require('./dist/main');
} catch (e) {
  const http = require('http');
  const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
  http.createServer((_req, res) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', service: 'KilimoLink' }));
  }).listen(PORT);
  console.error('NestJS failed, health server fallback:', e.message);
}
