var startTime = 0;
const cardCount = Math.min(window.innerWidth > 700 ? 16 : 8, Object.keys(cards).length);
const shuffledCards = Object.keys(cards).shuffle().slice(0, cardCount);
// must deep copy, cannot pass by reference
const shuffledAgain = JSON.parse(JSON.stringify(shuffledCards)).shuffle();
var stopwatchInterval;

// Starts the game.
function startGame() {
    startTime = Date.now();
    $('#gameModal').css('display', 'none');
    for (var i = 0; i < cardCount; i++) {
        $('#pg-1').append(`<div class="card q" id="q${i}"><p></p><img src="outer.svg"></div>`);
        $('#q' + i).find('p').text(shuffledCards[i])
    }
    // shuffle the order of the 16 terms again
    for (var i = 0; i < cardCount; i++) {
        $('#pg-2').append(`<div class="card a" id="a${i}"><p></p><img src="inner.svg"></div>`);
        $('#a' + i).find('p').text(cards[shuffledAgain[i]])
    }
    $('.card:not(.a)').on('mousedown', dragger).on('touchstart', dragger)

    // interval
    stopwatchInterval = setInterval(updateStopwatch, 100)
}

// Updates the #time stopwatch. 
function updateStopwatch() {
    $('#time').text(milisecondsToTime(Date.now() - startTime));
}

// Ends the game and shows the game result screen.
function endGame() {
    $('#finishModal').show();
    clearInterval(stopwatchInterval);
    $('#termCount').text(shuffledCards.length);
    $('#resultTime').text(milisecondsToTime(Date.now() - startTime))
}

// Term dragging functionality. Supports both mobile (ontouchstart) and desktop (onmousedown)
function dragger(event) {
    event.preventDefault()
    const elem = this;
    $(this).attr('class', 'card q dragging');
    // touch or click drag
    const start = [event.pageX || event.touches[0].clientX, event.pageY || event.touches[0].clientY];
    var offset = $(this).offset();

    function handle_dragging(e){
        var left = offset['left'] + ((e.pageX || e.touches[0].clientX) - start[0]);
        var top = offset['top'] + ((e.pageY || e.touches[0].clientY) - start[1]);
        $(elem).offset({top: top, left: left});
    }

    function handle_mouseup(e){
        $(document.body).off('mousemove').off('touchmove')
        $(this).off('mouseup').off('touchend');
        // check if over another card
        const bounding = detectBounding(e.pageX || e.changedTouches[0].pageX, e.pageY || e.changedTouches[0].pageY);
        if (bounding != -1 && shuffledAgain[bounding] == shuffledCards[parseInt($(this).attr('id').slice(1))]) {
            $(this).attr('class', 'card-deleted q').off('mousedown');
            $('#a' + bounding).attr('class', 'card-deleted a');
            // check completion
            if ($('.card').length == 0) {
                // win!
                endGame();
            }
        } else {
            if (bounding != -1 && !$('#a' + bounding).attr('class').includes('card-deleted')) {
                $('#a' + bounding).css('animation', 'popIn 0.2s ease-out, shakeDeny 0.2s ease-in-out');
                setTimeout(function() { $('#a' + bounding).css('animation', '') }, 200)
            }
            $(this).attr('class', 'card q');
            $(this).css({'left': 0, 'top': 0})
        }
    }

    $(this).on('mouseup', handle_mouseup).on('touchend', handle_mouseup)
    $(document.body).on('mousemove', handle_dragging).on("touchmove", handle_dragging);
}

// Detects if the cursor is inside a block. TODO: check bounding of term boxes instead of cursor for easier matching
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