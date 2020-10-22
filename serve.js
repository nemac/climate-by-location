const url = require('url');
const nodeStatic = require('node-static');
const http = require('http');


let port = 8080;
// instantiate file server with caching disabled
let fileServer = new nodeStatic.Server( './', {headers: {"cache-control": "no-cache, must-revalidate", "Access-Control-Allow-Origin": "*",  "Access-Control-Allow-Methods": "GET",  "Access-Control-Allow-Headers": "Content-Type"}, gzip: true});

// handle requests
http.createServer(function (request, response) {
  request.addListener('end', function () {
    fileServer.serve(request, response);
  }).resume();
}).listen(port);


console.log(`Serving at  http://localhost:${port}/`);

// allow graceful shutdown.
process.on('SIGTERM', function () {
  fileServer.close(function () {
    process.exit(0);
  });
});