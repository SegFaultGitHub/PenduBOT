module.exports = function (word) {
    var letters = [];
    var errors = 0;
    var word = word;

    function getWord() {
        var result = "";
        for (var i = 0; i < word.length; i++) {
            if (letters.indexOf(word[i]) !== -1) result += word[i];
            else result += " _ ";
        }
        return result;
    }

    function play(letter, callback) {
        if (letters.indexOf(letter) !== -1) return callback(1);
        else if (word.indexOf(letter) === -1) {
            errors++;
            if (errors > 8) return callback(2);
        }
        letters.push(letter);
        return callback(null, getWord() === word);
    }
    
    return {
        letters: letters,
        word: word,
        play: play,
        getWord: getWord
    }
};