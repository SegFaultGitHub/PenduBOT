var path = require("path");

module.exports = {
    func: function (user, userID, channelID, message, evt, args, callback) {
        if (games[userID]) {
            stats[userID].giveups++;
            stats.total.giveups++;
            delete games[userID];
        }
        return callback(null, { type: "GOOD" });
    },
    help: {
        usage: botConfig.prefix + path.basename(__filename, ".js"),
        message: "Abandonne la partie en cours"
    }
};