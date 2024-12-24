import { Command } from '../../types/command';
import { delay } from '../../utils';

export const startSpamCommand: Command = {
  name: '도배시작',
  description: '랜덤 문자를 도배합니다.',
  requiresAdmin: true,

  execute: async (client, data, channel) => {
    const channelId = channel.channelId.toString();

    if (client.spamManager.isSpamming(channelId)) {
      channel.sendChat('이미 도배 중입니다.');
      return;
    }

    channel.sendChat('도배를 시작합니다.');

    await delay(1000);

    client.spamManager.startSpam(channelId, (message) => {
      channel.sendChat(message);
    });
  },
};

export const stopSpamCommand: Command = {
  name: '도배중지',
  description: '도배를 중지합니다.',
  requiresAdmin: true,

  execute: (client, data, channel) => {
    const channelId = channel.channelId.toString();

    const stopped = client.spamManager.stopSpam(channelId);
    if (stopped) {
      channel.sendChat('도배를 중지했습니다.');
    } else {
      channel.sendChat('도배 중이 아닙니다.');
    }
  },
};
