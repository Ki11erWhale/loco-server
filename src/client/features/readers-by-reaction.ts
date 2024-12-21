import {
  ChatBuilder,
  KnownChatType,
  Long,
  MentionContent,
  TalkClient,
  TalkNormalChannel,
} from 'loco-client';

export const readersByReaction = async (
  client: TalkClient,
  channel: TalkNormalChannel,
  logId: Long,
  userId: Long
) => {
  const readers = channel.getReaders({ logId });
  const readerNames = readers.map((reader) => reader.nickname).join(', ');

  if (!client.clientUser.userId.equals(userId)) {
    const findDirectChat = (userId: Long) => {
      return Array.from(client.channelList.normal.all()).find((c) => {
        if (c.info.type === 'DirectChat') {
          return Array.from(c.getAllUserInfo()).some((user) =>
            user.userId.equals(userId)
          );
        }

        return false;
      });
    };

    let directChat = findDirectChat(userId);

    if (!directChat) {
      const newChannelRes = await client.channelList.normal.createChannel({
        userList: [{ userId }],
      });

      if (!newChannelRes.success) {
        const reactionUser = Array.from(channel.getAllUserInfo()).find((u) =>
          u.userId.equals(userId)
        );

        if (!reactionUser) return;

        channel.sendChat(
          new ChatBuilder()
            .text('[오류⛔]\n')
            .append(new MentionContent(reactionUser))
            .text('\u200b'.repeat(500) + '\n\n')
            .text(
              '감정표현으로 읽은 사람 몰래 알아내기 기능에서 오류 발생:\n봇이 개인 채팅방 생성에 실패하였습니다.' +
                '\n\n' +
                '봇의 개인 채팅으로 아무 메시지나 보낸 이후 다시 채팅방으로 돌아와 감정표현을 달아주세요.\n\n'
            )
            .build(KnownChatType.TEXT)
        );

        return;
      }

      directChat = newChannelRes.result;
    }

    directChat.sendChat(readerNames);
  } else {
    const findSelfChat = () => {
      return Array.from(client.channelList.normal.all()).find(
        (channel) => channel.info.type === 'MemoChat'
      );
    };

    let memoChat = findSelfChat();

    if (!memoChat) {
      const newChannelRes = await client.channelList.normal.createMemoChannel();

      if (!newChannelRes.success) return;

      memoChat = newChannelRes.result;
    }

    memoChat.sendChat(readerNames);
  }
};
