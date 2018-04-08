"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Events_1 = require("./lib/Events");
class Module {
    /**
     * Initializes module
     * @param client
     * @param config
     */
    async init(client, config) {
        Module.client = client;
        Module.config = config;
        await this.registerListeners(client);
    }
    /**
     * Register events
     * @param client
     */
    async registerListeners(client) {
        client.on('message', await Events_1.onMessage);
    }
}
exports.Module = Module;
//# sourceMappingURL=index.js.map