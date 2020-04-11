import React from 'react';
import { connectToSwarmUtil } from './connect-to-swarm.utils';
import { CONNECT_TO_SWARM_AUTH_CREDENTIALS_SESSION_STORAGE_KEY } from './connect-to-swarm.const';

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
      return <button onClick={this.connectToSwarm}>Connect</button>;
    }
    return <span>Connecting...</span>;
  }

  protected connectToSwarm = async () => {
    this.setState({
      isConnecting: true,
    });
    try {
      await connectToSwarmUtil(this.state.useSession);
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
