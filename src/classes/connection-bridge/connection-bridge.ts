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
} from './connection-bridge.const';
import { CentralAuthority } from '../central-authority-class/central-authority-class';
import { ipfsUtilsConnectBasic } from '../../utils/ipfs-utils/ipfs-utils';
import { SwarmMessageStore } from '../swarm-message-store/swarm-message-store';
import { ISensitiveDataSessionStorage } from 'classes/sensitive-data-session-storage/sensitive-data-session-storage.types';
import { SensitiveDataSessionStorage } from 'classes/sensitive-data-session-storage';
import {
  ISwarmMessageEncryptedCacheFabric,
  ISwarmMessageConstructorWithEncryptedCacheFabric,
} from '../swarm-messgae-encrypted-cache/swarm-messgae-encrypted-cache.types';
import { CONNECTION_BRIDGE_STORAGE_DATABASE_NAME } from './connection-bridge.const';
import {
  getSwarmMessageEncryptedCacheFabric,
  getSwarmMessageConstructorWithCacheFabric,
} from '../swarm-messgae-encrypted-cache/swarm-message-encrypted-cache.utils';
import { ISwarmMessgaeEncryptedCache } from '../swarm-messgae-encrypted-cache';
import { ISensitiveDataSessionStorageOptions } from '../sensitive-data-session-storage/sensitive-data-session-storage.types';
import {
  ISecretStorage,
  TSecretStorageAuthorizeCredentials,
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
import { IConnectionBridgeSwarmConnection } from './connection-bridge.types';
import { getSwarmStoreConnectionProviderOptionsForSwarmStoreConnector } from './connection-bridge.utils';
import { IPFS } from 'types/ipfs.types';
import { ICentralAuthorityUserProfile } from '../central-authority-class/central-authority-class-types/central-authority-class-types-common';
import {
  ISwarmStoreConnector,
  ISwarmStoreConnectorBasic,
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
  DBO extends TSwarmStoreDatabaseOptions<P, T>,
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
  public caConnection?: ICentralAuthority;

  public storage?: ISwarmMessageStore<P, T, DbType, ConnectorBasic, PO, DBO, CO, ConnectorMain, CFO, MSI, GAC, MCF, ACO, O>;

  public messageConstructor?: ISwarmMessageConstructor;

  public swarmMessageEncryptedCacheFabric?: ISwarmMessageEncryptedCacheFabric;

  public swarmMessageConstructorFabric?: ISwarmMessageConstructorWithEncryptedCacheFabric;

  public get secretStorage() {
    return this._secretStorage;
  }

  protected swarmStoreConnectorType?: P;

  protected options?: IConnectionBridgeOptions<P, T, DbType, ConnectorBasic, PO, MSI, GAC, MCF, ACO, CD>;

  protected optionsCA?: ICentralAuthorityOptions;

  protected optionsMessageConstructor?: TSwarmMessageConstructorOptions;

  protected optionsSwarmConnection?: any;

  protected optionsMessageStorage?: ISwarmMessageStoreOptions<P, T, DbType, ConnectorBasic, PO, MSI, GAC, MCF, ACO>;

  protected session?: ISensitiveDataSessionStorage;

  protected userDataStore?: ISensitiveDataSessionStorage;

  protected swarmMessageEncryptedCache?: ISwarmMessgaeEncryptedCache;

  protected _secretStorage?: ISecretStorage;

  protected swarmConnection: IConnectionBridgeSwarmConnection<P, NC> | undefined;

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
    options: IConnectionBridgeOptions<P, T, DbType, ConnectorBasic, PO, MSI, GAC, MCF, ACO, CD>
  ): Promise<void> {
    await this.startUserDataStore();
    try {
      await this.validateAndSetOptions(options);
      await this.startSession();
      this.setCurrentCentralAuthorityConnection(await this.createAndStartConnectionWithCentralAuthority());
      this.setCurrentSwarmMessageEncryptedCacheFabric(await this.createSwarmMessageEncryptedCacheFabric());
      this.setCurrentSwarmMessageConstructorFabric(await this.createSwarmMessageConstructorFabric());
      this.setSwarmMessageEncryptedCache(await this.createSwarmMessageEncryptedCache());
      this.setSwarmMessageConstructor(await this.createSwarmMessageConstructor());
      await this.startSwarmConnection();
      await this.startSwarmMessageStorageConnection();
      await this.setSessionExists();
      await this.startSecretStorage();
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
      | IConnectionBridgeOptions<P, T, DbType, ConnectorBasic, PO, MSI, GAC, MCF, ACO, CD>
  ) {
    const sessionParams = this.getSessionParamsOrUndefinedFromConnectionBridgeOrSensitiveDataSessionStorageOptions(options);

    if (!sessionParams) {
      return false;
    }
    await this.startUserDataStore();
    if (!(await this.readValueFromUserDataStoreForUserLoginKey())) {
      return false;
    }

    const sensitiveDataStorage = await this.createSensitiveDataStorageForSession({
      ...sessionParams,
      // do not clear data from the storage becuse it can be used later
      clearStorageAfterConnect: false,
    });

    return await this.whetherSessionDataExistsInSensitiveDataSessionStorage(sensitiveDataStorage);
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
    await this.closeCentralAuthorityConnection();
  }

  protected checkOptionsIsDefined(): this is {
    options: IConnectionBridgeOptions<P, T, DbType, ConnectorBasic, PO, MSI, GAC, MCF, ACO, CD>;
  } {
    if (!this.options) {
      throw new Error('Options should be defined');
    }
    return true;
  }

  protected validateAuthOptions(): void {
    if (this.checkOptionsIsDefined()) {
      const { auth: authOptions } = this.options;

      assert(authOptions, 'Authorization options must be defined');
      assert(typeof authOptions === 'object', 'Authorization options must be an object');
    }
  }

  protected validatetUserOptions() {
    if (this.checkOptionsIsDefined()) {
      const { user: userOptions } = this.options;

      assert(userOptions, 'User options must be defined');
      assert(typeof userOptions === 'object', 'User options must be an object');
    }
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
          session: this.session,
        },
      },
      authProvidersPool,
    };
  }

  protected setOptionsCentralAuthority(optionsCentralAuthority: ICentralAuthorityOptions) {
    this.optionsCA = optionsCentralAuthority;
  }

  protected createOptionsForCentralAuthorityFromConnectionBridgeOptions(): ICentralAuthorityOptions {
    if (!this.checkOptionsIsDefined()) {
      throw new Error('Options must be defined');
    }

    const { auth: authOptions, user: userOptions } = this.options;
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
    if (!this.checkOptionsIsDefined()) {
      throw new Error('Options must be defined');
    }
    this.validateAuthOptions();
    this.validatetUserOptions();
    const optionsCentralAuthority = this.createOptionsForCentralAuthorityFromConnectionBridgeOptions();
    return optionsCentralAuthority;
  }

  /**
   *
   *
   * @protected
   * @returns {TSwarmMessageConstructorOptions}
   * @memberof ConnectionBridge
   * @throws
   */
  protected createOptionsMessageConstructor(): TSwarmMessageConstructorOptions {
    const { caConnection } = this;

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

  protected getSwarmStoreConnectionProviderOptions<SC extends IConnectionBridgeSwarmConnection<P, NC>>(
    swarmConnection: SC
  ): TSwarmStoreConnectorConnectionOptions<P, T, DbType, ConnectorBasic> {
    const { options, swarmStoreConnectorType } = this;

    if (!swarmStoreConnectorType) {
      throw new Error('Uknown connector type');
    }
    if (!options) {
      throw new Error('Options should be defined');
    }

    const { storage } = options;

    const swarmStoreConnectionProviderOptions = getSwarmStoreConnectionProviderOptionsForSwarmStoreConnector<
      P,
      T,
      DbType,
      NC,
      SC
    >(swarmStoreConnectorType, swarmConnection, storage.connectorBasicFabric);

    return swarmStoreConnectionProviderOptions;
  }

  /**
   * set options for the message storage
   *
   * @protected
   * @memberof ConnectionBridge
   * @throws
   */
  protected async getOptionsMessageStorage(): Promise<O> {
    const { messageConstructor, caConnection, swarmConnection, options } = this;

    if (!options) {
      throw new Error('Options must be defined');
    }

    const { auth: authOptions, storage: storageOptions } = options;

    if (!messageConstructor) {
      throw new Error('There is no message constructor defined');
    }
    if (!caConnection) {
      throw new Error('There is no message central authority connection defined');
    }
    if (!swarmConnection) {
      throw new Error('There is no swarm connection provider');
    }

    const userId = caConnection.getUserIdentity();

    if (typeof userId !== 'string') {
      throw new Error('Failed to get the user identity');
    }

    // TODO - refactor it
    // const authCredentials = {
    //   ...(authOptions.credentials as ISwarmMessageStoreOptions<P,T,DbType,ConnectorBasic>['credentials']),
    //   session: this.session,
    // };
    const messageStorageOptions: O = {
      ...storageOptions,
      // credentials: authCredentials,
      userId,
      databasesListStorage: await this.startEncryptedCache(CONNECTION_BRIDGE_STORAGE_DATABASE_PREFIX.DATABASE_LIST_STORAGE),
      swarmMessageConstructorFabric: this.swarmMessageConstructorFabric,
      messageConstructors: {
        default: messageConstructor,
      },
      providerConnectionOptions: this.getSwarmStoreConnectionProviderOptions(swarmConnection),
    } as any;

    return messageStorageOptions;
  }

  protected async startUserDataStore() {
    if (!this.userDataStore) {
      const userDataStore = new SensitiveDataSessionStorage();

      await userDataStore.connect({
        storagePrefix: CONNECTION_BRIDGE_STORAGE_DATABASE_PREFIX.USER_DATA_STORAGE,
      });
      this.userDataStore = userDataStore;
    }
  }

  protected setSwarmStoreConnectorType(swarmStoreConnectorType: P): void {
    this.swarmStoreConnectorType = swarmStoreConnectorType;
  }

  protected setOptions(options: IConnectionBridgeOptions<P, T, DbType, ConnectorBasic>): void {
    this.options = options;
  }

  protected checkUserDataStoreIsReady(): this is {
    userDataStore: ISensitiveDataSessionStorage;
  } {
    const { userDataStore } = this;
    if (!userDataStore) {
      throw new Error('User data store is not initialized');
    }
    return true;
  }

  protected async readValueFromUserDataStore(key: CONNECTION_BRIDGE_SESSION_STORAGE_KEYS): Promise<unknown | undefined> {
    if (this.checkUserDataStoreIsReady()) {
      return this.userDataStore.getItem(key);
    }
    return undefined;
  }

  protected async setValueInUserDataStore(key: CONNECTION_BRIDGE_SESSION_STORAGE_KEYS, value: unknown): Promise<void> {
    if (this.checkUserDataStoreIsReady()) {
      return this.userDataStore.setItem(key, value);
    }
  }

  protected readValueFromUserDataStoreForUserLoginKey() {
    return this.readValueFromUserDataStore(CONNECTION_BRIDGE_SESSION_STORAGE_KEYS.USER_LOGIN);
  }

  protected async readUserLoginFromUserDataStore(): Promise<string | undefined> {
    const userLogin = this.readValueFromUserDataStoreForUserLoginKey();

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

  protected validateOptions(options: any): options is IConnectionBridgeOptions<P, T, DbType, ConnectorBasic> {
    assert(options, 'Options must be provided');
    assert(typeof options === 'object', 'Options must be an object');
    assert(options.swarmStoreConnectorType, 'swarmStoreConnectorType should be defined');
    return true;
  }

  protected isOptionsWithCredentials(
    options: IConnectionBridgeOptions<P, T, DbType, ConnectorBasic>
  ): options is IConnectionBridgeOptions<P, T, DbType, ConnectorBasic, true> {
    return !!options.auth.credentials?.login;
  }

  protected async setOptionsWithUserCredentialsProvided(
    options: IConnectionBridgeOptions<P, T, DbType, ConnectorBasic, true>
  ): Promise<void> {
    await this.setValueInUserDataStore(CONNECTION_BRIDGE_SESSION_STORAGE_KEYS.USER_LOGIN, options.auth.credentials.login);
    this.setOptions(options);
  }

  protected async setOptionsWithoutUserCredentials(
    options: IConnectionBridgeOptions<P, T, DbType, ConnectorBasic>
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
    };
  }

  /**
   *
   *
   * @protected
   * @param {IConnectionBridgeOptions<P>} options
   * @memberof ConnectionBridge
   * @throws
   */
  protected async validateAndSetOptions(options: IConnectionBridgeOptions<P, T, DbType, ConnectorBasic>): Promise<void> {
    this.validateOptions(options);
    this.setSwarmStoreConnectorType(options.swarmStoreConnectorType);
    if (this.isOptionsWithCredentials(options)) {
      this.setOptionsWithUserCredentialsProvided(options);
    } else {
      this.setOptionsWithoutUserCredentials(options);
    }
  }

  protected getSensitiveDataStoragePrefixForSession(sessionParams: ISensitiveDataSessionStorageOptions): string | undefined {
    return sessionParams.storagePrefix ? `${sessionParams.storagePrefix}${this.options?.auth.credentials?.login}` : undefined;
  }

  protected async createSensitiveDataStorageForSession(
    sessionParams: ISensitiveDataSessionStorageOptions
  ): Promise<ISensitiveDataSessionStorage> {
    const session = new SensitiveDataSessionStorage();

    await session.connect({
      ...sessionParams,
      storagePrefix: this.getSensitiveDataStoragePrefixForSession(sessionParams),
    });
    return session;
  }

  /**
   * start session if options provided
   *
   * @protected
   * @param {ISensitiveDataSessionStorageOptions} sessionParams
   * @memberof ConnectionBridge
   * @throws
   */
  protected async startSession(): Promise<void> {
    const sessionParams = this.options?.auth.session;

    if (sessionParams) {
      this.session = await this.createSensitiveDataStorageForSession(sessionParams);
    }
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
    this.caConnection = centralAuthority;
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

  protected setSwarmMessageConstructor(swarmMessageConstructor: ISwarmMessageConstructor): void {
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

  /**
   * create connection to the swarm through the
   * provider.
   * TODO
   *
   * @protected
   * @memberof ConnectionBridge
   */
  protected async startSwarmConnection(): Promise<void> {
    this.setOptionsSwarmConnection();

    const ipfs = await ipfsUtilsConnectBasic(this.options ? this.options.swarm : undefined);

    this.swarmConnection = {
      getNativeConnection() {
        return ipfs;
      },
    };
  }

  protected getUserCredentialsFromOptions(): Pick<ICentralAuthorityUserCredentials, 'cryptoCredentials' | 'login' | 'password'> {
    if (!this.checkOptionsIsDefined()) {
      throw new Error('Options should be defined');
    }
    const { auth } = this.options;
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

    if (!userPassword && !this.session) {
      throw new Error('Session with user secret key or password shoul exists');
    }
    return {
      login: this.getUserLoginFromOptions(),
      password: userPassword,
      session: this.session,
    } as TSecretStorageAuthOptionsCredentials;
  }

  protected getDatabaseNamePrefixForEncryptedCahce(userLogin: string): string {
    return `__${CONNECTION_BRIDGE_STORAGE_DATABASE_PREFIX.MESSAGE_CACHE_STORAGE}_//_${userLogin}`;
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
    if (!this.caConnection) {
      throw new Error('Connection to the Central authority should exists');
    }
    return {
      caConnection: this.caConnection,
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
    return `${dbNamePrefix}_//_${userLogin}`;
  }

  protected startEncryptedCache(dbNamePrefix: string): Promise<ISwarmMessgaeEncryptedCache> {
    if (!this.swarmMessageEncryptedCacheFabric) {
      throw new Error('Encrypted cache fabric must be started before');
    }

    const databaseFullName = this.getDatabaseNameForEncryptedCacheInstance(dbNamePrefix);

    return this.swarmMessageEncryptedCacheFabric({
      dbName: databaseFullName,
    });
  }

  protected setSwarmMessageEncryptedCache(swarmMessageEncryptedCache: ISwarmMessgaeEncryptedCache): void {
    this.swarmMessageEncryptedCache = swarmMessageEncryptedCache;
  }

  protected async createSwarmMessageEncryptedCache(): Promise<ISwarmMessgaeEncryptedCache> {
    if (!this.swarmMessageEncryptedCacheFabric) {
      throw new Error('Encrypted cache fabric must be started before');
    }
    return await this.startEncryptedCache(CONNECTION_BRIDGE_STORAGE_DATABASE_NAME.MESSAGE_CACHE_STORAGE);
  }

  /**
   * start connection with the SwarmMessage storage
   *
   * @protected
   * @memberof ConnectionBridge
   * @throws
   */
  protected async startSwarmMessageStorageConnection(): Promise<void> {
    const swarmMessageStorageOptions = await this.getOptionsMessageStorage();
    const swarmMessageStorage = new SwarmMessageStore<P, T, DbType, ConnectorBasic, ConnectorMain, O>();
    const result = await swarmMessageStorage.connect(swarmMessageStorageOptions);

    if (result instanceof Error) {
      throw result;
    }
    this.storage = swarmMessageStorage as ISwarmMessageStore<P, T, DbType, ConnectorBasic, ConnectorMain, O>;
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
    const { storage } = this;

    if (storage) {
      try {
        await storage.close();
      } catch (err) {
        console.error('Failed to close the connection to the swarm message storage', err);
      }
    } else {
      console.warn('closeSwarmMessageStorage - there is no connection');
    }
    this.storage = undefined;
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
  protected async closeCentralAuthorityConnection(): Promise<void> {
    const { caConnection } = this;

    if (caConnection) {
      try {
        await caConnection.disconnect();
      } catch (err) {
        console.error('closeCentralAuthorityConnection failed to close the connection to the central authority', err);
      }
    }
    this.caConnection = undefined;
    this.optionsCA = undefined;
  }

  /**
   * set that authorized before in the session
   * data, if it's available
   *
   * @protected
   * @memberof ConnectionBridge
   */
  protected async setSessionExists() {
    await this.session?.setItem(CONNECTION_BRIDGE_SESSION_STORAGE_KEYS.SESSION_DATA_AVAILABLE, true);
  }

  protected getSecretStorageDBOptions(): Partial<IStorageProviderOptions> {
    return {
      dbName: `${CONNECTION_BRIDGE_STORAGE_DATABASE_PREFIX.SECRET_STORAGE}//${this.options?.auth.credentials.login}`,
    };
  }

  protected getSecretStorageAuthCredentials(): TSecretStorageAuthorizeCredentials {
    if (!this.session && !this.options?.auth.credentials.password) {
      throw new Error('Session storage or password must be provided to authorize in SecretStorage');
    }
    return {
      ...this.options?.auth.credentials,
      ...(this.session ? { session: this.session } : undefined),
    } as TSecretStorageAuthorizeCredentials;
  }

  protected async startSecretStorage() {
    const secretStorage = new SecretStorage();
    const authResult = await secretStorage.authorize(this.getSecretStorageAuthCredentials(), this.getSecretStorageDBOptions());
    if (authResult !== true) {
      throw authResult === false ? new Error('Conntection to the secret storage failed') : authResult;
    }
    this._secretStorage = secretStorage;
  }

  protected getSessionParamsOrUndefinedFromConnectionBridgeOrSensitiveDataSessionStorageOptions(
    options?:
      | ISensitiveDataSessionStorageOptions
      | IConnectionBridgeOptions<P, T, DbType, ConnectorBasic, PO, MSI, GAC, MCF, ACO, CD>
  ): ISensitiveDataSessionStorageOptions | undefined {
    if (!options) {
      return undefined;
    }
    return (options as IConnectionBridgeOptions<P, T, DbType, ConnectorBasic, PO, MSI, GAC, MCF, ACO, CD>).auth
      ? (options as IConnectionBridgeOptions<P, T, DbType, ConnectorBasic, PO, MSI, GAC, MCF, ACO, CD>).auth.session
      : (options as ISensitiveDataSessionStorageOptions);
  }

  protected async whetherSessionDataExistsInSensitiveDataSessionStorage(
    sensitiveDataStorage: ISensitiveDataSessionStorage
  ): Promise<boolean> {
    return !!(await sensitiveDataStorage.getItem(CONNECTION_BRIDGE_SESSION_STORAGE_KEYS.SESSION_DATA_AVAILABLE));
  }
}
