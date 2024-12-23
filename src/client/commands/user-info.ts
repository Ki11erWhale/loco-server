import { Long } from 'loco-client';
import { Command } from '../../types/command';

export const info: Command = {
  name: '정보',
  description: '사용법: 정보 <멘션>\n멘션한 사용자의 정보를 출력합니다.',
  requiresAdmin: true,

  execute: (_, data, channel) => {
    const mentioned = data.mentions?.[0];
    if (!mentioned) {
      channel.sendChat('멘션한 사용자가 없습니다.\n사용법: 정보 <멘션>');
      return;
    }

    const userId = Long.fromValue(mentioned.user_id);
    const user = channel.getUserInfo({ userId });
    if (!user) return;

    channel.sendChat(
      `사용자 정보 (${user.nickname})` +
        '\u200b'.repeat(500) +
        '\n\n' +
        'Nickname: ' +
        user.nickname +
        '\n' +
        'UserId: ' +
        user.userId +
        '\n' +
        'UserType: ' +
        user.userType +
        '\n' +
        'ProfileURL: ' +
        user.profileURL +
        '\n' +
        'OriginalProfileURL: ' +
        user.originalProfileURL +
        '\n' +
        'FullProfileURL: ' +
        user.fullProfileURL
    );
  },
};
