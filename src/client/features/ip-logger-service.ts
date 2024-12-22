import { TalkChannel } from 'loco-client';

const loggerMap = new Map<string, { seed: string; channel: TalkChannel }>();

export const ipLoggerService = {
  addLogger: (id: string, channel: TalkChannel, seed: string) => {
    loggerMap.set(id, { seed, channel });
  },

  getLogger: (id: string) => {
    return loggerMap.get(id);
  },

  removeLogger: (id: string) => {
    loggerMap.delete(id);
  },
};
