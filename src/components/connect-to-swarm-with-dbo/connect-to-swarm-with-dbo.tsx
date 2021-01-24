import React from 'react';
import { connectToSwarmWithDBOUtil } from './connect-to-swarm-with-dbo-utils/connect-to-swarm-with-dbo-utils';
import { CONNECT_TO_SWARM_STORAGE_DEFAULT_MESSAGE_BODY } from '../const/connect-to-swarm.const';
import { CONNECT_TO_SWARM_AUTH_CREDENTIALS_SESSION_STORAGE_KEY } from '../const/connect-to-swarm.const';
import {
  ESwarmStoreConnectorOrbitDbDatabaseMethodNames,
  ISwarmStoreDatabasesCommonStatusList,
  ESwarmStoreEventNames,
} from 'classes';
import { SwarmStoreDbComponent } from '../swarm-store-db-component/swarm-store-db-component';
import { ESwarmMessageStoreEventNames } from '../../classes/swarm-message-store/swarm-message-store.const';
import { ESwarmStoreConnector } from '../../classes/swarm-store-class/swarm-store-class.const';
import {
  TSwarmMessageInstance,
  TSwarmMessageSerialized,
  ISwarmMessageInstanceEncrypted,
} from '../../classes/swarm-message/swarm-message-constructor.types';
import { ISwarmMessageInstanceDecrypted } from '../../classes/swarm-message/swarm-message-constructor.types';
import { ISecretStorage } from '../../classes/secret-storage-class/secret-storage-class.types';
import { ICentralAuthorityUserProfile } from '../../classes/central-authority-class/central-authority-class-types/central-authority-class-types-common';
import { UserProfile } from '../userProfile/userProfile';
import { TSwarmStoreDatabaseType, TSwarmStoreDatabaseOptions } from '../../classes/swarm-store-class/swarm-store-class.types';
import { SwarmMessagesDatabaseComponent } from '../swarm-messages-database-component/swarm-messages-database-component';
import { PromiseResolveType } from '../../types/promise.types';
import {
  IConnectionBridgeOptionsDefault,
  IConnectionBridgeUnknown,
} from '../../classes/connection-bridge/types/connection-bridge.types';
import { TSwarmStoreDatabaseEntityKey } from '../../classes/swarm-store-class/swarm-store-class.types';
import { swarmMessagesDatabaseConnectedFabric } from '../../classes/swarm-messages-database/swarm-messages-database-fabric/swarm-messages-database-fabric';
import { TSwarmMessagesDatabaseConnectedFabricOptions } from '../../classes/swarm-messages-database/swarm-messages-database-fabric/swarm-messages-database-fabric.types';
import { IUserCredentialsCommon } from '../../types/credentials.types';
import { TSwarmMessageUserIdentifierSerialized } from '../../classes/swarm-message/swarm-message-subclasses/swarm-message-subclass-validators/swarm-message-subclass-validator-fields-validator/swarm-message-subclass-validator-fields-validator-validators/swarm-message-subclass-validator-fields-validator-validator-user-identifier/swarm-message-subclass-validator-fields-validator-validator-user-identifier.types';
import { ISwarmMessagesDatabaseConnectOptionsSwarmMessagesCacheOptions } from '../../classes/swarm-messages-database/swarm-messages-database.types';
import { createSwarmMessagesDatabaseMessagesCollectorInstance } from '../../classes/swarm-messages-database/swarm-messages-database-subclasses/swarm-messages-database-messages-collector/swarm-messages-database-messages-collector';
import { IConnectionBridge } from '../../classes/connection-bridge/types/connection-bridge.types';
import {
  TConnectionBridgeOptionsAccessControlOptions,
  TConnectionBridgeOptionsSwarmMessageStoreOptionsWithConnectorFabric,
} from '../../classes/connection-bridge/connection-bridge.types-helpers';
import {
  TConnectionBridgeOptionsConnectorFabricOptions,
  TConnectionBridgeOptionsSwarmMessageStoreInstance,
} from '../../classes/connection-bridge/connection-bridge.types-helpers';
import {
  TConnectionBridgeOptionsConnectorMain,
  TConnectionBridgeOptionsConstructorWithEncryptedCacheFabric,
  TConnectionBridgeOptionsGrandAccessCallback,
} from '../../classes/connection-bridge/connection-bridge.types-helpers';
import { TConnectionBridgeOptionsProviderOptions } from '../../classes/connection-bridge/connection-bridge.types-helpers';
import {
  ISwarmMessagesDatabaseCacheOptions,
  ISwarmMessagesDatabaseCache,
  ISwarmMessagesDatabaseCacheConstructor,
} from '../../classes/swarm-messages-database/swarm-messages-database.types';
import {
  TConnectionBridgeOptionsConnectorBasic,
  TConnectionBridgeOptionsConnectorConnectionOptions,
} from '../../classes/connection-bridge/connection-bridge.types-helpers';
import { ISwarmMessagesDatabaseMessagesCollector } from '../../classes/swarm-messages-database/swarm-messages-database.messages-collector.types';
import { ISerializer } from '../../types/serialization.types';

export type P = ESwarmStoreConnector.OrbitDB;

export interface IMessageDescription<P extends ESwarmStoreConnector> {
  id: string;
  key?: TSwarmStoreDatabaseEntityKey<P>;
  message: ISwarmMessageInstanceDecrypted;
}

export interface IConnectToSwarmProps<
  DbType extends TSwarmStoreDatabaseType<P>,
  T extends TSwarmMessageSerialized,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>,
  CD extends boolean,
  CBO extends IConnectionBridgeOptionsDefault<P, T, DbType, CD>,
  MD extends ISwarmMessageInstanceDecrypted,
  SMSM extends ISwarmMessagesDatabaseMessagesCollector<P, DbType, MD>,
  DCO extends ISwarmMessagesDatabaseCacheOptions<P, DbType, MD, SMSM>,
  DCCRT extends ISwarmMessagesDatabaseCache<P, T, DbType, DBO, MD, SMSM>,
  SMDCC extends ISwarmMessagesDatabaseCacheConstructor<P, T, DbType, DBO, MD, SMSM, DCO, DCCRT>
> {
  connectionBridgeOptions: CBO;
  userCredentialsList: Array<IUserCredentialsCommon>;
  dbo: DBO;
  userIdReceiverSwarmMessages: TSwarmMessageUserIdentifierSerialized;
  swarmMessagesDatabaseCacheOptions: ISwarmMessagesDatabaseConnectOptionsSwarmMessagesCacheOptions<
    P,
    T,
    DbType,
    DBO,
    MD,
    SMSM,
    DCO,
    DCCRT,
    SMDCC
  >;
  userCredentialsToConnectImmediate?: IUserCredentialsCommon;
}

export class ConnectToSwarmWithDBO<
  DbType extends TSwarmStoreDatabaseType<P>,
  T extends TSwarmMessageSerialized,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>,
  CD extends boolean,
  CBO extends IConnectionBridgeOptionsDefault<P, T, DbType, CD>,
  SRLZR extends ISerializer,
  MI extends TSwarmMessageInstance = TSwarmMessageInstance,
  MD extends ISwarmMessageInstanceDecrypted = Exclude<MI, ISwarmMessageInstanceEncrypted>,
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
  SMDCC extends ISwarmMessagesDatabaseCacheConstructor<
    P,
    T,
    DbType,
    DBO,
    MD,
    SMSM,
    DCO,
    DCCRT
  > = ISwarmMessagesDatabaseCacheConstructor<P, T, DbType, DBO, MD, SMSM, DCO, DCCRT>
> extends React.PureComponent<IConnectToSwarmProps<DbType, T, DBO, CD, CBO, MD, SMSM, DCO, DCCRT, SMDCC>> {
  public state = {
    isConnecting: false,
    messagingSending: undefined as NodeJS.Timeout | undefined,
    error: undefined as Error | undefined,
    connectionBridge: undefined as
      | IConnectionBridge<
          P,
          T,
          DbType,
          DBO,
          TConnectionBridgeOptionsConnectorBasic<CBO>,
          TConnectionBridgeOptionsConnectorConnectionOptions<CBO>,
          TConnectionBridgeOptionsProviderOptions<CBO>,
          TConnectionBridgeOptionsSwarmMessageStoreInstance<CBO>,
          TConnectionBridgeOptionsConnectorFabricOptions<CBO>,
          any,
          MI | T,
          TConnectionBridgeOptionsGrandAccessCallback<CBO>,
          TConnectionBridgeOptionsConstructorWithEncryptedCacheFabric<CBO>,
          TConnectionBridgeOptionsAccessControlOptions<CBO>,
          any,
          CD,
          any,
          any,
          any,
          SRLZR
        >
      | undefined,
    userId: undefined as string | undefined,
    // was the database main removed by the user
    dbRemoved: false,
    dbRemoving: false,
    messages: [] as any[],
    messagesReceived: new Map() as Map<string, Map<string, IMessageDescription<P>>>,
    databasesList: undefined as ISwarmStoreDatabasesCommonStatusList<P, T, DbType, DBO> | undefined,
    swarmStoreMessagesDbOptionsList: [] as DBO[],
    databaseOpeningStatus: false as boolean,
    secretStorage: undefined as undefined | ISecretStorage,
    userProfileData: undefined as undefined | Partial<ICentralAuthorityUserProfile>,
    userCredentialsActive: undefined as IUserCredentialsCommon | undefined,
    isDatabaseListVisible: false,
  };

  protected get defaultDbOptions(): DBO {
    const { dbo } = this.props;

    if (!dbo) {
      throw new Error('Ther is no options passed in the props');
    }
    return dbo;
  }

  protected get swarmMessageStore(): Required<IConnectionBridgeUnknown<P, T, DbType, any, DBO>>['swarmMessageStore'] {
    const { connectionBridge } = this.state;

    if (!connectionBridge) {
      throw new Error('There is no connection to the connection bridge instance');
    }

    const { swarmMessageStore } = connectionBridge;

    if (!swarmMessageStore) {
      throw new Error('There is no connection to a swarm message stor');
    }
    return swarmMessageStore;
  }

  protected get mainDatabaseOptions(): DBO {
    if (!this.props.dbo) {
      throw new Error('The main database options are not defined in the props');
    }
    return this.props.dbo;
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
      await this.swarmMessageStore?.addMessage(this.mainDatabaseName, {
        ...CONNECT_TO_SWARM_STORAGE_DEFAULT_MESSAGE_BODY,
        receiverId: this.props.userIdReceiverSwarmMessages,
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

      void method();
      return {
        messagingSending: setInterval(method, 1000),
      };
    });
  };

  public handleDatabaseRemove = async () => {
    const { swarmMessageStore: swarmMessageStoreOrUndefined } = this;

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
    const { swarmMessageStore: swarmMessageStoreOrUndefined } = this;

    if (swarmMessageStoreOrUndefined) {
      await swarmMessageStoreOrUndefined.openDatabase(this.mainDatabaseOptions);
      this.setState({
        dbRemoved: false,
      });
    }
  };

  public loadNextMessages = async () => {
    const { swarmMessageStore: swarmMessageStoreOrUndefined } = this;

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
        {/* TODO {this.renderDatabasesList()} */}
        {this.renderSwarmMessagesDatabasesList()}
        {this.renderConnectToDatabase()}
        {this.renderLoadMessages()}
      </div>
    );
  }

  public componentDidMount() {
    const { userCredentialsToConnectImmediate } = this.props;
    if (userCredentialsToConnectImmediate) {
      void this.connectToSwarm(userCredentialsToConnectImmediate);
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
          {this.props.userCredentialsList.map((credentials) => (
            <button key={credentials.login} onClick={() => this.connectToSwarm(credentials)}>
              Connect cred {credentials.login}
            </button>
          ))}
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

  protected handleMessage = (dbName: DBO['dbName'], message: MI, id: string, key: string) => {
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

  protected setListenersConnectionBridge(connectionBridge: PromiseResolveType<ReturnType<typeof connectToSwarmWithDBOUtil>>) {
    const swarmMessageStore = connectionBridge.swarmMessageStore;

    if (!swarmMessageStore) {
      throw new Error('Swarm message store insatnce is not exists in the connection bridge instance');
    }
    swarmMessageStore.addListener(ESwarmStoreEventNames.DATABASES_LIST_UPDATED, this.handleDatabasesListUpdate);
    swarmMessageStore.addListener(ESwarmMessageStoreEventNames.NEW_MESSAGE, this.handleMessage);
  }

  protected connectToSwarm = async (credentials: IUserCredentialsCommon) => {
    if (!credentials) {
      throw new Error('Credentials should be defined to connect to swarm');
    }

    this.setState({
      isConnecting: true,
      userCredentialsActive: credentials,
    });
    try {
      const connectionBridge = await connectToSwarmWithDBOUtil<P, T, DbType, DBO, CBO['serializer']>(
        this.props.connectionBridgeOptions,
        credentials
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
        (connectionBridge as unknown) as PromiseResolveType<ReturnType<typeof connectToSwarmWithDBOUtil>>
      );

      const { dbo } = this.props;

      if (!dbo) {
        throw new Error('Database options shoul be defined to connect with it');
      }
      await this.handleOpenNewSwarmStoreMessagesDatabase(dbo);
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
      await this.swarmMessageStore?.openDatabase({
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

  public handleClickOpenNewSwarmStoreMessagesDatabase = async () => {
    await this.handleOpenNewSwarmStoreMessagesDatabase();
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

  protected toggleDatabasesListVisible = () => {
    this.setState((state: any) => ({
      isDatabaseListVisible: !state.isDatabaseListVisible,
    }));
  };

  protected renderDatabasesList() {
    const { databasesList, connectionBridge, databaseOpeningStatus, isDatabaseListVisible } = this.state;
    const dbsOptions = databasesList?.options;
    const isDefaultDatabaseWasOpenedBeforeOrOpening =
      !databaseOpeningStatus && !dbsOptions?.[this.defaultDbOptions.dbName as DBO['dbName']];

    return (
      <div>
        <div>
          <h4 onClick={this.toggleDatabasesListVisible}>List of databases:</h4>
          <div style={{ display: isDatabaseListVisible ? 'initial' : 'none' }}>
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
        </div>
        {!!isDefaultDatabaseWasOpenedBeforeOrOpening ? (
          <button onClick={() => this.handleOpenDatabase()}>Open default database</button>
        ) : (
          <button onClick={this.handleOpenNewDatabase}>Open new database</button>
        )}
      </div>
    );
  }

  protected getSwarmMessagesCollector(): SMSM {
    const { connectionBridge } = this.state;

    if (!connectionBridge) {
      throw new Error('There is no connection with connction bridge');
    }

    const swarmMessageStore = connectionBridge?.swarmMessageStore as TConnectionBridgeOptionsSwarmMessageStoreInstance<CBO>;

    if (!swarmMessageStore) {
      throw new Error('Swarm message store is not ready');
    }
    return createSwarmMessagesDatabaseMessagesCollectorInstance<
      P,
      T,
      DbType,
      DBO,
      TConnectionBridgeOptionsConnectorBasic<CBO>,
      TConnectionBridgeOptionsConnectorConnectionOptions<CBO>,
      TConnectionBridgeOptionsProviderOptions<CBO>,
      TConnectionBridgeOptionsConnectorMain<CBO>,
      TConnectionBridgeOptionsConnectorFabricOptions<CBO>,
      TConnectionBridgeOptionsGrandAccessCallback<CBO>,
      TConnectionBridgeOptionsConstructorWithEncryptedCacheFabric<CBO>,
      TConnectionBridgeOptionsAccessControlOptions<CBO>,
      TConnectionBridgeOptionsSwarmMessageStoreOptionsWithConnectorFabric<CBO>,
      TConnectionBridgeOptionsSwarmMessageStoreInstance<CBO>,
      MD
    >({
      swarmMessageStore,
    }) as SMSM;
  }

  protected _getOptionsForSwarmMessagesDatabaseConnectedWithoutDatabaseOptionsFabric = (): Omit<
    TSwarmMessagesDatabaseConnectedFabricOptions<typeof swarmMessagesDatabaseConnectedFabric>,
    'dbOptions'
  > => {
    const { connectionBridge, userId } = this.state;
    const { swarmMessagesDatabaseCacheOptions } = this.props;

    if (!connectionBridge || !connectionBridge.swarmMessageStore) {
      throw new Error('A connection bridge instance is not exists in the state');
    }
    if (!userId) {
      throw new Error('User id should be defined');
    }

    return {
      cacheOptions: swarmMessagesDatabaseCacheOptions,
      swarmMessageStore: connectionBridge.swarmMessageStore,
      swarmMessagesCollector: this.getSwarmMessagesCollector(),
      user: {
        userId,
      },
    };
  };

  protected getOptionsForSwarmMessagesDatabaseConnectedFabric = (
    dbsOptions: DBO
  ): TSwarmMessagesDatabaseConnectedFabricOptions<typeof swarmMessagesDatabaseConnectedFabric> => {
    const options = this._getOptionsForSwarmMessagesDatabaseConnectedWithoutDatabaseOptionsFabric();
    return {
      ...options,
      dbOptions: { ...dbsOptions },
    };
  };

  protected createDatabaseConnector = async (dbOptions: DBO) => {
    return await swarmMessagesDatabaseConnectedFabric<
      P,
      T,
      DbType,
      DBO,
      any,
      MD,
      TConnectionBridgeOptionsGrandAccessCallback<CBO>,
      TConnectionBridgeOptionsAccessControlOptions<CBO>,
      TConnectionBridgeOptionsConnectorBasic<CBO>,
      TConnectionBridgeOptionsConnectorConnectionOptions<CBO>,
      TConnectionBridgeOptionsProviderOptions<CBO>,
      TConnectionBridgeOptionsConnectorMain<CBO>,
      TConnectionBridgeOptionsConnectorFabricOptions<CBO>,
      any,
      any,
      SMSM,
      DCO,
      DCCRT,
      any
    >(this.getOptionsForSwarmMessagesDatabaseConnectedFabric(dbOptions));
  };

  protected renderSwarmMessagesDatabasesList() {
    const { swarmStoreMessagesDbOptionsList, connectionBridge } = this.state;
    const { dbo } = this.props;

    if (!connectionBridge) {
      throw new Error('Connection bridge should be defined');
    }
    return (
      <div>
        <div>
          <h4 onClick={this.toggleDatabasesListVisible}>List of swarm messages databases:</h4>
          {swarmStoreMessagesDbOptionsList.map((dbsOptions) => {
            const { userId } = this.state;
            const createDatabaseConnector = this.createDatabaseConnector;

            type TCreateDatabaseConnector = PromiseResolveType<ReturnType<typeof createDatabaseConnector>>;
            if (!userId) {
              throw new Error('User identity should not be empty');
            }
            return (
              <SwarmMessagesDatabaseComponent<
                T,
                DbType,
                IConnectionBridgeUnknown<P, T, DbType, any, DBO, MI | T>,
                DBO,
                MD,
                SMSM,
                DCO,
                DCCRT,
                TCreateDatabaseConnector
              >
                key={dbsOptions.dbName}
                userId={userId}
                databaseOptions={dbsOptions}
                connectionBridge={connectionBridge}
                isOpenImmediate={dbsOptions.dbName === dbo?.dbName}
                createDb={this.createDatabaseConnector}
              />
            );
          })}
        </div>
        <button onClick={this.handleClickOpenNewSwarmStoreMessagesDatabase}>Open new swarm store database</button>
      </div>
    );
  }
}
