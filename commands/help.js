var async = require("async");
var path = require("path");

function sendHelpMessage(user, userID, channelID, message, evt, cmds, callback) {
    return async.waterfall([
        function (callback) {
            return callback(null, cmds.filter(function (cmd) {
                return Object.keys(libs.commands.commands).indexOf(cmd) !== -1;
            }).filter(function (elem, index, self) {
                return index == self.indexOf(elem);
            }));
        },
        function (cmds, callback) {
            if (cmds.length === 0) {
                return discordClient.sendMessage({
                    to: channelID,
                    message: "La commande demandée n'existe pas"
                }, function (err) {
                    if (err) return callback(err);
                    return callback(null, {
                        type: "GOOD"
                    });
                });
            }
            var embed = {
                title: "Aide pour le bot " + botConfig.botName,
                fields: []
            };
            cmds.forEach(function (cmd) {
                var field = {
                    name: cmd,
                    value: "`" + libs.commands.commands[cmd].help.usage + "`\n" + libs.commands.commands[cmd].help.message
                };
                embed.fields.push(field);
            });
            return discordClient.sendMessage({
                to: channelID,
                embed: embed
            }, function (err) {
                if (err) return callback(err);
                return callback(null, {
                    type: "GOOD"
                });
            });
        }
    ], callback);
}

module.exports = {
    func: function (user, userID, channelID, message, evt, args, callback) {
        if (args.length === 0) {
            return sendHelpMessage(user, userID, channelID, message, evt, Object.keys(libs.commands.commands), callback);
        } else {
            return sendHelpMessage(user, userID, channelID, message, evt, args.map(function (arg) {
                return arg.toLowerCase();
            }), callback);
        }
    },
    help: {
        usage: botConfig.prefix + path.basename(__filename, ".js") + " [COMMAND ...]",
        message: "Affiche les informations sur les commandes demandées"
    }
};