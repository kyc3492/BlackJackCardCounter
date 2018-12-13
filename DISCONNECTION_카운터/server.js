var socketio = require('socket.io');
var express = require('express');
var http = require('http');
var fs = require('fs');



var app = express();
var blackjack = "count user"



app.use(express.static('public'));

var server = http.createServer(app);
server.maxConnections = 2;

server.listen(52273, function () {
    console.log('server running at http://127.0.0.1:52273');
});


app.get('/', function (request, response) {
    
    fs.readFile('indexsample.html', function (error, data) {
        response.send(data.toString());
    });
});

app.get('/blackjack', function (request, response, next) {
    response.send(blackjack);
});


var count = 0

var io = socketio.listen(server);
io.sockets.on('connection', function (socket) {
    count++;
    console.log("user++: "+ count)
    socket.on('disconnect', function(){
        count--;
        console.log("user--: "+ count)
    });
    socket.on('game_start',function (data){
        blackjack += count.toString();
        console.log(blackjack);
        io.sockets.emit('game_start',blackjack);
    });

});