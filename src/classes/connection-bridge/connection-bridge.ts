import assert from 'assert';
import {
  IConnectionBridgeOptions,
  IConnectionBridge,
  TNativeConnectionType,
  IConnectionBridgeOptionsAuth,
} from './types/connection-bridge.types';
import { ESwarmStoreConnector } from '../swarm-store-class/swarm-store-class.const';
import { ICentralAuthorityOptions, ICentralAuthority } from '../central-authority-class/central-authority-class.types';
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
} from '../swarm-message-store/types/swarm-message-store.types';
import { extend } from '../../utils/common-utils/common-utils-objects';
import {
  CONNECTION_BRIDGE_OPTIONS_DEFAULT_AUTH_PROVIDERS_POOL,
  CONNECTION_BRIDGE_SESSION_STORAGE_KEYS,
  CONNECTION_BRIDGE_STORAGE_DATABASE_PREFIX,
  CONNECTION_BRIDGE_STORAGE_DELIMETER_FOR_STORAGE_KEYS_DEFAULT,
} from './connection-bridge.const';
import { CentralAuthority } from '../central-authority-class/central-authority-class';
import { ISensitiveDataSessionStorage } from 'classes/sensitive-data-session-storage/sensitive-data-session-storage.types';
import { SensitiveDataSessionStorage } from 'classes/sensitive-data-session-storage';
import {
  ISwarmMessageEncryptedCacheFabric,
  ISwarmMessageConstructorWithEncryptedCacheFabric,
} from '../swarm-message-encrypted-cache/swarm-messgae-encrypted-cache.types';
import {
  CONNECTION_BRIDGE_STORAGE_DATABASE_NAME,
  CONNECTION_BRIDGE_OPTIONS_DEFAULT_USER_SENSITIVE_DATA_STORE as CONNECTION_BRIDGE_OPTIONS_DEFAULT_USER_SENSITIVE_DATA_STORE_OPTIONS,
} from './connection-bridge.const';
import {
  getSwarmMessageEncryptedCacheFabric,
  getSwarmMessageConstructorWithCacheFabric,
} from '../swarm-message-encrypted-cache/swarm-message-encrypted-cache.utils';
import { ISwarmMessageEncryptedCache } from '../swarm-message-encrypted-cache';
import { ISensitiveDataSessionStorageOptions } from '../sensitive-data-session-storage/sensitive-data-session-storage.types';
import { ISecretStorage, TSecretStorageAuthorizazionOptions } from '../secret-storage-class/secret-storage-class.types';
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
} from './types/connection-bridge.types';
import { createNativeConnection } from './connection-bridge-utils-fabrics/connection-bridge-swarm-fabrics/connection-bridge-utils-native-connection-fabrics';
import { IPFS } from 'types/ipfs.types';
import { ICentralAuthorityUserProfile } from '../central-authority-class/central-authority-class-types/central-authority-class-types-common';
import {
  ISwarmStoreConnectorBasic,
  ISwarmStoreConnector,
  TSwarmStoreConnectorBasicFabric,
} from '../swarm-store-class/swarm-store-class.types';
import {
  TSwarmStoreConnectorConstructorOptions,
  ISwarmStoreConnectorDatabasesPersistentList,
  ISwarmStoreConnectorDatabasesPersistentListConstructorParams,
} from '../swarm-store-class/swarm-store-class.types';
import { TSwarmMessageUserIdentifierSerialized } from '../swarm-message/swarm-message-subclasses/swarm-message-subclass-validators/swarm-message-subclass-validator-fields-validator/swarm-message-subclass-validator-fields-validator-validators/swarm-message-subclass-validator-fields-validator-validator-user-identifier/swarm-message-subclass-validator-fields-validator-validator-user-identifier.types';
import {
  TConnectionBridgeCFODefault,
  TConnectionBridgeOptionsAuthCredentials,
  ISwarmStoreDatabasesPersistentListFabric,
} from './types/connection-bridge.types';
import { calculateHash } from '../../utils/hash-calculation-utils/hash-calculation-utils';
import { PromiseResolveType } from '../../types/promise.types';
import { ISerializer } from '../../types/serialization.types';
import { CONNECTION_BRIDGE_DEFAULT_SERIALIZER } from './connection-bridge.const';
import { IStorageCommon } from '../../types/storage.types';
import {
  ISwarmMessageDatabaseConstructors,
  ISwarmMessageStoreOptionsWithConnectorFabric,
} from '../swarm-message-store/types/swarm-message-store.types';
import {
  TSwarmStoreDatabaseOptions,
  ISwarmStoreProviderOptions,
  ISwarmStoreOptionsConnectorFabric,
} from '../swarm-store-class/swarm-store-class.types';
import {
  connectorBasicFabricOrbitDBDefault,
  getSwarmStoreConnectionProviderOptionsForSwarmStoreConnector,
} from './connection-bridge-utils-fabrics/connection-bridge-swarm-fabrics/connection-bridge-utils-store-to-swarm-database-fabrics';
import { getMainConnectorFabricDefault } from './connection-bridge-utils-fabrics/connection-bridge-swarm-fabrics/connection-bridge-utils-store-to-swarm-connector-fabrics';

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
  CO extends TSwarmStoreConnectorConnectionOptions<P, T, DbType, DBO, ConnectorBasic>,
  PO extends ISwarmStoreProviderOptions<P, T, DbType, DBO, ConnectorBasic, CO>,
  ConnectorMain extends ISwarmStoreConnector<P, T, DbType, DBO, ConnectorBasic, CO>,
  CFO extends ISwarmStoreOptionsConnectorFabric<P, T, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain>,
  CBFO extends TSwarmStoreConnectorBasicFabric<P, T, DbType, DBO, ConnectorBasic>,
  MSI extends TSwarmMessageInstance | T,
  GAC extends TSwarmMessagesStoreGrantAccessCallback<P, MSI>,
  MCF extends ISwarmMessageConstructorWithEncryptedCacheFabric,
  ACO extends ISwarmMessageStoreAccessControlOptions<P, T, MSI, GAC>,
  O extends ISwarmMessageStoreOptionsWithConnectorFabric<
    P,
    T,
    DbType,
    DBO,
    ConnectorBasic,
    CO,
    PO,
    ConnectorMain,
    TConnectionBridgeCFODefault<P, T, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain, CFO>,
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
    CO,
    PO,
    ConnectorMain,
    MSI,
    GAC,
    MCF,
    ACO,
    CFO,
    CBFO,
    CD,
    O,
    SMS,
    SSDPLF
  >,
  SMS extends ISwarmMessageStore<
    P,
    T,
    DbType,
    DBO,
    ConnectorBasic,
    CO,
    PO,
    ConnectorMain,
    TConnectionBridgeCFODefault<P, T, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain, CFO>,
    MSI,
    GAC,
    MCF,
    ACO,
    O
  > = ISwarmMessageStore<
    P,
    T,
    DbType,
    DBO,
    ConnectorBasic,
    CO,
    PO,
    ConnectorMain,
    TConnectionBridgeCFODefault<P, T, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain, CFO>,
    MSI,
    GAC,
    MCF,
    ACO,
    O
  >,
  E extends ISwarmMessageStoreEvents<P, T, DbType, DBO> = ISwarmMessageStoreEvents<P, T, DbType, DBO>,
  DBL extends TSwarmStoreOptionsOfDatabasesKnownList<P, T, DbType, DBO> = TSwarmStoreOptionsOfDatabasesKnownList<
    P,
    T,
    DbType,
    DBO
  >,
  NC extends TNativeConnectionType<P> = TNativeConnectionType<P>,
  SSDPLF extends ISwarmStoreDatabasesPersistentListFabric<
    P,
    T,
    DbType,
    DBO,
    Record<DBO['dbName'], DBO>
  > = ISwarmStoreDatabasesPersistentListFabric<P, T, DbType, DBO, Record<DBO['dbName'], DBO>>
> implements
    IConnectionBridge<
      P,
      T,
      DbType,
      DBO,
      ConnectorBasic,
      CO,
      PO,
      ConnectorMain,
      CFO,
      CBFO,
      MSI,
      GAC,
      MCF,
      ACO,
      O,
      CD,
      CBO,
      SMS,
      SSDPLF
    > {
  static joinKeyPartsUsedForStorageValue(...parts: string[]): string {
    return parts.join(CONNECTION_BRIDGE_STORAGE_DELIMETER_FOR_STORAGE_KEYS_DEFAULT);
  }

  public get swarmMessageStore(): SMS | undefined {
    return this._swarmMessageStore;
  }

  public get centralAuthorityConnection(): ICentralAuthority | undefined {
    return this._centralAuthorityConnection;
  }

  public messageConstructor?: PromiseResolveType<ReturnType<NonNullable<MCF>>>;

  public swarmMessageEncryptedCacheFabric?: ISwarmMessageEncryptedCacheFabric;

  public swarmMessageConstructorFabric?: MCF;

  public get secretStorage(): ISecretStorage | undefined {
    return this._secretStorage;
  }

  protected options?: CBO;

  protected _swarmMessageStore?: SMS;

  protected _centralAuthorityConnection?: ICentralAuthority;

  protected get swarmStoreConnectorType(): P | undefined {
    return this.options?.swarmStoreConnectorType;
  }

  protected optionsCentralAuthority?: ICentralAuthorityOptions;

  protected optionsSwarmConnection?: TNativeConnectionOptions<P>;

  protected optionsMessageStorage?: ISwarmMessageStoreOptions<P, T, DbType, DBO, ConnectorBasic, CO, MSI, GAC, MCF, ACO>;

  protected sessionSensitiveStorage?: ISensitiveDataSessionStorage;

  protected connectionBridgeSessionDataStore?: ISensitiveDataSessionStorage;

  protected swarmMessageEncryptedCache?: ISwarmMessageEncryptedCache;

  protected _serializer: ISerializer | undefined;

  protected _swarmConnectorDatabasesPeristentList: PromiseResolveType<ReturnType<SSDPLF>> | undefined;

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
        await this.createAndSetSensitiveDataStorageForMainSession(sensitiveDataStorageOptions);
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
  public async checkSessionAvailable(options?: ISensitiveDataSessionStorageOptions | CBO): Promise<boolean> {
    const sessionParams = this.getSessionParamsOrUndefinedFromConnectionBridgeOrSensitiveDataSessionStorageOptions(options);

    if (!sessionParams) {
      return false;
    }

    const connectionBridgeSessionDataStore = await this.createSessionSensitiveDataStoreForConnectionBridgeSession(
      this.getOptionsForSensitiveDataStoreDuringCheckSessionAvailable()
    );
    const userLogin = await this.readUserLoginKeyValueFromConnectionBridgeSessionDataStore(connectionBridgeSessionDataStore);

    // check whether the user login value set for a previous session by this Connection bridge instance
    if (!this.isUserLogin(userLogin)) {
      return false;
    }

    await connectionBridgeSessionDataStore.close();

    // check any data exists in the main session data store
    const mainSessionDataStore = await this.createMainSensitiveDataStorageForSession({
      ...sessionParams,
      // do not clear data from the storage becuse it can be used later
      clearStorageAfterConnect: false,
    });

    const sessionDataIsExists = await this.whetherAnySessionDataExistsInSensitiveDataSessionStorage(mainSessionDataStore);

    await mainSessionDataStore.close();
    return sessionDataIsExists;
  }

  /**
   * close all the connections and
   * release all instances
   *
   * @returns {Promise<void>}
   * @memberof ConnectionBridge
   */
  public async close(): Promise<void> {
    await this.closeSwarmConnection();
    await this.closeCurrentCentralAuthorityConnection();
    await this._closeSwarmDatabasesListPersistentStorage();
    this.closeSwarmMessageEncryptedCacheFabric();
    this.closeSwarmMessageConstructorFabric();
    await this.closeSensitiveDataStorages();
    await this.closeStorage();
    this.closeMessageConstructor();
    this._unsetSerializer();
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

  protected _getOptions(): CBO {
    if (this.checkCurrentOptionsIsDefined()) {
      return this.options;
    }
    throw new Error('Current options are not defined');
  }

  protected _getStorageOptions(): CBO['storage'] {
    const storageOptions = this._getOptions().storage;

    assert(storageOptions, 'There is no storage options exists');
    return storageOptions;
  }

  protected _getCentralAuthorityConnection(): ICentralAuthority {
    const centralAuthorityConnection = this._centralAuthorityConnection;

    if (!centralAuthorityConnection) {
      throw new Error('There is no connection with the central authority');
    }
    return centralAuthorityConnection;
  }

  protected _setSerializer(serializer: ISerializer): void {
    this._serializer = serializer;
  }

  protected _validateSerializerInstance(serializer: ISerializer): void {
    // TODO - move to a separate function
    assert(typeof serializer === 'object', 'Serializer should be an object');
    assert(typeof serializer.parse === 'function', 'Serializer should have the "parse" method');
    assert(typeof serializer.stringify === 'function', 'Serializer should have the "stringify" method');
  }

  protected _returnSerializerIfDefinedOrDefault(serializer?: ISerializer): ISerializer {
    return serializer ?? CONNECTION_BRIDGE_DEFAULT_SERIALIZER;
  }

  protected _setSerializerInstanceFromOptionsOrDefault(options: { serializer?: ISerializer }) {
    const serializerFromOptions = options.serializer;

    if (!serializerFromOptions) {
      console.log("Connection bridge: browser's JSON API will be used as a serializer");
    }

    const serializerApiToUse = this._returnSerializerIfDefinedOrDefault(serializerFromOptions);

    this._validateSerializerInstance(serializerApiToUse);
    this._setSerializer(serializerApiToUse);
  }

  protected _getSerializerFromOptions(): ISerializer {
    const serializer = this._serializer;
    if (!serializer) {
      throw new Error('A serializer instance is not defined');
    }
    return serializer;
  }

  protected _unsetSerializer(): void {
    this._serializer = undefined;
  }

  protected validatetCurrentUserOptions(): void {
    const { user: userOptions } = this._getOptions();

    assert(userOptions, 'User options must be defined');
    assert(typeof userOptions === 'object', 'User options must be an object');
  }

  protected getOptionsForSensitiveDataStoreDuringCheckSessionAvailable(): ISensitiveDataSessionStorageOptions {
    return {
      ...CONNECTION_BRIDGE_OPTIONS_DEFAULT_USER_SENSITIVE_DATA_STORE_OPTIONS,
      clearStorageAfterConnect: false,
    };
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
        credentials: this.getCredentialsWithSession(),
      },
      authProvidersPool,
    };
  }

  protected setOptionsCentralAuthority(optionsCentralAuthority: ICentralAuthorityOptions): void {
    this.optionsCentralAuthority = optionsCentralAuthority;
  }

  protected createOptionsForCentralAuthorityWithCurrentConnectionBridgeOptions(): ICentralAuthorityOptions {
    const { auth: authOptions, user: userOptions } = this._getOptions();
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
    const caConnection = this._getCentralAuthorityConnection();
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

  protected getSwarmStoreConnectionProviderOptions<SC extends IConnectionBridgeSwarmConnection<P, NC>>(swarmConnection: SC): CO {
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

    return swarmStoreConnectionProviderOptions as CO;
  }

  protected getCurrentUserIdentityFromCurrentConnectionToCentralAuthority(): TSwarmMessageUserIdentifierSerialized {
    const caConnection = this._getCentralAuthorityConnection();
    const userId = caConnection.getUserIdentity();

    if (userId instanceof Error) {
      throw userId;
    }
    return userId;
  }

  protected getSwarmStoreConnectionProviderOptionsFromCurrentOptions(): CO {
    const { swarmConnection } = this;

    if (!swarmConnection) {
      throw new Error('There is no swarm connection provider');
    }
    return this.getSwarmStoreConnectionProviderOptions(swarmConnection);
  }

  protected _getSwarmMessageConstructor(): PromiseResolveType<ReturnType<NonNullable<MCF>>> {
    const { messageConstructor } = this;
    if (!messageConstructor) {
      throw new Error('There is no message constructor defined');
    }
    return messageConstructor;
  }

  protected getMessageConstructorOptionsForMessageStoreFromCurrentOptions(): ISwarmMessageDatabaseConstructors<
    PromiseResolveType<ReturnType<NonNullable<MCF>>>
  > {
    return {
      default: this._getSwarmMessageConstructor(),
    };
  }

  protected getSecretStoreCredentialsOptionsForMessageStoreFromCurrentOptions(): TSecretStorageAuthorizazionOptions {
    return this.getCredentialsWithSession();
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
    const options = this._getOptions();

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
    return this._getStorageOptions().connectorMainFabric;
  }

  protected getMainConnectorFabricUtilFromCurrentOptionsIfExists():
    | IConnectionBridgeOptionsGetMainConnectorFabric<P, T, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain>
    | undefined {
    return this._getStorageOptions().getMainConnectorFabric;
  }

  protected _getSwarmDatabasesListPersistentStorageFabricFromCurrentOptions(): SSDPLF {
    const swarmStorageDatabasesPersistentListFabricFromOptions = this._getStorageOptions()
      .swarmStoreDatabasesPersistentListFabric;
    if (!swarmStorageDatabasesPersistentListFabricFromOptions) {
      throw new Error('There is no swarm storage databases persistent list fabric is provided in the options');
    }
    return swarmStorageDatabasesPersistentListFabricFromOptions;
  }

  protected getUtilGetMainConnectorFabricForMessageStore(): IConnectionBridgeOptionsGetMainConnectorFabric<
    P,
    T,
    DbType,
    DBO,
    ConnectorBasic,
    CO,
    PO,
    ConnectorMain
  > {
    return this.getMainConnectorFabricUtilFromCurrentOptionsIfExists() || getMainConnectorFabricDefault;
  }

  protected createMainConnectorFabricForMessageStoreByCurrentOptions(
    userId: TSwarmMessageUserIdentifierSerialized,
    credentials: TSecretStorageAuthorizazionOptions
  ): ISwarmStoreOptionsConnectorFabric<P, T, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain> {
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
      CO,
      PO,
      ConnectorMain,
      CFO
    >;
  }

  protected getMainConnectorFabricForSwarmMessageStore(
    userId: TSwarmMessageUserIdentifierSerialized,
    credentials: TSecretStorageAuthorizazionOptions
  ): CFO | ISwarmStoreOptionsConnectorFabric<P, T, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain> {
    return (
      this.getConnectorMainFabricFromCurrentOptionsIfExists() ||
      this.createMainConnectorFabricForMessageStoreByCurrentOptions(userId, credentials)
    );
  }

  protected _getPersistentEncryptedStorageForStoreDatabasesListPersistentStorage = (
    storagePrefix: string
  ): Promise<IStorageCommon> => {
    return this.startEncryptedCache(storagePrefix);
  };

  protected async _getKeyPrefixForDatabasesLisInPersistentStorageForCurrentUser(): Promise<
    ISwarmStoreConnectorDatabasesPersistentListConstructorParams['keyPrefixForDatabasesLisInPersistentStorage']
  > {
    const jointStoragePrefix = ConnectionBridge.joinKeyPartsUsedForStorageValue(
      CONNECTION_BRIDGE_STORAGE_DATABASE_PREFIX.DATABASE_LIST_STORAGE,
      this.getCurrentUserIdentityFromCurrentConnectionToCentralAuthority()
    );
    const jointStoragePrefixHashCalcResult = await calculateHash(jointStoragePrefix);

    if (jointStoragePrefixHashCalcResult instanceof Error) {
      throw jointStoragePrefixHashCalcResult;
    }
    return jointStoragePrefixHashCalcResult;
  }

  protected async _getSwarmDatabasesListPersistentStorageFabricOptionsFromCurrentOptions(): Promise<
    ISwarmStoreConnectorDatabasesPersistentListConstructorParams
  > {
    const storageKeyPrefix: string = await this._getKeyPrefixForDatabasesLisInPersistentStorageForCurrentUser();
    const persistentStorageForDatabasesList: IStorageCommon = await this._getPersistentEncryptedStorageForStoreDatabasesListPersistentStorage(
      storageKeyPrefix
    );
    return {
      persistentStorage: persistentStorageForDatabasesList,
      serializer: this._getSerializerFromOptions(),
      keyPrefixForDatabasesLisInPersistentStorage: storageKeyPrefix,
    };
  }

  protected _setCurrentSwarmDatabasesListPersistentStorage(
    swarmDatabasesListPersistentStorage: PromiseResolveType<ReturnType<SSDPLF>>
  ): void {
    this._swarmConnectorDatabasesPeristentList = swarmDatabasesListPersistentStorage;
  }

  protected async _createSwarmDatabasesListPersistentStorageByCurrentOptions(): Promise<PromiseResolveType<ReturnType<SSDPLF>>> {
    const swarmDatabasesListPersistentStorageFabric = this._getSwarmDatabasesListPersistentStorageFabricFromCurrentOptions();
    const swarmDatabasesListPersistentStorageFabricOptions = await this._getSwarmDatabasesListPersistentStorageFabricOptionsFromCurrentOptions();

    return (await swarmDatabasesListPersistentStorageFabric(
      swarmDatabasesListPersistentStorageFabricOptions
    )) as PromiseResolveType<ReturnType<SSDPLF>>;
  }

  protected async _createSwarmDatabasesListPersistentStorageByCurrentOptionsAndSetAsCurrent(): Promise<
    PromiseResolveType<ReturnType<SSDPLF>>
  > {
    const databasesPersistentListStorage = await this._createSwarmDatabasesListPersistentStorageByCurrentOptions();
    this._setCurrentSwarmDatabasesListPersistentStorage(databasesPersistentListStorage);
    return databasesPersistentListStorage;
  }

  protected async _getCurrentSwarmDatabasesListPersistentStorageOrCreateNew(): Promise<
    ISwarmStoreConnectorDatabasesPersistentList<P, T, DbType, DBO, DBL>
  > {
    return (this._swarmConnectorDatabasesPeristentList ??
      (await this._createSwarmDatabasesListPersistentStorageByCurrentOptionsAndSetAsCurrent())) as ISwarmStoreConnectorDatabasesPersistentList<
      P,
      T,
      DbType,
      DBO,
      DBL
    >;
  }

  protected async _closeSwarmDatabasesListPersistentStorage(): Promise<void> {
    const currentSwarmDatabasesListPersistentStorage = this._swarmConnectorDatabasesPeristentList;

    if (currentSwarmDatabasesListPersistentStorage) {
      await currentSwarmDatabasesListPersistentStorage.close();
    }
  }

  protected getAccessControlOptionsToUse(): ACO {
    const { storage: storageOptions } = this._getOptions();
    const { accessControl } = storageOptions;
    return accessControl;
  }

  protected async getSwarmMessageStoreOptions(): Promise<
    ISwarmMessageStoreOptionsWithConnectorFabric<
      P,
      T,
      DbType,
      DBO,
      ConnectorBasic,
      CO,
      PO,
      ConnectorMain,
      TConnectionBridgeCFODefault<P, T, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain, CFO>,
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

    const swarmMessageConstructorFabric = this.swarmMessageConstructorFabric;

    if (!swarmMessageConstructorFabric) {
      throw new Error('Swarm messages constructor fabric should be defined');
    }

    const { storage: storageOptions } = this._getOptions();
    const { directory, databases } = storageOptions;
    const credentials = this.getSecretStoreCredentialsOptionsForMessageStoreFromCurrentOptions();
    const userId = this.getCurrentUserIdentityFromCurrentConnectionToCentralAuthority();
    const persistentDatbasesList = await this._getCurrentSwarmDatabasesListPersistentStorageOrCreateNew();

    return {
      provider: swarmStoreConnectorType,
      directory,
      databases,
      credentials,
      userId,
      persistentDatbasesList,
      swarmMessageConstructorFabric,
      accessControl: this.getAccessControlOptionsToUse(),
      messageConstructors: this.getMessageConstructorOptionsForMessageStoreFromCurrentOptions(),
      providerConnectionOptions: this.getSwarmStoreConnectionProviderOptionsFromCurrentOptions(),
      connectorFabric: this.getMainConnectorFabricForSwarmMessageStore(userId, credentials) as TConnectionBridgeCFODefault<
        P,
        T,
        DbType,
        DBO,
        ConnectorBasic,
        CO,
        PO,
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

  protected async connectSensitiveDataStoreConnectionBridgeSession(
    dataStore: ISensitiveDataSessionStorage,
    options: ISensitiveDataSessionStorageOptions
  ): Promise<void> {
    await dataStore.connect(options);
  }

  protected async createSessionSensitiveDataStoreForConnectionBridgeSession(
    options: ISensitiveDataSessionStorageOptions
  ): Promise<ISensitiveDataSessionStorage> {
    const connectionBridgeSessoinSensitiveDataStore = this.createSensitiveDataStorageInstance();
    await this.connectSensitiveDataStoreConnectionBridgeSession(connectionBridgeSessoinSensitiveDataStore, options);
    return connectionBridgeSessoinSensitiveDataStore;
  }

  protected async createAndSetSessionSensitiveDataStoreForConnectionBridgeSessionIfNotExists(): Promise<void> {
    if (!this.connectionBridgeSessionDataStore) {
      this.connectionBridgeSessionDataStore = await this.createSessionSensitiveDataStoreForConnectionBridgeSession(
        CONNECTION_BRIDGE_OPTIONS_DEFAULT_USER_SENSITIVE_DATA_STORE_OPTIONS
      );
    }
  }

  protected setOptions(options: CBO): void {
    this.options = options;
  }

  protected checkConnectionBridgeSessionDataStoreIsReady(): this is {
    connectionBridgeSessionDataStore: ISensitiveDataSessionStorage;
  } {
    const { connectionBridgeSessionDataStore: userDataStore } = this;
    if (!userDataStore) {
      throw new Error('User data store is not initialized');
    }
    return true;
  }

  protected getAcitveConnectionBridgeSessionDataStore(): ISensitiveDataSessionStorage {
    if (this.checkConnectionBridgeSessionDataStoreIsReady()) {
      return this.connectionBridgeSessionDataStore;
    }
    throw new Error('User sensitive data store is not initialized');
  }

  protected async setValueInConnectionBridgeSessionDataStore(
    key: CONNECTION_BRIDGE_SESSION_STORAGE_KEYS,
    value: unknown
  ): Promise<void> {
    return await this.getAcitveConnectionBridgeSessionDataStore().setItem(key, value);
  }

  protected readUserLoginKeyValueFromConnectionBridgeSessionDataStore(
    connectionBridgeSessionActiveDataStore: ISensitiveDataSessionStorage
  ): unknown {
    return connectionBridgeSessionActiveDataStore.getItem(CONNECTION_BRIDGE_SESSION_STORAGE_KEYS.USER_LOGIN);
  }

  protected async readUserLoginFromConnectionBridgeSessionStore(): Promise<string | undefined> {
    const userLogin = await this.readUserLoginKeyValueFromConnectionBridgeSessionDataStore(
      this.getAcitveConnectionBridgeSessionDataStore()
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
    options: CBO
  ): options is CBO &
    IConnectionBridgeOptions<
      P,
      T,
      DbType,
      DBO,
      ConnectorBasic,
      CO,
      PO,
      ConnectorMain,
      MSI,
      GAC,
      MCF,
      ACO,
      CFO,
      CBFO,
      true,
      any,
      any,
      SSDPLF
    > {
    return !!options.auth.credentials?.login;
  }

  protected async setUserLoginFromOptionsInConnectionBridgeSessionDataStore(options: {
    auth: { credentials: { login: string } };
  }): Promise<void> {
    return void (await this.setValueInConnectionBridgeSessionDataStore(
      CONNECTION_BRIDGE_SESSION_STORAGE_KEYS.USER_LOGIN,
      options.auth.credentials.login
    ));
  }

  protected async setOptionsWithUserCredentialsProvided(options: { auth: { credentials: { login: string } } }): Promise<void> {
    await this.setUserLoginFromOptionsInConnectionBridgeSessionDataStore(options);
    this.setOptions(options as CBO);
  }

  protected async setCurrentOptionsWithoutUserCredentials(
    options: CBO &
      IConnectionBridgeOptions<
        P,
        T,
        DbType,
        DBO,
        ConnectorBasic,
        CO,
        PO,
        ConnectorMain,
        MSI,
        GAC,
        MCF,
        ACO,
        CFO,
        CBFO,
        false,
        any,
        any,
        SSDPLF
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
          ...(options.auth.credentials ?? {}),
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
    this._setSerializerInstanceFromOptionsOrDefault(options);
    if (this.isOptionsWithCredentials(options)) {
      await this.setOptionsWithUserCredentialsProvided(options);
    } else {
      await this.setCurrentOptionsWithoutUserCredentials(
        options as CBO &
          IConnectionBridgeOptions<
            P,
            T,
            DbType,
            DBO,
            ConnectorBasic,
            CO,
            PO,
            ConnectorMain,
            MSI,
            GAC,
            MCF,
            ACO,
            CFO,
            CBFO,
            false,
            any,
            any,
            SSDPLF
          >
      );
    }
  }

  protected async getSensitiveDataStoragePrefixForSession(sessionParams: ISensitiveDataSessionStorageOptions): Promise<string> {
    const hash = await calculateHash(
      `${sessionParams.storagePrefix ?? ''}${CONNECTION_BRIDGE_STORAGE_DELIMETER_FOR_STORAGE_KEYS_DEFAULT}`
    );
    if (hash instanceof Error) {
      throw hash;
    }
    return hash;
  }

  protected async connectToSensitiveDataStorage(
    sensitiveDataStorageParams: ISensitiveDataSessionStorageOptions
  ): Promise<ISensitiveDataSessionStorage> {
    const sessionDataStorage = this.createSensitiveDataStorageInstance();
    await sessionDataStorage.connect({
      ...sensitiveDataStorageParams,
      storagePrefix: await this.getSensitiveDataStoragePrefixForSession(sensitiveDataStorageParams),
    });
    return sessionDataStorage;
  }

  protected setCurrentSessionSensitiveDataStorage(sessionSensitiveStorage: ISensitiveDataSessionStorage): void {
    this.sessionSensitiveStorage = sessionSensitiveStorage;
  }

  protected async createMainSensitiveDataStorageForSession(
    sensitiveDataStorageOptions: ISensitiveDataSessionStorageOptions
  ): Promise<ISensitiveDataSessionStorage> {
    if (!sensitiveDataStorageOptions) {
      throw new Error('Params for the sensitive data storage should be defined to start the session');
    }
    return await this.connectToSensitiveDataStorage(sensitiveDataStorageOptions);
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
    sensitiveDataStorageOptions: ISensitiveDataSessionStorageOptions
  ): Promise<void> {
    this.setCurrentSessionSensitiveDataStorage(await this.createMainSensitiveDataStorageForSession(sensitiveDataStorageOptions));
  }

  protected async createCentralAuthorityInstnace(optionsCentralAuthority: ICentralAuthorityOptions): Promise<ICentralAuthority> {
    const centralAuthority = new CentralAuthority();
    const connectionResult = await centralAuthority.connect(optionsCentralAuthority);

    if (connectionResult instanceof Error) {
      throw connectionResult;
    }
    return centralAuthority;
  }

  protected setCurrentCentralAuthorityConnection(centralAuthority: ICentralAuthority): void {
    this._centralAuthorityConnection = centralAuthority;
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
    return await this.createCentralAuthorityInstnace(optioinsCA);
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
    return await this.swarmMessageConstructorFabric(this.createOptionsMessageConstructor());
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

  protected getCredentialsWithSession():
    | {
        login: string;
        password: string;
        session: ISensitiveDataSessionStorage;
      }
    | {
        login: string;
        password: undefined;
        session: ISensitiveDataSessionStorage;
      }
    | {
        login: string;
        password: string;
        session: undefined;
      } {
    const {
      auth: { credentials },
    } = this._getOptions();
    const sessionDataStorage = this.sessionSensitiveStorage;

    if (!credentials) {
      throw new Error('Credentials should be specified');
    }

    const { login, password } = credentials as TConnectionBridgeOptionsAuthCredentials;

    if (!login) {
      throw new Error('Login should be specified');
    }
    if (password) {
      return {
        login,
        password,
        session: sessionDataStorage,
      };
    }
    if (!sessionDataStorage) {
      throw new Error('Password or session should be defined');
    }
    return {
      login,
      password,
      session: sessionDataStorage,
    };
  }

  protected getDatabaseNamePrefixForEncryptedCahce(userLogin: string): string {
    return `__${CONNECTION_BRIDGE_STORAGE_DATABASE_PREFIX.MESSAGE_CACHE_STORAGE}${CONNECTION_BRIDGE_STORAGE_DELIMETER_FOR_STORAGE_KEYS_DEFAULT}${userLogin}`;
  }

  protected setCurrentSwarmMessageEncryptedCacheFabric(
    swarmMessageEncryptedCacheFabric: ISwarmMessageEncryptedCacheFabric
  ): void {
    this.swarmMessageEncryptedCacheFabric = swarmMessageEncryptedCacheFabric;
  }

  protected async createSwarmMessageEncryptedCacheFabric(): Promise<ISwarmMessageEncryptedCacheFabric> {
    const authOptions = this.getCredentialsWithSession();
    return await getSwarmMessageEncryptedCacheFabric(
      this.getCredentialsWithSession(),
      this.getDatabaseNamePrefixForEncryptedCahce(authOptions.login)
    );
  }

  protected getSwarmMessageConstructorOptions(): TSwarmMessageConstructorOptions {
    return {
      caConnection: this._getCentralAuthorityConnection(),
      instances: {},
    };
  }

  protected setCurrentSwarmMessageConstructorFabric(
    swarmMessageConstructorFabric: ISwarmMessageConstructorWithEncryptedCacheFabric
  ): void {
    this.swarmMessageConstructorFabric = swarmMessageConstructorFabric as MCF;
  }

  protected getSwarmMessageConstructorFabricFromOptions(): MCF | undefined {
    return this._getOptions().storage.swarmMessageConstructorFabric;
  }

  protected async createSwarmMessageConstructorFabric(): Promise<ISwarmMessageConstructorWithEncryptedCacheFabric> {
    const authOptions = this.getCredentialsWithSession();
    return await getSwarmMessageConstructorWithCacheFabric(
      authOptions,
      this.getSwarmMessageConstructorOptions(),
      this.getDatabaseNamePrefixForEncryptedCahce(authOptions.login)
    );
  }

  protected async getSwarmMessageConstructorFabric(): Promise<ISwarmMessageConstructorWithEncryptedCacheFabric> {
    const swarmMessageConstructorFabricFromOptions = this.getSwarmMessageConstructorFabricFromOptions();
    if (swarmMessageConstructorFabricFromOptions) {
      return swarmMessageConstructorFabricFromOptions;
    }
    return await this.createSwarmMessageConstructorFabric();
  }

  protected getDatabaseNameForEncryptedCacheInstance(dbNamePrefix: string): string {
    const userLogin = this.getCredentialsWithSession().login;
    return `${dbNamePrefix}${CONNECTION_BRIDGE_STORAGE_DELIMETER_FOR_STORAGE_KEYS_DEFAULT}${userLogin}`;
  }

  protected getOptionsForSwarmMessageEncryptedFabric(dbNamePrefix: string): { dbName: string } {
    return {
      dbName: this.getDatabaseNameForEncryptedCacheInstance(dbNamePrefix),
    };
  }

  protected startEncryptedCache(dbNamePrefix: string): Promise<ISwarmMessageEncryptedCache> {
    if (!this.swarmMessageEncryptedCacheFabric) {
      throw new Error('Encrypted cache fabric must be started before');
    }

    const optionsForSwarmMessageEncryptedCacheFabric = this.getOptionsForSwarmMessageEncryptedFabric(dbNamePrefix);

    return this.swarmMessageEncryptedCacheFabric(optionsForSwarmMessageEncryptedCacheFabric);
  }

  protected setCurrentSwarmMessageEncryptedCache(swarmMessageEncryptedCache: ISwarmMessageEncryptedCache): void {
    this.swarmMessageEncryptedCache = swarmMessageEncryptedCache;
  }

  protected async createSwarmMessageEncryptedCache(): Promise<ISwarmMessageEncryptedCache> {
    if (!this.swarmMessageEncryptedCacheFabric) {
      throw new Error('Encrypted cache fabric must be started before');
    }
    return await this.startEncryptedCache(CONNECTION_BRIDGE_STORAGE_DATABASE_NAME.MESSAGE_CACHE_STORAGE);
  }

  protected createSwarmMessageStoreInstanceByOptionsFabric(): SMS {
    const { swarmMessageStoreInstanceFabric } = this._getStorageOptions();
    assert(swarmMessageStoreInstanceFabric, 'swarmMessageStoreInstanceFabric should be defined in the storage options');
    return swarmMessageStoreInstanceFabric();
  }

  protected createSwarmMessageStoreInstance(): SMS {
    return this.createSwarmMessageStoreInstanceByOptionsFabric();
  }

  protected connectToSwarmMessageStore = async (
    swarmMessageStorage: ISwarmMessageStore<
      P,
      T,
      DbType,
      DBO,
      ConnectorBasic,
      CO,
      PO,
      ConnectorMain,
      TConnectionBridgeCFODefault<P, T, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain, CFO>,
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

  protected setCurrentSwarmMessageStorage = (swarmMessageStorage: SMS | undefined): void => {
    this._swarmMessageStore = swarmMessageStorage;
  };

  /**
   * start connection with the SwarmMessage storage
   *
   * @protected
   * @memberof ConnectionBridge
   * @throws
   */
  protected async createAndStartSwarmMessageStorageConnection(): Promise<SMS> {
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
    this.setCurrentSwarmMessageStorage(undefined);
    this.optionsMessageStorage = undefined;
  }

  /**
   * close the default constructor of a swarm messages,
   * release it's options and the instance.
   *
   * @protected
   * @memberof ConnectionBridge
   */
  protected closeMessageConstructor(): void {
    this.messageConstructor = undefined;
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
  protected closeSwarmMessageEncryptedCacheFabric(): void {
    this.swarmMessageEncryptedCacheFabric = undefined;
  }

  /**
   * close the instance of the fabric
   *
   * @protected
   * @memberof ConnectionBridge
   */
  protected closeSwarmMessageConstructorFabric(): void {
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
    const { _centralAuthorityConnection: caConnection } = this;

    if (caConnection) {
      try {
        await caConnection.disconnect();
      } catch (err) {
        console.error('closeCentralAuthorityConnection failed to close the connection to the central authority', err);
      }
    }
    this._centralAuthorityConnection = undefined;
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
  protected async markSessionAsStartedInStorageForSession(): Promise<void> {
    await this.setFlagInSessionStorageSessionDataIsExists();
  }

  protected getSecretStorageDBName(): string {
    const userLogin = this.getCredentialsWithSession().login;
    return `${CONNECTION_BRIDGE_STORAGE_DATABASE_PREFIX.SECRET_STORAGE}${CONNECTION_BRIDGE_STORAGE_DELIMETER_FOR_STORAGE_KEYS_DEFAULT}${userLogin}`;
  }

  protected getSecretStorageDBOptions(): Partial<IStorageProviderOptions> {
    return {
      dbName: this.getSecretStorageDBName(),
    };
  }

  protected createSecretStorageInstance(): ISecretStorage {
    return new SecretStorage();
  }

  protected async authorizeInSecretStorage(secretStorage: ISecretStorage): Promise<void> {
    const authResult = await secretStorage.authorize(this.getCredentialsWithSession(), this.getSecretStorageDBOptions());
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

  protected async createAndSetSequentlyDependenciesInstances(): Promise<void> {
    this.setCurrentCentralAuthorityConnection(await this.createAndStartConnectionWithCentralAuthority());
    this.setCurrentSwarmMessageEncryptedCacheFabric(await this.createSwarmMessageEncryptedCacheFabric());
    this.setCurrentSwarmMessageConstructorFabric(await this.getSwarmMessageConstructorFabric());
    this.setCurrentSwarmMessageEncryptedCache(await this.createSwarmMessageEncryptedCache());
    this.setCurrentSwarmMessageConstructor(await this.createSwarmMessageConstructor());
    this.setCurrentSwarmConnection(await this.createSwarmConnection());
    this.setCurrentSwarmMessageStorage(await this.createAndStartSwarmMessageStorageConnection());
  }

  protected async closeAndUnsetCurrentSessionSensitiveStorage(): Promise<void> {
    await this.sessionSensitiveStorage?.close();
    this.sessionSensitiveStorage = undefined;
  }

  protected async closeAndUnsetConnectionBridgeSessionDataStore(): Promise<void> {
    await this.connectionBridgeSessionDataStore?.close();
    this.connectionBridgeSessionDataStore = undefined;
  }

  protected async closeSensitiveDataStorages(): Promise<void> {
    await Promise.all([this.closeAndUnsetCurrentSessionSensitiveStorage(), this.closeAndUnsetConnectionBridgeSessionDataStore()]);
  }
}
