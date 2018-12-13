var socketio = require('socket.io');
var express = require('express');
var http = require('http');
var fs = require('fs');


var app = express();
app.use(express.static('public'));


var server = http.createServer(app);
server.listen(52273, function () {
    console.log('server running at http://127.0.0.1:52273');
});


app.get('/', function (request, response) {
    
    fs.readFile('chat.html', function (error, data) {
        response.send(data.toString());
    });
});

var io = socketio.listen(server);
io.sockets.on('connection', function (socket) {

    socket.on('msg',function (data){
        io.sockets.emit('msg',data);
    });

});