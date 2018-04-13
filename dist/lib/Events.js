"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const _1 = require("../");
const util_1 = require("@natsuki/util");
const _2 = require("./");
exports.onMessage = async (message, config) => {
    if (message.author.bot || !message.content ||
        !message.content.trim() || message.channel.type !== 'text') {
        return;
    }
    const { api } = _1.Module.config;
    const baseRoute = `${api.address}/users`;
    // Prevent the user from earning xp for bot commands.
    // Handles *most* bots.
    const firstTwoMatch = message.content.trim().substring(0, 2).match(/[a-z]/ig);
    if (!firstTwoMatch || firstTwoMatch.length !== 2) {
        return;
    }
    const route = `${baseRoute}/${message.author.id}?token=${api.token}`;
    axios_1.default.get(route)
        .then(res => {
        if (!res.data) {
            util_1.MessageUtility.createUser(message.author, message, _1.Module.config).catch(util_1.Logger.error);
            return;
        }
        const user = res.data;
        _2.giveXp(user, message).catch(util_1.Logger.error);
    })
        .catch((err) => {
        util_1.Logger.error(err);
    });
};
//# sourceMappingURL=Events.js.map