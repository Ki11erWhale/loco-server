import { Command } from '../../types/command';

export const checkStatus: Command = {
  name: '작동',
  description: '봇이 정상 작동 중인지 확인합니다.',
  requiresAdmin: false,

  execute: (_, data, channel) => {
    channel.sendChat('작동중');
  },
};
