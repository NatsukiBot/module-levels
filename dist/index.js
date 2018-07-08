"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Events_1 = require("./lib/Events");
class Plugin {
    /**
     * Initializes plugin
     * @param client
     * @param config
     */
    async init(client, config) {
        Plugin.client = client;
        Plugin.config = config;
        await this.registerListeners(client, config);
    }
    /**
     * Register events
     * @param client
     */
    async registerListeners(client, config) {
        client.on('message', message => Events_1.onMessage(message, config));
    }
}
Plugin.id = 'Levels';
Plugin.description = 'A leveling system that awards XP when users send messages. Also rewards credits when a user levels up.';
exports.Plugin = Plugin;
//# sourceMappingURL=index.js.map