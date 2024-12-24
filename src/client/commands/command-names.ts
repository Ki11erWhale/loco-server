import { Command } from '../../types/command';

export const commandName: Command = {
  name: '명령어',
  description: '사용 가능한 명령어 목록을 출력합니다.',
  requiresAdmin: false,

  execute: (client, data, channel) => {
    const commands = client.getRegisteredCommand();
    const isAdminBot = client.commandConf.isAdminBot;

    const commandDescriptions = commands
      .map(
        (cmd) =>
          `${isAdminBot && cmd.requiresAdmin ? '✅ ' : ''}${
            client.commandConf.prefix
          }${cmd.name}\n${cmd.description}`
      )
      .join('\n\n');

    channel.sendChat(
      '[명령어 목록]' +
        '\u200b'.repeat(500) +
        '\n\n' +
        (isAdminBot ? '✅: 관리자 권한이 필요한 명령어\n\n' : '') +
        commandDescriptions
    );
  },
};
