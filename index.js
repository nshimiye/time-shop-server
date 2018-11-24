'use strict';
var http = require('http');
var fs = require('fs');

http.createServer(function(req, res) {
  // debugHeaders(req);

  if (req.headers.accept && req.headers.accept == 'text/event-stream') {
    if (req.url == '/events') {
      sendSSE(req, res);
    } else {
      res.writeHead(404);
      res.end();
    }
  } else {
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(fs.readFileSync(__dirname + '/sse-node.html'));
    res.end();
  }
}).listen(8000);

function sendSSE(req, res) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive',
    'Access-Control-Allow-Origin': '*',
  });

  var nextId = 0;
  var id = (new Date()).toLocaleTimeString();
  var customerEvent = { initEvent: true };

  // Sends a SSE every 5 seconds on a single connection.
  setInterval(function() {
    nextId = nextId+1;
    customerEvent = {
      id: nextId.toString(),
      title: 'Customer ' + nextId,
      start: new Date(2018, 10, 18, 0, 0, 1),
      end: new Date(2018, 10, 18, 0, 10, 1),
    };
    constructSSE(res, id, customerEvent);
    debugHeaders(req);
  }, 5000);

  constructSSE(res, id, customerEvent);
}

function constructSSE(res, id, data) {
  res.write('id: ' + id + '\n');
  res.write('data: ' + JSON.stringify(data) + '\n\n');
}

function debugHeaders(req) {
  console.log('URL: ' + req.url);
  for (var key in req.headers) {
    console.log(key + ': ' + req.headers[key]);
  }
  console.log('\n\n');
}