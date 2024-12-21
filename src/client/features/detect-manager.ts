import {
  ChannelUserInfo,
  ChatBuilder,
  KnownChatType,
  Long,
  MentionContent,
  TalkChannel,
} from 'loco-client';

type Target = {
  userId: Long;
  nickname: string;
  waitedBy: ChannelUserInfo[];
};

export class DetectManager {
  private detectLists: Map<string, Target[]>;

  constructor() {
    this.detectLists = new Map();
  }

  getDetectList(channel: TalkChannel): Target[] {
    const channelId = channel.channelId.toString();

    if (!this.detectLists.has(channelId)) {
      this.detectLists.set(channelId, []);
    }
    return this.detectLists.get(channelId)!;
  }

  addTarget(
    channel: TalkChannel,
    userId: Long,
    nickname: string,
    requester: ChannelUserInfo
  ) {
    const detectList = this.getDetectList(channel);
    let target = detectList.find((t) => t.userId.equals(userId));

    if (!target) {
      target = { userId, nickname, waitedBy: [] };
      detectList.push(target);
    }

    if (!target.waitedBy.find((w) => w.userId.equals(requester.userId))) {
      target.waitedBy.push(requester);
    }
  }

  removeTarget(channel: TalkChannel, userId: Long) {
    const detectList = this.getDetectList(channel);
    const index = detectList.findIndex((target) =>
      target.userId.equals(userId)
    );
    if (index !== -1) detectList.splice(index, 1);
  }
}

export const onDetected = (
  channel: TalkChannel,
  reader: ChannelUserInfo,
  target: Target
) => {
  const chatBuilder = new ChatBuilder();
  chatBuilder.text(`${reader.nickname}님이 메시지를 읽었습니다!\n`);

  target.waitedBy.forEach((requester) => {
    chatBuilder.append(
      new MentionContent({
        userId: requester.userId,
        nickname: requester.nickname,
        profileURL: requester.profileURL,
      })
    );
    chatBuilder.text(' ');
  });

  channel.sendChat(chatBuilder.build(KnownChatType.TEXT));
};
