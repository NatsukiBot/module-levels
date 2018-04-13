import { Message, TextChannel } from 'discord.js'
import axios from 'axios'
import { Module } from '../'
import { Logger, MessageUtility, Config } from '@natsuki/util'
import { User as NatsukiUser } from '@natsuki/db'
import { giveXp } from './'

export const onMessage = async (message: Message, config: Config) => {
  if (message.author.bot || !message.content || !message.content.trim()
    || typeof message.channel !== typeof TextChannel) {
    return
  }

  const { api } = Module.config
  const baseRoute = `${api.address}/users`

  // Prevent the user from earning xp for bot commands.
  // Handles *most* bots.
  const firstTwoMatch = message.content.trim().substring(0, 2).match(/[a-z]/ig)
  if (!firstTwoMatch || firstTwoMatch.length !== 2) {
    return
  }

  const route = `${baseRoute}/${message.author.id}?token=${api.token}`

  axios.get(route)
    .then(res => {
      if (!res.data) {
        MessageUtility.createUser(message.author, message, Module.config).catch(Logger.error)
        return
      }

      const user = res.data as NatsukiUser

      giveXp(user, message).catch(Logger.error)
    })
    .catch((err: any) => {
      Logger.error(err)
    })
}
