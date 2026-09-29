   const http = require('http');
   const fs = require('fs');
   const path = require('path');

   const PORT = process.env.SERVER_PORT || 8080;
   const ROOT = path.join(__dirname, 'public');
   const TYPES = {
     '.html': 'text/html; charset=utf-8',
     '.js': 'text/javascript',
     '.css': 'text/css',
     '.json': 'application/json',
     '.png': 'image/png',
     '.jpg': 'image/jpeg',
     '.svg': 'image/svg+xml',
   };

   http.createServer((req, res) => {
     let urlPath = decodeURIComponent(req.url.split('?')[0]);
     if (urlPath.endsWith('/')) urlPath += 'index.html';

     const filePath = path.join(ROOT, urlPath);
     if (!filePath.startsWith(ROOT)) {
       res.writeHead(403); return res.end('Forbidden');
     }

     fs.readFile(filePath, (err, data) => {
       if (err) { res.writeHead(404); return res.end('404 Not Found'); }
       res.writeHead(200, {
         'Content-Type': TYPES[path.extname(filePath)] || 'application/octet-stream'
       });
       res.end(data);
     });
   }).listen(PORT, '0.0.0.0', () => console.log(`Site sur le port ${PORT}`));
