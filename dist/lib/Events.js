"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const __1 = require("../");
const util_1 = require("@nightwatch/util");
const _1 = require("./");
exports.onMessage = async (message, config) => {
    if (message.author.bot || !message.content || !message.content.trim() || message.channel.type !== 'text') {
        return;
    }
    const { api } = __1.Plugin.config;
    const baseRoute = `${api.address}/users`;
    // prevent the user from earning xp for bot commands.
    // handles *most* bots.
    const firstTwoMatch = message.content.trim().substring(0, 2).match(/[a-z]/gi);
    if (!firstTwoMatch || firstTwoMatch.length !== 2) {
        return;
    }
    const route = `${baseRoute}/${message.author.id}?token=${api.token}`;
    const { data: user } = await axios_1.default.get(route);
    if (!user) {
        util_1.MessageUtility.createUser(message.author, __1.Plugin.config).catch(util_1.Logger.error);
        return;
    }
    _1.giveXp(user, message).catch(util_1.Logger.error);
};
//# sourceMappingURL=Events.js.map