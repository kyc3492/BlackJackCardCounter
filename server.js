var socketio = require('socket.io');
var express = require('express');
var http = require('http');
var fs = require('fs');
var counter = require('counter.js')

var card = require('cards.js');

var app = express();
var server = http.createServer(app);

app.use('/js',express.static(__dirname + "/js"));
app.use('/css',express.static(__dirname + "/css"));

var deck = []
var dealercard = []
var playercard = []
var cinfo = []


function fdata(bet, cinfo, pcard, dcard, fund) {
    this.fund = 1000;
    this.bet = bet;
    this.countinfo = cinfo;
    this.playercard = pcard;
    this.dealercard = dcard;
};


app.get('/', function (request, response, next) {
    fs.readFile('index.html', function (error, data) {
        response.send(data.toString());
    });
});

server.listen(PORT, function () {
    console.log('blackjack server running');
});

io.sockets.on('connection', function (socket){
     
    socket.on('game_start',function (bet){
        deck = card.shuffle(card.deck);
        //시작 카드 104장
        //cinfo = counter.remainingdecks(deck);
        
        dealercard = [deck.shift(), deck.shift()];
        playercard = [deck.shift(), deck.shift()];
        
        // 뽑은 4장을 function에 넣고 돌림

        data = new fdata(bet, cinfo, playercard, dealercard);
        io.sockets.emit('game_start', data);
     });

     socket.on('hit',function (Hit){
        // playercard에 한장 추가
        playercard = playercard + [deck.shift()];
        //playerTotal은 카드 합산 점수, pBursted는 플레이어 파산여부
        var playerTotal = 0;
        var pBursted = 0;
        //playerTotal에 card값을 더하는 과정
        for(i=0; i<playercard.length;i++){
            playerTotal = playerTotal + playercard[i].value;
            //21을 초과할 경우, A의 존재 여부, 없으면 burst 
            if(playerTotal>21 && playercard.every.value == 11){
                playerTotal = playerTotal - 10;
            }
            if(playerTotal>21){
                pBursted = 1;
                break;
            }
        }
        if 
        io.sockets.emit('hit', data)
     });

     socket.on('',function (){});

});