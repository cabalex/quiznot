var startTime;
var updateInterval;
const ballTrail = []
var cardOrder = [];
var selectedTerm;
var snakeLength = 0;
var lastSpawn = 0;
var scrollSpeed = 0.1;
var isStopped = false;
var isZoomed = false;
const stats = {
    termCount: 0,
    longestChain: 10,   
}
var gameTicks = 0;

// Starts the game.
function startGame() {
    startTime = Date.now();
    $('#gameModal').hide();
    snakeLength = $('.snakeBall').length;
    $(document).on('mousedown', dragger).on('touchstart', dragger);
    gameTicks = 0;
    updateInterval = setInterval(updateGame, 10);
}

// Ends the game and displays stats.
function endGame() {
    clearInterval(updateInterval);
    $('#termName').remove();
    $('#termCount').text(stats.termCount);
    $('#longestChain').text(stats.longestChain);
    $('#resultTime').text(milisecondsToTime(Date.now() - startTime));
    $('#finishModal').show();
}

// Update game interval.
function updateGame() {
    if (scrollSpeed > 0) {
        detectCollisions();
    }
    gameTicks++;
    if ($('.blockrow').length == 0) {
        lastSpawn = Date.now();
        spawnBlockRow();
        scrollSpeed += 0.005;
    }
    let currOffset = $('#snake').offset()['left'];
    if (snakeLength <= 0) { endGame(); return; }
    $('#ball-0').text(snakeLength)

    if (!isStopped) {
        $('.blockrow').each(function() {
            $(this).offset({top: $(this).offset()['top'] + 30 * scrollSpeed});
            if ($(this).offset()['top'] > innerHeight + 100) { $(this).remove() };
        })
    }
    $('#infoTime').text(milisecondsToTime(Date.now() - startTime))
    if (gameTicks % 5 == 0) {
        ballTrail.unshift(currOffset);
        ballTrail.splice(snakeLength);
        $('.snakeBall').each(function (index) {$(this).offset({'left': ballTrail[index]})});
    }
        
}

// https://stackoverflow.com/questions/50378855/how-to-detect-if-two-divs-are-touching-collision-detection
// Collision detection between two divs
function touching(d1,d2){
    let ox = Math.abs(d1.x - d2.x) < (d1.x > d2.x ? d2.width : d1.width);
    let oy = Math.abs(d1.y - d2.y) < (d1.y > d2.y ? d2.height : d1.height);
    return ox && oy;
}

// Detect collisions - ran within the main game loop.
// Source of a lot of issues; may be something to tweak at some point
function detectCollisions() {
    const rootBounding = $('#ball-0')[0].getBoundingClientRect();
    $('.blockrow:not(.passed)').find('.block').each(async function() {
        let blockBounding = this.getBoundingClientRect();
        if (blockBounding['bottom'] < rootBounding['bottom'] && touching(rootBounding, blockBounding)) {
            const def = $(this).text()
            $(this).closest('.blockrow').attr('class', 'blockrow passed')
            $('#snake').offset({'left': blockBounding['left'] + blockBounding['width'] / 2 - 25})
            // touching: correct?
            if (def == cards[selectedTerm]) {
                // correct term
                stats.termCount++;
                $(this).attr('class', 'block-broken')
                for (var i = 0; i < selectedTerm.length; i++) {
                    if (snakeLength < 20)
                        $('#snake').append(`<div class="snakeBall" id="ball-${snakeLength}"></div>`)
                    snakeLength++;
                    await sleep(100);
                }
                if (snakeLength > stats.longestChain) stats.longestChain = snakeLength;
            } else if ($(this).attr('class').includes('block-hard')) {
                // hard block
                scrollSpeed = 0;
                while (snakeLength > 0) {
                    snakeLength--;
                    $('#ball-' + snakeLength).remove();
                    await sleep(100);
                }
            } else {
                // incorrect term
                let tempScrollSpeed = scrollSpeed;
                scrollSpeed = 0;
                const incorrectTerm = Object.keys(cards)[Object.values(cards).indexOf(def)];
                $(this).append(`<div class="correction"></div>`)
                $(this).find('.correction').text(incorrectTerm)
                for (var i = 0; i < incorrectTerm.length; i++) {
                    snakeLength--;
                    $('#ball-' + snakeLength).remove();
                    await sleep(100);
                }
                $(this).attr('class', 'block-broken')
                if (snakeLength > 0 && tempScrollSpeed != 0)
                    scrollSpeed = tempScrollSpeed;
            }
            return false;
        }
    })
}

// Spawns one row of term definitions and sets the term name to one of them.
function spawnBlockRow() {
    const stamp = Date.now();
    const blockRow = `
    <div class="blockrow" id="${stamp}">
        <div class="block block-hard" id="${stamp}-0"><span></span></div>
        <div class="block block-hard" id="${stamp}-1"><span></span></div>
        <div class="block block-hard" id="${stamp}-2"><span></span></div>
        <div class="block block-hard" id="${stamp}-3"><span></span></div>
    </div>`
    $('#gameContent').append(blockRow);
    $(`#${stamp}`).offset({'top': -500})

    if (cardOrder.length == 0) {
        cardOrder = Object.keys(cards).shuffle();
    }
    // pop first item off array
    selectedTerm = cardOrder.shift();
    $('#termName').text(selectedTerm)
    // using JS sets; sets can only have one of each unique value in them, so it's perfect
    const set = new Set([cards[selectedTerm]])
    let tempCards = Object.keys(cards).shuffle();
    for (var i = 0; i < tempCards.length; i++) {
        if (set.size == 4) { break };
        set.add(cards[tempCards[i]]);
    }
    // convert back to array
    let setArr = Array.from(set).shuffle();
    setArr.forEach((item, i) => {
        $(`#${stamp}-${i}`).attr('class', 'block').find('span').text(item);
    })
}

// Dragger for snake
function dragger(event) {
    event.preventDefault()
    if (scrollSpeed == 0) return;
    // touch or click drag
    const start = [event.pageX || event.touches[0].clientX, event.pageY || event.touches[0].clientY];
    var offset = $('#snake').offset();

    function handle_dragging(e){
        if (scrollSpeed == 0) { return; }
        var left = offset['left'] + ((e.pageX || e.touches[0].clientX) - start[0]);
        $('#snake').offset({left: left, 'top': offset['top']});
    }

    function handle_mouseup(e){
        $(document).off('mousemove').off('touchmove')
        $(document).off('mouseup').off('touchend');
    }

    $(document).on('mouseup', handle_mouseup).on('touchend', handle_mouseup)
    $(document).on('mousemove', handle_dragging).on("touchmove", handle_dragging);
}

// Toggles zoom.
function zoomToggle() {
    if (!isZoomed) {
        isZoomed = true;
        $(':root').css('--fontsize', '22px')
        $('#fontSizeChange').find('span').text('zoom_out')
    } else {
        $(':root').css('--fontsize', '16px')
        isZoomed = false;
        $('#fontSizeChange').find('span').text('zoom_in')
    }
}