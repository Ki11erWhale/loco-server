import crypto from 'crypto';
import { ChatBuilder, KnownChatType } from 'loco-client';
import { Command } from '../../types/command';
import { delay } from '../../utils';
import { ipLoggerService } from '../features/ip-logger-service';

export const startIpLogging: Command = {
  name: '아이피시작',
  description: '아이피 주소 로깅을 시작합니다.',
  requiresAdmin: true,

  execute: async (client, data, channel) => {
    const id = channel.channelId.toString();
    if (ipLoggerService.getChannel(id)) {
      channel.sendChat('이미 아이피 주소를 로깅하고 있습니다.');
      return;
    }

    const seed = crypto.randomBytes(8).toString('hex');
    ipLoggerService.addLogger(id, channel);

    channel.sendChat('아이피 주소 로깅을 시작합니다.');

    await delay(1000);

    channel.sendChat(
      new ChatBuilder()
        .attachment({
          'lv': '4.0',
          'av': '1.0',
          'ak': '8fa1ffbc074c716c201ce0074d5f798e',
          'ti': '14325',
          'ta': {
            '${kakao_link_app_scheme}': '',
            '${kakao_link_subtitle}': 'IP Logger',
            '${kakao_link_pc_url}': '',
            '${kakao_link_image_width}': '339',
            '${kakao_link_image_height}': '339',
            '${kakao_link_image_src}': `https://loco-server.xyz/features/ip-logger/${id}-${seed}`,
            '${kakao_link_name}': '',
          },
          'extras': {
            'KA': 'sdk/1.43.1 os/javascript sdk_type/javascript lang/ko-KR device/Linux_i686 origin/https%3A%2F%2Fgame.kakao.com',
          },
        })
        .build(KnownChatType.CUSTOM)
    );
  },
};

export const stopIpLogging: Command = {
  name: '아이피중지',
  description: '아이피 주소 로깅을 중지합니다.',
  requiresAdmin: true,

  execute: async (client, data, channel) => {
    const id = channel.channelId.toString();
    if (!ipLoggerService.getChannel(id)) {
      channel.sendChat('아이피 주소 로깅중이 아닙니다.');
      return;
    }

    ipLoggerService.removeLogger(id);
    channel.sendChat('아이피 주소 로깅을 중지하였습니다.');
  },
};
