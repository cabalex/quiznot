/* Global functions. */
// Fisher-Yates Shuffle - https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
Array.prototype.shuffle = function() {
    let currentIndex = this.length,  randomIndex;

    while (currentIndex != 0) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        // And swap it with the current element.
        [this[currentIndex], this[randomIndex]] = [
        this[randomIndex], this[currentIndex]];
    }
    return this;
}

// Grab cards from local storage.
function getCards() {
    return JSON.parse(localStorage.getItem("cards"));
}

function milisecondsToTime(ms, forceHours=false) {
    const secs = (Math.round(ms/1000) % 60).toString().padStart(2, '0');
    if (forceHours || ms >= 3600000) {
        var hrs = Math.floor(ms/3600000).toString();
        var mins = (Math.floor(ms/60000) % 60).toString().padStart(2, '0');
        return `${hrs}:${mins}:${secs}`;
    } else {
        var mins = Math.floor(ms/60000).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    }
}

// Waits a certain amount of time, in miliseconds. Async.
function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
}

// Format answers so they are easier to compare.
function cleanFormatting(text) {
    return text.toLowerCase().replace(/\W/gm, '');
}