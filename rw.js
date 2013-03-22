'use strict';

var http = require('http'),
    fs   = require('fs');

var prefix = __dirname;

var server = http.createServer(function(req, res) {
  if (req.headers['content-type'] !== 'application/json') {
    res.writeHead(405);
    res.end();
  }
  if (req.method === 'GET') {
    fs.readFile(prefix + req.url, 'utf8', function(err, data) {
      if (err) {
        res.writeHead(500);
        res.end();
        return;
      }
      res.writeHead(200, {'Content-Type':'application/json'});
      res.end(data);
    });
  } else if (req.method == 'POST') {
    fs.open(prefix + req.url, 'w', function(err, fd) {
      req.on('data', function(data) {
        fs.write(fd, new Buffer(data), 0, data.length, null, function(err, written, buffer) {
          if (err) {
            res.writeHead(500);
            res.end();
            throw err;
          }
        });
      });
      req.on('end', function() {
        fs.close(fd, function(err, fd) {
          if (err) {
            res.writeHead(500);
            res.end();
            throw err;
          }
        })
        res.writeHead(204);
        res.end();
      });
    });
  }
});

server.listen(8080);
