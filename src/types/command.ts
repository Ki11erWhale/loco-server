import { TalkChatData, TalkChannel } from 'loco-client';
import { CommandClient } from '../client';

export interface Command {
  name: string;
  description: string;
  execute: (
    client: CommandClient,
    data: TalkChatData,
    channel: TalkChannel
  ) => void;
}

export interface CommandConf {
  prefix: string;
}
