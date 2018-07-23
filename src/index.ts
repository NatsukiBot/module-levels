import { CommandoClient } from 'discord.js-commando'
import { Config } from '@nightwatch/util'
import { onMessage } from './lib/Events'

export class Plugin {
  public static config: Config
  public static client: CommandoClient
  public static id = 'Levels'
  public static description = 'A leveling system that awards XP when users send messages. Also rewards credits when a user levels up.'

  /**
   * Initializes plugin
   * @param client
   * @param config
   */
  public async init (client: CommandoClient, config: Config) {
    Plugin.client = client
    Plugin.config = config
    await this.registerListeners(client, config)
  }

  /**
   * Register events
   * @param client
   */
  private async registerListeners (client: CommandoClient, config: Config): Promise<void> {
    client.on('message', message => onMessage(message, config))
  }
}
