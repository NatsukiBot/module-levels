import { Message, TextChannel } from 'discord.js'
import axios from 'axios'
import { Plugin } from '../'
import { Logger, MessageUtility, Config } from '@nightwatch/util'
import { User as NightwatchUser } from '@nightwatch/db'
import { giveXp } from './'

export const onMessage = async (message: Message, config: Config) => {
  if (message.author.bot || !message.content || !message.content.trim() || message.channel.type !== 'text') {
    return
  }

  const { api } = Plugin.config
  const baseRoute = `${api.address}/users`

  // prevent the user from earning xp for bot commands.
  // handles *most* bots.
  const firstTwoMatch = message.content.trim().substring(0, 2).match(/[a-z]/gi)
  if (!firstTwoMatch || firstTwoMatch.length !== 2) {
    return
  }

  const route = `${baseRoute}/${message.author.id}?token=${api.token}`

  axios
    .get(route)
    .then(res => {
      if (!res.data) {
        MessageUtility.createUser(message.author, Plugin.config).catch(Logger.error)
        return
      }

      const user = res.data as NightwatchUser

      giveXp(user, message).catch(Logger.error)
    })
    .catch((err: any) => {
      Logger.error(err)
    })
}
