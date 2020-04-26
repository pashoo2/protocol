import React from 'react';
import { connectToSwarmUtil } from './connect-to-swarm.utils';
import { IConnectionBridge } from 'classes/connection-bridge/connection-bridge.types';
import { CONNECT_TO_SWARM_DATABASE_MAIN } from './connect-to-swarm.const';
import {
  CONNECT_TO_SWARM_AUTH_CREDENTIALS_USEDID_1,
  CONNECT_TO_SWARM_AUTH_CREDENTIALS_USEDID_2,
} from './connect-to-swarm.const';
import {
  CONNECT_TO_SWARM_DATABASE_MAIN_NAME,
  CONNECT_TO_SWARM_STORAGE_DEFAULT_MESSAGE_BODY,
} from './connect-to-swarm.const';
import {
  CONNECT_TO_SWARM_AUTH_CREDENTIALS_SESSION_STORAGE_KEY,
  CONNECT_TO_SWARM_AUTH_CREDENTIALS_1,
  CONNECT_TO_SWARM_AUTH_CREDENTIALS_2,
} from './connect-to-swarm.const';

export class ConnectToSwarm extends React.PureComponent {
  public state = {
    isConnecting: false,
    messagingSending: undefined as NodeJS.Timeout | undefined,
    error: undefined as Error | undefined,
    useSession: false,
    connectionBridge: undefined as IConnectionBridge | undefined,
    userId: undefined as string | undefined,
    // was the database main removed by the user
    dbRemoved: false,
    dbRemoving: false,
  };

  protected sendSwarmMessage = async () => {
    try {
      await this.state.connectionBridge?.storage?.addMessage(
        CONNECT_TO_SWARM_DATABASE_MAIN_NAME,
        {
          ...CONNECT_TO_SWARM_STORAGE_DEFAULT_MESSAGE_BODY,
        }
      );
    } catch (err) {
      console.error(err);
    }
  };

  protected sendPrivateSwarmMessage = async () => {
    try {
      await this.state.connectionBridge?.storage?.addMessage(
        CONNECT_TO_SWARM_DATABASE_MAIN_NAME,
        {
          ...CONNECT_TO_SWARM_STORAGE_DEFAULT_MESSAGE_BODY,
          receiverId:
            this.state.userId === CONNECT_TO_SWARM_AUTH_CREDENTIALS_USEDID_1
              ? CONNECT_TO_SWARM_AUTH_CREDENTIALS_USEDID_2
              : CONNECT_TO_SWARM_AUTH_CREDENTIALS_USEDID_1,
        }
      );
    } catch (err) {
      console.error(err);
    }
  };

  protected toggleMessagesSending = (isPrivate: boolean = false) => {
    this.setState((state: any) => {
      if (state.messagingSending) {
        clearInterval(state.messagingSending);
        return {
          messagingSending: undefined,
        };
      }

      const method = isPrivate
        ? this.sendPrivateSwarmMessage
        : this.sendSwarmMessage;

      method();
      return {
        messagingSending: setInterval(method, 1000),
      };
    });
  };

  public componentDidMount() {
    const key = sessionStorage.getItem(
      CONNECT_TO_SWARM_AUTH_CREDENTIALS_SESSION_STORAGE_KEY
    );

    if (key) {
      this.setState({
        useSession: true,
      });
    }
  }

  public handleDatabaseRemove = async () => {
    const { connectionBridge } = this.state;

    if (connectionBridge) {
      this.setState({
        dbRemoving: true,
      });
      await connectionBridge.storage?.dropDatabase(
        CONNECT_TO_SWARM_DATABASE_MAIN_NAME
      );
      this.setState({
        dbRemoved: true,
        dbRemoving: false,
      });
    }
  };

  protected renderConnectToDatabase() {
    return (
      <div>
        <h2>Database connection</h2>
        <button onClick={this.handleDatabaseRemove}>Remove the database</button>
      </div>
    );
  }

  public connectToDb = async () => {
    const { connectionBridge } = this.state;

    if (connectionBridge) {
      await connectionBridge.storage?.openDatabase(
        CONNECT_TO_SWARM_DATABASE_MAIN
      );
      this.setState({
        dbRemoved: false,
      });
    }
  };

  public renderConnectedState() {
    const { messagingSending, userId, dbRemoved, dbRemoving } = this.state;

    if (dbRemoved) {
      return <div onClick={this.connectToDb}>Connect to database</div>;
    }
    if (dbRemoving) {
      return <span>Database removing...</span>;
    }
    return (
      <div>
        <div>Is connected with user identity ${userId}</div>
        <button onClick={() => this.toggleMessagesSending()}>
          {messagingSending ? 'Stop' : 'Start'} messages sending
        </button>
        <button onClick={() => this.toggleMessagesSending(true)}>
          {messagingSending ? 'Stop' : 'Start'} private messages sending
        </button>
        {this.renderConnectToDatabase()}
      </div>
    );
  }

  public render() {
    const { connectionBridge, isConnecting, error } = this.state;

    if (error) {
      return <span>Error: {error.message}</span>;
    }
    if (connectionBridge) {
      return this.renderConnectedState();
    }
    if (!connectionBridge && !isConnecting) {
      return (
        <div>
          <button onClick={() => this.connectToSwarm()}>Connect cred 1</button>
          <button onClick={() => this.connectToSwarm(2)}>Connect cred 2</button>
        </div>
      );
    }
    return <span>Connecting...</span>;
  }

  protected connectToSwarm = async (credentialsVariant: 1 | 2 = 1) => {
    this.setState({
      isConnecting: true,
    });
    try {
      const connectionBridge = await connectToSwarmUtil(
        this.state.useSession,
        credentialsVariant === 1
          ? CONNECT_TO_SWARM_AUTH_CREDENTIALS_1
          : CONNECT_TO_SWARM_AUTH_CREDENTIALS_2
      );

      sessionStorage.setItem(
        CONNECT_TO_SWARM_AUTH_CREDENTIALS_SESSION_STORAGE_KEY,
        'true'
      );

      const userId = connectionBridge?.caConnection?.getUserIdentity();

      this.setState({
        connectionBridge,
        userId,
      });
    } catch (error) {
      this.setState({
        error,
      });
    }
  };
}
