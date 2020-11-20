import React from 'react';
import { connectToSwarmUtil } from './connect-to-swarm.utils';
import { CONNECT_TO_SWARM_AUTH_CREDENTIALS_USEDID_1, CONNECT_TO_SWARM_AUTH_CREDENTIALS_USEDID_2 } from './connect-to-swarm.const';
import { CONNECT_TO_SWARM_STORAGE_DEFAULT_MESSAGE_BODY } from './connect-to-swarm.const';
import {
  CONNECT_TO_SWARM_AUTH_CREDENTIALS_SESSION_STORAGE_KEY,
  CONNECT_TO_SWARM_AUTH_CREDENTIALS_1,
  CONNECT_TO_SWARM_AUTH_CREDENTIALS_2,
} from './connect-to-swarm.const';
import {
  ESwarmStoreConnectorOrbitDbDatabaseMethodNames,
  ISwarmStoreDatabasesCommonStatusList,
  ESwarmStoreEventNames,
} from 'classes';
import { SwarmStoreDbComponent } from '../swarm-store-db-component/swarm-store-db-component';
import { ESwarmMessageStoreEventNames } from '../../classes/swarm-message-store/swarm-message-store.const';
import { ESwarmStoreConnector } from '../../classes/swarm-store-class/swarm-store-class.const';
import { TSwarmMessageInstance, TSwarmMessageSerialized } from '../../classes/swarm-message/swarm-message-constructor.types';
import { ISwarmMessageInstanceDecrypted } from '../../classes/swarm-message/swarm-message-constructor.types';
import { ISecretStorage } from '../../classes/secret-storage-class/secret-storage-class.types';
import { ICentralAuthorityUserProfile } from '../../classes/central-authority-class/central-authority-class-types/central-authority-class-types-common';
import { UserProfile } from '../userProfile/userProfile';
import { TSwarmStoreDatabaseType, TSwarmStoreDatabaseOptions } from '../../classes/swarm-store-class/swarm-store-class.types';
import { SwarmMessagesDatabaseComponent } from '../swarm-messages-database-component/swarm-messages-database-component';
import { IPromiseResolveType } from '../../types/promise.types';
import {
  IConnectionBridgeOptionsDefault,
  IConnectionBridgeUnknown,
} from '../../classes/connection-bridge/connection-bridge.types';
import { TSwarmStoreDatabaseEntityKey } from '../../classes/swarm-store-class/swarm-store-class.types';

export interface IMessageDescription<P extends ESwarmStoreConnector> {
  id: string;
  key?: TSwarmStoreDatabaseEntityKey<P>;
  message: ISwarmMessageInstanceDecrypted;
}

type P = ESwarmStoreConnector.OrbitDB;

export interface IConnectToSwarmProps<
  DbType extends TSwarmStoreDatabaseType<P>,
  T extends TSwarmMessageSerialized,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>
> {
  connectionBridgeOptions: IConnectionBridgeOptionsDefault<P, T, DbType, false>;
  connectImmediateWithCredentials?: 1 | 2;
  dbOptionsToConnectImmediate?: Partial<DBO> & {
    dbName: DBO['dbName'];
  };
  dbo1: DBO;
  dbo2: DBO;
  dboMain: DBO;
}

export class ConnectToSwarm<
  DbType extends TSwarmStoreDatabaseType<P>,
  T extends TSwarmMessageSerialized,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>
> extends React.PureComponent<IConnectToSwarmProps<DbType, T, DBO>> {
  public state = {
    isConnecting: false,
    messagingSending: undefined as NodeJS.Timeout | undefined,
    error: undefined as Error | undefined,
    connectionBridge: undefined as IConnectionBridgeUnknown<P, T, DbType, any, DBO> | undefined,
    userId: undefined as string | undefined,
    // was the database main removed by the user
    dbRemoved: false,
    dbRemoving: false,
    messages: [] as any[],
    messagesReceived: new Map() as Map<string, Map<string, IMessageDescription<P>>>,
    databasesList: undefined as ISwarmStoreDatabasesCommonStatusList<P, T, DbType, DBO> | undefined,
    swarmStoreMessagesDbOptionsList: [] as DBO[],
    databaseOpeningStatus: false as boolean,
    credentialsVariant: undefined as undefined | number,
    secretStorage: undefined as undefined | ISecretStorage,
    userProfileData: undefined as undefined | Partial<ICentralAuthorityUserProfile>,
  };

  protected get defaultDbOptions(): DBO {
    const { dbo1, dbo2 } = this.props;
    return this.state.credentialsVariant === 1 ? dbo1 : dbo2;
  }

  protected get swarmMessageStoreOrUndefined() {
    const { connectionBridge } = this.state;
    return connectionBridge?.swarmMessageStore;
  }

  protected get mainDatabaseOptions(): DBO {
    return this.props.dboMain;
  }

  protected get mainDatabaseName(): string {
    return this.mainDatabaseOptions.dbName;
  }

  protected sendSwarmMessage = async () => {
    throw new Error('sendSwarmMessage is not implemented yet');
    // try {
    //   const key = 'test_message';
    //   await this.swarmMessageStoreOrUndefined?.addMessage(
    //     this.props.dboMain.dbName,
    //     {
    //       ...CONNECT_TO_SWARM_STORAGE_DEFAULT_MESSAGE_BODY,
    //     },
    //     key
    //   );
    // } catch (err) {
    //   console.error(err);
    // }
  };

  protected sendPrivateSwarmMessage = async () => {
    try {
      await this.swarmMessageStoreOrUndefined?.addMessage(this.mainDatabaseName, {
        ...CONNECT_TO_SWARM_STORAGE_DEFAULT_MESSAGE_BODY,
        receiverId:
          this.state.userId === CONNECT_TO_SWARM_AUTH_CREDENTIALS_USEDID_1
            ? CONNECT_TO_SWARM_AUTH_CREDENTIALS_USEDID_2
            : CONNECT_TO_SWARM_AUTH_CREDENTIALS_USEDID_1,
      });
    } catch (err) {
      console.error(err);
    }
  };

  protected toggleMessagesSending = (isPrivate: boolean = false) => {
    this.setState((state: any) => {
      if (state.messagingSending) {
        clearInterval(state.messagingSending);
        return {
          messagingSending: undefined,
        };
      }

      const method = isPrivate ? this.sendPrivateSwarmMessage : this.sendSwarmMessage;

      method();
      return {
        messagingSending: setInterval(method, 1000),
      };
    });
  };

  public handleDatabaseRemove = async () => {
    const { swarmMessageStoreOrUndefined } = this;

    if (swarmMessageStoreOrUndefined) {
      this.setState({
        dbRemoving: true,
      });
      await swarmMessageStoreOrUndefined.dropDatabase(this.mainDatabaseName);
      this.setState({
        dbRemoved: true,
        dbRemoving: false,
      });
    }
  };

  protected renderConnectToDatabase() {
    return (
      <div>
        <h2>Database connection</h2>
        <button onClick={this.handleDatabaseRemove}>Remove the database</button>
      </div>
    );
  }

  public connectToDb = async () => {
    const { swarmMessageStoreOrUndefined } = this;

    if (swarmMessageStoreOrUndefined) {
      await swarmMessageStoreOrUndefined.openDatabase(this.mainDatabaseOptions);
      this.setState({
        dbRemoved: false,
      });
    }
  };

  public loadNextMessages = async () => {
    const { swarmMessageStoreOrUndefined } = this;

    if (swarmMessageStoreOrUndefined) {
      const result = await swarmMessageStoreOrUndefined.request(
        this.mainDatabaseName,
        ESwarmStoreConnectorOrbitDbDatabaseMethodNames.load,
        10
      );
      console.log(result);
    }
  };

  public renderLoadMessages() {
    return (
      <div>
        <button onClick={this.loadNextMessages}>Load next 10 messages</button>
      </div>
    );
  }
  public renderConnectedState() {
    const { messagingSending, userId, dbRemoved, dbRemoving } = this.state;

    if (dbRemoved) {
      return <div onClick={this.connectToDb}>Connect to database</div>;
    }
    if (dbRemoving) {
      return <span>Database removing...</span>;
    }
    return (
      <div>
        <div>Is connected with user identity ${userId}</div>
        <button onClick={() => this.toggleMessagesSending()}>{messagingSending ? 'Stop' : 'Start'} messages sending</button>
        <button onClick={() => this.toggleMessagesSending(true)}>
          {messagingSending ? 'Stop' : 'Start'} private messages sending
        </button>
        {this.renderUserProfile()}
        {this.renderDatabasesList()}
        {this.renderSwarmMessagesDatabasesList()}
        {this.renderConnectToDatabase()}
        {this.renderLoadMessages()}
      </div>
    );
  }

  public componentDidMount() {
    const { connectImmediateWithCredentials } = this.props;

    if (connectImmediateWithCredentials != null) {
      this.connectToSwarm(connectImmediateWithCredentials);
    }
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

  protected handleDatabasesListUpdate = (
    databasesList: ISwarmStoreDatabasesCommonStatusList<P, T, DbType, TSwarmStoreDatabaseOptions<P, T, DbType>>
  ) => {
    this.setState({
      databasesList: { ...databasesList },
    });
  };

  protected handleMessage = (dbName: string, message: TSwarmMessageInstance, id: string, key: string) => {
    const { messagesReceived } = this.state;
    const messagesMap = messagesReceived.get(dbName) || new Map();
    // TODO - to get all of actual values for KV-store it is necessary
    // to iterate overall database. Cause for a KV store implemented
    // by the OrbitDB only the "db.all" method returns all keys, so
    // in this implementation only thught the iterate method of a db
    // this is able to iterate over all items(db.all)

    if (!messagesMap.get(id)) {
      messagesMap.set(id, {
        message,
        id,
        key,
      });
      messagesReceived.set(dbName, messagesMap);
      this.forceUpdate();
    }
  };

  protected setListenersConnectionBridge(connectionBridge: IPromiseResolveType<ReturnType<typeof connectToSwarmUtil>>) {
    const { swarmMessageStore } = connectionBridge;

    if (!swarmMessageStore) {
      throw new Error('Swarm message store insatnce is not exists in the connection bridge instance');
    }
    swarmMessageStore.addListener(ESwarmStoreEventNames.DATABASES_LIST_UPDATED, this.handleDatabasesListUpdate);
    swarmMessageStore.addListener(ESwarmMessageStoreEventNames.NEW_MESSAGE, this.handleMessage);
  }

  protected connectToSwarm = async (credentialsVariant: 1 | 2 = 1) => {
    this.setState({
      isConnecting: true,
      credentialsVariant,
    });
    try {
      const connectionBridge = await connectToSwarmUtil<P, DbType, T>(
        this.props.connectionBridgeOptions,
        credentialsVariant === 1 ? CONNECT_TO_SWARM_AUTH_CREDENTIALS_1 : CONNECT_TO_SWARM_AUTH_CREDENTIALS_2
      );

      sessionStorage.setItem(CONNECT_TO_SWARM_AUTH_CREDENTIALS_SESSION_STORAGE_KEY, 'true');

      const userId = connectionBridge?.centralAuthorityConnection?.getUserIdentity();
      const userProfileData = await connectionBridge?.centralAuthorityConnection?.getCAUserProfile();

      this.setState({
        connectionBridge,
        userId,
        databasesList: connectionBridge.swarmMessageStore?.databases,
        secretStorage: connectionBridge.secretStorage,
        userProfileData,
      });
      this.setListenersConnectionBridge(
        (connectionBridge as unknown) as IPromiseResolveType<ReturnType<typeof connectToSwarmUtil>>
      );

      const { dbOptionsToConnectImmediate } = this.props;

      if (dbOptionsToConnectImmediate) {
        await this.handleOpenNewSwarmStoreMessagesDatabase(dbOptionsToConnectImmediate);
      }
    } catch (error) {
      this.setState({
        error,
      });
    }
  };

  public handleOpenDatabase = async (dbName?: string) => {
    try {
      this.setState({
        databaseOpeningStatus: true,
      });
      await this.swarmMessageStoreOrUndefined?.openDatabase({
        ...this.defaultDbOptions,
        dbName: dbName || this.defaultDbOptions.dbName,
      });
    } catch (err) {
      console.error(err);
    } finally {
      this.setState({
        databaseOpeningStatus: false,
      });
    }
  };

  public handleClickOpenNewSwarmStoreMessagesDatabase = () => {
    this.handleOpenNewSwarmStoreMessagesDatabase();
  };

  public handleOpenNewDatabase = async () => {
    const dbName = window.prompt('Enter database name', '');

    if (dbName) {
      await this.handleOpenDatabase(dbName);
    }
  };

  protected handleOpenNewSwarmStoreMessagesDatabase = async (dbOptionsToConnectImmediate?: Partial<DBO>) => {
    const dbNameToOpen = dbOptionsToConnectImmediate?.dbName;
    const dbName = dbNameToOpen || window.prompt('Enter database name', '');

    if (dbName) {
      const dbOptions = {
        ...this.defaultDbOptions,
        ...dbOptionsToConnectImmediate,
        dbName: dbName || this.defaultDbOptions.dbName,
      };
      this.setState(({ swarmStoreMessagesDbOptionsList }: any) => ({
        swarmStoreMessagesDbOptionsList: [...swarmStoreMessagesDbOptionsList, dbOptions],
      }));
    }
  };

  protected renderUserProfile() {
    const { userId, userProfileData } = this.state;
    return <UserProfile id={userId} profile={userProfileData} />;
  }

  protected renderDatabasesList() {
    const { databasesList, connectionBridge, databaseOpeningStatus } = this.state;
    const dbsOptions = databasesList?.options;
    const isDefaultDatabaseWasOpenedBeforeOrOpening =
      !databaseOpeningStatus && !dbsOptions?.[this.defaultDbOptions.dbName as DBO['dbName']];

    return (
      <div>
        <div>
          <h4>List of databases:</h4>
          {!!databasesList &&
            !!dbsOptions &&
            Object.keys(dbsOptions).map((databaseName) => {
              const databaseOptions = dbsOptions[databaseName as DBO['dbName']];
              const isOpened = databasesList.opened[databaseName];
              const dbMessages = this.state.messagesReceived.get(databaseName);

              return (
                <SwarmStoreDbComponent<P, T, DbType, DBO>
                  key={databaseName}
                  databaseOptions={databaseOptions}
                  isOpened={isOpened}
                  connectionBridge={connectionBridge}
                  messages={Array.from(dbMessages?.values() || [])}
                />
              );
            })}
        </div>
        {!!isDefaultDatabaseWasOpenedBeforeOrOpening ? (
          <button onClick={() => this.handleOpenDatabase()}>Open default database</button>
        ) : (
          <button onClick={this.handleOpenNewDatabase}>Open new database</button>
        )}
      </div>
    );
  }

  protected renderSwarmMessagesDatabasesList() {
    const { swarmStoreMessagesDbOptionsList, connectionBridge } = this.state;
    const { dbOptionsToConnectImmediate } = this.props;

    return (
      <div>
        <div>
          <h4>List of swarm messages databases:</h4>
          {swarmStoreMessagesDbOptionsList.map((dbsOptions) => {
            const { userId } = this.state;
            if (!userId) {
              throw new Error('User identity should not be empty');
            }
            return (
              <SwarmMessagesDatabaseComponent
                key={dbsOptions.dbName}
                userId={userId}
                databaseOptions={dbsOptions}
                connectionBridge={connectionBridge}
                isOpenImmediate={dbsOptions.dbName === dbOptionsToConnectImmediate?.dbName}
              />
            );
          })}
        </div>
        <button onClick={this.handleClickOpenNewSwarmStoreMessagesDatabase}>Open new swarm store database</button>
      </div>
    );
  }
}
