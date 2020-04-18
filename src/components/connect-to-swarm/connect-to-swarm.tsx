import React from 'react';
import { connectToSwarmUtil } from './connect-to-swarm.utils';
import { IConnectionBridge } from 'classes/connection-bridge/connection-bridge.types';
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
  };

  protected sendSwarmMessage = async () => {
    try {
      await this.state.connectionBridge?.storage?.addMessage(
        CONNECT_TO_SWARM_DATABASE_MAIN_NAME,
        {
          ...CONNECT_TO_SWARM_STORAGE_DEFAULT_MESSAGE_BODY,
        }
      );
      debugger;
    } catch (err) {
      console.error(err);
      debugger;
    }
  };

  protected toggleMessagesSending = () => {
    this.setState((state: any) => {
      if (state.messagingSending) {
        clearInterval(state.messagingSending);
        return {
          messagingSending: undefined,
        };
      }
      this.sendSwarmMessage();
      return {
        messagingSending: setInterval(this.sendSwarmMessage, 20000),
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

  public renderConnectedState() {
    const { messagingSending } = this.state;

    return (
      <div>
        <div>Is connected</div>
        <button onClick={this.toggleMessagesSending}>
          {messagingSending ? 'Stop' : 'Start'} message sending
        </button>
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
      this.setState({
        connectionBridge,
      });
    } catch (error) {
      this.setState({
        error,
      });
    }
  };
}
