let questionArr = [];
let questionCount = 0;
let currentPos = 0;
let hasShuffled = false;

$(document).ready(function() {
    questionCount = 0;
    for(var prop in cards){
        questionArr.push({
            question: `${prop}`,
            answer: `${cards[prop]}`
        })
        questionCount++
    }
    question(0)
    $('.flip-card').click(flipCard)
})

function flipCard() {
    if ($('.card-inner').attr('id') == 'flipped') {
        $('.card-inner').attr('id', 'unflipped');
    } else {
        $('.card-inner').attr('id', 'flipped');
    }
}

/* Future Buttons (?)
<div class="btn-danger" onclick="" style="visibility: hidden;"><span class="material-icons">shuffle_on</span> Reshuffle Cards</div> <div class="btn-danger" onclick="" style="visibility: hidden;"><span class="material-icons">shuffle_on</span> Unshuffle Cards</div>
*/
function shuffle(){
    questionArr.shuffle();
    hasShuffled = true;
    question(0);
}

// Detect Key Presses - Left and Right
document.onkeydown = checkKey;
function checkKey(e) {
    e = e || window.event;

    if (e.keyCode == '37' || e.keyCode == '65') { // Left Arrow, A
        question('previous');
    }
    else if (e.keyCode == '39' || e.keyCode == '68') { // Right arrow, D
        question('next');
    }
    else if(e.keyCode == '38' || e.keyCode == '32' || e.keyCode == '87'){ // Spacebar, Up Arrow, W
        flipCard();
    }
}

// Take a number input.
function question(input) {
    if(input == 'next'){
        currentPos++
        if(currentPos > questionCount - 1) currentPos = 0;
    }
    else if(input == 'previous'){
        currentPos--;
        if(currentPos < 0) currentPos = questionCount - 1;
    } else if (typeof input == "number") {
        // input number
        currentPos = input;
    }

    // Here is the fix for the card flipping answer issue :pogu:
    if($('.card-inner').attr('id') == 'flipped'){
        $('.term').text("");
        $('.definition').text("");
        setTimeout(function(){
            $('.term').text(questionArr[currentPos].question);
            $('.definition').text(questionArr[currentPos].answer);
        }, 300)
    }
    else {
        $('.term').text(questionArr[currentPos].question);
        $('.definition').text(questionArr[currentPos].answer);
    }

    // flip the card back
    $('.card-inner').attr('id', 'unflipped');
    $('#questionNum').text(`(${currentPos + 1}/${questionCount})`)
}

function toggleStudy() {
    $('.term').attr('class', 'tmp');
    $('.definition').attr('class', 'term');
    $('.tmp').attr('class', 'definition');
    // toggle the display
    if ($('#currentStudy').text() == "terms") {
        $('#currentStudy').text("definitions")
    } else {
        $('#currentStudy').text("terms")
    }
    question();
}