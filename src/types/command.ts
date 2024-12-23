import { TalkChatData, TalkChannel, Long } from 'loco-client';
import { CommandClient } from '../client';

export interface Command {
  name: string;
  description: string;
  requiresAdmin: boolean;
  execute: (
    client: CommandClient,
    data: TalkChatData,
    channel: TalkChannel
  ) => void;
}

export interface AdminBotCommandConf {
  prefix: string;
  isAdminBot: true;
  adminList: { nickname: string; userId: Long }[];
}

export interface GeneralBotCommandConf {
  prefix: string;
  isAdminBot: false;
}

export type CommandConf = AdminBotCommandConf | GeneralBotCommandConf;
