import { ChatBuilder, KnownChatType } from 'loco-client';
import { Command } from '../../types/command';
import { delay } from '../../utils';

export const clearChat: Command = {
  name: '채팅청소',
  description: '채팅을 청소합니다.',

  execute: async (_, data, channel) => {
    channel.sendChat('채팅 청소를 시작합니다.');

    await delay(1000);

    channel.sendChat(
      new ChatBuilder()
        .attachment({
          type: 'animated-sticker/digital-item',
          path: '4412206.emot_008.webp',
          name: '(이모티콘)',
          sound: '',
          width: 10000,
          height: 10000,
          msg: '',
          alt: '넵! 라이언 움직이는 이모티콘',
        })
        .build(KnownChatType.STICKERGIF)
    );

    channel.sendChat('채팅 청소를 완료하였습니다.');
  },
};
