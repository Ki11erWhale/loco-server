import { ChatBuilder, KnownChatType } from 'loco-client';
import { Command } from '../../types/command';

export const deco: Command = {
  name: '데코',
  description: '사용법: 데코 <말>\n데코레이트된 메시지를 보냅니다.',
  requiresAdmin: true,

  execute: (_, data, channel) => {
    const message = data.text.trim().split(' ').slice(1).join(' ');

    if (!message) {
      channel.sendChat('데코레이트할 말이 없습니다.\n사용법: 데코 <말>');
      return;
    }

    channel.sendChat(
      new ChatBuilder()
        .text(message)
        .attachment({
          'decoEvent': { 'eventID': 1733726024 },
        })
        .build(KnownChatType.TEXT)
    );
  },
};
