var socketio = require('socket.io');
var express = require('express');
var http = require('http');
var fs = require('fs');
var ejs = require('ejs');
//var counter = require('counter.js')

var card = require('./cards.js');

var app = express();
var server = http.createServer(app);

app.use(express.static("backup"));

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
        //실제론 게임이 진행되는 곳은 game.html이지만 같은 하나의 페이지에서 진행되므로 일단 놔둬보겠음.
        response.send(data.toString());
    });
});

server.listen(52273, function () {
    console.log('blackjack server running');
});

var io = socketio.listen(server);
io.sockets.on('connection', function (socket){
     
    socket.on('game_start',function (bet){
        //카드 리셋
        reset();
        //자본금에서 배팅금액 차감
        fund = fund - bet;

        deck = card.shuffle(card.deck);
        //시작 카드 104장
        //cinfo = counter.remainingdecks(deck);
        
        dealercard = [deck.shift(), deck.shift()];
        playercard = [deck.shift(), deck.shift()];
        
        // 뽑은 4장을 function에 넣고 돌림

        data = new fdata(bet, cinfo, playercard, dealercard, fund);
        io.sockets.emit('game_start', data);
     });

     socket.on('hit',function (Hit){
        // playercard에 한장 추가
        playercard = playercard + [deck.shift()];
        //playerTotal은 카드 합산 점수, pBursted는 플레이어 파산여부
        var playerTotal = 0;
        var pBursted = 0;
        //playerTotal에 card값을 더하는 과정
        for(i=0; i<playercard.length; i++){
            playerTotal = playerTotal + playercard[i].value;
            //21을 초과할 경우, A의 존재 여부, 없으면 bursted
            if(playerTotal>21 && playercard.every.value == 11){
                playerTotal = playerTotal - 10;
            }
            if(playerTotal>21){
                pBursted = 1;
                //플레이어 파산하면 바로 승패로 이동
                whoWin();
                break;
            }
        }
        
        data = new fdata(bet, cinfo, playercard, dealercard, fund);
        io.sockets.emit('hit', data);
     });

     socket.on('stand',function (Stand){
        //dealerTotal은 카드 합산 점수, dBursted는 딜러 파산여부
        var dealerTotal = 0;
        var dBursted = 0;
        //dealerTotal에 card값을 더하는 과정
        for(j=0; j<dealercard.length; j++){
            dealerTotal = dealerTotal + dealercard[j].value;
            if(dealerTotal<17){
                dealercard = dealercard + [deck.shift()];
            }
            //21을 초과할 경우, A의 존재 여부, 없으면 bursted
            if(dealerTotal>21 && dealercard.every.value == 11){
                dealerTotal = dealerTotal - 10;
            }
            if(dealerTotal>21){
                dBursted = 1;
                break;
            }
        }
        whoWin();
        data = new fdata(bet, cinfo, playercard, dealercard, fund);
        io.sockets.emit('stand', data);
     });

     socket.on('whoWin',function (whoWin){
        //플레이어 딜러 둘다 파산한 경우, 배팅을 돌려줌
        if(pBursted == 1 && dBursted == 1){
            fund = fund + bet;
        }
        //플레이어는 파산 x 딜러만 파산한 경우, 플레이어 승
        //플레이어만 파산한 경우, bet이 사라지고 fund는 그대로니 동일
        else if(dBursted == 1){
            fund = fund + 2*bet;
        }
        //둘다 파산이 아닌 경우
        else{
            //플레이어 승
            if(playerTotal > dealerTotal){
                fund = fund + 2*bet;
            }
            //무승부
            else if(playerTotal == dealerTotal){
                fund = fund + bet;
            }
            //딜러 승
            else{
                fund = fund;
            }
        }

        data = new fdata(bet, cinfo, playercard, dealercard, fund);
        io.sockets.emit('whoWin', data);
     });

     socket.on('reset',function(reset){
        playercard = []
        dealercard = []

        data = new fdata(bet, cinfo, playercard, dealercard, fund);
        io.sockets.emit('reset');
     });

});