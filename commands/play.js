var path = require("path");
var game = require("../game.js");

function makeTitle(user, userID) {
    var res = user;
    if (games[userID].letters.length !== 0) res += " (" + games[userID].letters + ")";
    return res;
}

module.exports = {
    func: function (user, userID, channelID, message, evt, args, callback) {
        if (games[userID]) {
            if (args.length === 0) {
                discordClient.sendMessage({
                    to: channelID,
                    embed: {
                        title: makeTitle(user, userID),
                        description: "`" + games[userID].getWord() + "`"
                    }
                }, function (err, res) {
                    if (err) return callback(err);
                    else return callback(null, { type: "GOOD" });
                });
            } else if (args.length === 1) {
                if (args[0].length !== 1) return callback(null, { type: "MISUSED" });
                else {
                    return games[userID].play(libs.utils.reformat(args[0]), function (err, win) {
                        if (err === 2) {
                            stats.total.losses++;
                            stats[userID].losses++;
                            return discordClient.sendMessage({
                                to: channelID,
                                embed: {
                                    title: makeTitle(user, userID),
                                    description: "Partie terminée. Le mot était : " + games[userID].word
                                }
                            }, function (err) {
                                if (err) return callback(err);
                                else {
                                    delete games[userID];
                                    return callback(null, { type: "GOOD" });
                                }
                            });
                        } else if (!win) {
                            return discordClient.sendMessage({
                                to: channelID,
                                embed: {
                                    title: makeTitle(user, userID),
                                    description: "`" + games[userID].getWord() + "`"
                                }
                            }, function (err) {
                                if (err) return callback(err);
                                else return callback(null, { type: "GOOD" });
                            });
                        } else {
                            stats.total.wins++;
                            stats[userID].wins++;
                            return discordClient.sendMessage({
                                to: channelID,
                                embed: {
                                    title: makeTitle(user, userID),
                                    description: "Victoire, le mot était : " + games[userID].word
                                }
                            }, function (err) {
                                if (err) return callback(err);
                                else {
                                    delete games[userID];
                                    return callback(null, { type: "GOOD" });
                                }
                            });
                        }
                    });
                }
            } else {
                return callback(null, { type: "MISUSED" });
            }
        } else {
            var word = libs.utils.pickWord();
            logger.info(word);
            games[userID] = game(word);
            stats.total.plays++;
            stats[userID].plays++;
            discordClient.sendMessage({
                to: channelID,
                embed: {
                    title: makeTitle(user, userID),
                    description: "`" + games[userID].getWord() + "`"
                }
            }, function (err, res) {
                if (err) return callback(err);
                else return callback(null, { type: "GOOD" });
            });
        }
    },
    help: {
        usage: botConfig.prefix + path.basename(__filename, ".js") + " [LETTER]",
        message: "Lance une nouvelle partie, ou continue celle en cours"
    }
};