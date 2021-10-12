/*
Cards are stored in local storage and are loaded on every game.

*/
// I KNOW, I KNOW, i put both as class term/definition, but it makes the code slightly cleaner
const card = `
<div class="card">
    <div class="term"><input class="term" type="text" placeholder="Term..."></div>
    <div class="divider"></div>
    <div class="definition"><textarea class="definition" placeholder="Definition..."></textarea></div>
    <div class="btn-danger" onclick="removeCard(this)"><span class="material-icons">delete</span></div>
</div>`;

// speech recognition
var SpeechRecognition;
var recognition;
var isRecordOpen = false;

// promise for QR
var promiseQR = null;

$(document).ready(function() {
    // Load cards...
    if (window.location.search.includes("?s=")) {
        // load new set
        localStorage.setItem("cards", decodeURIComponent(window.location.search.slice(3)));
        window.location.href = window.location.href.split("?")[0];
        return;
    }
    var cards = getCards();
    if (cards == null) { cards = {} };
    for (const [key, value] of Object.entries(cards)) {
        var elem = $("#add-card").before(card)
            .prev().find("input").val(key);
        $("#add-card").prev().find("textarea").val(value);
    }
    $('#termCount').text(`${Object.keys(cards).length} terms`);
    $("input").focusout(function() {saveCards()})
    $("textarea").focusout(function() {saveCards()})
    if (!Object.keys(cards).length) {
        $("#cover").show();
        $("#games-message").text("Enter a term or two before playing some games");
        $("div[disable-btn='true']").attr('class', 'btn-disabled');
    } else {
        $("#cover").hide();
        $("#games-message").text("Reinforce these terms");
        $("div[disable-btn='true']").attr('class', 'btn');
    }
    // check if user can use microphone
    SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
    if (!SpeechRecognition) {
        $('#open-record').attr({'class': 'btn-disabled', 'onclick': ''})
    } else {
        recognition = new SpeechRecognition()
    }
})

$('#add-card').focus(function() {addCard()})

// Set cards in local storage based on cards in the webpage.
function saveCards() {
    var cards = {};
    $(".card:not('#add-card')").each(function() {cards[$(this).find('input').val()] = $(this).find('textarea').val()});
    localStorage.setItem("cards", JSON.stringify(cards));
    $('#termCount').text(`${Object.keys(cards).length} terms`);
    if (!Object.keys(cards).length) {
        $("#cover").show();
        $("#games-message").text("Enter a term or two before playing some games");
        $("div[disable-btn='true']").attr('class', 'btn-disabled');
    } else {
        $("#cover").hide();
        $("#games-message").text("Reinforce these terms")
        $("div[disable-btn='true']").attr('class', 'btn');
    }
    console.log("cards saved!")
}

function flipTermsDef(){
    let cc = getCards();
    if (Object.keys(cc).length === 0) {
        return;
    }
    var cards = {};
    for (var prop in cc){
        cards[(cc[prop])] = prop;
    }
    localStorage.setItem("cards", JSON.stringify(cards));
    location.reload();
}

function importQuizlet() {
    let text = prompt('Copy-paste your terms here (You can get them from exporting from this page, or from Quizlet [Cards page > three dots > Export > Copy text])\nNOTE: This will overwrite your current term list.')
    // text is null or empty means user cancelled prompt
    if (!text) {
        return
    }
    // Check for Windows carriage returns
    var tabsplitText = text.split("\t");
    if (text.includes("\r")) {
        tabsplitText.forEach((elem, index) => tabsplitText[index] = elem.split("\r\n"));
    } else {
        tabsplitText.forEach((elem, index) => tabsplitText[index] = elem.split("\n"))
    }
    var termsdict = {};
    var prevTerm = tabsplitText[0];
    console.log(tabsplitText)
    tabsplitText.forEach(function(elem, index) {
        // [KEY 1]
        // [VAL 1, KEY 2]
        // [VAL 2, KEY 3]
        // [VAL 3]
        if (index == 0) return;
        if (index != tabsplitText.length - 1) {
            var tmpTerm = elem.pop();
        }
        termsdict[prevTerm] = elem.join("\n");
        prevTerm = tmpTerm;
        
    })
    localStorage.setItem("cards", JSON.stringify(termsdict));
    // reload the page since I'm too lazy to redo the whole cards list lol
    document.location.reload();
}

async function exportTerms(elem) {
    if(!Object.keys(getCards()).length) return;
    const cards = {};
    var outputStr = "";
    $(".card:not('#add-card')").each(function() {cards[$(this).find('input').val()] = $(this).find('textarea').val()});
    for (const [key, value] of Object.entries(cards)) {
        outputStr += `${key}\t${value}\n`
    }
    try {
        navigator.clipboard.writeText(outputStr);
        $(elem).css('animation', 'copied 0.5s').find('span').text('check')
        await sleep(500);
        $(elem).css('animation', '').find('span').text('cloud_upload')
    } catch {
        prompt("Could not copy to clipboard (are you on an HTTPS website?)\nAlternatively, copy the text below.", outputStr)
    }
    
}

async function exportQR(elem) {
    if (!Object.keys(getCards()).length) return;
    if (promiseQR) { return console.log("Already searching for QR, returning...")}
    promiseQR = new Promise( async (resolve, reject) => {
        // Find endpoint - Add index.html if needed (local testing)
        var ENDPOINT = window.location.origin + window.location.pathname.replace("index.html", "") +
            (window.location.origin.includes(".github.io") ? "" : "index.html");
        
        $('#exportQR').slideDown(100);
        $('#qrcode').html('');
        $('#qrMsg').text('Generating QR code...');
        $('body').css('overflow', 'hidden');
        const cards = {};
        $(".card:not('#add-card')").each(function() {cards[$(this).find('input').val()] = $(this).find('textarea').val()});
        cardsStr = JSON.stringify(cards);

        var xhr = new XMLHttpRequest();
        xhr.open("POST", "https://api.shrtco.de/v2/shorten", true);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
        await xhr.send(`url=${encodeURIComponent(`${ENDPOINT}?s=${cardsStr}`)}`)
        xhr.onload = function() {
            const jsonRes = JSON.parse(xhr.responseText);
            if (jsonRes['ok']) {
                let link = jsonRes['result']['full_short_link']
                new QRCode(document.getElementById("qrcode"), link);
                $('#qrMsg').attr('href', link).text(link);
                resolve(jsonRes['result']['full_short_link']);
            } else {
                promiseQR = null;
                reject("Error requesting url service")
            }
        }
    })
    await promiseQR;
    promiseQR = null;
    return;
}

function closeQR() {
    $('#exportQR').slideUp(100);
    $('body').css('overflow', '');
}

// Adds a card. Takes the event and element that was clicked.
function addCard() {
    $('#add-card').before(card);
    $('#add-card').prev().hide().slideDown(200, function() {$(this).find('input.term').select()});
    $("input").focusout(function() {saveCards()})
    $("textarea").focusout(function() {saveCards()})
}

// Deletes a card. Takes the delete button element as its input.
function removeCard(elem) {
    // elem is the delete button; must grab parent
    $(elem).closest('div.card').slideUp(200, function() { 
        $(this).remove(); 
        saveCards();
    })

    if(Object.keys(getCards()) == 0){
        $("#cover").show();
        $("#games-message").text("Enter a term or two before playing some games");
        $("div[disable-btn='true']").attr('class', 'btn-disabled');
    }
}

function removeAllCards() {
    let isConfirmed = confirm('Are you sure you want to delete all of your terms?');
    if(!isConfirmed) return;
    $(".card:not('#add-card')").slideUp(200, function() { $(this).remove()})
    localStorage.setItem("cards", "{}");
    $('#termCount').text(`0 terms`);
    $("#cover").show();
    $("#games-message").text("Enter a term or two before playing some games");
    $("div[disable-btn='true']").attr('class', 'btn-disabled');
}

/* Recording */

function resetRecord() {
    $('#record-btn').unbind("click").click(startRecording);
    $('#transcript-term').text('Tap to record a term')
    $('#transcript-def').text('')
    $('#transcript-confirm').text('')
    $('#record-btn').attr('class', 'btn btn-record').css('background-color', '')
}

function record() {
    // open the record popup
    resetRecord();
    $('#record').slideDown(100);
    // hide pesky scrollbar
    $('body').css('overflow', 'hidden');
    isRecordOpen = true;
}

function closeRecord() {
    $('#record').slideUp(100);
    recognition.stop();
    $('body').css('overflow', '');
    isRecordOpen = false;
}
async function startRecording() {
    // record activation loop
    $('#record-btn').attr({'class': 'btn-pressed'})
    $('#record-btn').unbind("click").click(stopRecording)
    $('#record-btn').css('background-color', 'var(--danger)')

    $('#transcript-term').html('<b>Speak your term</b>')
    let term = await _record("term")
    // prevent errors
    if (term == "") {
        resetRecord();
        return;
    }

    $('#record-btn').css('background-color', 'var(--success)')
    $('#transcript-def').html('<b>Now, speak your definition</b>')
    let def = await _record("def")

    $('#record-btn').css('background-color', 'var(--secondary)')
    $('#transcript-confirm').html('<b>This okay?</b>')
    let confirm = await _record("confirm")

    resetRecord();

    if (confirm.includes('yes') || confirm.includes('okay') || confirm.includes('yep')) {
        // the term is accepted
        $("#add-card").before(card).prev().find("input").val(term);
        $("#add-card").prev().find("textarea").val(def);
        saveCards();
        $('#record-btn').find('span').text('check');
        await sleep(1000);
        $('#record-btn').find('span').text('mic');
    }
}
function stopRecording() {
    recognition.stop();
}
function _record(kind="term") {
    return new Promise((resolve, reject) => {
        if (!isRecordOpen) { reject("Record menu is not open.") }
        console.log("record loop started")
        
        recognition.interimResults = true;
        final_transcript = '';
        recognition.start();

        recognition.onresult = function(event) {
            var interim_transcript = '';
        
            for (var i = event.resultIndex; i < event.results.length; ++i) {
                if (event.results[i].isFinal) {
                    final_transcript += event.results[i][0].transcript;
                } else {
                    interim_transcript += event.results[i][0].transcript;
                }
            }
            $(`#transcript-${kind}`).text(interim_transcript)
        };

        recognition.onend = function(event) {
            $(`#transcript-${kind}`).text(final_transcript)
            recognition.stop();
            resolve(final_transcript);
        }
    })
}

/* Credits */
function showCredits() {
    $('#credits').slideDown(100);
}

function hideCredits() {
    $('#credits').slideUp(100);
}
