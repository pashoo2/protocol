import React from 'react';
import { ESwarmStoreConnectorOrbitDbDatabaseType } from '../../classes/swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.const';
import { CONNECT_TO_SWARM_STORAGE_DEFAULT_MESSAGE_BODY } from '../connect-to-swarm/connect-to-swarm.const';
import { ESwarmStoreConnectorOrbitDbDatabaseIteratorOption } from '../../classes/swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.types';
import { MessageComponent } from '../message-component/message-component';
import { setMessageListener } from './swarm-messages-database-component.utils';
import { ESwarmStoreConnector } from '../../classes/swarm-store-class/swarm-store-class.const';
import { TSwarmStoreDatabaseEntityKey, TSwarmStoreDatabaseType } from '../../classes/swarm-store-class/swarm-store-class.types';
import {
  ISwarmMessagesDatabaseMessageDescription,
  ISwarmMessagesDatabaseDeleteMessageDescription,
} from './swarm-messages-database-component.types';
import {
  ISwarmMessageInstanceDecrypted,
  TSwarmMessageSerialized,
} from '../../classes/swarm-message/swarm-message-constructor.types';
import {
  ISwarmMessageStoreDeleteMessageArg,
  ISwarmMessageStoreMessagingMethods,
} from '../../classes/swarm-message-store/swarm-message-store.types';
import { setMessageDeleteListener, setCacheUpdateListener } from './swarm-messages-database-component.utils';
import { TSwarmMessageDatabaseMessagesCached } from '../../classes/swarm-messages-database/swarm-messages-database.types';
import { isValidSwarmMessageDecryptedFormat } from '../../classes/swarm-message-store/swarm-message-store-utils/swarm-message-store-validators/swarm-message-store-validator-swarm-message';
import { TSwarmMessageUserIdentifierSerialized } from '../../classes/swarm-message/swarm-message-subclasses/swarm-message-subclass-validators/swarm-message-subclass-validator-fields-validator/swarm-message-subclass-validator-fields-validator-validators/swarm-message-subclass-validator-fields-validator-validator-user-identifier/swarm-message-subclass-validator-fields-validator-validator-user-identifier.types';
import { TSwarmStoreDatabaseOptions } from '../../classes/swarm-store-class/swarm-store-class.types';
import { IConnectionBridgeUnknown } from '../../classes/connection-bridge/connection-bridge.types';
import { ISwarmMessagesDatabaseConnectedFabric } from '../../classes/swarm-messages-database/swarm-messages-database-fabric/swarm-messages-database-fabric.types';
import { PromiseResolveType } from '../../types/helper.types';
import {
  TSwarmMessageInstance,
  ISwarmMessageInstanceEncrypted,
} from '../../classes/swarm-message/swarm-message-constructor.types';

type P = ESwarmStoreConnector.OrbitDB;

interface IProps<
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  CB extends IConnectionBridgeUnknown<P, T, DbType, any, DBO, MSI>,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType> = TSwarmStoreDatabaseOptions<P, T, DbType>,
  MSI extends TSwarmMessageInstance | T = TSwarmMessageInstance | T
> {
  userId: TSwarmMessageUserIdentifierSerialized;
  databaseOptions: DBO;
  connectionBridge?: CB;
  isOpenImmediate?: boolean;
  swarmMessagesDatabaseConnectedFabric: ISwarmMessagesDatabaseConnectedFabric<P, T, DbType, DBO, MSI>;
}

interface IState<
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType> = TSwarmStoreDatabaseOptions<P, T, DbType>,
  MSI extends TSwarmMessageInstance | T = TSwarmMessageInstance | T
> {
  messages: TSwarmMessageDatabaseMessagesCached<P, DbType, Exclude<MSI, T | ISwarmMessageInstanceEncrypted>> | undefined;
  isOpening: boolean;
  isClosing: boolean;
  db?: PromiseResolveType<ReturnType<ISwarmMessagesDatabaseConnectedFabric<P, T, DbType, DBO, MSI>>>;
}

export class SwarmMessagesDatabaseComponent<
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  CB extends IConnectionBridgeUnknown<P, T, DbType, any, DBO, MSI>,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType> = TSwarmStoreDatabaseOptions<P, T, DbType>,
  MSI extends TSwarmMessageInstance | T = TSwarmMessageInstance | T
> extends React.PureComponent<IProps<T, DbType, CB, DBO, MSI>, IState<T, DbType, DBO, MSI>> {
  state: IState<T, DbType, DBO, MSI> = {
    messages: undefined,
    isOpening: false,
    isClosing: false,
    db: undefined,
  };

  get isOpened(): boolean {
    const { isOpening, isClosing, db } = this.state;

    return !isOpening && !isClosing && !!db;
  }

  get isUpdating(): boolean {
    return !!this.state.db?.whetherMessagesListUpdateInProgress;
  }

  get messagesCached():
    | TSwarmMessageDatabaseMessagesCached<P, DbType, Exclude<MSI, T | ISwarmMessageInstanceEncrypted>>
    | undefined {
    return this.state.db?.cachedMessages;
  }

  protected get swarmMessagesDatabaseConnectedFabric(): ISwarmMessagesDatabaseConnectedFabric<P, T, DbType, DBO, MSI> {
    const { swarmMessagesDatabaseConnectedFabric } = this.props;
    if (!swarmMessagesDatabaseConnectedFabric) {
      throw new Error('A swarmMessagesDatabaseConnectedFabric not exists in the props');
    }
    return swarmMessagesDatabaseConnectedFabric;
  }

  queryDatabase = async () => {
    const { db } = this.state;

    if (db) {
      const result = await db.collect({
        [ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.limit]: -1,
      });
      console.log(result);
    }
  };

  queryDatabaseMessagesWithMeta = async () => {
    const { db } = this.state;

    if (db) {
      const result = await db.collectWithMeta({
        [ESwarmStoreConnectorOrbitDbDatabaseIteratorOption.limit]: -1,
      } as any);
      console.log(result);
    }
  };

  onNewMessage = (message: ISwarmMessagesDatabaseMessageDescription<P>): void => {
    console.log('New message', message);
  };

  onMessageDelete = (deleteMessageDescription: ISwarmMessagesDatabaseDeleteMessageDescription<P>) => {
    console.log('Message removed', deleteMessageDescription);
  };

  onMessagesCacheUpdated = (
    messages: TSwarmMessageDatabaseMessagesCached<P, DbType, Exclude<MSI, T | ISwarmMessageInstanceEncrypted>> | undefined
  ) => {
    console.log('Cache updated', messages);
    this.setState({
      messages,
    });
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

    if (connectionBridge && connectionBridge.swarmMessageStore && !this.isOpened && !isOpening) {
      try {
        this.setState({ isOpening: true });

        const dbOptions: DBO = {
          ...databaseOptions,
          grantAccess: async (...args: any[]) => {
            console.log(...args);
            return true;
          },
        };
        const db = await this.swarmMessagesDatabaseConnectedFabric({
          dbOptions,
          swarmMessageStore: connectionBridge.swarmMessageStore,
          user: {
            userId: this.props.userId,
          },
        });

        setMessageListener<
          P,
          T,
          DbType,
          DBO,
          MSI,
          ISwarmMessageStoreMessagingMethods<P, T, DbType, Exclude<MSI, T>>,
          Exclude<MSI, T | ISwarmMessageInstanceEncrypted> & Exclude<Exclude<MSI, T>, ISwarmMessageInstanceEncrypted>,
          Required<IState<T, DbType, DBO, MSI>>['db']
        >(db, this.onNewMessage);
        setMessageDeleteListener<
          P,
          T,
          DbType,
          DBO,
          MSI,
          ISwarmMessageStoreMessagingMethods<P, T, DbType, Exclude<MSI, T>>,
          Exclude<MSI, T | ISwarmMessageInstanceEncrypted> & Exclude<Exclude<MSI, T>, ISwarmMessageInstanceEncrypted>,
          Required<IState<T, DbType, DBO, MSI>>['db']
        >(db, this.onMessageDelete);
        setCacheUpdateListener<
          P,
          T,
          DbType,
          DBO,
          MSI,
          ISwarmMessageStoreMessagingMethods<P, T, DbType, Exclude<MSI, T>>,
          Exclude<MSI, T | ISwarmMessageInstanceEncrypted> & Exclude<Exclude<MSI, T>, ISwarmMessageInstanceEncrypted>,
          Required<IState<T, DbType, DBO, MSI>>['db']
        >(db, this.onMessagesCacheUpdated);
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
    key: TSwarmStoreDatabaseEntityKey<P> | undefined
  ): Promise<void> => {
    const { db } = this.state;
    let removeArg: TSwarmStoreDatabaseEntityKey<P> | string | ISwarmMessageInstanceDecrypted | undefined;

    if (this.isOpened && db?.isReady) {
      const { dbType } = db;

      if (dbType === ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE) {
        if (!key) {
          throw new Error('For key-value database type a key must be provided to delete a message');
        }
        removeArg = key;
      } else if (db.dbType === ESwarmStoreConnectorOrbitDbDatabaseType.FEED) {
        removeArg = id;
      } else {
        removeArg = message;
      }
      return db.deleteMessage(removeArg as ISwarmMessageStoreDeleteMessageArg<P>);
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

        let key: TSwarmStoreDatabaseEntityKey<P> | undefined;

        if (databaseOptions.dbType === ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE) {
          key = prompt('Key for the message', '') || undefined;
          if (!key) {
            return;
          }
        }

        // const message = prompt('Message', String(new Date()));
        while (true) {
          await db.addMessage(
            {
              ...CONNECT_TO_SWARM_STORAGE_DEFAULT_MESSAGE_BODY,
              pld: String(new Date()) || '',
            },
            key
          );
          await new Promise((res) => setTimeout(res, 300));
        }
      }
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  componentDidMount() {
    const { isOpenImmediate } = this.props;

    if (isOpenImmediate) {
      this.handleDbOpen();
    }
  }

  render() {
    const { isOpening, isClosing } = this.state;
    const { databaseOptions } = this.props;
    const { isOpened, isUpdating } = this;
    const { dbName, isPublic } = databaseOptions;
    // TODO - this.messagesCached doesn't work
    const { messages } = this.state;

    return (
      <div style={{ border: '1px solid black' }}>
        Database: {dbName}, {isOpened ? 'opened' : 'closed'}, {isPublic ? 'is public' : ''}, {isOpening && 'is opening'},{' '}
        {isClosing && 'is closing'};
        <br />
        {isOpened ? <button onClick={this.handleDbClose}>Close</button> : <button onClick={this.handleDbOpen}>Open</button>}
        <br />
        {isOpened && <button onClick={this.sendSwarmMessage}>Send message</button>}
        {isUpdating && <div>Updating...</div>}
        <div>
          Messages:
          {messages &&
            Array.from(messages.entries()).map(([key, messageWithMeta]) => {
              const { messageAddress, dbName: messageDbName, message } = messageWithMeta;
              let messageId = '';

              if (message instanceof Error) {
                return <div>Error: {message.message}</div>;
              }
              try {
                if (!isValidSwarmMessageDecryptedFormat(message)) {
                  return <div>Message has an invalid format</div>;
                }
              } catch (err) {
                return <div>Error message format: {err.message}</div>;
              }
              if (messageAddress instanceof Error) {
                messageId = messageAddress.message;
              } else if (messageAddress) {
                messageId = messageAddress;
              }
              return (
                <MessageComponent
                  key={key}
                  dbName={messageDbName || dbName}
                  id={messageId}
                  k={key}
                  message={message}
                  deleteMessage={this.handleDeleteMessage}
                />
              );
            })}
        </div>
      </div>
    );
  }
}
