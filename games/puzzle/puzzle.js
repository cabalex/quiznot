var startTime = 0;
const shuffledCards = Object.keys(cards).shuffle().slice(0, 16);
const shuffledAgain = shuffledCards.shuffle();
var stopwatchInterval;

function startGame() {
    startTime = Date.now();
    const cardCount = Math.min(16, shuffledCards.length);
    $('#gameModal').css('display', 'none');
    for (var i = 0; i < cardCount; i++) {
        $('#pg-1').append(`<div class="card q" id="q${i}"><p></p><img src="outer.svg"></div>`);
        $('#q' + i).find('p').text(shuffledCards[i])
    }
    // shuffle the order of the 16 terms again
    for (var i = 0; i < cardCount; i++) {
        $('#pg-2').append(`<div class="card a" id="a${i}"><p></p><img src="inner.svg"></div>`);
        $('#a' + i).find('p').text(cards[shuffledCards[i]])
    }
    $('.card:not(.a)').mousedown(dragger)

    // interval
    stopwatchInterval = setInterval(updateStopwatch, 100)
}

function updateStopwatch() {
    $('#time').text(milisecondsToTime(Date.now() - startTime));
}

function endGame() {
    $('#finishModal').show();
    clearInterval(stopwatchInterval);
    $('#termCount').text(shuffledCards.length);
    $('#resultTime').text(milisecondsToTime(Date.now() - startTime))
}

function dragger(event) {
    event.preventDefault()
    const elem = this;
    $(this).attr('class', 'card q dragging');
    const start = [event.pageX, event.pageY];
    var offset = $(this).offset();
    function handle_dragging(e){
        var left = offset['left'] + (e.pageX - start[0]);
        var top = offset['top'] + (e.pageY - start[1]);
        $(elem).offset({top: top, left: left});
    }
    function handle_mouseup(e){
        $(document.body).off('mousemove', handle_dragging)
        $(this).off('mouseup', handle_mouseup);
        // check if over another card
        const bounding = detectBounding(e.pageX, e.pageY);
        if (bounding != -1 && shuffledAgain[bounding] == shuffledCards[parseInt($(this).attr('id').slice(1))]) {
            $(this).attr('class', 'card-deleted q').off('mousedown');
            $('#a' + bounding).attr('class', 'card-deleted a');
            // check completion
            if ($('.card').length == 0) {
                // win!
                endGame();
            }
        } else {
            $(this).attr('class', 'card q');
            $(this).css({'left': 0, 'top': 0})
        }
    }
    $(this).on('mouseup', handle_mouseup)
    $(document.body).on('mousemove', handle_dragging);
}

function detectBounding(cursorX, cursorY) {
    boundingRects = []
    $('.a').get().forEach((elem, index) => boundingRects[index] = checkCollisions(elem.getBoundingClientRect()))
    function checkCollisions(arr) {
        if (arr.top < cursorY && cursorY < arr.bottom &&
            arr.left < cursorX && cursorX < arr.right) {
                return true;
            }
        return false;
    }
    return boundingRects.indexOf(true)
}