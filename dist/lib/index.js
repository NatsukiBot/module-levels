"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const _1 = require("../");
const util_1 = require("@nightwatch/util");
const timeForExp = 60 * 1000;
const minExpPerMessage = 15;
const maxExpPerMessage = 25;
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
    const { api } = _1.Module.config;
    const baseRoute = `${api.address}/users`;
    const timeDiff = Date.now() - new Date(user.level.timestamp).getTime();
    if (timeDiff < timeForExp) {
        return;
    }
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
    const route = `${baseRoute}/${message.author.id}/level?token=${api.token}`;
    if (leveledup) {
        const popcornEmoji = '🍿';
        const dollarEmoji = '💵';
        const rewardAmount = getRandomNumber(45, 50) + Math.floor(level * 0.5);
        message.channel.send(`**${popcornEmoji} | ${message.member
            .displayName} just advanced to level ${level} and earned ${dollarEmoji} ${rewardAmount} credits!**`);
        user.balance.balance += rewardAmount;
        user.balance.netWorth += rewardAmount;
        const postData = {
            level: {
                xp: experience,
                level
            },
            balance: {
                balance: user.balance.balance,
                netWorth: user.balance.netWorth,
                dateLastClaimedDailies: user.balance.dateLastClaimedDailies
            }
        };
        axios_1.default.put(route, postData).catch(util_1.Logger.error);
        return;
    }
    const postData = {
        level: {
            xp: experience,
            level
        }
    };
    axios_1.default.put(route, postData).catch(util_1.Logger.error);
};
//# sourceMappingURL=index.js.map