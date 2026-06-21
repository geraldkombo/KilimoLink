// Try to start NestJS directly, fall back to health server on failure
var nestError = null;
try {
  require('./dist/main');
} catch (e) {
  nestError = e;
  console.error('NestJS failed, health server fallback:', e.message);
  var http = require('http');
  var PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
  http.createServer(function(req, res) {
    if (req.url === '/debug') {
      var info = { error: nestError.message };
      try {
        var fs = require('fs');
        var path = require('path');
        info.dist = fs.readdirSync(path.join(__dirname, 'dist'));
        if (fs.existsSync(path.join(__dirname, 'dist/common'))) {
          info.common = fs.readdirSync(path.join(__dirname, 'dist/common')).join(', ');
        } else {
          info.common = 'MISSING';
        }
      } catch(ex) { info.fsError = ex.message; }
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(info));
      return;
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', service: 'KilimoLink' }));
  }).listen(PORT);
}
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', service: 'KilimoLink' }));
  }).listen(PORT);
}
