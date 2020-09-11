import React from 'react';
import { IConnectionBridge } from 'classes/connection-bridge/connection-bridge.types';
import { ISwarmStoreDatabaseBaseOptions } from 'classes/swarm-store-class/swarm-store-class.types';
import { ESwarmStoreConnectorOrbitDbDatabaseType } from '../../classes/swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.const';
import { CONNECT_TO_SWARM_STORAGE_DEFAULT_MESSAGE_BODY } from '../connect-to-swarm/connect-to-swarm.const';
import { ISwarmStoreConnectorOrbitDbDatabaseOptions } from '../../classes/swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.types';
import { MessageComponent } from '../message-component/message-component';
import {
  connectToDatabase,
  setMessageListener,
} from './swarm-messages-database-component.utils';
import { ESwarmStoreConnector } from '../../classes/swarm-store-class/swarm-store-class.const';
import { SwarmMessagesDatabase } from '../../classes/swarm-messages-database';
import { TSwarmStoreDatabaseEntityKey } from '../../classes/swarm-store-class/swarm-store-class.types';
import { ISwarmMessagesDatabaseMessageDescription } from './swarm-messages-database-component.types';
import { ISwarmMessageInstanceDecrypted } from '../../classes/swarm-message/swarm-message-constructor.types';
import { ISwarmMessageStoreDeleteMessageArg } from '../../classes/swarm-message-store/swarm-message-store.types';

interface IProps {
  databaseOptions: ISwarmStoreDatabaseBaseOptions;
  connectionBridge?: IConnectionBridge;
}

interface IState<P extends ESwarmStoreConnector> {
  messages: ISwarmMessagesDatabaseMessageDescription<P>[];
  isOpening: boolean;
  isClosing: boolean;
  db?: SwarmMessagesDatabase<P>;
}

export class SwarmMessagesDatabaseComponent<
  P extends ESwarmStoreConnector
> extends React.PureComponent<IProps, IState<P>> {
  state = {
    messages: [] as ISwarmMessagesDatabaseMessageDescription<P>[],
    isOpening: false,
    isClosing: false,
    db: undefined as SwarmMessagesDatabase<P> | undefined,
  };

  get isOpened(): boolean {
    const { isOpening, isClosing, db } = this.state;

    return !isOpening && !isClosing && !!db;
  }

  handleNewMessage = (
    message: ISwarmMessagesDatabaseMessageDescription<P>
  ): void => {
    this.setState(({ messages }) => ({
      messages: [...messages, message],
    }));
  };

  handleDbClose = async () => {
    const { connectionBridge } = this.props;
    const { isClosing, db } = this.state;

    if (connectionBridge && db && this.isOpened && !isClosing) {
      try {
        this.setState({ isClosing: true });
        await db.close();
        this.setState({ db: undefined });
      } catch (err) {
        console.error(err);
      } finally {
        this.setState({ isClosing: false });
      }
    }
  };

  handleDbOpen = async () => {
    const { connectionBridge, databaseOptions } = this.props;
    const { isOpening } = this.state;

    if (
      connectionBridge &&
      connectionBridge.storage &&
      !this.isOpened &&
      !isOpening
    ) {
      try {
        this.setState({ isOpening: true });

        const dbOptions = {
          ...databaseOptions,
          grantAccess: async (...args: any[]) => {
            console.log(...args);
            return true;
          },
        };
        const db = await connectToDatabase({
          dbOptions,
          swarmMessageStore: connectionBridge.storage,
        });

        setMessageListener(db, this.handleNewMessage);
        this.setState({ db });
      } catch (err) {
        console.error(err);
      } finally {
        this.setState({ isOpening: false });
      }
    }
  };

  handleDeleteMessage = async (
    id: TSwarmStoreDatabaseEntityKey<P>,
    message: ISwarmMessageInstanceDecrypted,
    key: string | undefined
  ): Promise<void> => {
    const { db } = this.state;
    let removeArg:
      | TSwarmStoreDatabaseEntityKey<P>
      | string
      | ISwarmMessageInstanceDecrypted
      | undefined;

    if (this.isOpened && db?.isReady) {
      const { dbType } = db;

      if (dbType === ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE) {
        if (!key) {
          throw new Error(
            'For key-value database type a key must be provided to delete a message'
          );
        }
        removeArg = key;
      } else if (db.dbType === ESwarmStoreConnectorOrbitDbDatabaseType.FEED) {
        removeArg = id;
      } else {
        removeArg = message;
      }
      return db.deleteMessage(
        removeArg as ISwarmMessageStoreDeleteMessageArg<P>
      );
    }
  };

  protected sendSwarmMessage = async () => {
    const { databaseOptions } = this.props;
    const { db } = this.state;

    try {
      if (this.isOpened && db) {
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

        await db.addMessage(
          {
            ...CONNECT_TO_SWARM_STORAGE_DEFAULT_MESSAGE_BODY,
            pld: message || '',
          },
          key as TSwarmStoreDatabaseEntityKey<P> | undefined
        );
      }
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  render() {
    const { isOpening, isClosing, messages } = this.state;
    const { databaseOptions } = this.props;
    const isOpened = this.isOpened;
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
                deleteMessage={this.handleDeleteMessage}
              />
            );
          })}
        </div>
      </div>
    );
  }
}
