var fruits = [];
var points = 0;
var endTime;
var fruitIndex = 0;
var lastFruit = 0;
var cardOrder = Object.keys(cards).shuffle();
const cardCount = Object.keys(cards).length;
var updateWorldInterval;
const stats = {
    highestCombo: 0,
    solved: 0
}

class Fruit {
    constructor(fi, term) {
        // randomize fruit type (1 - 10)
        this.fruitType = Math.round(Math.random() * 10);
        this.term = term;
        // X, Y, ROTATION
        
        this.position = [window.innerWidth / 2 - (Math.random() * 10) - (cards[this.term].length / 2), -window.innerHeight - 50, (Math.random() - 0.5) * 50];
        this.momentum = [(Math.random() - 0.5) * (window.innerWidth / 20), window.innerHeight/18, 0]; // rot is based off of x
        this.momentum[2] = this.momentum[0] / 20;
        this.index = fi;
        this.isDestroyed = false;
        $('#fruits').append(`<div class="fruit" id="fr-${this.index}"><span class="def"></span><br><b class="term"></b></div>`);
        $(`#fr-${this.index}`).css('filter', `hue-rotate(${this.term.length * 50 + Math.random() * 10}deg)`).find('span.def').text(cards[this.term]);
    }

    updateFruitPos() {
        this.position.forEach((elem, index) => this.position[index] += this.momentum[index])
        $(`#fr-${this.index}`).css({'left': `${this.position[0]}px`, 'top': `${this.position[1] * -1}px`, 'transform': `rotate(${this.position[2]}deg)`})
        if (this.momentum[1] > -30)
        this.momentum[1] -= 2;
        if (this.term.length == 0 || this.position[1] < -window.innerHeight * 1.5) {
            // destroy
            $(`#fr-${this.index}`).remove()
            this.isDestroyed = true;
            return;
        }
    }

    keyDown(ev, multi) {
        if (this.term.toUpperCase().startsWith(String.fromCharCode(ev.keyCode))) {
            const text = $(`#fr-${this.index}`).find('.term').text();
            $(`#fr-${this.index}`).find('.term').text(text + this.term[0])
            this.term = this.term.substr(1);
            if (this.term.length == 0) {
                // destroy
                $(`#fr-${this.index}`).remove()
                let pointsToAdd = (text.length + 1) * multi;
                points += pointsToAdd;
                stats.solved++;
                spawnMsg(`${pointsToAdd} pts!` + ((multi > 1) ? ` (${multi}x!)` : ""), "green", this.position)
                this.isDestroyed = true;
                return 1;
            }
            this.position[1] += 10;
            this.momentum[0] *= -0.8;
            this.momentum[2] *= -0.8;
            if (this.momentum[1] < 0) {
                this.momentum[1] = 10;
            }
        }
        return 0
    }
}

async function spawnMsg(text, color, pos) {
    let timeStmp = Date.now();
    $('#fruits').append(`<div id="${timeStmp}" class="floatingMsg" style="color: ${color}; left: ${pos[0]}px; top: ${pos[1] * -1}px">${text}</div>`);
    await sleep(1000);
    $(`#${timeStmp}`).remove();
}

async function startGame() {
    $('#gameModal').css('display', 'none');
    /*$('#countdown').text('3').css('animation', 'countdown 1s infinite ease-in-out')
    await sleep(1000)
    $('#countdown').text('2')
    await sleep(1000)
    $('#countdown').text('1')
    await sleep(1000)
    $('#countdown').text('')*/
    updateWorldInterval = setInterval(updateWorld, 100);
    endTime = Date.now() + 60 * 1000;
    inGame = true;
}

function updateWorld() {
    if (Date.now() - lastFruit > Math.max((endTime - Date.now())/10, 1000)) {
        fruits.push(new Fruit(fruitIndex, cardOrder[fruitIndex % cardCount]))
        cardOrder = Object.keys(cards).shuffle();
        fruitIndex++;
        if (fruitIndex % cardCount == 0) {
            cardOrder = Object.keys(cards).shuffle();
        }
        lastFruit = Date.now();
    }
    var newFruits = [];
    for (var i = 0; i < fruits.length; i++) {
        fruits[i].updateFruitPos();
        if (!fruits[i].isDestroyed) {
            newFruits.push(fruits[i])
        } 
    }
    fruits = newFruits;
    $('#timer').text(milisecondsToTime(endTime - Date.now()))
    $('#points').text(`${points} pts`)
    if (endTime - Date.now() < 50) {
        clearInterval(updateWorldInterval);
        $('#finishModal').css('display', 'block');
        $('#ptsResult').text(points);
        $('#right').text(stats.solved);
        $('#highestCombo').text(stats.highestCombo);
    }
}

window.onkeydown = function(ev) {
    var multi = 1;
    for (var i = 0; i < fruits.length; i++) {
        multi += fruits[i].keyDown(ev, multi);
    }
    if (multi > stats.highestCombo) stats.highestCombo = multi;
}