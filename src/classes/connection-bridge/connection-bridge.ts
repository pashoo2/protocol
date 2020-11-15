// @ts-nocheck
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
  ISwarmMessageStoreOptionsWithConnectorFabric,
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
  CONNECTION_BRIDGE_OPTIONS_DEFAULT_USER_SENSITIVE_DATA_STORE,
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
import { IConnectionBridgeSwarmConnection, TNativeConnectionOptions } from './connection-bridge.types';
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
  ConnectorBasic extends ISwarmStoreConnectorBasic<P, T, DbType>,
  PO extends TSwarmStoreConnectorConnectionOptions<P, T, DbType, ConnectorBasic>,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>,
  CO extends ISwarmStoreProviderOptions<P, T, DbType, ConnectorBasic, PO>,
  ConnectorMain extends ISwarmStoreConnector<P, T, DbType, ConnectorBasic, PO, DBO>,
  CFO extends ISwarmStoreOptionsConnectorFabric<P, T, DbType, ConnectorBasic, PO, CO, DBO, ConnectorMain>,
  MSI extends TSwarmMessageInstance | T,
  GAC extends TSwarmMessagesStoreGrantAccessCallback<P, MSI>,
  MCF extends ISwarmMessageConstructorWithEncryptedCacheFabric | undefined,
  ACO extends ISwarmMessageStoreAccessControlOptions<P, T, MSI, GAC> | undefined,
  O extends ISwarmMessageStoreOptionsWithConnectorFabric<
    P,
    T,
    DbType,
    ConnectorBasic,
    PO,
    CO,
    DBO,
    ConnectorMain,
    CFO,
    MSI,
    GAC,
    MCF,
    ACO
  >,
  NC extends TNativeConnectionType<P>,
  CD extends boolean = true,
  E extends ISwarmMessageStoreEvents<P, T, DBO> = ISwarmMessageStoreEvents<P, T, DBO>,
  DBL extends TSwarmStoreOptionsOfDatabasesKnownList<P, T, DBO> = TSwarmStoreOptionsOfDatabasesKnownList<P, T, DBO>
> implements IConnectionBridge<P, T, DbType, ConnectorBasic, PO, DBO, CO, ConnectorMain, CFO, MSI, GAC, MCF, ACO, O, CD> {
  public centralAuthorityConnection?: ICentralAuthority;

  public swarmMessageStore?: ISwarmMessageStore<
    P,
    T,
    DbType,
    ConnectorBasic,
    PO,
    DBO,
    CO,
    ConnectorMain,
    CFO,
    MSI,
    GAC,
    MCF,
    ACO,
    O
  >;

  public messageConstructor?: ISwarmMessageConstructor;

  public swarmMessageEncryptedCacheFabric?: ISwarmMessageEncryptedCacheFabric;

  public swarmMessageConstructorFabric?: ISwarmMessageConstructorWithEncryptedCacheFabric;

  public get secretStorage() {
    return this._secretStorage;
  }

  protected swarmStoreConnectorType?: P;

  protected options?: IConnectionBridgeOptions<P, T, DbType, ConnectorBasic, PO, DBO, CO, ConnectorMain, MSI, GAC, MCF, ACO, CD>;

  protected optionsCentralAuthority?: ICentralAuthorityOptions;

  protected optionsMessageConstructor?: TSwarmMessageConstructorOptions;

  protected optionsSwarmConnection?: TNativeConnectionOptions<P>;

  protected optionsMessageStorage?: ISwarmMessageStoreOptions<P, T, DbType, ConnectorBasic, PO, MSI, GAC, MCF, ACO>;

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
  public async connect(
    options: IConnectionBridgeOptions<P, T, DbType, ConnectorBasic, PO, DBO, CO, ConnectorMain, MSI, GAC, MCF, ACO, CD>
  ): Promise<void> {
    this.createAndSetCurrentActiveUserSensitiveDataStoreIfNotExists();
    try {
      await this.validateAndSetOptions(options);

      const { sensitiveDataStorageOptions } = this;

      if (sensitiveDataStorageOptions) {
        await this.createAndSetSensitiveDataStorageForSession(sensitiveDataStorageOptions);
      }
      this.createAndSetSequentlyNeccesaryInstances();
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
  public async checkSessionAvailable(
    options?:
      | ISensitiveDataSessionStorageOptions
      | IConnectionBridgeOptions<P, T, DbType, ConnectorBasic, PO, DBO, CO, ConnectorMain, MSI, GAC, MCF, ACO, CD>
  ) {
    const sessionParams = this.getSessionParamsOrUndefinedFromConnectionBridgeOrSensitiveDataSessionStorageOptions(options);

    if (!sessionParams) {
      return false;
    }

    const userSensitiveDataStore = await this.createActiveCurrentUserSensitiveDataStore();
    if (!(await this.readValueFromUserDataStoreForUserLoginKey(userSensitiveDataStore))) {
      return false;
    }

    const sensitiveDataStorage = await this.createSensitiveDataStorageForSession({
      ...sessionParams,
      // do not clear data from the storage becuse it can be used later
      clearStorageAfterConnect: false,
    });

    return await this.whetherAnySessionDataExistsInSensitiveDataSessionStorage(sensitiveDataStorage);
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

  protected checkCurrentOptionsIsDefined(): this is {
    options: IConnectionBridgeOptions<P, T, DbType, ConnectorBasic, PO, DBO, CO, ConnectorMain, MSI, GAC, MCF, ACO, CD>;
  } {
    if (!this.options) {
      throw new Error('Options should be defined');
    }
    return true;
  }

  protected getOptions(): IConnectionBridgeOptions<
    P,
    T,
    DbType,
    ConnectorBasic,
    PO,
    DBO,
    CO,
    ConnectorMain,
    MSI,
    GAC,
    MCF,
    ACO,
    CD
  > {
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

  /**
   * set options for the SwarmConnection provider
   *
   * @protected
   * @memberof ConnectionBridge
   */
  protected setOptionsSwarmConnection() {}

  protected getConnectorBasicFabricToUseInSwarmStoreConnectionProviderOptionsForSwarmStoreConnector(): TSwarmStoreConnectorBasicFabric<
    P,
    T,
    DbType,
    ConnectorBasic
  > {
    return (this.options?.storage.connectorBasicFabric ?? connectorBasicFabricOrbitDBDefault) as TSwarmStoreConnectorBasicFabric<
      P,
      T,
      DbType,
      ConnectorBasic
    >;
  }

  protected getSwarmStoreConnectionProviderOptions<SC extends IConnectionBridgeSwarmConnection<P, NC>>(
    swarmConnection: SC
  ): TSwarmStoreConnectorConnectionOptions<P, T, DbType, ConnectorBasic> {
    const { swarmStoreConnectorType } = this;

    if (!swarmStoreConnectorType) {
      throw new Error('Uknown connector type');
    }

    const connectorBasicFabric = this.getConnectorBasicFabricToUseInSwarmStoreConnectionProviderOptionsForSwarmStoreConnector();
    const swarmStoreConnectionProviderOptions = getSwarmStoreConnectionProviderOptionsForSwarmStoreConnector<
      P,
      T,
      DbType,
      ConnectorBasic,
      NC,
      SC
    >(swarmStoreConnectorType, swarmConnection, connectorBasicFabric);

    return swarmStoreConnectionProviderOptions;
  }

  protected getCurrentUserIdentityFromCurrentConnectionToCentralAuthority(): string {
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

  protected getSwarmStoreConnectionProviderOptionsFromCurrentOptions(): TSwarmStoreConnectorConnectionOptions<
    P,
    T,
    DbType,
    ConnectorBasic
  > {
    const { swarmConnection } = this;

    if (!swarmConnection) {
      throw new Error('There is no swarm connection provider');
    }
    return this.getSwarmStoreConnectionProviderOptions(swarmConnection);
  }

  protected getMessageConstructorOptionsForMessageStoreFromCurrentOptions(): {
    default: ISwarmMessageConstructor;
  } {
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

  protected getConnectorFabricForMessageStoreFromCurrentOptions(): CFO {
    return;
  }

  /**
   * set options for the message storage
   *
   * @protected
   * @memberof ConnectionBridge
   * @throws
   */
  protected async getOptionsMessageStorage(): Promise<O> {
    const { storage: storageOptions } = this.getOptions();
    const messageStorageOptions: O = {
      ...storageOptions,
      credentials: this.getSecretStoreCredentialsOptionsForMessageStoreFromCurrentOptions(),
      userId: this.getCurrentUserIdentityFromCurrentConnectionToCentralAuthority(),
      databasesListStorage: await this.startEncryptedCache(CONNECTION_BRIDGE_STORAGE_DATABASE_PREFIX.DATABASE_LIST_STORAGE),
      swarmMessageConstructorFabric: this.swarmMessageConstructorFabric,
      messageConstructors: this.getMessageConstructorOptionsForMessageStoreFromCurrentOptions(),
      providerConnectionOptions: this.getSwarmStoreConnectionProviderOptionsFromCurrentOptions(),
      connectorFabric: this.getConnectorFabricForMessageStoreFromCurrentOptions(),
    };

    return messageStorageOptions;
  }

  protected createSensitiveDataStorageInstance(): ISensitiveDataSessionStorage {
    return new SensitiveDataSessionStorage();
  }

  protected async connectUserSensitiveDataStore(userDataStore: ISensitiveDataSessionStorage) {
    await userDataStore.connect(CONNECTION_BRIDGE_OPTIONS_DEFAULT_USER_SENSITIVE_DATA_STORE);
  }

  protected async createActiveCurrentUserSensitiveDataStore(): Promise<ISensitiveDataSessionStorage> {
    const userSensitiveDataStore = this.createSensitiveDataStorageInstance();
    await this.connectUserSensitiveDataStore(userSensitiveDataStore);
    return userSensitiveDataStore;
  }

  protected async createAndSetCurrentActiveUserSensitiveDataStoreIfNotExists() {
    if (!this.userSensitiveDataStore) {
      this.userSensitiveDataStore = await this.createActiveCurrentUserSensitiveDataStore();
    }
  }

  protected setSwarmStoreConnectorType(swarmStoreConnectorType: P): void {
    this.swarmStoreConnectorType = swarmStoreConnectorType;
  }

  protected setOptions(
    options: IConnectionBridgeOptions<P, T, DbType, ConnectorBasic, PO, DBO, CO, ConnectorMain, MSI, GAC, MCF, ACO, CD>
  ): void {
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

  protected readValueFromUserDataStoreForUserLoginKey(userSensitiveDataStore: ISensitiveDataSessionStorage): unknown {
    return userSensitiveDataStore.getItem(CONNECTION_BRIDGE_SESSION_STORAGE_KEYS.USER_LOGIN);
  }

  protected async readUserLoginFromUserDataStore(): Promise<string | undefined> {
    const userLogin = this.readValueFromUserDataStoreForUserLoginKey(this.getAcitveUserSensitiveDataStore());

    if (!userLogin) {
      return;
    }
    if (typeof userLogin !== 'string') {
      throw new Error('User login from the user data store should be a string');
    }
    return userLogin;
  }

  protected async getUserLoginForCurrentSession(): Promise<string> {
    const login = await this.readUserLoginFromUserDataStore();

    if (!login) {
      throw new Error('There is no login provided in options and no session data found to get it');
    }
    return login;
  }

  protected validateOptions(
    options: unknown
  ): options is IConnectionBridgeOptions<P, T, DbType, ConnectorBasic, PO, DBO, CO, ConnectorMain, MSI, GAC, MCF, ACO, CD> {
    assert(options, 'Options must be provided');
    assert(typeof options === 'object', 'Options must be an object');
    assert(
      (options as IConnectionBridgeOptions<P, T, DbType, ConnectorBasic, PO, DBO, CO, ConnectorMain, MSI, GAC, MCF, ACO, CD>)
        .swarmStoreConnectorType,
      'swarmStoreConnectorType should be defined'
    );
    return true;
  }

  protected isOptionsWithCredentials(
    options: IConnectionBridgeOptions<P, T, DbType, ConnectorBasic, PO, DBO, CO, ConnectorMain, MSI, GAC, MCF, ACO, any>
  ): options is IConnectionBridgeOptions<P, T, DbType, ConnectorBasic, PO, DBO, CO, ConnectorMain, MSI, GAC, MCF, ACO, true> {
    return !!options.auth.credentials?.login;
  }

  protected async setOptionsWithUserCredentialsProvided(
    options: IConnectionBridgeOptions<P, T, DbType, ConnectorBasic, PO, DBO, CO, ConnectorMain, MSI, GAC, MCF, ACO, true>
  ): Promise<void> {
    await this.setValueInCurrentActiveUserSensitiveDataStore(
      CONNECTION_BRIDGE_SESSION_STORAGE_KEYS.USER_LOGIN,
      options.auth.credentials.login
    );
    this.setOptions(
      options as IConnectionBridgeOptions<P, T, DbType, ConnectorBasic, PO, DBO, CO, ConnectorMain, MSI, GAC, MCF, ACO, CD>
    );
  }

  protected async setCurrentOptionsWithoutUserCredentials(
    options: IConnectionBridgeOptions<P, T, DbType, ConnectorBasic, PO, DBO, CO, ConnectorMain, MSI, GAC, MCF, ACO, false>
  ): Promise<void> {
    assert(options.auth.session, 'A session must be started if there is no credentials provided');

    const login = await this.getUserLoginForCurrentSession();

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
    } as IConnectionBridgeOptions<P, T, DbType, ConnectorBasic, PO, DBO, CO, ConnectorMain, MSI, GAC, MCF, ACO, CD>;
  }

  /**
   *
   *
   * @protected
   * @param {IConnectionBridgeOptions<P>} options
   * @memberof ConnectionBridge
   * @throws
   */
  protected async validateAndSetOptions(
    options: IConnectionBridgeOptions<P, T, DbType, ConnectorBasic, PO, DBO, CO, ConnectorMain, MSI, GAC, MCF, ACO, CD>
  ): Promise<void> {
    this.validateOptions(options);
    this.setSwarmStoreConnectorType(options.swarmStoreConnectorType);
    if (this.isOptionsWithCredentials(options)) {
      this.setOptionsWithUserCredentialsProvided(options);
    } else {
      this.setCurrentOptionsWithoutUserCredentials(
        options as IConnectionBridgeOptions<P, T, DbType, ConnectorBasic, PO, DBO, CO, ConnectorMain, MSI, GAC, MCF, ACO, false>
      );
    }
  }

  protected getSensitiveDataStoragePrefixForSession(sessionParams: ISensitiveDataSessionStorageOptions): string | undefined {
    const userLogin = this.getUserLoginFromOptions();

    if (!userLogin) {
      throw new Error('User login should be defined');
    }
    return sessionParams.storagePrefix
      ? `${sessionParams.storagePrefix}${CONNECTION_BRIDGE_DATA_STORAGE_DATABASE_NAME_PREFIX_DELIMETER}${userLogin}`
      : undefined;
  }

  protected async connectToSensitiveDataStorage(
    sensitiveDataStorageParams: ISensitiveDataSessionStorageOptions
  ): Promise<ISensitiveDataSessionStorage> {
    const sessionDataStorage = this.createSensitiveDataStorageInstance();
    await sessionDataStorage.connect({
      ...sensitiveDataStorageParams,
      storagePrefix: this.getSensitiveDataStoragePrefixForSession(sensitiveDataStorageParams),
    });
    return sessionDataStorage;
  }

  protected setCurrentSessionSensitiveDataStorage(sessionSensitiveStorage: ISensitiveDataSessionStorage): void {
    this.sessionSensitiveStorage = sessionSensitiveStorage;
  }

  protected async createSensitiveDataStorageForSession(
    sensitiveDataStorageOptions: ISensitiveDataSessionStorageOptions
  ): Promise<ISensitiveDataSessionStorage> {
    if (!sensitiveDataStorageOptions) {
      throw new Error('Params for the sensitive data storage should be defined to start the session');
    }
    return this.connectToSensitiveDataStorage(sensitiveDataStorageOptions);
  }

  /**
   * start session if options provided
   *
   * @protected
   * @param {ISensitiveDataSessionStorageOptions} sessionParams
   * @memberof ConnectionBridge
   * @throws
   */
  protected async createAndSetSensitiveDataStorageForSession(
    sensitiveDataStorageOptions: ISensitiveDataSessionStorageOptions
  ): Promise<void> {
    this.setCurrentSessionSensitiveDataStorage(await this.createSensitiveDataStorageForSession(sensitiveDataStorageOptions));
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
    this.messageConstructor = swarmMessageConstructor;
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
    if (!this.options?.swarm) {
      throw new Error('There is no options for ');
    }

    return createNativeConnection(this.swarmStoreConnectorType, this.options.swarm);
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
    this.setOptionsSwarmConnection();

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

  protected getOptionsSwarmMessageEncryptedCache(): TSecretStorageAuthOptionsCredentials {
    const userPassword = this.getUserPasswordFromOptions();

    if (!userPassword && !this.sessionSensitiveStorage) {
      throw new Error('Session with user secret key or password shoul exists');
    }
    return {
      login: this.getUserLoginFromOptions(),
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
    return getSwarmMessageEncryptedCacheFabric(
      this.getOptionsSwarmMessageEncryptedCache(),
      this.getDatabaseNamePrefixForEncryptedCahce(this.getUserLoginFromOptions())
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
    this.swarmMessageConstructorFabric = swarmMessageConstructorFabric;
  }

  protected async createSwarmMessageConstructorFabric(): Promise<ISwarmMessageConstructorWithEncryptedCacheFabric> {
    return await getSwarmMessageConstructorWithCacheFabric(
      this.getOptionsSwarmMessageEncryptedCache(),
      this.getSwarmMessageConstructorOptions(),
      this.getDatabaseNamePrefixForEncryptedCahce(this.getUserLoginFromOptions())
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
    return await this.startEncryptedCache(CONNECTION_BRIDGE_STORAGE_DATABASE_NAME.MESSAGE_CACHE_STORAGE);
  }

  protected createSwarmMessageStoreInstance = (): ISwarmMessageStore<
    P,
    T,
    DbType,
    ConnectorBasic,
    PO,
    DBO,
    CO,
    ConnectorMain,
    CFO,
    MSI,
    GAC,
    MCF,
    ACO,
    O
  > => {
    return new SwarmMessageStore<P, T, DbType, ConnectorBasic, PO, DBO, CO, ConnectorMain, CFO, MSI, GAC, MCF, ACO, O, E, DBL>();
  };

  protected connectToSwarmMessageStore = async (
    swarmMessageStorage: ISwarmMessageStore<P, T, DbType, ConnectorBasic, PO, DBO, CO, ConnectorMain, CFO, MSI, GAC, MCF, ACO, O>
  ): Promise<void> => {
    const swarmMessageStorageOptions = await this.getOptionsMessageStorage();
    const result = await swarmMessageStorage.connect(swarmMessageStorageOptions);

    if (result instanceof Error) {
      throw result;
    }
  };

  protected setCurrentSwarmMessageStorage = (
    swarmMessageStorage: ISwarmMessageStore<P, T, DbType, ConnectorBasic, PO, DBO, CO, ConnectorMain, CFO, MSI, GAC, MCF, ACO, O>
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
    ISwarmMessageStore<P, T, DbType, ConnectorBasic, PO, DBO, CO, ConnectorMain, CFO, MSI, GAC, MCF, ACO, O>
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
    this.swarmMessageConstructorFabric = undefined;
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

  protected async setInSessionStorageSessionDataIsExists(): Promise<void> {
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
    this.setInSessionStorageSessionDataIsExists();
  }

  protected getSecretStorageDBName(): string {
    const userLogin = this.getUserLoginForCurrentSession();
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

  protected getSecretStorageCredentials(
    options: IConnectionBridgeOptions<P, T, DbType, ConnectorBasic, PO, DBO, CO, ConnectorMain, MSI, GAC, MCF, ACO, CD>
  ): ISecretStoreCredentials {
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

  protected getSessionParamsOrUndefinedFromConnectionBridgeOrSensitiveDataSessionStorageOptions(
    options?:
      | ISensitiveDataSessionStorageOptions
      | IConnectionBridgeOptions<P, T, DbType, ConnectorBasic, PO, DBO, CO, ConnectorMain, MSI, GAC, MCF, ACO, CD>
  ): ISensitiveDataSessionStorageOptions | undefined {
    if (!options) {
      return undefined;
    }
    return (options as IConnectionBridgeOptions<P, T, DbType, ConnectorBasic, PO, DBO, CO, ConnectorMain, MSI, GAC, MCF, ACO, CD>)
      .auth
      ? (options as IConnectionBridgeOptions<P, T, DbType, ConnectorBasic, PO, DBO, CO, ConnectorMain, MSI, GAC, MCF, ACO, CD>)
          .auth.session
      : (options as ISensitiveDataSessionStorageOptions);
  }

  protected async whetherAnySessionDataExistsInSensitiveDataSessionStorage(
    sensitiveDataStorage: ISensitiveDataSessionStorage
  ): Promise<boolean> {
    return !!(await sensitiveDataStorage.getItem(CONNECTION_BRIDGE_SESSION_STORAGE_KEYS.SESSION_DATA_AVAILABLE));
  }

  protected async createAndSetSequentlyNeccesaryInstances() {
    this.setCurrentCentralAuthorityConnection(await this.createAndStartConnectionWithCentralAuthority());
    this.setCurrentSwarmMessageEncryptedCacheFabric(await this.createSwarmMessageEncryptedCacheFabric());
    this.setCurrentSwarmMessageConstructorFabric(await this.createSwarmMessageConstructorFabric());
    this.setCurrentSwarmMessageEncryptedCache(await this.createSwarmMessageEncryptedCache());
    this.setCurrentSwarmMessageConstructor(await this.createSwarmMessageConstructor());
    this.setCurrentSwarmConnection(await this.createSwarmConnection());
    this.setCurrentSwarmMessageStorage(await this.createAndStartSwarmMessageStorageConnection());
  }
}
