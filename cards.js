var id = 0;
function Card(symbol, value, count) {
    this.count = id++;
    this.symbol = symbol;
    this.value = value;
}

var deck = [
    new Card('H',11),new Card('H',2),new Card('H',3),new Card('H',4),new Card('H',5),new Card('H',6),new Card('H',7),new Card('H',8),new Card('H',9),new Card('H',10),new Card('H','K'),new Card('H','Q'),new Card('H','J'),
    new Card('D',11),new Card('D',2),new Card('D',3),new Card('D',4),new Card('D',5),new Card('D',6),new Card('D',7),new Card('D',8),new Card('D',9),new Card('D',10),new Card('D','K'),new Card('D','Q'),new Card('D','J'),
    new Card('S',11),new Card('S',2),new Card('S',3),new Card('S',4),new Card('S',5),new Card('S',6),new Card('S',7),new Card('S',8),new Card('S',9),new Card('S',10),new Card('S','K'),new Card('S','Q'),new Card('S','J'),
    new Card('C',11),new Card('C',2),new Card('C',3),new Card('C',4),new Card('C',5),new Card('C',6),new Card('C',7),new Card('C',8),new Card('C',9),new Card('C',10),new Card('C','K'),new Card('C','Q'),new Card('C','J'),
    new Card('H',11),new Card('H',2),new Card('H',3),new Card('H',4),new Card('H',5),new Card('H',6),new Card('H',7),new Card('H',8),new Card('H',9),new Card('H',10),new Card('H','K'),new Card('H','Q'),new Card('H','J'),
    new Card('D',11),new Card('D',2),new Card('D',3),new Card('D',4),new Card('D',5),new Card('D',6),new Card('D',7),new Card('D',8),new Card('D',9),new Card('D',10),new Card('D','K'),new Card('D','Q'),new Card('D','J'),
    new Card('S',11),new Card('S',2),new Card('S',3),new Card('S',4),new Card('S',5),new Card('S',6),new Card('S',7),new Card('S',8),new Card('S',9),new Card('S',10),new Card('S','K'),new Card('S','Q'),new Card('S','J'),
    new Card('C',11),new Card('C',2),new Card('C',3),new Card('C',4),new Card('C',5),new Card('C',6),new Card('C',7),new Card('C',8),new Card('C',9),new Card('C',10),new Card('C','K'),new Card('C','Q'),new Card('C','J')
];

exports.shuffle = function(a) {
    var j, x, i;
    for (i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
}
