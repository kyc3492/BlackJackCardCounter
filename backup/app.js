
var http = require('http');
var fs = require('fs');
var socketio = require('socket.io');
var express = require('express');
var app = express();
const PORT = 32274;


app.use('/js',express.static(__dirname + "/js"));
app.use('/css',express.static(__dirname + "/css"));


var server = http.createServer(app).listen(PORT, function() {console.log('server run')});

app.get('/', function(req, res){
  fs.readFile('index.html',function(error, data){
    res.writeHead(200,{'Content-Type': 'text/html'});
    res.end(data);
  });
});

/*
var io = socketio.listen(server);
io.sockets.on('connection', function (socket) {
  socket.on('message', function (data) {
    io.sockets.emit('message', data);
  });
});

*/