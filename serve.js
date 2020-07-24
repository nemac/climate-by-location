const url = require('url');
const nodeStatic = require('node-static');
const http = require('http');


let port = 8080;

let fileServer = new nodeStatic.Server( './', {headers: {"Cache-Control": "no-cache, must-revalidate", "Access-Control-Allow-Origin": "*",  "Access-Control-Allow-Methods": "GET",  "Access-Control-Allow-Headers": "Content-Type"}, gzip: true});


http.createServer(function (request, response) {
  request.addListener('end', function () {
    fileServer.serve(request, response);
  }).resume();
}).listen(port);


console.log(`Serving at  http://localhost:${port}/`);
