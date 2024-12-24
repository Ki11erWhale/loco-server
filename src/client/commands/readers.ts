import { KnownChatType, ReplyAttachment } from 'loco-client';
import { Command } from '../../types/command';

export const readers: Command = {
  name: '읽은사람',
  description:
    '사용법: 읽은사람(읽은 사람을 확인할 메시지에 답장 형식으로 전송)' +
    '\n' +
    '🔥특수 기능🔥: 읽은 사람을 확인하고 싶은 메시지에 감정 표현을 아무거나 달면 봇이 개인 메시지로 몰래 누가 읽었는지 알려줍니다. (오픈채팅방 사용 불가)',
  requiresAdmin: true,

  execute: (_, data, channel) => {
    const sender = data.getSenderInfo(channel);
    if (!sender) return;

    if (data.originalType !== KnownChatType.REPLY) {
      channel.sendChat(
        '사용법: 읽은 사람을 확인할 메시지에 답장 형식으로 명령어를 전송하세요.'
      );
      return;
    }

    const reply = data.attachment<ReplyAttachment>();
    const logId = reply.src_logId;
    if (logId) {
      const readers = channel.getReaders({ logId });
      channel.sendChat(
        `[읽은 사람 총 ${readers.length}명]` +
          '\u200b'.repeat(500) +
          '\n\n' +
          `${readers.map((reader) => reader.nickname).join(', ')}` +
          '\n\n' +
          '⚠️ 특수 기능으로 읽은 사람을 몰래 확인해 보세요. ⚠️' +
          '\n' +
          '읽은 사람을 확인하고 싶은 메시지에 감정 표현을 아무거나 달면 봇이 개인 메시지로 몰래 누가 읽었는지 알려줍니다. (오픈채팅방 사용 불가)'
      );
    }
  },
};
