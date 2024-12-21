import { ChatBuilder, KnownChatType, MentionContent } from 'loco-client';
import { Command } from '../../types/command';

export const mentionAll: Command = {
  name: '모두멘션',
  description: '채팅방에 있는 모든 사람을 멘션합니다.',
  execute: (_, data, channel) => {
    const userList = Array.from(channel.getAllUserInfo());
    const maxMentions = 15;

    for (let i = 0; i < userList.length; i += maxMentions) {
      const chunk = userList.slice(i, i + maxMentions);
      const chatBuilder = new ChatBuilder();

      for (const user of chunk) {
        chatBuilder.append(new MentionContent(user));
        chatBuilder.text(' ');
      }

      channel.sendChat(chatBuilder.build(KnownChatType.TEXT));
    }
  },
};
