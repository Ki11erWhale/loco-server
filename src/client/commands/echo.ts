import { Command } from '../../types/command';

export const echo: Command = {
  name: '따라하기',
  description: '사용법: 따라하기 <말>\n말을 따라합니다.',
  requiresAdmin: true,

  execute: (_, data, channel) => {
    const message = data.text.trim().split(' ').slice(1).join(' ');

    if (!message) {
      channel.sendChat('따라할 말이 없습니다.\n사용법: 따라하기 <말>');
      return;
    }

    channel.sendChat(message);
  },
};
