var socketio = require('socket.io');
var express = require('express');
var http = require('http');
var ejs = require('ejs');
var fs = require('fs');



var app = express();
app.use(express.static('public'));

var blackjack = ['안녕하세요 Korean heroes, 나의 이름은 Alan Dabiri이다.'];


var id = 0;
function Card(symbol, value, count) {
    this.count = id++;
    this.symbol = symbol;
    this.value = value;
}

var deck = [
    new Card('H',1),new Card('H',2),new Card('H',3),new Card('H',4),new Card('H',5),new Card('H',6),new Card('H',7),new Card('H',8),new Card('H',9),new Card('H',10),new Card('H','K'),new Card('H','Q'),new Card('H','J'),
    new Card('D',1),new Card('D',2),new Card('D',3),new Card('D',4),new Card('D',5),new Card('D',6),new Card('D',7),new Card('D',8),new Card('D',9),new Card('D',10),new Card('D','K'),new Card('D','Q'),new Card('D','J'),
    new Card('S',1),new Card('S',2),new Card('S',3),new Card('S',4),new Card('S',5),new Card('S',6),new Card('S',7),new Card('S',8),new Card('S',9),new Card('S',10),new Card('S','K'),new Card('S','Q'),new Card('S','J'),
    new Card('C',1),new Card('C',2),new Card('C',3),new Card('C',4),new Card('C',5),new Card('C',6),new Card('C',7),new Card('C',8),new Card('C',9),new Card('C',10),new Card('C','K'),new Card('C','Q'),new Card('C','J'),
    new Card('H',1),new Card('H',2),new Card('H',3),new Card('H',4),new Card('H',5),new Card('H',6),new Card('H',7),new Card('H',8),new Card('H',9),new Card('H',10),new Card('H','K'),new Card('H','Q'),new Card('H','J'),
    new Card('D',1),new Card('D',2),new Card('D',3),new Card('D',4),new Card('D',5),new Card('D',6),new Card('D',7),new Card('D',8),new Card('D',9),new Card('D',10),new Card('D','K'),new Card('D','Q'),new Card('D','J'),
    new Card('S',1),new Card('S',2),new Card('S',3),new Card('S',4),new Card('S',5),new Card('S',6),new Card('S',7),new Card('S',8),new Card('S',9),new Card('S',10),new Card('S','K'),new Card('S','Q'),new Card('S','J'),
    new Card('C',1),new Card('C',2),new Card('C',3),new Card('C',4),new Card('C',5),new Card('C',6),new Card('C',7),new Card('C',8),new Card('C',9),new Card('C',10),new Card('C','K'),new Card('C','Q'),new Card('C','J')
];



var server = http.createServer(app);
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





// 소켓 서버
var io = socketio.listen(server);
io.sockets.on('connection', function (socket) {

    socket.on('game_start',function (data){
        blackjack = JSON.stringify(deck[1]);
        console.log(blackjack);
        io.sockets.emit('game_start',blackjack);
    });

});