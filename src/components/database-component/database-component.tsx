import React from 'react';
import { IConnectionBridge } from 'classes/connection-bridge/connection-bridge.types';
import { ISwarmStoreDatabaseBaseOptions } from 'classes/swarm-store-class/swarm-store-class.types';

interface IProps {
  databaseOptions: ISwarmStoreDatabaseBaseOptions;
  isOpened: boolean;
  connectionBridge?: IConnectionBridge;
}

export class DatabaseComponent extends React.PureComponent<IProps> {
  state = {
    isOpening: false as boolean,
    isClosing: false as boolean,
  };

  handleDbClose = async () => {
    const { connectionBridge, databaseOptions, isOpened } = this.props;
    const { isClosing } = this.state;

    if (connectionBridge && isOpened && !isClosing) {
      try {
        this.setState({ isClosing: true });
        await connectionBridge.storage?.closeDatabase(databaseOptions.dbName);
      } catch (err) {
        console.error(err);
      } finally {
        this.setState({ isClosing: false });
      }
    }
  };

  handleDbOpen = async () => {
    const { connectionBridge, databaseOptions, isOpened } = this.props;
    const { isOpening } = this.state;

    if (connectionBridge && !isOpened && !isOpening) {
      try {
        this.setState({ isOpening: true });
        await connectionBridge.storage?.openDatabase(databaseOptions);
      } catch (err) {
        console.error(err);
      } finally {
        this.setState({ isOpening: false });
      }
    }
  };

  render() {
    const { isOpening, isClosing } = this.state;
    const { databaseOptions, isOpened } = this.props;
    const { dbName, isPublic } = databaseOptions;

    return (
      <div style={{ border: '1px solid black' }}>
        Database: {dbName}, {isOpened ? 'opened' : 'closed'},{' '}
        {isPublic ? 'is public' : ''}, {isOpening && 'is opening'},{' '}
        {isClosing && 'is closing'};
        {isOpened ? (
          <button onClick={this.handleDbClose}>Close</button>
        ) : (
          <button onClick={this.handleDbOpen}>Open</button>
        )}
      </div>
    );
  }
}
