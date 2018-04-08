import { Message, TextChannel } from 'discord.js'
import axios from 'axios'
import { Module } from '../'
import { Logger } from '@natsuki/util'
import { User as NatsukiUser } from '@natsuki/db'
import { giveXp } from './'

const { api } = Module.config
const baseRoute = `${api.address}/users`

export const onMessage = async (message: Message) => {
  if (message.author.bot || !message.content || !message.content.trim()
    || typeof message.channel !== typeof TextChannel) {
    return
  }

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
        // TODO: move createUser function from bot to util repo.
        // MessageUtility.createUser(message.author, message).catch(Logger.error)
        return
      }

      giveXp(res.data as NatsukiUser, message).catch(Logger.error)
    })
    .catch((err: any) => {
      Logger.error(err)
    })
}
