import { Command } from '../../types/command';

export const commandName: Command = {
  name: '명령어',
  description: '사용 가능한 명령어 목록을 출력합니다.',

  execute: (client, data, channel) => {
    const commands = client.getRegisteredCommand();

    const commandDescriptions = commands
      .map(
        (cmd) =>
          `✅ ${client.commandConf.prefix}${cmd.name}\n${cmd.description}`
      )
      .join('\n\n');
    channel.sendChat(
      '[명령어 목록]' + '\u200b'.repeat(500) + '\n\n' + commandDescriptions
    );
  },
};
