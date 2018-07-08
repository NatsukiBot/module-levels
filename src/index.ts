import { Message } from 'discord.js'
import { CommandoClient } from 'discord.js-commando'
import { Config } from '@nightwatch/util'
import { onMessage } from './lib/Events'

export class Module {
  static config: Config
  static client: CommandoClient
  static id = 'Levels'
  static description = 'A leveling system that awards XP when users send messages. Also rewards credits when a user levels up.'

  /**
   * Initializes module
   * @param client
   * @param config
   */
  public async init (client: CommandoClient, config: Config) {
    Module.client = client
    Module.config = config
    await this.registerListeners(client, config)
  }

  /**
   * Register events
   * @param client
   */
  private async registerListeners (client: CommandoClient, config: Config): Promise<void> {
    client.on('message', (message) => onMessage(message, config))
  }
}
