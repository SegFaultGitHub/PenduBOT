var async = require("async");
var path = require("path");

module.exports = {
    func: function (user, userID, channelID, message, evt, args, callback) {
        if (args.length !== 0) {
            return callback(null, {
                type: "MISUSED"
            });
        }
        embed = {
            title: " :bar_chart: Statistiques de " + botConfig.botName,
            fields: []
        };

        return async.series({
            uptime: function (callback) {
                embed.fields.push({
                    name: ":clock4: Uptime",
                    value: "• **En ligne depuis** : " + libs.utils.secondsToTimestamp(libs.utils.now() - connectionDate)
                });
                return callback();
            },
            global: function (callback) {
                embed.fields.push({
                    name: ":chart_with_upwards_trend: Statistiques globales",
                    value: "• **Parties jouées** : " + stats.total.plays + "\n" +
                        "• **Victoires** : " + stats.total.wins + "\n" +
                        "• **Défaites** : " + stats.total.losses + "\n" +
                        "• **Abandons** : " + stats.total.giveups
                });
                return callback();
            },
            personnal: function (callback) {
                embed.fields.push({
                    name: ":chart_with_downwards_trend: Statistiques personnelles",
                    value: "• **Parties jouées** : " + stats[userID].plays + "\n" +
                        "• **Victoires** : " + stats[userID].wins + "\n" +
                        "• **Défaites** : " + stats[userID].losses + "\n" +
                        "• **Abandons** : " + stats[userID].giveups
                });
                return callback();
            }
        }, function (err) {
            if (err) return callback(err);
            return discordClient.sendMessage({
                to: channelID,
                embed: embed
            }, function (err) {
                if (err) return callback(err);
                else return callback(null, {
                    type: "GOOD"
                });
            });
        });
    },
    help: {
        usage: botConfig.prefix + path.basename(__filename, ".js"),
        message: "Affiche diverses statistiques concernant le bot"
    }
};