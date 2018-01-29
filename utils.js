var fs = require("fs");

module.exports = function (callback) {
    words = [];
    function initializeWordList() {
        words = require("./words.json");
        words = words.filter(function (word) {
            return word.length >= 5 && word.length <= 10;
        });
        logger.info(words.length + " words loaded.");
    }

    initializeWordList();

    return callback(null, {
        secondsToTimestamp: function (epoch) {
            epoch = epoch / 1000;
            var uptime = {
                days: Math.floor(epoch / (60 * 60 * 24)),
                hours: Math.floor(epoch % (60 * 60 * 24) / (60 * 60)),
                minutes: Math.floor(epoch % (60 * 60) / 60),
                seconds: Math.floor(epoch % 60)
            };

            var result = "";
            if (uptime.days) result += uptime.days + " day" + (uptime.days > 1 ? "s " : " ");
            if (uptime.hours) result += uptime.hours + " hour" + (uptime.hours > 1 ? "s " : " ");
            if (uptime.minutes) result += uptime.minutes + " minute" + (uptime.minutes > 1 ? "s " : " ");
            if (uptime.seconds) result += uptime.seconds + " second" + (uptime.seconds > 1 ? "s " : " ");
            return result.trim() || "0 second";
        },
        now: function (plus) {
            return new Date().getTime() + (plus || 0) * 1e3;
        },
        pickWord: function () {
            return words[Math.floor(Math.random() * words.length)];
        },
        reformat: function (str) {
            str = str.toLowerCase();
            str = str.replace(/(á|à|ä|â)/g, "a");
            str = str.replace(/(é|è|ë|ê)/g, "e");
            str = str.replace(/(í|ì|ï|î)/g, "i");
            str = str.replace(/(ó|ò|ö|ô)/g, "o");
            str = str.replace(/(ú|ù|ü|û)/g, "u");
            str = str.replace(/(ÿ)/g, "y");
            str = str.replace(/(ç)/g, "c");
            str = str.replace(/\s+/g, " ");
            return str;
        }
    });
};