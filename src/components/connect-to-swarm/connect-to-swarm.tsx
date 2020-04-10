import React from 'react';
import { connectToSwarmUtil } from './connect-to-swarm.utils';

export class ConnectToSwarm extends React.PureComponent {
  public state = {
    isConnected: false,
    isConnecting: false,
    error: undefined as Error | undefined,
  };

  public componentDidMount() {
    const key = sessionStorage.getItem('key--');
    console.log(key);
    debugger;
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
      await connectToSwarmUtil();
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
