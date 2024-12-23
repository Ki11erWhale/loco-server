import { Command } from '../../types/command';
import { Long } from 'loco-client';

export const detectRead: Command = {
  name: '감지',
  description:
    '사용법: 감지 <멘션>\n멘션한 사용자가 채팅방의 메시지를 읽으면 바로 알려줍니다.',
  requiresAdmin: true,

  execute: (client, data, channel) => {
    const mentioned = data.mentions?.[0];
    if (!mentioned) {
      channel.sendChat('멘션한 사용자가 없습니다.\n사용법: 감지 <멘션>');
      return;
    }

    const userId = Long.fromValue(mentioned.user_id);
    const user = channel.getUserInfo({ userId });
    if (!user) return;

    const sender = data.getSenderInfo(channel);
    if (!sender) return;

    client.detectManager.addTarget(channel, user.userId, user.nickname, sender);

    channel.sendChat(`${user.nickname}님을 감지 리스트에 추가했습니다.`);
  },
};

export const detectList: Command = {
  name: '감지목록',
  description: '현재 감지 리스트에 등록된 사용자들을 출력합니다.',
  requiresAdmin: true,

  execute: (client, data, channel) => {
    const detectList = client.detectManager.getDetectList(channel);

    channel.sendChat(
      `[감지 목록 총 ${detectList.length}명]` +
        '\u200b'.repeat(500) +
        '\n\n' +
        `${detectList
          .map(
            (user) =>
              `${user.nickname} is being waited by ${user.waitedBy
                .map((r) => r.nickname)
                .join(', ')}`
          )
          .join('\n')}`
    );
  },
};
