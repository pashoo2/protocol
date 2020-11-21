import assert from 'assert';
import {
  IConnectionBridgeOptions,
  IConnectionBridge,
  TNativeConnectionType,
  IConnectionBridgeOptionsAuth,
} from './connection-bridge.types';
import { ESwarmStoreConnector } from '../swarm-store-class/swarm-store-class.const';
import {
  ICentralAuthorityOptions,
  ICentralAuthority,
  ICentralAuthorityUserCredentials,
} from '../central-authority-class/central-authority-class.types';
import {
  TSwarmMessageConstructorOptions,
  ISwarmMessageConstructor,
  TSwarmMessageInstance,
} from '../swarm-message/swarm-message-constructor.types';
import {
  ISwarmMessageStoreOptions,
  ISwarmMessageStore,
  ISwarmMessageStoreEvents,
  TSwarmMessagesStoreGrantAccessCallback,
  ISwarmMessageStoreAccessControlOptions,
} from '../swarm-message-store/swarm-message-store.types';
import { extend } from '../../utils/common-utils/common-utils-objects';
import {
  CONNECTION_BRIDGE_OPTIONS_DEFAULT_AUTH_PROVIDERS_POOL,
  CONNECTION_BRIDGE_SESSION_STORAGE_KEYS,
  CONNECTION_BRIDGE_STORAGE_DATABASE_PREFIX,
  CONNECTION_BRIDGE_DATA_STORAGE_DATABASE_NAME_PREFIX_DELIMETER,
} from './connection-bridge.const';
import { CentralAuthority } from '../central-authority-class/central-authority-class';
import { SwarmMessageStore } from '../swarm-message-store/swarm-message-store';
import { ISensitiveDataSessionStorage } from 'classes/sensitive-data-session-storage/sensitive-data-session-storage.types';
import { SensitiveDataSessionStorage } from 'classes/sensitive-data-session-storage';
import {
  ISwarmMessageEncryptedCacheFabric,
  ISwarmMessageConstructorWithEncryptedCacheFabric,
} from '../swarm-messgae-encrypted-cache/swarm-messgae-encrypted-cache.types';
import {
  CONNECTION_BRIDGE_STORAGE_DATABASE_NAME,
  CONNECTION_BRIDGE_OPTIONS_DEFAULT_USER_SENSITIVE_DATA_STORE as CONNECTION_BRIDGE_OPTIONS_DEFAULT_USER_SENSITIVE_DATA_STORE_OPTIONS,
} from './connection-bridge.const';
import {
  getSwarmMessageEncryptedCacheFabric,
  getSwarmMessageConstructorWithCacheFabric,
} from '../swarm-messgae-encrypted-cache/swarm-message-encrypted-cache.utils';
import { ISwarmMessgaeEncryptedCache } from '../swarm-messgae-encrypted-cache';
import { ISensitiveDataSessionStorageOptions } from '../sensitive-data-session-storage/sensitive-data-session-storage.types';
import {
  ISecretStorage,
  TSecretStorageAuthorizazionOptions,
  TSecretStorageAuthOptionsCredentials,
} from '../secret-storage-class/secret-storage-class.types';
import { SecretStorage } from '../secret-storage-class/secret-storage-class';
import { IStorageProviderOptions } from '../storage-providers/storage-providers.types';
import {
  TSwarmStoreDatabaseType,
  TSwarmStoreConnectorConnectionOptions,
  TSwarmStoreOptionsOfDatabasesKnownList,
} from '../swarm-store-class/swarm-store-class.types';
import { TSwarmMessageSerialized } from '../swarm-message/swarm-message-constructor.types';
import {
  IConnectionBridgeSwarmConnection,
  TNativeConnectionOptions,
  IConnectionBridgeOptionsGetMainConnectorFabric,
} from './connection-bridge.types';
import {
  getSwarmStoreConnectionProviderOptionsForSwarmStoreConnector,
  createNativeConnection,
  connectorBasicFabricOrbitDBDefault,
} from './connection-bridge.utils';
import { IPFS } from 'types/ipfs.types';
import { ICentralAuthorityUserProfile } from '../central-authority-class/central-authority-class-types/central-authority-class-types-common';
import {
  ISwarmStoreConnectorBasic,
  ISwarmStoreConnector,
  TSwarmStoreConnectorBasicFabric,
} from '../swarm-store-class/swarm-store-class.types';
import { ISecretStoreCredentialsSession, ISecretStoreCredentials } from '../secret-storage-class/secret-storage-class.types';
import { getMainConnectorFabricDefault } from './connection-bridge.utils';
import { TSwarmStoreConnectorConstructorOptions } from '../swarm-store-class/swarm-store-class.types';
import { TSwarmMessageUserIdentifierSerialized } from '../swarm-message/swarm-message-subclasses/swarm-message-subclass-validators/swarm-message-subclass-validator-fields-validator/swarm-message-subclass-validator-fields-validator-validators/swarm-message-subclass-validator-fields-validator-validator-user-identifier/swarm-message-subclass-validator-fields-validator-validator-user-identifier.types';
import { PromiseResolveType } from '../../types/helper.types';
import { TConnectionBridgeCFODefault } from './connection-bridge.types';
import {
  ISwarmMessageDatabaseConstructors,
  ISwarmMessageStoreOptionsWithConnectorFabric,
} from '../swarm-message-store/swarm-message-store.types';
import {
  TSwarmStoreDatabaseOptions,
  ISwarmStoreProviderOptions,
  ISwarmStoreOptionsConnectorFabric,
} from '../swarm-store-class/swarm-store-class.types';

/**
 * this class used if front of connection
 * to the swarm, swarm database and
 * central authority, to simplify connection
 * process.
 *
 * @export
 * @class ConnectionBridge
 */
export class ConnectionBridge<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>,
  ConnectorBasic extends ISwarmStoreConnectorBasic<P, T, DbType, DBO>,
  PO extends TSwarmStoreConnectorConnectionOptions<P, T, DbType, DBO, ConnectorBasic>,
  CO extends ISwarmStoreProviderOptions<P, T, DbType, DBO, ConnectorBasic, PO>,
  ConnectorMain extends ISwarmStoreConnector<P, T, DbType, DBO, ConnectorBasic, PO>,
  CFO extends ISwarmStoreOptionsConnectorFabric<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain> | undefined,
  CBFO extends TSwarmStoreConnectorBasicFabric<P, T, DbType, DBO, ConnectorBasic> | undefined,
  MSI extends TSwarmMessageInstance | T,
  GAC extends TSwarmMessagesStoreGrantAccessCallback<P, MSI>,
  MCF extends ISwarmMessageConstructorWithEncryptedCacheFabric | undefined,
  ACO extends ISwarmMessageStoreAccessControlOptions<P, T, MSI, GAC> | undefined,
  O extends ISwarmMessageStoreOptionsWithConnectorFabric<
    P,
    T,
    DbType,
    DBO,
    ConnectorBasic,
    PO,
    CO,
    ConnectorMain,
    TConnectionBridgeCFODefault<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain, CFO>,
    MSI,
    GAC,
    MCF,
    ACO
  >,
  CD extends boolean,
  CBO extends IConnectionBridgeOptions<
    P,
    T,
    DbType,
    DBO,
    ConnectorBasic,
    PO,
    CO,
    ConnectorMain,
    MSI,
    GAC,
    MCF,
    ACO,
    CFO,
    CBFO,
    CD
  >,
  E extends ISwarmMessageStoreEvents<P, T, DbType, DBO> = ISwarmMessageStoreEvents<P, T, DbType, DBO>,
  DBL extends TSwarmStoreOptionsOfDatabasesKnownList<P, T, DbType, DBO> = TSwarmStoreOptionsOfDatabasesKnownList<
    P,
    T,
    DbType,
    DBO
  >,
  NC extends TNativeConnectionType<P> = TNativeConnectionType<P>
> implements
    IConnectionBridge<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain, CFO, CBFO, MSI, GAC, MCF, ACO, O, CD, CBO> {
  public centralAuthorityConnection?: ICentralAuthority;

  public swarmMessageStore?: ISwarmMessageStore<
    P,
    T,
    DbType,
    DBO,
    ConnectorBasic,
    PO,
    CO,
    ConnectorMain,
    TConnectionBridgeCFODefault<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain, CFO>,
    MSI,
    GAC,
    MCF,
    ACO,
    O
  >;

  public messageConstructor?: PromiseResolveType<ReturnType<NonNullable<MCF>>>;

  public swarmMessageEncryptedCacheFabric?: ISwarmMessageEncryptedCacheFabric;

  public swarmMessageConstructorFabric: MCF = undefined as MCF;

  public get secretStorage() {
    return this._secretStorage;
  }

  protected options?: CBO;

  protected get swarmStoreConnectorType(): P | undefined {
    return this.options?.swarmStoreConnectorType;
  }

  protected optionsCentralAuthority?: ICentralAuthorityOptions;

  protected optionsMessageConstructor?: TSwarmMessageConstructorOptions;

  protected optionsSwarmConnection?: TNativeConnectionOptions<P>;

  protected optionsMessageStorage?: ISwarmMessageStoreOptions<P, T, DbType, DBO, ConnectorBasic, PO, MSI, GAC, MCF, ACO>;

  protected sessionSensitiveStorage?: ISensitiveDataSessionStorage;

  protected userSensitiveDataStore?: ISensitiveDataSessionStorage;

  protected swarmMessageEncryptedCache?: ISwarmMessgaeEncryptedCache;

  protected _secretStorage?: ISecretStorage;

  protected swarmConnection: IConnectionBridgeSwarmConnection<P, NC> | undefined;

  protected get sensitiveDataStorageOptions(): ISensitiveDataSessionStorageOptions | undefined {
    return this.options?.auth.session;
  }

  /**
   * Connect to the central authority,
   * create the message constructor,
   * create swarm connection, start
   * connection with the swarm message storage.
   *
   * @memberof ConnectionBridge
   * @throws
   */
  public async connect(options: CBO): Promise<void> {
    await this.createAndSetSessionSensitiveDataStoreForConnectionBridgeSessionIfNotExists();
    try {
      await this.validateAndSetOptions(options);

      const { sensitiveDataStorageOptions } = this;

      if (sensitiveDataStorageOptions) {
        await this.createAndSetSensitiveDataStorageForMainSession(sensitiveDataStorageOptions, this.getUserLoginFromOptions());
      }
      await this.createAndSetSequentlyDependenciesInstances();
      if (sensitiveDataStorageOptions) {
        await this.markSessionAsStartedInStorageForSession();
      }
      this.setCurrentSecretStorageInstance(await this.createAndAutorizeInSecretStorage());
    } catch (err) {
      console.error('connection to the swarm failed', err);
      await this.close();
      throw err;
    }
  }

  /**
   * @param {ISensitiveDataSessionStorageOptions} sessionParams
   * @returns
   * @memberof ConnectionBridge
   */
  public async checkSessionAvailable(options?: ISensitiveDataSessionStorageOptions | CBO) {
    const sessionParams = this.getSessionParamsOrUndefinedFromConnectionBridgeOrSensitiveDataSessionStorageOptions(options);

    if (!sessionParams) {
      return false;
    }

    const connectionBridgeSessionDataStore = await this.createSessionSensitiveDataStoreForConnectionBridgeSession();
    const userLogin = await this.readUserLoginKeyValueFromConnectionBridgeSessionDataStore(connectionBridgeSessionDataStore);

    // check whether the user login value set for a previous session by this Connection bridge instance
    if (!this.isUserLogin(userLogin)) {
      return false;
    }

    // check any data exists in the main session data store
    const mainSessionDataStore = await this.createMainSensitiveDataStorageForSession(
      {
        ...sessionParams,
        // do not clear data from the storage becuse it can be used later
        clearStorageAfterConnect: false,
      },
      userLogin
    );

    return this.whetherAnySessionDataExistsInSensitiveDataSessionStorage(mainSessionDataStore);
  }

  /**
   * close all the connections and
   * release all instances
   *
   * @returns {Promise<void>}
   * @memberof ConnectionBridge
   */
  public async close(): Promise<void> {
    await this.closeStorage();
    await this.closeMessageConstructor();
    await this.closeSwarmConnection();
    await this.closeSwarmMessageEncryptedCacheFabric();
    await this.closeSwarmMessageConstructorFabric();
    await this.closeCurrentCentralAuthorityConnection();
  }

  protected isUserLogin(userLogin: unknown): userLogin is string {
    return userLogin && typeof userLogin === 'string';
  }

  protected checkCurrentOptionsIsDefined(): this is {
    options: CBO;
  } {
    if (!this.options) {
      throw new Error('Options should be defined');
    }
    return true;
  }

  protected getOptions(): CBO {
    if (this.checkCurrentOptionsIsDefined()) {
      return this.options;
    }
    throw new Error('Current options are not defined');
  }

  protected validateCurrentAuthOptions(): void {
    const { auth: authOptions } = this.getOptions();

    assert(authOptions, 'Authorization options must be defined');
    assert(typeof authOptions === 'object', 'Authorization options must be an object');
  }

  protected validatetCurrentUserOptions() {
    const { user: userOptions } = this.getOptions();

    assert(userOptions, 'User options must be defined');
    assert(typeof userOptions === 'object', 'User options must be an object');
  }

  protected createOptionsForCentralAuthority(
    authOptions: IConnectionBridgeOptionsAuth<CD>,
    userOptions: { profile?: Partial<ICentralAuthorityUserProfile> | undefined }
  ): ICentralAuthorityOptions {
    const authProvidersPool: ICentralAuthorityOptions['authProvidersPool'] = extend(
      authOptions.authProvidersPool,
      CONNECTION_BRIDGE_OPTIONS_DEFAULT_AUTH_PROVIDERS_POOL
    );
    return {
      user: {
        profile: userOptions.profile,
        authProviderUrl: authOptions.providerUrl,
        credentials: {
          ...authOptions.credentials,
          session: this.sessionSensitiveStorage,
        },
      },
      authProvidersPool,
    };
  }

  protected setOptionsCentralAuthority(optionsCentralAuthority: ICentralAuthorityOptions) {
    this.optionsCentralAuthority = optionsCentralAuthority;
  }

  protected createOptionsForCentralAuthorityWithCurrentConnectionBridgeOptions(): ICentralAuthorityOptions {
    const { auth: authOptions, user: userOptions } = this.getOptions();
    return this.createOptionsForCentralAuthority(authOptions, userOptions);
  }

  /**
   * set options for the CentralAuthority connection.
   *
   * @protected
   * @memberof ConnectionBridge
   * @throws
   */
  protected createOptionsCentralAuthority(): ICentralAuthorityOptions {
    if (!this.checkCurrentOptionsIsDefined()) {
      throw new Error('Options must be defined');
    }
    this.validateCurrentAuthOptions();
    this.validatetCurrentUserOptions();

    const optionsCentralAuthority = this.createOptionsForCentralAuthorityWithCurrentConnectionBridgeOptions();

    return optionsCentralAuthority;
  }

  /**
   * Options for message contrustor by the current options
   *
   * @protected
   * @returns {TSwarmMessageConstructorOptions}
   * @memberof ConnectionBridge
   * @throws
   */
  protected createOptionsMessageConstructor(): TSwarmMessageConstructorOptions {
    const { centralAuthorityConnection: caConnection } = this;

    if (!caConnection) {
      throw new Error('There is no connection to the central authoriry');
    }
    return {
      caConnection,
      instances: {
        encryptedCache: this.swarmMessageEncryptedCache,
      },
    };
  }

  protected getConnectorBasicFabricToUseInSwarmStoreConnectionProviderOptionsForSwarmStoreConnector(): TSwarmStoreConnectorBasicFabric<
    P,
    T,
    DbType,
    DBO,
    ConnectorBasic
  > {
    return (this.options?.storage.connectorBasicFabric ?? connectorBasicFabricOrbitDBDefault) as TSwarmStoreConnectorBasicFabric<
      P,
      T,
      DbType,
      DBO,
      ConnectorBasic
    >;
  }

  protected getSwarmStoreConnectionProviderOptions<SC extends IConnectionBridgeSwarmConnection<P, NC>>(swarmConnection: SC): PO {
    const { swarmStoreConnectorType } = this;

    if (!swarmStoreConnectorType) {
      throw new Error('Uknown connector type');
    }

    const connectorBasicFabric = this.getConnectorBasicFabricToUseInSwarmStoreConnectionProviderOptionsForSwarmStoreConnector();
    const swarmStoreConnectionProviderOptions = getSwarmStoreConnectionProviderOptionsForSwarmStoreConnector<
      P,
      T,
      DbType,
      DBO,
      ConnectorBasic,
      NC,
      SC
    >(swarmStoreConnectorType, swarmConnection, connectorBasicFabric);

    return swarmStoreConnectionProviderOptions as PO;
  }

  protected getCurrentUserIdentityFromCurrentConnectionToCentralAuthority(): TSwarmMessageUserIdentifierSerialized {
    const { centralAuthorityConnection: caConnection } = this;
    if (!caConnection) {
      throw new Error('There is no message central authority connection defined');
    }
    const userId = caConnection.getUserIdentity();

    if (userId instanceof Error) {
      throw userId;
    }
    return userId;
  }

  protected getMessageStorageDatabasesListStorage = (): Promise<ISwarmMessgaeEncryptedCache> => {
    return this.startEncryptedCache(CONNECTION_BRIDGE_STORAGE_DATABASE_PREFIX.DATABASE_LIST_STORAGE);
  };

  protected getSwarmStoreConnectionProviderOptionsFromCurrentOptions(): PO {
    const { swarmConnection } = this;

    if (!swarmConnection) {
      throw new Error('There is no swarm connection provider');
    }
    return this.getSwarmStoreConnectionProviderOptions(swarmConnection);
  }

  protected getMessageConstructorOptionsForMessageStoreFromCurrentOptions(): ISwarmMessageDatabaseConstructors<
    PromiseResolveType<ReturnType<NonNullable<MCF>>>
  > {
    const { messageConstructor } = this;
    if (!messageConstructor) {
      throw new Error('There is no message constructor defined');
    }
    return {
      default: messageConstructor,
    };
  }

  protected getSecretStoreCredentialsOptionsForMessageStoreFromCurrentOptions(): TSecretStorageAuthorizazionOptions {
    return this.getSecretStorageAuthorizationOptions();
  }

  protected getSwarmStoreOrbitDbConnectorConstructorOptionsByConnectionBridgeOptions(
    userId: TSwarmMessageUserIdentifierSerialized,
    credentials: TSecretStorageAuthorizazionOptions,
    storageOptions: CBO['storage']
  ): TSwarmStoreConnectorConstructorOptions<ESwarmStoreConnector.OrbitDB, T, DbType> {
    return {
      userId,
      credentials,
      databases: storageOptions.databases,
      directory: storageOptions.directory,
    };
  }

  protected getSwarmStoreConnectorConstructorOptionsByConnectionBridgeOptions = (
    userId: TSwarmMessageUserIdentifierSerialized,
    credentials: TSecretStorageAuthorizazionOptions
  ): TSwarmStoreConnectorConstructorOptions<P, T, DbType> => {
    const options = this.getOptions();

    switch (options.swarmStoreConnectorType) {
      case ESwarmStoreConnector.OrbitDB:
        return this.getSwarmStoreOrbitDbConnectorConstructorOptionsByConnectionBridgeOptions(
          userId,
          credentials,
          options.storage
        ) as TSwarmStoreConnectorConstructorOptions<P, T, DbType>;
      default:
        throw new Error('Unsupported connector type');
    }
  };

  protected getConnectorMainFabricFromCurrentOptionsIfExists(): CFO | undefined {
    return this.getOptions().storage.connectorMainFabric;
  }

  protected getMainConnectorFabricUtilFromCurrentOptionsIfExists():
    | IConnectionBridgeOptionsGetMainConnectorFabric<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain>
    | undefined {
    return this.getOptions().storage.getMainConnectorFabric;
  }

  protected getUtilGetMainConnectorFabricForMessageStore(): IConnectionBridgeOptionsGetMainConnectorFabric<
    P,
    T,
    DbType,
    DBO,
    ConnectorBasic,
    PO,
    CO,
    ConnectorMain
  > {
    return this.getMainConnectorFabricUtilFromCurrentOptionsIfExists() || getMainConnectorFabricDefault;
  }

  protected createMainConnectorFabricForMessageStoreByCurrentOptions(
    userId: TSwarmMessageUserIdentifierSerialized,
    credentials: TSecretStorageAuthorizazionOptions
  ): ISwarmStoreOptionsConnectorFabric<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain> {
    if (!this.swarmStoreConnectorType) {
      throw new Error('Swarm store connector type should be defined');
    }
    const swarmStoreConnectorOptions = this.getSwarmStoreConnectorConstructorOptionsByConnectionBridgeOptions(
      userId,
      credentials
    );

    return this.getUtilGetMainConnectorFabricForMessageStore()(swarmStoreConnectorOptions) as TConnectionBridgeCFODefault<
      P,
      T,
      DbType,
      DBO,
      ConnectorBasic,
      PO,
      CO,
      ConnectorMain,
      CFO
    >;
  }

  protected getMainConnectorFabricForSwarmMessageStore(
    userId: TSwarmMessageUserIdentifierSerialized,
    credentials: TSecretStorageAuthorizazionOptions
  ): CFO | ISwarmStoreOptionsConnectorFabric<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain> {
    return (
      this.getConnectorMainFabricFromCurrentOptionsIfExists() ||
      this.createMainConnectorFabricForMessageStoreByCurrentOptions(userId, credentials)
    );
  }

  protected async getSwarmMessageStoreOptions(): Promise<
    ISwarmMessageStoreOptionsWithConnectorFabric<
      P,
      T,
      DbType,
      DBO,
      ConnectorBasic,
      PO,
      CO,
      ConnectorMain,
      TConnectionBridgeCFODefault<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain, CFO>,
      MSI,
      GAC,
      MCF,
      ACO
    >
  > {
    const { swarmStoreConnectorType } = this;

    if (!swarmStoreConnectorType) {
      throw new Error('Connector type is not defined');
    }

    const { storage: storageOptions } = this.getOptions();
    const { accessControl, directory, databases } = storageOptions;
    const credentials = this.getSecretStoreCredentialsOptionsForMessageStoreFromCurrentOptions();
    const userId = this.getCurrentUserIdentityFromCurrentConnectionToCentralAuthority();

    return {
      provider: swarmStoreConnectorType,
      directory,
      databases,
      credentials,
      userId,
      accessControl,
      messageConstructors: this.getMessageConstructorOptionsForMessageStoreFromCurrentOptions(),
      databasesListStorage: await this.startEncryptedCache(CONNECTION_BRIDGE_STORAGE_DATABASE_PREFIX.DATABASE_LIST_STORAGE),
      swarmMessageConstructorFabric: this.swarmMessageConstructorFabric,
      providerConnectionOptions: this.getSwarmStoreConnectionProviderOptionsFromCurrentOptions(),
      connectorFabric: this.getMainConnectorFabricForSwarmMessageStore(userId, credentials) as TConnectionBridgeCFODefault<
        P,
        T,
        DbType,
        DBO,
        ConnectorBasic,
        PO,
        CO,
        ConnectorMain,
        CFO
      >,
    };
  }

  /**
   * set options for the message storage
   *
   * @protected
   * @memberof ConnectionBridge
   * @throws
   */
  protected async getOptionsMessageStorage(): Promise<O> {
    const optionsStorage = await this.getSwarmMessageStoreOptions();

    return optionsStorage as O;
  }

  protected createSensitiveDataStorageInstance(): ISensitiveDataSessionStorage {
    return new SensitiveDataSessionStorage();
  }

  protected async connectSensitiveDataStoreConnectionBridgeSession(userDataStore: ISensitiveDataSessionStorage) {
    await userDataStore.connect(CONNECTION_BRIDGE_OPTIONS_DEFAULT_USER_SENSITIVE_DATA_STORE_OPTIONS);
  }

  protected async createSessionSensitiveDataStoreForConnectionBridgeSession(): Promise<ISensitiveDataSessionStorage> {
    const connectionBridgeSessoinSensitiveDataStore = this.createSensitiveDataStorageInstance();
    await this.connectSensitiveDataStoreConnectionBridgeSession(connectionBridgeSessoinSensitiveDataStore);
    return connectionBridgeSessoinSensitiveDataStore;
  }

  protected async createAndSetSessionSensitiveDataStoreForConnectionBridgeSessionIfNotExists() {
    if (!this.userSensitiveDataStore) {
      this.userSensitiveDataStore = await this.createSessionSensitiveDataStoreForConnectionBridgeSession();
    }
  }

  protected setOptions(options: CBO): void {
    this.options = options;
  }

  protected checkUserDataStoreIsReady(): this is {
    userSensitiveDataStore: ISensitiveDataSessionStorage;
  } {
    const { userSensitiveDataStore: userDataStore } = this;
    if (!userDataStore) {
      throw new Error('User data store is not initialized');
    }
    return true;
  }

  protected getAcitveUserSensitiveDataStore(): ISensitiveDataSessionStorage {
    if (this.checkUserDataStoreIsReady()) {
      return this.userSensitiveDataStore;
    }
    throw new Error('User sensitive data store is not initialized');
  }

  protected async setValueInCurrentActiveUserSensitiveDataStore(
    key: CONNECTION_BRIDGE_SESSION_STORAGE_KEYS,
    value: unknown
  ): Promise<void> {
    return this.getAcitveUserSensitiveDataStore().setItem(key, value);
  }

  protected readUserLoginKeyValueFromConnectionBridgeSessionDataStore(
    userSensitiveDataStore: ISensitiveDataSessionStorage
  ): unknown {
    return userSensitiveDataStore.getItem(CONNECTION_BRIDGE_SESSION_STORAGE_KEYS.USER_LOGIN);
  }

  protected async readUserLoginFromConnectionBridgeSessionStore(): Promise<string | undefined> {
    const userLogin = await this.readUserLoginKeyValueFromConnectionBridgeSessionDataStore(
      this.getAcitveUserSensitiveDataStore()
    );

    if (!this.isUserLogin(userLogin)) {
      return;
    }
    return userLogin;
  }

  protected async getUserLoginFromConnectionBridgeSessionDataStore(): Promise<string> {
    const login = await this.readUserLoginFromConnectionBridgeSessionStore();

    if (!login) {
      throw new Error('There is no login provided in options and no session data found to get it');
    }
    return login;
  }

  protected validateOptions(options: unknown): options is CBO {
    assert(options, 'Options must be provided');
    assert(typeof options === 'object', 'Options must be an object');
    assert((options as CBO).swarmStoreConnectorType, 'swarmStoreConnectorType should be defined');
    return true;
  }

  protected isOptionsWithCredentials(
    options: IConnectionBridgeOptions<
      P,
      T,
      DbType,
      DBO,
      ConnectorBasic,
      PO,
      CO,
      ConnectorMain,
      MSI,
      GAC,
      MCF,
      ACO,
      CFO,
      CBFO,
      any
    >
  ): options is IConnectionBridgeOptions<
    P,
    T,
    DbType,
    DBO,
    ConnectorBasic,
    PO,
    CO,
    ConnectorMain,
    MSI,
    GAC,
    MCF,
    ACO,
    CFO,
    CBFO,
    true
  > {
    return !!options.auth.credentials?.login;
  }

  protected async setOptionsWithUserCredentialsProvided(
    options: IConnectionBridgeOptions<
      P,
      T,
      DbType,
      DBO,
      ConnectorBasic,
      PO,
      CO,
      ConnectorMain,
      MSI,
      GAC,
      MCF,
      ACO,
      CFO,
      CBFO,
      true
    >
  ): Promise<void> {
    await this.setValueInCurrentActiveUserSensitiveDataStore(
      CONNECTION_BRIDGE_SESSION_STORAGE_KEYS.USER_LOGIN,
      options.auth.credentials.login
    );
    this.setOptions(options as CBO);
  }

  protected async setCurrentOptionsWithoutUserCredentials(
    options: IConnectionBridgeOptions<
      P,
      T,
      DbType,
      DBO,
      ConnectorBasic,
      PO,
      CO,
      ConnectorMain,
      MSI,
      GAC,
      MCF,
      ACO,
      CFO,
      CBFO,
      false
    >
  ): Promise<void> {
    assert(options.auth.session, 'A session must be started if there is no credentials provided');

    const login = await this.getUserLoginFromConnectionBridgeSessionDataStore();

    if (!login) {
      throw new Error('There is no login provided in options and no session data found to get it');
    }
    this.options = {
      ...options,
      auth: {
        ...options.auth,
        credentials: {
          ...options.auth.credentials,
          login,
        },
      },
    } as CBO;
  }

  /**
   *
   *
   * @protected
   * @param {IConnectionBridgeOptions<P>} options
   * @memberof ConnectionBridge
   * @throws
   */
  protected async validateAndSetOptions(options: CBO): Promise<void> {
    this.validateOptions(options);
    if (this.isOptionsWithCredentials(options)) {
      await this.setOptionsWithUserCredentialsProvided(options);
    } else {
      await this.setCurrentOptionsWithoutUserCredentials(
        options as IConnectionBridgeOptions<
          P,
          T,
          DbType,
          DBO,
          ConnectorBasic,
          PO,
          CO,
          ConnectorMain,
          MSI,
          GAC,
          MCF,
          ACO,
          CFO,
          CBFO,
          false
        >
      );
    }
  }

  protected getSensitiveDataStoragePrefixForSession(
    sessionParams: ISensitiveDataSessionStorageOptions,
    userLogin: string
  ): string | undefined {
    return sessionParams.storagePrefix
      ? `${sessionParams.storagePrefix}${CONNECTION_BRIDGE_DATA_STORAGE_DATABASE_NAME_PREFIX_DELIMETER}${userLogin}`
      : undefined;
  }

  protected async connectToSensitiveDataStorage(
    sensitiveDataStorageParams: ISensitiveDataSessionStorageOptions,
    userLogin: string
  ): Promise<ISensitiveDataSessionStorage> {
    const sessionDataStorage = this.createSensitiveDataStorageInstance();
    await sessionDataStorage.connect({
      ...sensitiveDataStorageParams,
      storagePrefix: this.getSensitiveDataStoragePrefixForSession(sensitiveDataStorageParams, userLogin),
    });
    return sessionDataStorage;
  }

  protected setCurrentSessionSensitiveDataStorage(sessionSensitiveStorage: ISensitiveDataSessionStorage): void {
    this.sessionSensitiveStorage = sessionSensitiveStorage;
  }

  protected async createMainSensitiveDataStorageForSession(
    sensitiveDataStorageOptions: ISensitiveDataSessionStorageOptions,
    userLogin: string
  ): Promise<ISensitiveDataSessionStorage> {
    if (!sensitiveDataStorageOptions) {
      throw new Error('Params for the sensitive data storage should be defined to start the session');
    }
    return this.connectToSensitiveDataStorage(sensitiveDataStorageOptions, userLogin);
  }

  /**
   * start session if options provided
   *
   * @protected
   * @param {ISensitiveDataSessionStorageOptions} sessionParams
   * @memberof ConnectionBridge
   * @throws
   */
  protected async createAndSetSensitiveDataStorageForMainSession(
    sensitiveDataStorageOptions: ISensitiveDataSessionStorageOptions,
    userLogin: string
  ): Promise<void> {
    this.setCurrentSessionSensitiveDataStorage(
      await this.createMainSensitiveDataStorageForSession(sensitiveDataStorageOptions, userLogin)
    );
  }

  protected async createCentralAuthorityInstnace(optionsCentralAuthority: ICentralAuthorityOptions): Promise<ICentralAuthority> {
    const centralAuthority = new CentralAuthority();
    const connectionResult = await centralAuthority.connect(optionsCentralAuthority);

    if (connectionResult instanceof Error) {
      throw connectionResult;
    }
    return centralAuthority;
  }

  protected setCurrentCentralAuthorityConnection(centralAuthority: ICentralAuthority) {
    this.centralAuthorityConnection = centralAuthority;
  }

  /**
   *
   *
   * @protected
   * @memberof ConnectionBridge
   * @throws
   */
  protected async createAndStartConnectionWithCentralAuthority(): Promise<ICentralAuthority> {
    const optioinsCA = this.createOptionsCentralAuthority();

    this.setOptionsCentralAuthority(optioinsCA);
    return this.createCentralAuthorityInstnace(optioinsCA);
  }

  protected setCurrentSwarmMessageConstructor(swarmMessageConstructor: ISwarmMessageConstructor): void {
    this.messageConstructor = swarmMessageConstructor as PromiseResolveType<ReturnType<NonNullable<MCF>>>;
  }

  /**
   * create the default message construtor
   *
   * @protected
   * @memberof ConnectionBridge
   * @throws
   */
  protected async createSwarmMessageConstructor(): Promise<ISwarmMessageConstructor> {
    if (!this.swarmMessageConstructorFabric) {
      throw new Error('Swarm message constructor fabric must be created before');
    }
    return this.swarmMessageConstructorFabric(this.createOptionsMessageConstructor());
  }

  protected createNativeConnection = (): Promise<TNativeConnectionType<P>> => {
    if (!this.swarmStoreConnectorType) {
      throw new Error('Swarm store connector type should be defined');
    }
    if (!this.options?.nativeConnection) {
      throw new Error('There is no options for the native connection');
    }

    return createNativeConnection(this.swarmStoreConnectorType, this.options.nativeConnection);
  };

  protected setCurrentSwarmConnection = (swarmConnection: IConnectionBridgeSwarmConnection<P, NC>): void => {
    this.swarmConnection = swarmConnection;
  };

  /**
   * create connection to the swarm through the
   * provider.
   *
   * @protected
   * @memberof ConnectionBridge
   */
  protected async createSwarmConnection(): Promise<IConnectionBridgeSwarmConnection<P, NC>> {
    const nativeConnection = await this.createNativeConnection();

    return {
      getNativeConnection() {
        return nativeConnection;
      },
    } as IConnectionBridgeSwarmConnection<P, NC>;
  }

  protected getUserCredentialsFromOptions(): Pick<ICentralAuthorityUserCredentials, 'cryptoCredentials' | 'login' | 'password'> {
    const { auth } = this.getOptions();
    const { credentials } = auth;

    if (!credentials) {
      throw new Error('Credentials should be defined');
    }
    return credentials as Pick<ICentralAuthorityUserCredentials, 'cryptoCredentials' | 'login' | 'password'>;
  }

  protected getUserLoginFromOptions(): string {
    return this.getUserCredentialsFromOptions().login;
  }

  protected getUserPasswordFromOptions(): string | undefined {
    return this.getUserCredentialsFromOptions().password;
  }

  protected getOptionsSwarmMessageEncryptedCache(userLogin: string): TSecretStorageAuthOptionsCredentials {
    const userPassword = this.getUserPasswordFromOptions();

    if (!userPassword && !this.sessionSensitiveStorage) {
      throw new Error('Session with user secret key or password shoul exists');
    }
    return {
      login: userLogin,
      password: userPassword,
      session: this.sessionSensitiveStorage,
    } as TSecretStorageAuthOptionsCredentials;
  }

  protected getDatabaseNamePrefixForEncryptedCahce(userLogin: string): string {
    return `__${CONNECTION_BRIDGE_STORAGE_DATABASE_PREFIX.MESSAGE_CACHE_STORAGE}${CONNECTION_BRIDGE_DATA_STORAGE_DATABASE_NAME_PREFIX_DELIMETER}${userLogin}`;
  }

  protected setCurrentSwarmMessageEncryptedCacheFabric(
    swarmMessageEncryptedCacheFabric: ISwarmMessageEncryptedCacheFabric
  ): void {
    this.swarmMessageEncryptedCacheFabric = swarmMessageEncryptedCacheFabric;
  }

  protected async createSwarmMessageEncryptedCacheFabric(): Promise<ISwarmMessageEncryptedCacheFabric> {
    const userLogin = this.getUserLoginFromOptions();
    return getSwarmMessageEncryptedCacheFabric(
      this.getOptionsSwarmMessageEncryptedCache(userLogin),
      this.getDatabaseNamePrefixForEncryptedCahce(userLogin)
    );
  }

  protected getSwarmMessageConstructorOptions() {
    if (!this.centralAuthorityConnection) {
      throw new Error('Connection to the Central authority should exists');
    }
    return {
      caConnection: this.centralAuthorityConnection,
      instances: {},
    };
  }

  protected setCurrentSwarmMessageConstructorFabric(
    swarmMessageConstructorFabric: ISwarmMessageConstructorWithEncryptedCacheFabric
  ): void {
    this.swarmMessageConstructorFabric = swarmMessageConstructorFabric as MCF;
  }

  protected async createSwarmMessageConstructorFabric(): Promise<ISwarmMessageConstructorWithEncryptedCacheFabric> {
    const userLogin = this.getUserLoginFromOptions();
    return getSwarmMessageConstructorWithCacheFabric(
      this.getOptionsSwarmMessageEncryptedCache(userLogin),
      this.getSwarmMessageConstructorOptions(),
      this.getDatabaseNamePrefixForEncryptedCahce(userLogin)
    );
  }

  protected getDatabaseNameForEncryptedCacheInstance(dbNamePrefix: string): string {
    const userLogin = this.getUserLoginFromOptions();
    return `${dbNamePrefix}${CONNECTION_BRIDGE_DATA_STORAGE_DATABASE_NAME_PREFIX_DELIMETER}${userLogin}`;
  }

  protected getOptionsForSwarmMessageEncryptedFabric(dbNamePrefix: string) {
    return {
      dbName: this.getDatabaseNameForEncryptedCacheInstance(dbNamePrefix),
    };
  }

  protected startEncryptedCache(dbNamePrefix: string): Promise<ISwarmMessgaeEncryptedCache> {
    if (!this.swarmMessageEncryptedCacheFabric) {
      throw new Error('Encrypted cache fabric must be started before');
    }

    const optionsForSwarmMessageEncryptedCacheFabric = this.getOptionsForSwarmMessageEncryptedFabric(dbNamePrefix);

    return this.swarmMessageEncryptedCacheFabric(optionsForSwarmMessageEncryptedCacheFabric);
  }

  protected setCurrentSwarmMessageEncryptedCache(swarmMessageEncryptedCache: ISwarmMessgaeEncryptedCache): void {
    this.swarmMessageEncryptedCache = swarmMessageEncryptedCache;
  }

  protected async createSwarmMessageEncryptedCache(): Promise<ISwarmMessgaeEncryptedCache> {
    if (!this.swarmMessageEncryptedCacheFabric) {
      throw new Error('Encrypted cache fabric must be started before');
    }
    return this.startEncryptedCache(CONNECTION_BRIDGE_STORAGE_DATABASE_NAME.MESSAGE_CACHE_STORAGE);
  }

  protected createSwarmMessageStoreInstance = (): ISwarmMessageStore<
    P,
    T,
    DbType,
    DBO,
    ConnectorBasic,
    PO,
    CO,
    ConnectorMain,
    TConnectionBridgeCFODefault<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain, CFO>,
    MSI,
    GAC,
    MCF,
    ACO,
    O
  > => {
    return new SwarmMessageStore<
      P,
      T,
      DbType,
      DBO,
      ConnectorBasic,
      PO,
      CO,
      ConnectorMain,
      TConnectionBridgeCFODefault<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain, CFO>,
      MSI,
      GAC,
      MCF,
      ACO,
      O,
      E,
      DBL
    >();
  };

  protected connectToSwarmMessageStore = async (
    swarmMessageStorage: ISwarmMessageStore<
      P,
      T,
      DbType,
      DBO,
      ConnectorBasic,
      PO,
      CO,
      ConnectorMain,
      TConnectionBridgeCFODefault<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain, CFO>,
      MSI,
      GAC,
      MCF,
      ACO,
      O
    >
  ): Promise<void> => {
    const swarmMessageStorageOptions = await this.getOptionsMessageStorage();
    const result = await swarmMessageStorage.connect(swarmMessageStorageOptions);

    if (result instanceof Error) {
      throw result;
    }
  };

  protected setCurrentSwarmMessageStorage = (
    swarmMessageStorage: ISwarmMessageStore<
      P,
      T,
      DbType,
      DBO,
      ConnectorBasic,
      PO,
      CO,
      ConnectorMain,
      TConnectionBridgeCFODefault<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain, CFO>,
      MSI,
      GAC,
      MCF,
      ACO,
      O
    >
  ): void => {
    this.swarmMessageStore = swarmMessageStorage;
  };

  /**
   * start connection with the SwarmMessage storage
   *
   * @protected
   * @memberof ConnectionBridge
   * @throws
   */
  protected async createAndStartSwarmMessageStorageConnection(): Promise<
    ISwarmMessageStore<
      P,
      T,
      DbType,
      DBO,
      ConnectorBasic,
      PO,
      CO,
      ConnectorMain,
      TConnectionBridgeCFODefault<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain, CFO>,
      MSI,
      GAC,
      MCF,
      ACO,
      O
    >
  > {
    const swarmMessageStorage = this.createSwarmMessageStoreInstance();

    await this.connectToSwarmMessageStore(swarmMessageStorage);
    return swarmMessageStorage;
  }

  /**
   * close the connection with the swarm message storage
   * and release the instance and options;
   *
   * @protected
   * @returns {Promise<void>}
   * @memberof ConnectionBridge
   */
  protected async closeStorage(): Promise<void> {
    const { swarmMessageStore: storage } = this;

    if (storage) {
      try {
        await storage.close();
      } catch (err) {
        console.error('Failed to close the connection to the swarm message storage', err);
      }
    } else {
      console.warn('closeSwarmMessageStorage - there is no connection');
    }
    this.swarmMessageStore = undefined;
    this.optionsMessageStorage = undefined;
  }

  /**
   * close the default constructor of a swarm messages,
   * release it's options and the instance.
   *
   * @protected
   * @memberof ConnectionBridge
   */
  protected async closeMessageConstructor(): Promise<void> {
    this.messageConstructor = undefined;
    this.optionsMessageConstructor = undefined;
  }

  /**
   * close the connection to the swarm and release the instance
   * and settings.
   *
   * @protected
   * @returns {Promise<void>}
   * @memberof ConnectionBridge
   */
  protected async closeSwarmConnection(): Promise<void> {
    const { swarmConnection } = this;

    if (swarmConnection) {
      const nativeConnection = swarmConnection.getNativeConnection();

      try {
        await (nativeConnection as IPFS).stop();
      } catch (error) {
        console.error('closeSwarmConnection failed to stop the ipfs node!', error);
      }
    }
    this.swarmConnection = undefined;
    this.optionsSwarmConnection = undefined;
  }

  /**
   * close the instance of the fabric
   *
   * @protected
   * @memberof ConnectionBridge
   */
  protected async closeSwarmMessageEncryptedCacheFabric() {
    this.swarmMessageEncryptedCacheFabric = undefined;
  }

  /**
   * close the instance of the fabric
   *
   * @protected
   * @memberof ConnectionBridge
   */
  protected async closeSwarmMessageConstructorFabric() {
    this.swarmMessageConstructorFabric = undefined as MCF;
  }

  /**
   * close the connection to the central authority
   *
   * @protected
   * @returns {Promise<void>}
   * @memberof ConnectionBridge
   */
  protected async closeCurrentCentralAuthorityConnection(): Promise<void> {
    const { centralAuthorityConnection: caConnection } = this;

    if (caConnection) {
      try {
        await caConnection.disconnect();
      } catch (err) {
        console.error('closeCentralAuthorityConnection failed to close the connection to the central authority', err);
      }
    }
    this.centralAuthorityConnection = undefined;
    this.optionsCentralAuthority = undefined;
  }

  protected async setFlagInSessionStorageSessionDataIsExists(): Promise<void> {
    if (!this.sessionSensitiveStorage) {
      throw new Error('Session sensitive storage is not exists for the current session');
    }
    await this.sessionSensitiveStorage.setItem(CONNECTION_BRIDGE_SESSION_STORAGE_KEYS.SESSION_DATA_AVAILABLE, true);
  }

  /**
   * set that authorized before in the session
   * data, if it's available
   *
   * @protected
   * @memberof ConnectionBridge
   */
  protected async markSessionAsStartedInStorageForSession() {
    await this.setFlagInSessionStorageSessionDataIsExists();
  }

  protected getSecretStorageDBName(): string {
    const userLogin = this.getUserLoginFromOptions();
    return `${CONNECTION_BRIDGE_STORAGE_DATABASE_PREFIX.SECRET_STORAGE}${CONNECTION_BRIDGE_DATA_STORAGE_DATABASE_NAME_PREFIX_DELIMETER}${userLogin}`;
  }

  protected getSecretStorageDBOptions(): Partial<IStorageProviderOptions> {
    return {
      dbName: this.getSecretStorageDBName(),
    };
  }

  protected getSecretStorageSessionOptions(): ISecretStoreCredentialsSession {
    const { sessionSensitiveStorage } = this;

    if (!sessionSensitiveStorage) {
      throw new Error('sessionSensitiveStorage is not defined');
    }
    return {
      session: sessionSensitiveStorage,
    };
  }

  protected getSecretStorageCredentials(options: CBO): ISecretStoreCredentials {
    const {
      auth: { credentials },
    } = options;

    if (!credentials) {
      throw new Error('Credentials should be defined to authorize in SecretStorage');
    }
    if (!credentials.login) {
      throw new Error('Login must be provided to authorize in SecretStorage');
    }
    if (!credentials.password) {
      throw new Error('Password must be provided to authorize in SecretStorage');
    }
    return credentials as ISecretStoreCredentials;
  }

  protected getSecretStorageAuthorizationOptions(): TSecretStorageAuthorizazionOptions {
    if (!this.checkCurrentOptionsIsDefined()) {
      throw new Error('Options should be defined');
    }

    const { options } = this;

    if (!this.isOptionsWithCredentials(options)) {
      return this.getSecretStorageSessionOptions();
    }
    return this.getSecretStorageCredentials(options);
  }

  protected createSecretStorageInstance(): ISecretStorage {
    return new SecretStorage();
  }

  protected async authorizeInSecretStorage(secretStorage: ISecretStorage): Promise<void> {
    const authResult = await secretStorage.authorize(
      this.getSecretStorageAuthorizationOptions(),
      this.getSecretStorageDBOptions()
    );
    if (authResult !== true) {
      throw authResult === false ? new Error('Conntection to the secret storage failed') : authResult;
    }
  }

  protected setCurrentSecretStorageInstance(secretStorage: ISecretStorage): void {
    this._secretStorage = secretStorage;
  }

  protected async createAndAutorizeInSecretStorage(): Promise<ISecretStorage> {
    const secretStorage = this.createSecretStorageInstance();

    await this.authorizeInSecretStorage(secretStorage);
    return secretStorage;
  }

  protected isConnectionBridgeOptionsWithSession(options: ISensitiveDataSessionStorageOptions | CBO): options is CBO {
    return !!(options as CBO).auth?.session;
  }

  protected getSessionParamsOrUndefinedFromConnectionBridgeOrSensitiveDataSessionStorageOptions(
    options?: ISensitiveDataSessionStorageOptions | CBO
  ): ISensitiveDataSessionStorageOptions | undefined {
    if (!options) {
      return undefined;
    }
    return this.isConnectionBridgeOptionsWithSession(options) ? options.auth.session : options;
  }

  protected async whetherAnySessionDataExistsInSensitiveDataSessionStorage(
    sensitiveDataStorage: ISensitiveDataSessionStorage
  ): Promise<boolean> {
    return !!(await sensitiveDataStorage.getItem(CONNECTION_BRIDGE_SESSION_STORAGE_KEYS.SESSION_DATA_AVAILABLE));
  }

  protected async createAndSetSequentlyDependenciesInstances() {
    this.setCurrentCentralAuthorityConnection(await this.createAndStartConnectionWithCentralAuthority());
    this.setCurrentSwarmMessageEncryptedCacheFabric(await this.createSwarmMessageEncryptedCacheFabric());
    this.setCurrentSwarmMessageConstructorFabric(await this.createSwarmMessageConstructorFabric());
    this.setCurrentSwarmMessageEncryptedCache(await this.createSwarmMessageEncryptedCache());
    this.setCurrentSwarmMessageConstructor(await this.createSwarmMessageConstructor());
    this.setCurrentSwarmConnection(await this.createSwarmConnection());
    this.setCurrentSwarmMessageStorage(await this.createAndStartSwarmMessageStorageConnection());
  }
}
