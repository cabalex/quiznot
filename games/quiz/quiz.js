
// reuse the card CSS
const quizItem = `
<div class="card">
    <div class="quiz-term">{TERMNAME}</div>
    <div class="definition"><input class="definition" type="text" placeholder="Type your answer..."></div>
</div>
`
// if page is "dirty" / unsaved changes
var isQuizInProgress = true;
const quizStartTime = Date.now();

// shuffle the card keys and assign them
const shuffledcardkeys = Object.keys(cards).shuffle()
const shuffledcardvalues = [];
shuffledcardkeys.forEach(elem => {shuffledcardvalues.push(cards[elem])});

window.onbeforeunload = function() {
    if (isQuizInProgress) {
        return 'Warning!'
    } else {
        return undefined;
    }
}

$(document).ready(function() {
    for (let i = 0; i < shuffledcardkeys.length; i++) {
        $("#cardlist").append(quizItem);
        $("#cardlist").find(".quiz-term").last().text(shuffledcardvalues[i]);
    }
})

// Parse quiz answers from the document and validates them.
function parseQuizAnswers() {
    var quizAnswers = [];
    isQuizInProgress = false;
    // prevent clicking again
    $('#submit').attr({'class': 'btn-disabled', 'onclick': ''})
    $('#cardlist').find('input').each(function() {
        $(this).attr({'disabled': '1', 'placeholder': ''});
        quizAnswers.push($(this).val())
    })
    var [answers, numTrue] = validateQuizAnswers(quizAnswers);
    console.log(answers)
    $('#cardlist').find('.quiz-term').each(function(index) {
        if (answers[index]) {
            $(this).parent().attr('class', 'card card-success');
        } else {
            $(this).parent().attr('class', 'card card-danger').append(`<div class="correct-answer"><span class="material-icons">check</span></div>`).find('span.material-icons').after($('<span>').text(shuffledcardkeys[index]));
        }
    })
    // get the number of 
    const countOccurrences = (arr, val) => arr.reduce((a, v) => (v === val ? a + 1 : a), 0);
    $('#quizState').html(`<b style="font-size: 25px">${numTrue}/${Object.keys(answers).length} answers correct (${Math.round(numTrue/Object.keys(answers).length*100)}%)</b> It took you ${milisecondsToTime(Date.now() - quizStartTime)} to finish this quiz.`)
}

// Validates quiz answers. Takes an array of answers according to the preshuffled questions/answers
function validateQuizAnswers(answers) {
    let testing = true;
    var ans = [];
    var numTrue = 0;
    for (var i = 0; i < shuffledcardvalues.length; i++) {
        ans.push(cleanFormatting(shuffledcardkeys[i]) == cleanFormatting(answers[i]));
        if (ans[ans.length - 1]) numTrue++;
    }
    return [ans, numTrue];
}