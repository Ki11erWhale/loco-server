import {
  AuthApiClient,
  ChannelUserInfo,
  DefaultRes,
  Long,
  TalkChannel,
  TalkChatData,
  TalkClient,
  TalkNormalChannel,
  util,
} from 'loco-client';
import { Command, CommandConf } from '../types/command';
import { UserInfo } from '../types/user';
import {
  checkStatus,
  clearChat,
  commandName,
  detectRead,
  detectList,
  echo,
  emoticon,
  emoticonList,
  startIpLogging,
  mentionAll,
  readers,
  info,
  deco,
  stopIpLogging,
} from './commands';
import { readersByReaction } from './features/readers-by-reaction';
import { DetectManager, onDetected } from './features/detect-manager';

export class CommandClient {
  private userInfo: UserInfo;
  private commands: Command[];

  commandConf: CommandConf;
  client: TalkClient;
  detectManager: DetectManager;

  constructor(userInfo: UserInfo, commandConf: CommandConf) {
    this.client = new TalkClient();
    this.userInfo = userInfo;
    this.commands = [];
    this.detectManager = new DetectManager();
    this.commandConf = commandConf;

    this.registerCommand(checkStatus);
    this.registerCommand(commandName);
    this.registerCommand(clearChat);
    this.registerCommand(echo);
    this.registerCommand(info);
    this.registerCommand(deco);
    this.registerCommand(mentionAll);
    this.registerCommand(readers);
    this.registerCommand(detectRead);
    this.registerCommand(detectList);
    this.registerCommand(emoticon);
    this.registerCommand(emoticonList);
    this.registerCommand(startIpLogging);
    this.registerCommand(stopIpLogging);

    this.client.on('chat', (data, channel) => {
      this.handleCommand(data, channel);
    });

    this.client.on('chat_read', (_, channel, reader) => {
      this.handleChatRead(channel, reader);
    });

    this.client.on('push_packet', (method, data) => {
      this.handlePacket(method, data);
    });
  }

  private registerCommand(command: Command) {
    this.commands.push(command);
  }

  getRegisteredCommand() {
    return this.commands;
  }

  private handleCommand(data: TalkChatData, channel: TalkChannel) {
    const text = data.text?.trim();
    if (!text?.startsWith(this.commandConf.prefix)) return;

    const commandName = text.slice(1).split(' ')[0];
    const registeredCommand = this.commands.find(
      (cmd) => cmd.name === commandName
    );

    if (!registeredCommand) {
      channel.sendChat(`${commandName}는 존재하지 않는 명령어입니다.`);
      return;
    }

    try {
      registeredCommand.execute(this, data, channel);
    } catch (e) {
      console.error(e);
    }
  }

  private handleChatRead(
    channel: TalkChannel,
    reader: ChannelUserInfo | undefined
  ) {
    if (!reader) return;

    const detectList = this.detectManager.getDetectList(channel);
    const target = detectList.find((t) => t.userId.equals(reader.userId));
    if (!target) return;

    onDetected(channel, reader, target);

    this.detectManager.removeTarget(channel, reader.userId);
  }

  private handlePacket(method: string, data: DefaultRes) {
    if (method === 'CHGLOGMETA') {
      const channel = this.client.channelList.get(data.chatId as Long);
      const extra = util.JsonUtil.parseLoseless(data.extra as string);
      const logId = Long.fromValue(data.logId as number);
      const userId = Long.fromValue(extra.userId);

      if (!(channel instanceof TalkNormalChannel)) return;
      if (extra.type === 0) return;

      readersByReaction(this.client, channel, logId, userId);
    }
  }

  async login(): Promise<
    { success: true } | { success: false; reason: string }
  > {
    const { email, password, deviceUuid, deviceName } = this.userInfo;

    const api = await AuthApiClient.create(deviceName, deviceUuid);
    const loginRes = await api.login({ email, password });

    if (!loginRes.success) {
      return {
        success: false,
        reason: `Web login failed with status: ${loginRes.status}`,
      };
    }

    const res = await this.client.login(loginRes.result);
    if (!res.success) {
      return {
        success: false,
        reason: `Login failed with status: ${res.status}`,
      };
    }

    return { success: true };
  }
}
