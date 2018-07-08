import { Message } from 'discord.js';
import { User as NightwatchUser } from '@nightwatch/db';
export declare const giveXp: (user: NightwatchUser, message: Message) => Promise<void>;
