import crypto from 'crypto';
import { Command } from '../../types/command';

export const adminList: Command = {
  name: '관리자목록',
  description: '현재 등록된 관리자 목록을 출력합니다.',
  requiresAdmin: false,

  execute: (client, data, channel) => {
    if (!client.commandConf.isAdminBot) return;

    const adminList = client.commandConf.adminList;

    channel.sendChat(
      `[관리자 총 ${adminList.length}명]` +
        '\u200b'.repeat(500) +
        '\n\n' +
        `${adminList.map((admin) => admin.nickname).join(', ')}`
    );
  },
};

export const addAdmin: Command = {
  name: '관리자등록',
  description: `관리자를 등록하기 위한 키를 발급합니다.\n매니저 클라이언트에서 4번 옵션을 통해 발급받은 키를 확인하고 채팅방에 '관리자인증 <키>' 명령어를 보내주세요.`,
  requiresAdmin: false,

  execute: (client, data, channel) => {
    if (!client.commandConf.isAdminBot) return;

    const key = crypto.randomBytes(8).toString('hex');
    client.setAdminKey(key);

    channel.sendChat(
      `관리자 인증에 필요한 키를 발급하였습니다.\n\n매니저 클라이언트에서 4번 옵션을 통해 발급받은 키를 확인하고 채팅방에 '관리자인증 <키>' 명령어를 보내주세요.`
    );
  },
};

export const verifyAdmin: Command = {
  name: '관리자인증',
  description: `사용법: 관리자인증 <키>\n'관리자추가' 명령어로 발급된 키를 통해 인증합니다.`,
  requiresAdmin: false,

  execute: (client, data, channel) => {
    if (!client.commandConf.isAdminBot) return;

    const key = data.text.trim().split(' ')[1];

    if (!key) {
      channel.sendChat('키를 입력해 주세요.\n사용법: 관리자인증 <키>');
      return;
    }

    if (client.getAdminKey() === key) {
      const sender = data.getSenderInfo(channel);
      if (!sender) return;

      client.commandConf.adminList.push({
        nickname: sender.nickname,
        userId: sender.userId,
      });

      channel.sendChat(
        '관리자 인증이 완료되었습니다.\n\n✅ 매니저 클라이언트에서 5번 옵션을 통해 관리자 목록을 업데이트하세요.'
      );

      client.setAdminKey('');
    } else {
      channel.sendChat('잘못된 키값입니다.');
    }
  },
};
