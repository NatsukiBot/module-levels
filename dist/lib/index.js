"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const _1 = require("../");
const util_1 = require("@natsuki/util");
const { api } = _1.Module.config;
const lastMessageMap = new Map();
const timeForExp = 60 * 1000;
const minExpPerMessage = 15;
const maxExpPerMessage = 25;
const baseRoute = `${api.address}/users`;
const getRandomNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
const getXpForLevel = (level) => {
    return 5 * level * level + 50 * level + 100;
};
exports.giveXp = async (user, message) => {
    if (!user.settings.levelsEnabled) {
        return;
    }
    const lastMessage = lastMessageMap.get(message.author) || -Infinity;
    if (!lastMessage || Date.now() - lastMessage < timeForExp) {
        return;
    }
    lastMessageMap.set(message.author, Date.now());
    const entry = user.level;
    let experience = entry.xp;
    let level = entry.level;
    let experienceNext = getXpForLevel(level);
    let leveledup = false;
    const expGain = getRandomNumber(maxExpPerMessage, minExpPerMessage);
    experience += expGain;
    while (experience >= experienceNext) {
        experience -= experienceNext;
        experienceNext = getXpForLevel(level);
        level++;
        leveledup = true;
    }
    if (leveledup) {
        const popcornEmoji = '🍿';
        const dollarEmoji = '💵';
        const rewardAmount = getRandomNumber(45, 55) + level * 1.25;
        message.channel.send(`**${popcornEmoji} | ${message.member.displayName} just advanced to level ${level} and earned ${dollarEmoji} ${rewardAmount} credits!**`);
        // user.money.balance += 50
        // user.money.netWorth += 50
        // await userController.updateBalance(message.member.id, user.money.balance, user.money.networth).catch(Logger.error)
    }
    const route = `${baseRoute}/${message.author.id}?token=${api.token}`;
    const postData = {
        xp: experience,
        level
    };
    axios_1.default.put(route, postData).catch(util_1.Logger.error);
};
//# sourceMappingURL=index.js.map