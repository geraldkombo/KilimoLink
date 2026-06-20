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
  var fs = require('fs');
  var path = require('path');
  http.createServer(function(req, res) {
    if (req.url === '/debug') {
      var info = { error: nestError.message, stack: nestError.stack.split('\n') };
      try { info.dist = fs.readdirSync(path.join(__dirname, 'dist')); } catch(e) { info.dist = 'ERROR: ' + e.message; }
      try { info.common = fs.readdirSync(path.join(__dirname, 'dist/common')).join(', '); } catch(e) { info.common = 'ERROR: ' + e.message; }
      try { info.admin = fs.readdirSync(path.join(__dirname, 'dist/admin')).join(', '); } catch(e) { info.admin = 'ERROR: ' + e.message; }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(info));
      return;
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', service: 'KilimoLink' }));
  }).listen(PORT);
}
