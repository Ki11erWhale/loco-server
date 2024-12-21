import { ChatBuilder, KnownChatType } from 'loco-client';
import { Command } from '../../types/command';

type Emoticon = {
  name: string;
  description: string;
  eid: string;
  chatType: KnownChatType.STICKER | KnownChatType.STICKERGIF;
  type: 'sticker/digital-item' | 'animated-sticker/digital-item';
};

const emoticons: Emoticon[] = [
  {
    name: '카카오프렌즈 클래식',
    description: '(1~88)',
    eid: '2212560',
    chatType: KnownChatType.STICKER,
    type: 'sticker/digital-item',
  },
  {
    name: '안녕 니니즈',
    description: '(1~48)',
    eid: '4412207',
    chatType: KnownChatType.STICKERGIF,
    type: 'animated-sticker/digital-item',
  },
  {
    name: '안녕 카카오프렌즈',
    description: '(1~48)',
    eid: '4412206',
    chatType: KnownChatType.STICKERGIF,
    type: 'animated-sticker/digital-item',
  },
  // {
  //   name: '춘식이는 프렌즈 2',
  //   description: '(1~24)',
  //   eid: '4419790',
  //   chatType: KnownChatType.STICKERGIF,
  //   type: 'animated-sticker/digital-item',
  // },
];

export const emoticonList: Command = {
  name: '임티목록',
  description: '사용 가능한 이모티콘 번호 목록을 출력합니다.',

  execute: (_, data, channel) => {
    channel.sendChat(
      '[사용 가능한 이모티콘 목록]' +
        '\u200b'.repeat(500) +
        '\n\n' +
        emoticons
          .map(
            (e) =>
              e.name +
              '\n' +
              '아이디: ' +
              e.eid +
              '\n' +
              '번호 범위: ' +
              e.description
          )
          .join('\n\n')
    );
  },
};

export const emoticon: Command = {
  name: '임티',
  description:
    '사용빕: 임티 <임티 아이디> <임티 번호> <크기(기본값: 360)>\n이모티콘을 전송합니다.\n예시: 임티 4412207 35 720',

  execute: (client, data, channel) => {
    const args = data.text.trim().split(' ').slice(1);
    const [eid, enumber, size = '360'] = args;

    if (args.length < 2 || !eid || !enumber) {
      return channel.sendChat(
        '사용법: 임티 <임티 아이디> <임티 번호> <크기(기본값: 360)>\n' +
          '예시: 임티 4412207 35 720\n\n' +
          '이모티콘 정보를 확인하려면 "임티목록" 명령어를 사용하세요.'
      );
    }

    const emoticon = emoticons.find((e) => e.eid === eid);
    if (!emoticon) {
      return channel.sendChat(
        '사용 불가능한 이모티콘입니다. 이모티콘 아이디를 확인하세요.\n' +
          '사용 가능한 이모티콘 목록을 보려면 "임티목록" 명령어를 사용하세요.'
      );
    }

    const rangeMatch = emoticon.description.match(/\((\d+)~(\d+)\)/);
    if (!rangeMatch) {
      return channel.sendChat('이모티콘 번호 범위를 확인할 수 없습니다.');
    }
    const [_, min, max] = rangeMatch.map(Number);
    if (Number(enumber) < min || Number(enumber) > max) {
      return channel.sendChat(
        `이모티콘 번호가 유효하지 않습니다. 가능한 번호 범위: ${min} ~ ${max}`
      );
    }

    const sizeValue = Number(size);
    if (isNaN(sizeValue) || sizeValue < 50 || sizeValue > 50000) {
      return channel.sendChat(
        '크기 값은 50~50000 사이의 숫자로 입력해야 합니다.\n' +
          '기본값(360)이 사용됩니다.'
      );
    }

    channel.sendChat(
      new ChatBuilder()
        .attachment({
          type: emoticon.type,
          path: `${eid}.emot_${enumber.padStart(3, '0')}.${
            emoticon.chatType === KnownChatType.STICKER ? 'png' : 'webp'
          }`,
          name: '(이모티콘)',
          sound: '',
          width: sizeValue,
          height: sizeValue,
          msg: '',
          alt: '',
        })
        .build(emoticon.chatType)
    );
  },
};
