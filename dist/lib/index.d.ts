import { Message } from 'discord.js';
import { User as NatsukiUser } from '@natsuki/db';
export declare const giveXp: (user: NatsukiUser, message: Message) => Promise<void>;
