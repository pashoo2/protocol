import React from 'react';
import { connectToSwarmUtil } from './connect-to-swarm.utils';
import {
  CONNECT_TO_SWARM_AUTH_CREDENTIALS_SESSION_STORAGE_KEY,
  CONNECT_TO_SWARM_AUTH_CREDENTIALS_1,
  CONNECT_TO_SWARM_AUTH_CREDENTIALS_2,
} from './connect-to-swarm.const';

export class ConnectToSwarm extends React.PureComponent {
  public state = {
    isConnected: false,
    isConnecting: false,
    error: undefined as Error | undefined,
    useSession: false,
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

  public render() {
    const { isConnected, isConnecting, error } = this.state;

    if (error) {
      return <span>Error: {error.message}</span>;
    }
    if (isConnected) {
      return <span>Is connected</span>;
    }
    if (!isConnected && !isConnecting) {
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
      await connectToSwarmUtil(
        this.state.useSession,
        credentialsVariant === 1
          ? CONNECT_TO_SWARM_AUTH_CREDENTIALS_1
          : CONNECT_TO_SWARM_AUTH_CREDENTIALS_2
      );
      sessionStorage.setItem(
        CONNECT_TO_SWARM_AUTH_CREDENTIALS_SESSION_STORAGE_KEY,
        'true'
      );
    } catch (error) {
      this.setState({
        error,
      });
    }
    this.setState({
      isConnected: true,
    });
  };
}
