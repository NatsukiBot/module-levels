import { Message, User } from 'discord.js'
import axios from 'axios'
import { Plugin } from '../'
import { Logger } from '@nightwatch/util'
import { User as NightwatchUser } from '@nightwatch/db'

const timeForExp = 60 * 1000
const minExpPerMessage = 15
const maxExpPerMessage = 25

const getRandomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const getXpForLevel = (level: number) => {
  return 5 * level * level + 50 * level + 100
}

export const giveXp = async (user: NightwatchUser, message: Message) => {
  if (!user.settings.levelsEnabled) {
    return
  }

  const { api } = Plugin.config
  const baseRoute = `${api.address}/users`

  const timeDiff: number = Date.now() - new Date(user.level.timestamp).getTime()

  if (timeDiff < timeForExp) {
    return
  }

  const entry: { xp: number; level: number } = user.level

  let experience: number = entry.xp
  let level: number = entry.level
  let experienceNext: number = getXpForLevel(level)
  let leveledup: boolean = false
  const expGain: number = getRandomNumber(maxExpPerMessage, minExpPerMessage)

  experience += expGain

  while (experience >= experienceNext) {
    experience -= experienceNext
    experienceNext = getXpForLevel(level)
    level++
    leveledup = true
  }

  const route = `${baseRoute}/${message.author.id}/level?token=${api.token}`

  if (leveledup) {
    const popcornEmoji = '🍿'
    const dollarEmoji = '💵'
    const rewardAmount = getRandomNumber(45, 50) + Math.floor(level * 0.5)
    message.channel.send(
      `**${popcornEmoji} | ${message.member
        .displayName} just advanced to level ${level} and earned ${dollarEmoji} ${rewardAmount} credits!**`
    )

    user.balance.balance += rewardAmount
    user.balance.netWorth += rewardAmount

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
    }

    axios.put(route, postData).catch(Logger.error)
    return
  }

  const postData = {
    level: {
      xp: experience,
      level
    }
  }

  axios.put(route, postData).catch(Logger.error)
}
