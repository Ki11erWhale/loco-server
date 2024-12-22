import { TalkChannel } from 'loco-client';

const loggerMap = new Map<string, TalkChannel>();

export const ipLoggerService = {
  addLogger: (id: string, channel: TalkChannel) => {
    loggerMap.set(id, channel);
  },

  getChannel: (id: string) => {
    return loggerMap.get(id);
  },

  removeLogger: (id: string) => {
    loggerMap.delete(id);
  },
};
