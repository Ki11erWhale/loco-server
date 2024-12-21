import { ChatBuilder, KnownChatType } from 'loco-client';
import { Command } from '../../types/command';
import { delay } from '../../utils';
// import { setOnRequestCallback } from '../server/ip-logger';

export const startIpLogging: Command = {
  name: '아이피시작',
  description: '아이피 주소 로깅을 시작합니다.',

  execute: async (_, data, channel) => {
    // setOnRequestCallback((ip, userAgent) => {
    //   channel.sendChat(`IP: ${ip}\nUser-Agent: ${userAgent}`);
    // });

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
            '${kakao_link_image_src}': `https://github.com/user-attachments/assets/2d54d27d-dc4b-49c3-807a-7c6bce3023a6`,
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
