import React from 'react';
import { IConnectionBridge } from 'classes/connection-bridge/connection-bridge.types';
import { ISwarmStoreDatabaseBaseOptions } from 'classes/swarm-store-class/swarm-store-class.types';
import { ESwarmStoreConnectorOrbitDbDatabaseType } from '../../classes/swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.const';
import { CONNECT_TO_SWARM_STORAGE_DEFAULT_MESSAGE_BODY } from '../connect-to-swarm/connect-to-swarm.const';
import { ISwarmStoreConnectorOrbitDbDatabaseOptions } from '../../classes/swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.types';
import { MessageComponent } from '../message-component/message-component';
import { IMessageDescription } from '../connect-to-swarm/connect-to-swarm';

interface IProps {
  databaseOptions: ISwarmStoreDatabaseBaseOptions;
  isOpened: boolean;
  connectionBridge?: IConnectionBridge;
  messages: IMessageDescription[];
}

export class SwarmStoreDbComponent extends React.PureComponent<IProps> {
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
        await connectionBridge.storage?.openDatabase({
          ...databaseOptions,
          grantAccess: async (...args: any[]) => {
            console.log(...args);
            return true;
          },
        });
      } catch (err) {
        console.error(err);
      } finally {
        this.setState({ isOpening: false });
      }
    }
  };

  protected sendSwarmMessage = async () => {
    const { connectionBridge, databaseOptions, isOpened } = this.props;
    try {
      if (isOpened && connectionBridge) {
        if (!databaseOptions.isPublic) {
          alert('It is not a public database');
          return;
        }

        let key: string | undefined;

        if (
          (databaseOptions as ISwarmStoreConnectorOrbitDbDatabaseOptions<
            string
          >).dbType === ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE
        ) {
          key = prompt('Key for the message', '') || undefined;
          if (!key) {
            return;
          }
        }

        const message = prompt('Message', '');

        await connectionBridge?.storage?.addMessage(
          databaseOptions.dbName,
          {
            ...CONNECT_TO_SWARM_STORAGE_DEFAULT_MESSAGE_BODY,
            pld: message || '',
          },
          key
        );
      }
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  render() {
    const { isOpening, isClosing } = this.state;
    const { databaseOptions, isOpened, messages } = this.props;
    const { dbName, isPublic } = databaseOptions;

    return (
      <div style={{ border: '1px solid black' }}>
        Database: {dbName}, {isOpened ? 'opened' : 'closed'},{' '}
        {isPublic ? 'is public' : ''}, {isOpening && 'is opening'},{' '}
        {isClosing && 'is closing'};
        <br />
        {isOpened ? (
          <button onClick={this.handleDbClose}>Close</button>
        ) : (
          <button onClick={this.handleDbOpen}>Open</button>
        )}
        <br />
        {isOpened && (
          <button onClick={this.sendSwarmMessage}>Send message</button>
        )}
        <div>
          Messages:
          {messages.map((message) => {
            return (
              <MessageComponent
                key={message.id}
                dbName={dbName}
                id={message.id}
                k={message.key}
                message={message.message}
              />
            );
          })}
        </div>
      </div>
    );
  }
}
