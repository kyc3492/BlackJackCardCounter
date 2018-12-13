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
//플레이어, 딜러의 카드값과 파산여부
var playerTotal = 0;
var pBursted = 0;
var dealerTotal = 0;
var dBursted = 0;


var fdata = new Object();
function fdata_initializer(){
    fdata.fund = 1000;
    fdata.bet = 0;
    fdata.countinfo = [];
    fdata.playercard = [];
    fdata.dealercard = [];
}

fdata_initializer();

/*
function fdata(bet, cinfo, pcard, dcard, fund) {
    this.fund = 1000;
    this.bet = bet;
    this.countinfo = cinfo;
    this.playercard = pcard;
    this.dealercard = dcard;
};
*/

app.get('/', function (request, response, next) {
    fs.readFile('index.html', function (error, data) {
        //실제론 게임이 진행되는 곳은 game.html이지만 같은 하나의 페이지에서 진행되므로 일단 놔둬보겠음.
        response.send(data.toString());
    });
});

app.get('/fdata', function(request, response, next){
    response.send(fdata);
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
        fdata.bet = bet;
        fdata.fund = fdata.fund - fdata.bet;

        deck = card.shuffle(card.deck);
        //시작 카드 104장
        //cinfo = counter.remainingdecks(deck);
        
        fdata.dealercard = [deck.shift(), deck.shift()];
        fdata.playercard = [deck.shift(), deck.shift()];
        
        calculater();
        // 뽑은 4장을 function에 넣고 돌림

        //json화
       //fdata = JSON.stringify(fdata);
        

        //data = data(bet, cinfo, playercard, dealercard, fund);
        io.sockets.emit('game_start', fdata);
        console.log(fdata);
     });

     socket.on('hit',function (Hit){
        // playercard에 한장 추가과정 [연철]
        strPlayercard = JSON.stringify(fdata.playercard);
        strPlayercard = strPlayercard.replace("]", "");
        strPlayercard = strPlayercard + "," + JSON.stringify(deck.shift()) + "]";
        //fdata.playercard = fdata.playercard + [deck.shift()];
        fdata.playercard = JSON.parse(strPlayercard);
        //playerTotal에 card값을 더하는 과정
        console.log(strPlayercard);
        //굳이 로그 띄워보는 코드임 지워도 됨 [연철]

        additional_calculaterP();

        if(playerTotal>21){
            pBursted = 1;
            //플레이어 파산하면 바로 승패로 이동
            whoWin();
            return;
        }
        
        //data = new fdata(bet, cinfo, playercard, dealercard, fund);
        io.sockets.emit('hit', fdata);
     });

     socket.on('stand',function (Stand){
        //dealerTotal에 card값을 더하는 과정
        for(j=0; j<fdata.dealercard.length; j++){
            dealerTotal = dealerTotal + fdata.dealercard[j].value;
            if(dealerTotal<17){
                fdata.dealercard = fdata.dealercard + [deck.shift()];
            }
            //21을 초과할 경우, A의 존재 여부, 없으면 bursted
            if(dealerTotal>21 && fdata.dealercard.every.value == 11){
                dealerTotal = dealerTotal - 10;
            }
            if(dealerTotal>21){
                dBursted = 1;
                break;
            }
        }
        whoWin();
        //data = new fdata(bet, cinfo, playercard, dealercard, fund);
        io.sockets.emit('stand', data);
     });

     function whoWin(){
        //플레이어 파산한 경우, 무조건 패
        if(pBursted == 1){
            fdata.fund = fdata.fund ;
        }
        //플레이어는 파산 x 딜러만 파산한 경우, 플레이어 승
        //플레이어만 파산한 경우, bet이 사라지고 fund는 그대로니 동일
        else if(dBursted == 1){
            fdata.fund = fdata.fund + 2*fdata.bet;
        }
        //둘다 파산이 아닌 경우
        else{
            //플레이어 승
            if(playerTotal > dealerTotal){
                fdata.fund = fdata.fund + 2*fdata.bet;
            }
            //무승부
            else if(playerTotal == dealerTotal){
                fdata.fund = fdata.fund + fdata.bet;
            }
            //딜러 승
            else{
                fdata.fund = fdata.fund;
            }
        }
     };

     function reset(){
        fdata.playercard = []
        fdata.dealercard = []
        playerTotal = 0;
        pBursted = 0;
        dealerTotal = 0;
        dBursted = 0;
    //    data = new fdata(bet, cinfo, playercard, dealercard, fund);
      //  io.sockets.emit('reset');
     };

    //총합 계산기
    function calculater(){
        for(i=0; i<fdata.playercard.length; i++){
            if(fdata.playercard[i].value == 11 && playerTotal > 21){
                playerTotal = playerTotal + 1;
            } else if (fdata.playercard[i].value == 'K' || fdata.playercard[i].value == 'Q' || fdata.playercard[i].value == 'J'){
                playerTotal = playerTotal + 10;
            } else {
                playerTotal = playerTotal + fdata.playercard[i].value;
            }
            console.log("playerTotal: " + playerTotal);
        }

        for(i=0; i<fdata.dealercard.length; i++){
            if(fdata.dealercard[i].value == 11 && fdata.dealerTotal > 21){
                dealerTotal = dealerTotal + 1;
            } else if (fdata.dealercard[i].value == 'K' || fdata.dealercard[i].value == 'Q' || fdata.dealercard[i].value == 'J'){
                dealerTotal = dealerTotal + 10;
            } else {
                dealerTotal = dealerTotal + fdata.dealercard[i].value;
            }
            console.log("dealerTotal: " + dealerTotal);
        }
    }

    function additional_calculaterP(){
        var i = fdata.playercard.length - 1;

        if(fdata.playercard[i].value == 11 && playerTotal > 21){
            playerTotal = playerTotal + 1;
        } else if (fdata.playercard[i].value == 'K' || fdata.playercard[i].value == 'Q' || fdata.playercard[i].value == 'J'){
            playerTotal = playerTotal + 10;
        } else {
            playerTotal = playerTotal + fdata.playercard[i].value;
        }
        console.log("playerTotal: " + playerTotal);
    }

    function additional_calculaterD(){
        var i = fdata.dealercard.length - 1;

        for(i=0; i<fdata.dealercard.length; i++){
            if(fdata.dealercard[i].value == 11 && fdata.dealerTotal > 21){
                dealerTotal = dealerTotal + 1;
            } else if (fdata.dealercard[i].value == 'K' || fdata.dealercard[i].value == 'Q' || fdata.dealercard[i].value == 'J'){
                dealerTotal = dealerTotal + 10;
            } else {
                dealerTotal = dealerTotal + fdata.dealercard[i].value;
            }
            console.log("dealerTotal: " + dealerTotal);
        }
    }
});