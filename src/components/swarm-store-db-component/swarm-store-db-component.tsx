import React from 'react';
import { ESwarmStoreConnectorOrbitDbDatabaseType } from '../../classes/swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.const';
import { CONNECT_TO_SWARM_STORAGE_DEFAULT_MESSAGE_BODY } from '../const/connect-to-swarm.const';
import { MessageComponent } from '../message-component/message-component';
import { IMessageDescription } from '../connect-to-swarm/connect-to-swarm';
import { IConnectionBridgeUnknown } from '../../classes/connection-bridge/types/connection-bridge.types';
import { ESwarmStoreConnector } from '../../classes/swarm-store-class/swarm-store-class.const';
import {
  TSwarmStoreDatabaseType,
  TSwarmStoreDatabaseOptions,
  TSwarmStoreDatabaseEntityKey,
} from '../../classes/swarm-store-class/swarm-store-class.types';
import {
  TSwarmMessageSerialized,
  TSwarmMessageInstance,
  ISwarmMessageBodyDeserialized,
} from '../../classes/swarm-message/swarm-message-constructor.types';

interface IProps<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  CD extends boolean = true,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType> = TSwarmStoreDatabaseOptions<P, T, DbType>,
  MSI extends TSwarmMessageInstance | T = TSwarmMessageInstance | T
> {
  databaseOptions: DBO;
  isOpened: boolean;
  connectionBridge?: IConnectionBridgeUnknown<P, T, DbType, CD, DBO, MSI>;
  messages: IMessageDescription<P>[];
}

export class SwarmStoreDbComponent<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType> = TSwarmStoreDatabaseOptions<P, T, DbType>,
  CD extends boolean = boolean,
  MSI extends TSwarmMessageInstance | T = TSwarmMessageInstance | T
> extends React.PureComponent<IProps<P, T, DbType, CD, DBO, MSI>> {
  state = {
    isOpening: false as boolean,
    isClosing: false as boolean,
  };

  protected get connectionBridgeStorageOrUndefined(): Required<
    IProps<P, T, DbType, CD, DBO, MSI>
  >['connectionBridge']['swarmMessageStore'] {
    return this.props.connectionBridge?.swarmMessageStore;
  }

  handleDbClose = async () => {
    const { connectionBridgeStorageOrUndefined } = this;
    const { databaseOptions, isOpened } = this.props;
    const { isClosing } = this.state;

    if (connectionBridgeStorageOrUndefined && isOpened && !isClosing) {
      try {
        this.setState({ isClosing: true });
        await connectionBridgeStorageOrUndefined.closeDatabase(databaseOptions.dbName);
      } catch (err) {
        console.error(err);
      } finally {
        this.setState({ isClosing: false });
      }
    }
  };

  handleDbOpen = async () => {
    const { connectionBridgeStorageOrUndefined } = this;
    const { databaseOptions, isOpened } = this.props;
    const { isOpening } = this.state;

    if (connectionBridgeStorageOrUndefined && !isOpened && !isOpening) {
      try {
        this.setState({ isOpening: true });
        await connectionBridgeStorageOrUndefined?.openDatabase({
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

  protected isKeyValueDatabase(
    connectionBridge: any
  ): connectionBridge is IConnectionBridgeUnknown<P, T, ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE, CD, any, MSI> {
    const { databaseOptions } = this.props;
    return !!connectionBridge && databaseOptions.dbType === ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE;
  }

  protected createSwarmMessageBody(): ISwarmMessageBodyDeserialized {
    const messagePayload = prompt('Message', '');
    return {
      ...CONNECT_TO_SWARM_STORAGE_DEFAULT_MESSAGE_BODY,
      pld: messagePayload || '',
    };
  }

  protected sendSwarmMessage = async () => {
    const { connectionBridgeStorageOrUndefined } = this;
    const { connectionBridge, databaseOptions, isOpened } = this.props;
    try {
      if (isOpened && connectionBridge && connectionBridgeStorageOrUndefined) {
        if (!databaseOptions.isPublic) {
          alert('It is not a public database');
          return;
        }
        let key: TSwarmStoreDatabaseEntityKey<P> | undefined;
        const { connectionBridge } = this.props;

        if (this.isKeyValueDatabase(connectionBridge)) {
          key = (prompt('Key for the message', '') || undefined) as TSwarmStoreDatabaseEntityKey<P>;
          if (!key) {
            throw new Error('Key should be defined for key value store');
          }
        }
        await connectionBridgeStorageOrUndefined.addMessage(databaseOptions.dbName, this.createSwarmMessageBody(), key);
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
        Database: {dbName}, {isOpened ? 'opened' : 'closed'}, {isPublic ? 'is public' : ''}, {isOpening && 'is opening'},{' '}
        {isClosing && 'is closing'};
        <br />
        {isOpened ? <button onClick={this.handleDbClose}>Close</button> : <button onClick={this.handleDbOpen}>Open</button>}
        <br />
        {isOpened && <button onClick={this.sendSwarmMessage}>Send message</button>}
        <div>
          Messages:
          {messages.map((message, idx) => {
            return (
              <>
                {idx + 1}
                <MessageComponent key={message.id} dbName={dbName} id={message.id} k={message.key} message={message.message} />
              </>
            );
          })}
        </div>
      </div>
    );
  }
}
