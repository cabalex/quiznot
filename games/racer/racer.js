
var playerCar;
var cars;
var bgElements = [];
var updateWorldInterval;
var inGame = false;
const params = {
    trackLength: 100000,
    racers: 12, // don't set this to less than 1 lol
    bgElementDistance: 1000
}
$(document).ready(function() {
    for (var i = 0; i < 20; i++) {
        bgElements.push(new BackgroundElement(params.bgElementDistance * i));
    }
})


function startGame() {
    setupWorld();
    $('#trackLength').text(params['trackLength']/100)
    $('#gameModal').css('display', 'none');
    $('#racers').text(params.racers);
}

function setupWorld() {
    // spawn racers
    playerCar = new PlayerCar();
    cars = [playerCar];
    for (var i = 0; i < params.racers - 1; i++) {
        cars.push(new Car(i));
    }
    startRace();
}

function updateWorld() {
    if (playerCar.distance >= params['trackLength']) {
        // stats screen
        $('#finishModal').css('display', 'block');
        $('input').removeAttr("selected").attr('disabled');
        $('#pos').text($('.racePos').text())
        $('#right').text(playerCar.stats.right);
        $('#wrong').text(playerCar.stats.wrong);
        clearInterval(updateWorldInterval);
        inGame = false;
    }
    let pos = 1;
    for (var i = 0; i < cars.length; i++) {
        cars[i].updateDistance()
        if (cars[i].distance > playerCar.distance) pos++;
        cars[i].renderCar()
    }
    var newList = [];
    for (var i = 0; i < bgElements.length; i++) {
        bgElements[i].renderBgElement();
        if (!bgElements[i].readyToDelete) newList.push(bgElements[i]);
    }
    while (newList.length < bgElements.length) { newList.push(new BackgroundElement(bgElements[bgElements.length - 1].distance + params.bgElementDistance))}
    bgElements = newList;
    $('#trackPos').text(Math.round(playerCar.distance/100))
    // get label of position - algorithm could be massively improved but works for now!!
    switch (pos) {
        case 1:
            $('.racePos').text(pos + "st");
            break;
        case 2:
            $('.racePos').text(pos + "nd");
            break;
        case 3:
            $('.racePos').text(pos + "rd");
            break;
        default:
            $('.racePos').text(pos + "th");
    }
}

async function sendQuestionLoop() {
    if (inGame) {
        await playerCar.sendQuestion()
        sendQuestionLoop()
    }
}

async function startRace() {
    $('#countdown').text('3').css('animation', 'countdown 1s infinite ease-in-out')
    await sleep(1000)
    $('#countdown').text('2')
    await sleep(1000)
    $('#countdown').text('1')
    await sleep(1000)
    $('#countdown').text('')
    inGame = true;
    sendQuestionLoop();
    updateWorldInterval = setInterval(updateWorld, 100);
}
