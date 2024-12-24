import crypto from 'crypto';

type ChannelId = string;

export class SpamManager {
  private spamState: Map<string, NodeJS.Timeout>;

  constructor() {
    this.spamState = new Map();
  }

  startSpam(channelId: ChannelId, sendMessage: (message: string) => void) {
    if (this.spamState.has(channelId)) return false;

    const interval = setInterval(() => {
      const randomString = crypto.randomBytes(10).toString('base64');
      sendMessage(randomString);
    }, 110);

    this.spamState.set(channelId, interval);
    return true;
  }

  stopSpam(channelId: ChannelId) {
    const interval = this.spamState.get(channelId);

    if (interval) {
      clearInterval(interval);
      this.spamState.delete(channelId);
      return true;
    }

    return false;
  }

  isSpamming(channelId: ChannelId) {
    return this.spamState.has(channelId);
  }
}
