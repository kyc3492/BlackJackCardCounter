var socketio = require('socket.io');
var express = require('express');
var http = require('http');
var fs = require('fs');
var card = require('./cards.js');

var app = express();




app.use(express.static('backup'));

var server = http.createServer(app);
server.maxConnections = 2;

server.listen(52273, function () {
    console.log('server running at http://127.0.0.1:52273/%27');
});
app.get('/', function (request, response) {

    fs.readFile('index.html', function (error, data) {
        response.send(data.toString());
    });
});

var fdata = new Object();
function fdata_initializer(){
    fdata.fund = 1000;
    fdata.bet = 0;
    fdata.countinfo = [];
    fdata.playercard = [];
    fdata.dealercard = [];
}

fdata_initializer();


var deck = []
var dealercard = []
var playercard = []
var cinfo = []
var playerTotal = [];
var pBursted = [];
var dealerTotal = 0;
var dBursted = 0;

var count = 0
var usernum = 0

var io = socketio.listen(server);
io.sockets.on('connection', function (socket) {
    usernum = count;
    io.sockets.emit('usernum', usernum); // 보낸 usernum을 프론트에서 저장
    //반드시 프론트에서 보내는 데이터에 usernum을 포함
    count++;
    //playercard[usernum] //여기다 카드집어넘, 2차원배열
    console.log("user++: "+ count);

    if(count=2){
        io.sockets.emit('ready', 'ready');

    };
    socket.on('disconnect', function(){
        count--;
        console.log("user--: "+ count);
        io.sockets.emit('disconnected','disconnected');//disconnected가 오면 프론트에서 새로고침을 누름.
        // 새로고침을 누르면 커넥션이 끊기고 다시 연결됨
        // 새로고쳐질때마다 player fund값 1000으로 초기화
    });

    socket.on('game_start',function(data){
        reset();
        //이거 data 파라미터 제대로 인식되는지 확인좀
        fdata.bet[data.usernum] = data.bet;
        fdata.fund[data.usernum] = fdata.fund[data.usernum] - data.bet;
        deck = card.shuffle(card.deck);
        fdata.dealercard = [deck.shift(), deck.shift()];
        fdata.playercard[data.usernum] = [deck.shift(), deck.shift()];
        calculater(data.usernum);   // 요기 유저num을 넣어서 해당되는 playercard만 계산
        io.sockets.emit('game_start', fdata);
    });
    socket.on('hit',function (data){
        // playercard에 한장 추가과정 [연철]
        strPlayercard = JSON.stringify(fdata.playercard[data.usernum]);
        strPlayercard = strPlayercard.replace("]", "");
        strPlayercard = strPlayercard + "," + JSON.stringify(deck.shift()) + "]";
        //fdata.playercard = fdata.playercard + [deck.shift()];
        fdata.playercard = JSON.parse(strPlayercard);
        //playerTotal에 card값을 더하는 과정
        console.log(strPlayercard);
        //굳이 로그 띄워보는 코드임 지워도 됨 [연철]

        additional_calculaterP(data.usernum); // usernum 넣어서 playercard[usernum] 계산

        if(playerTotal[data.usernum]>21){
            pBursted[data.usernum] = 1;
            //플레이어 파산하면 바로 승패로 이동
            whoWin(data.usernum); // 역시 수정 필요
            return;
        }

        //data = new fdata(bet, cinfo, playercard, dealercard, fund);
        io.sockets.emit('hit', fdata);
     });
    
    socket.on('stand',function (data){
        strDealercard = JSON.stringify(fdata.playercard);
        strDealercard = strDealercard.replace("]", "")
        strDealercard = strDealercard + ',' + JSON.stringify(deck.shift()) + "]";

        fdata.Dealercard = JSON.parse(strDealercard);

        console.log(strPlayercard);

        additional_calculaterD();
        
        if(dealerTotal>21){
            dBursted = 1;
        }
        whoWin(data.usernum);

        io.sockets.emit('stand', fdata);
     });

    //socket.on('hit',1); 
    //socket.on('stand',2);

    function whoWin(num){
        //플레이어 파산한 경우, 무조건 패
        console.log("whoWin In");
        if(pBursted[num] == 1){
            fdata.fund[num] = fdata.fund[num] ;
            console.log("DWin");
        }
        //플레이어는 파산 x 딜러만 파산한 경우, 플레이어 승
        //플레이어만 파산한 경우, bet이 사라지고 fund는 그대로니 동일
        else if(dBursted == 1){
            fdata.fund[num] = fdata.fund[num] + 2*fdata.bet[num];
            console.log("P"+num+"win");
        }
        //둘다 파산이 아닌 경우
        else{
            //플레이어 승
            if(playerTotal[num] > dealerTotal){
                fdata.fund[num] = fdata.fund[num] + 2*fdata.bet[num];
                console.log("P"+num+"Win");
            }
            //무승부
            else if(playerTotal[num] == dealerTotal){
                fdata.fund[num] = fdata.fund[num] + fdata.bet[num];
                console.log("Draw");
            }
            //딜러 승
            else{
                fdata.fund[num] = fdata.fund[num];
                console.log("DWin");
            }
        }
        console.log(fdata.fund[num]);
     };

     function reset(){
        fdata.playercard = []
        fdata.dealercard = []
        playerTotal = [];
        pBursted = [];
        dealerTotal = 0;
        dBursted = 0;
        console.log(fdata.playercard);
    };
    //총합 계산기
    function calculater(num){
        for(i=0; i<fdata.playercard[num].length; i++){
            if(fdata.playercard[num][i].value == 11 && playerTotal[num] > 21){
                playerTotal[num] = playerTotal[num] + 1;
            } else if (fdata.playercard[num][i].value == 'K' || fdata.playercard[num][i].value == 'Q' || fdata.playercard[num][i].value == 'J'){
                playerTotal[num] = playerTotal[num] + 10;
            } else {
                playerTotal[num] = playerTotal[num] + fdata.playercard[num][i].value;
            }
            console.log("playerTotal: " + playerTotal[num]);
        }

        for(i=0; i<fdata.dealercard.length; i++){
            if(fdata.dealercard[i].value == 11 && dealerTotal > 21){
                dealerTotal = dealerTotal + 1;
            } else if (fdata.dealercard[i].value == 'K' || fdata.dealercard[i].value == 'Q' || fdata.dealercard[i].value == 'J'){
                dealerTotal = dealerTotal + 10;
            } else {
                dealerTotal = dealerTotal + fdata.dealercard[i].value;
            }
            console.log("dealerTotal: " + dealerTotal);
        }
    }

    function additional_calculaterP(num){
        var i = fdata.playercard[num].length - 1;

        if(fdata.playercard[num][i].value == 11 && playerTotal[num] + fdata.playercard[num][i].value > 21){
            playerTotal[num] = playerTotal[num] + 1;
        } else if (fdata.playercard[num][i].value == 'K' || fdata.playercard[num][i].value == 'Q' || fdata.playercard[num][i].value == 'J'){
            playerTotal[num] = playerTotal[num] + 10;
        } else {
            playerTotal[num] = playerTotal[num] + fdata.playercard[num][i].value;
        }
        console.log("playerTotal: " + playerTotal[num]);
    }

    function additional_calculaterD(){
        var i = fdata.dealercard.length - 1;

        for(i=0; i<fdata.dealercard.length; i++){
            if(fdata.dealercard[i].value == 11 && dealerTotal + fdata.dealercard[i].value> 21){
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