var counter = 0;
var cards = [];
function Card(symbol, value, count) {
    this.count = counter++;
    this.symbol = symbol;
    this.value = value;
}


values = ['a',2,3,4,5,6,7,8,9,10,'k','q','j'];
symbols = ['c', 'd', 'h', 's'];

for (i = 0; i < values.length; i++) {
    for (j = 0; i < symbols.length; j++){
        temp = new Card(symbols[j],values[i]);
        cards.push(temp);
    } 
}

console.log(cards[1].name);


