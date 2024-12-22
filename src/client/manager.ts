import { CommandClient } from '.';
import { CommandConf } from '../types/command';
import { UserInfo } from '../types/user';
import { v4 as uuidv4 } from 'uuid';

export class ClientManager {
  private clients: Map<string, { token: string; commandClient: CommandClient }>;

  constructor() {
    this.clients = new Map();
  }

  getClient(email: string, token: string) {
    const clientData = this.clients.get(email);

    if (!clientData || clientData.token !== token) {
      return null;
    }

    return clientData;
  }

  registerClient(
    userInfo: UserInfo,
    commandConf: CommandConf
  ): {
    token: string;
    commandClient: CommandClient;
  } {
    const token = uuidv4();
    const commandClient = new CommandClient(userInfo, commandConf);

    commandClient.client.on('disconnected', (_) => {
      this.removeClient(userInfo.email, token);
    });

    this.clients.set(userInfo.email, { token, commandClient });

    console.log(this.clients);

    return { token, commandClient };
  }

  removeClient(email: string, token: string): boolean {
    const clientData = this.getClient(email, token);

    if (!clientData) return false;

    if (clientData.commandClient.client.logon) {
      clientData.commandClient.client.close();
    }

    this.clients.delete(email);

    console.log(this.clients);

    return true;
  }
}
