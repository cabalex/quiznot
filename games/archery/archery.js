let endTime;
let timerInterval;
let cardOrder = [];
const stats = {
  questionsAnswered: 0,
  clicks: 0
}
let selectedTerm;

// Starts the game.
function startGame(e) { 
  $('#gameModal').hide();
  $('#crosshair').show();
  $('#infoText').css('visibility', 'visible');
  // Eventlisteners
  $(document).on('mousemove', onMouseMove).on('mousedown', onClick);
  // move mouse cursor to current position
  onMouseMove(e);
  endTime = Date.now() + 60000;
  timerInterval = setInterval(updateGame, 100);
  fetchTermDef();
}

// Update Game
function updateGame() {
  $('#time').text(milisecondsToTime(endTime - Date.now()));
  if (endTime - Date.now() <= 0) {
    clearInterval(timerInterval);
    endGame();
  }
}

// Fetch terms and definitions
function fetchTermDef() {
  if (cardOrder.length == 0) {
    cardOrder = Object.keys(cards).shuffle();
  }
  // pop first item off array
  selectedTerm = cardOrder.shift();
  $('.termName').text(selectedTerm)
  // using JS sets; sets can only have one of each unique value in them, so it's perfect
  const set = new Set([cards[selectedTerm]])
  let tempCards = Object.keys(cards).shuffle();
  for (var i = 0; i < tempCards.length; i++) {
    if (set.size == 4) { break };
    set.add(cards[tempCards[i]]);
  }
  // convert back to array
  let setArr = Array.from(set).shuffle();
  $('#terms').html('');
  setArr.forEach((item, i) => {
    $('#terms').append(`<div id="card-${i}" class="card"></div>`);
    $(`#card-${i}`).text(item);
  })
}

// Track crosshair to player mouse
const onMouseMove = (e) =>{
  $('#crosshair').css('left', e.pageX + 'px')
  $('#crosshair').css('top', e.pageY + 'px')
}

// Click
const onClick = (e) => {
  stats.clicks++;

  const bounding = detectBounding(e.pageX, e.pageY);
  if (bounding != -1 && $('#card-' + bounding).text() == cards[selectedTerm]) {
    // TODO: maybe some fun animation
    stats.questionsAnswered++;
    fetchTermDef();
  } else {
    if (bounding != -1) {
        $('#card-' + bounding).css('animation', 'popIn 0.2s ease-out, shakeDeny 0.2s ease-in-out');
        setTimeout(function() { $('#card-' + bounding).css('animation', '') }, 200)
    }
  }
  // Update Score
  $('#score').text(`Current Score: ${stats.questionsAnswered}/${stats.clicks}`);
  
}

// Game Over!
function endGame(){
  $(document).off('mousemove').off('mousedown');
  $('#infoText').css('visibility', 'hidden');
  $('#crosshair').css('display', 'none');
  $('#finishModal').css('display', 'inline');
  // May be NaN; corrects it to 0%
  $('#percentScore').text((Math.round(stats.questionsAnswered / stats.clicks * 100) || 0) + "%")
  $('#scoreDisplay').text(`${stats.questionsAnswered}/${stats.clicks}`)
}

// Detects if the cursor is inside a block.
function detectBounding(cursorX, cursorY) {
  boundingRects = []
  $('.card').get().forEach((elem, index) => boundingRects[index] = checkCollisions(elem.getBoundingClientRect()))
  function checkCollisions(arr) {
      if (arr.top < cursorY && cursorY < arr.bottom &&
          arr.left < cursorX && cursorX < arr.right) {
              return true;
          }
      return false;
  }
  return boundingRects.indexOf(true)
}