import React from 'react';
import { ESwarmStoreConnectorOrbitDbDatabaseType } from '../../classes/swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.const';
import { CONNECT_TO_SWARM_STORAGE_DEFAULT_MESSAGE_BODY } from '../const/connect-to-swarm.const';
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
  ISwarmMessageStore,
} from '../../classes/swarm-message-store/swarm-message-store.types';
import { setMessageDeleteListener, setCacheUpdateListener } from './swarm-messages-database-component.utils';
import {
  TSwarmMessageDatabaseMessagesCached,
  ISwarmMessagesDatabaseCacheOptions,
  ISwarmMessagesDatabaseCache,
} from '../../classes/swarm-messages-database/swarm-messages-database.types';
import { isValidSwarmMessageDecryptedFormat } from '../../classes/swarm-message-store/swarm-message-store-utils/swarm-message-store-validators/swarm-message-store-validator-swarm-message';
import { TSwarmMessageUserIdentifierSerialized } from '../../classes/swarm-message/swarm-message-subclasses/swarm-message-subclass-validators/swarm-message-subclass-validator-fields-validator/swarm-message-subclass-validator-fields-validator-validators/swarm-message-subclass-validator-fields-validator-validator-user-identifier/swarm-message-subclass-validator-fields-validator-validator-user-identifier.types';
import { TSwarmStoreDatabaseOptions } from '../../classes/swarm-store-class/swarm-store-class.types';
import { IConnectionBridgeUnknown } from '../../classes/connection-bridge/connection-bridge.types';
import { ISwarmMessagesDatabaseConnectedFabric } from '../../classes/swarm-messages-database/swarm-messages-database-fabric/swarm-messages-database-fabric.types';
import { TSwarmMessageInstance } from '../../classes/swarm-message/swarm-message-constructor.types';
import {
  ISwarmMessagesDatabaseMessagesCollector,
  ISwarmMessagesDatabaseConnector,
} from '../../classes/swarm-messages-database/swarm-messages-database.types';

type P = ESwarmStoreConnector.OrbitDB;

interface IProps<
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  CB extends IConnectionBridgeUnknown<P, T, DbType, any, DBO, MSI>,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>,
  MSI extends TSwarmMessageInstance | T,
  MD extends ISwarmMessageInstanceDecrypted,
  SMSM extends ISwarmMessagesDatabaseMessagesCollector<P, DbType, MD>,
  SMDC extends ISwarmMessagesDatabaseConnector<
    P,
    T,
    DbType,
    DBO,
    any,
    any,
    any,
    any,
    any,
    MSI,
    any,
    any,
    any,
    any,
    ISwarmMessageStore<P, T, DbType, DBO, any, any, any, any, any, MSI, any, any, any, any>,
    MD,
    SMSM,
    any,
    any,
    any
  >
> {
  userId: TSwarmMessageUserIdentifierSerialized;
  databaseOptions: DBO;
  connectionBridge?: CB;
  isOpenImmediate?: boolean;
  createDb: (databaseOptions: DBO) => Promise<SMDC>;
}

interface IState<
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>,
  MSI extends TSwarmMessageInstance | T,
  MD extends ISwarmMessageInstanceDecrypted,
  SMSM extends ISwarmMessagesDatabaseMessagesCollector<P, DbType, MD>,
  SMDC extends ISwarmMessagesDatabaseConnector<
    P,
    T,
    DbType,
    DBO,
    any,
    any,
    any,
    any,
    any,
    MSI,
    any,
    any,
    any,
    any,
    ISwarmMessageStore<P, T, DbType, DBO, any, any, any, any, any, MSI, any, any, any, any>,
    MD,
    SMSM,
    any,
    any,
    any
  >
> {
  messages: TSwarmMessageDatabaseMessagesCached<P, DbType, MD> | undefined;
  isOpening: boolean;
  isClosing: boolean;
  db?: SMDC;
}

export class SwarmMessagesDatabaseComponent<
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  CB extends IConnectionBridgeUnknown<P, T, DbType, any, DBO, MSI>,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType> = TSwarmStoreDatabaseOptions<P, T, DbType>,
  MSI extends TSwarmMessageInstance | T = TSwarmMessageInstance | T,
  MD extends ISwarmMessageInstanceDecrypted = ISwarmMessageInstanceDecrypted,
  SMSM extends ISwarmMessagesDatabaseMessagesCollector<P, DbType, MD> = ISwarmMessagesDatabaseMessagesCollector<P, DbType, MD>,
  DCO extends ISwarmMessagesDatabaseCacheOptions<P, DbType, MD, SMSM> = ISwarmMessagesDatabaseCacheOptions<P, DbType, MD, SMSM>,
  DCCRT extends ISwarmMessagesDatabaseCache<P, T, DbType, DBO, MD, SMSM> = ISwarmMessagesDatabaseCache<
    P,
    T,
    DbType,
    DBO,
    MD,
    SMSM
  >,
  SMDC extends ISwarmMessagesDatabaseConnector<
    P,
    T,
    DbType,
    DBO,
    any,
    any,
    any,
    any,
    any,
    MSI,
    any,
    any,
    any,
    any,
    ISwarmMessageStore<P, T, DbType, DBO, any, any, any, any, any, MSI, any, any, any, any>,
    MD,
    SMSM,
    any,
    any,
    any
  > = ISwarmMessagesDatabaseConnector<
    P,
    T,
    DbType,
    DBO,
    any,
    any,
    any,
    any,
    any,
    MSI,
    any,
    any,
    any,
    any,
    ISwarmMessageStore<P, T, DbType, DBO, any, any, any, any, any, MSI, any, any, any, any>,
    MD,
    SMSM,
    any,
    any,
    any
  >
> extends React.PureComponent<IProps<T, DbType, CB, DBO, MSI, MD, SMSM, SMDC>, IState<T, DbType, DBO, MSI, MD, SMSM, SMDC>> {
  state: IState<T, DbType, DBO, MSI, MD, SMSM, SMDC> = {
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

  get messagesCached(): TSwarmMessageDatabaseMessagesCached<P, DbType, MD> | undefined {
    return this.state.db?.cachedMessages;
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

  onMessagesCacheUpdated = (messages: TSwarmMessageDatabaseMessagesCached<P, DbType, MD> | undefined) => {
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
    const { isOpening } = this.state;

    if (!this.isOpened && !isOpening) {
      try {
        this.setState({ isOpening: true });

        const db = await this.props.createDb(this.props.databaseOptions);

        setMessageListener<P, T, DbType, DBO, MSI, MD, SMSM, DCO, DCCRT, typeof db>(db, this.onNewMessage);
        setMessageDeleteListener<P, T, DbType, DBO, MSI, MD, SMSM, DCO, DCCRT, typeof db>(db, this.onMessageDelete);
        setCacheUpdateListener<P, T, DbType, DBO, MSI, MD, SMSM, DCO, DCCRT, typeof db>(db, this.onMessagesCacheUpdated);
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
    message: MD,
    key: TSwarmStoreDatabaseEntityKey<P> | undefined
  ): Promise<void> => {
    const { db } = this.state;
    let removeArg: TSwarmStoreDatabaseEntityKey<P> | T | MD | undefined;

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
      void this.handleDbOpen();
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
