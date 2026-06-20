// Try to start NestJS directly, fall back to health server on failure
var nestError = null;
try {
  require('./dist/main');
} catch (e) {
  nestError = e;
  console.error('NestJS failed, health server fallback:', e.message);
  console.error(e.stack);
  var http = require('http');
  var PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
  http.createServer(function(req, res) {
    if (req.url === '/debug') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: nestError.message, stack: nestError.stack.split('\n') }));
      return;
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', service: 'KilimoLink' }));
  }).listen(PORT);
}
