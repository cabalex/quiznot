
class Car {
    constructor(index) {
        this.speed = 0;
        this.distance = 0;
        this.index = index;
        this.aiLevel = (Math.random() + 0.5) * (Math.random() + 0.5); // random AI level
        if (index != -1) {
            $('#gameWindow').append(`<img src="assets/car.png" id="car-${index}" style="filter: hue-rotate(${this.aiLevel * 400}deg) brightness(${this.aiLevel})" class="car">`);
            this.renderCar()
        }
    }

    updateDistance() {
        // Math.random() is between 0 and 1. Make it so it always goes forward, yet has a variable acceleration
        this.speed += Math.round(((Math.random() + 0.5) * 150 - this.speed) * 0.5) * this.aiLevel;
        this.speed = Math.max(0, this.speed);
        
        // rubber banding
        this.speed += Math.random() * ((playerCar.distance - this.distance) / 1000);
        
        this.distance += this.speed;
    }

    renderCar() {
        let offset = playerCar.distance - this.distance;
        $(`#car-${this.index}`).css('transform', `translateX(${offset * -1}px)`)
    }
}

class PlayerCar extends Car {
    constructor() {
        super(-1);
        this.questionUp = false;
        this.cardOrder = Object.keys(cards).shuffle();
        this.currentCard = -1;
        this.stats = {
            right: 0,
            wrong: 0
        }
        $('#gameWindow').append(`<img src="assets/playercar.png" id="playerCar" class="car">`)
    }


    sendQuestion() {
        return new Promise((resolve, reject) => {
            this.questionUp = true;
            this.currentCard++;
            if (this.currentCard == this.cardOrder.length) {
                this.cardOrder = Object.keys(cards).shuffle();
                this.currentCard = 0;
            }
            $('#question').text(cards[this.cardOrder[this.currentCard]])
            window.onkeydown = this.detectKey;
            $('input#answer').val('').select();
            this.interval = setInterval(() => {
                if (!playerCar.questionUp) {
                    resolve();
                    clearInterval(playerCar.interval);
                    console.log("clear")
                    return;
                }
            }, 100);
        })
    }

    async detectKey(ev) {
        // ENTER
        if (ev.keyCode == 13) {
            if (cleanFormatting($('input#answer').val()) == cleanFormatting(playerCar.cardOrder[playerCar.currentCard])) {
                playerCar.stats.right++;
                playerCar.speed += 90;
                
                $('#questionText').css('background-color', 'var(--success)');
                await sleep(200);
            } else {
                playerCar.stats.wrong++;
                $('input#answer').val(playerCar.cardOrder[playerCar.currentCard])
                $('input#answer').css('color', 'var(--danger-dark)')
                $('#questionText').css('background-color', 'var(--danger)');
                playerCar.speed -= Math.round((playerCar.speed - 50) / 5);
                await sleep(1000);
            }
            $('#questionText').css('background-color', '');
            $('input#answer').css('color', '')
            playerCar.questionUp = false;
        }
    }

    updateDistance() {
        // Update the distance needs to override the default NPC speed.
        if (this.speed < 100) {
            this.speed += Math.round((100 - this.speed) * 0.2);
        } else {
            this.speed -= Math.round(5 * Math.random());
        }
        this.distance += this.speed;
        $('.speedDisp').text(`${Math.floor(this.speed / 4)} MPH`);
        // speedometer between 0 and 180 - add some randomization.
        // The needle is also inverted here, so flip and add 180deg offset
        let speedometerSpeed = Math.min(180, this.speed / 2) + (Math.random() - 0.5) * 5;
        $('.needle').css('transform', `rotate(${speedometerSpeed * -1 + 180}deg)`)
        $('#playerCar').css('transform', `translateX(${(Math.random() - 0.5) * this.speed}px)`)
    }
}

class BackgroundElement {
    constructor(dist) {
        this.distance = dist;
        this.readyToDelete = false;
        if (dist == params.trackLength) {
            $('#gameWindow').append(`<img src="assets/bg-flag-finish.png" id="bg-${dist}" class="bgElem">`)
        } else {
            $('#gameWindow').append(`<img src="assets/bg-flag.png" id="bg-${dist}" class="bgElem">`)
        }
        $(`#bg-${this.distance}`).css({'transform': `translateX(${this.distance/2 * -1}px)`, 'display': 'none'})
    }

    renderBgElement() {
        let offset = (playerCar.distance - this.distance) / 2;
        $(`#bg-${this.distance}`).css('transform', `translateX(${offset * -1}px)`).css({'display': ''})
        if (offset * -1 < -5000) {
            this.readyToDelete = true;
            $(`#bg-${this.distance}`).remove()
        }
    }
}