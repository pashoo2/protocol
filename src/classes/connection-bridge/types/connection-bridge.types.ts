import {
  ISwarmMessageStore,
  ISwarmMessageStoreAccessControlOptions,
  ISwarmMessageStoreOptions,
  ISwarmMessageStoreOptionsWithConnectorFabric,
  TSwarmMessagesStoreGrantAccessCallback,
} from '../../swarm-message-store/types/swarm-message-store.types';
import { ESwarmStoreConnector } from '../../swarm-store-class/swarm-store-class.const';
import { ICentralAuthority, ICentralAuthorityOptions } from '../../central-authority-class/central-authority-class.types';
import {
  ISwarmMessageConstructor,
  TSwarmMessageInstance,
  TSwarmMessageSerialized,
} from '../../swarm-message/swarm-message-constructor.types';
import { ISensitiveDataSessionStorageOptions } from 'classes/sensitive-data-session-storage/sensitive-data-session-storage.types';
import {
  ISwarmMessageConstructorWithEncryptedCacheFabric,
  ISwarmMessageEncryptedCacheFabric,
} from '../../swarm-message-encrypted-cache/swarm-messgae-encrypted-cache.types';
import {
  ISwarmStoreConnector,
  ISwarmStoreConnectorBasic,
  ISwarmStoreOptionsConnectorFabric,
  ISwarmStoreProviderOptions,
  TSwarmStoreConnectorBasicFabric,
  TSwarmStoreConnectorConnectionOptions,
  TSwarmStoreConnectorConstructorOptions,
  TSwarmStoreDatabaseOptions,
  TSwarmStoreDatabaseType,
} from '../../swarm-store-class/swarm-store-class.types';
import { IPFS } from 'types/ipfs.types';
import { ISerializer } from '../../../types/serialization.types';
import { ISwarmMessageInstanceEncrypted } from '../../swarm-message/swarm-message-constructor.types';
import {
  ISwarmStoreConnectorDatabasesPersistentListConstructorParams,
  ISwarmStoreConnectorDatabasesPersistentList,
} from '../../swarm-store-class/swarm-store-class.types';

export type TNativeConnectionType<P extends ESwarmStoreConnector> = P extends ESwarmStoreConnector.OrbitDB ? IPFS : never;

export type TNativeConnectionOptions<P extends ESwarmStoreConnector> = P extends ESwarmStoreConnector.OrbitDB ? {} : never;

export type TConnectionBridgeOptionsAuthCredentials = {
  login: string;
  password: string | undefined;
};

export type TConnectionBridgeCFODefault<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>,
  ConnectorBasic extends ISwarmStoreConnectorBasic<P, T, DbType, DBO>,
  PO extends TSwarmStoreConnectorConnectionOptions<P, T, DbType, DBO, ConnectorBasic>,
  CO extends ISwarmStoreProviderOptions<P, T, DbType, DBO, ConnectorBasic, PO>,
  ConnectorMain extends ISwarmStoreConnector<P, T, DbType, DBO, ConnectorBasic, PO>,
  CFO extends ISwarmStoreOptionsConnectorFabric<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain> | undefined
> = CFO extends undefined ? ISwarmStoreOptionsConnectorFabric<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain> : CFO;

export interface IConnectionBridgeOptionsAuth<CD extends boolean = false> {
  /**
   * url of an  auth provider from the auth providers pool
   * on which the user will be authorized or registered
   * if still had not.
   *
   * @type {ICentralAuthorityOptions['user']['authProviderUrl']}
   */
  providerUrl: ICentralAuthorityOptions['user']['authProviderUrl'];
  /**
   * credentials used to authorize or register on a credentials
   * provider. If credentials are not provided, then session
   * must be started before
   *
   * @type {ICentralAuthorityOptions['user']['credentials']}
   */
  credentials: CD extends true ? TConnectionBridgeOptionsAuthCredentials : TConnectionBridgeOptionsAuthCredentials | undefined;
  session?: ISensitiveDataSessionStorageOptions;
  /**
   * this is list of auth providers will be used to authorize
   * the user and a keys of another users connected to the
   * swarm
   *
   * @type {ICentralAuthorityOptions['authProvidersPool']}
   */
  authProvidersPool?: ICentralAuthorityOptions['authProvidersPool'];
}

export interface IConnectionBridgeSwarmConnection<P extends ESwarmStoreConnector, NC extends TNativeConnectionType<P>> {
  getNativeConnection(): NC;
}

export interface IGetBasicConnectorFabric<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>,
  ConnectorBasic extends ISwarmStoreConnectorBasic<P, T, DbType, DBO>,
  PO extends TSwarmStoreConnectorConnectionOptions<P, T, DbType, DBO, ConnectorBasic>,
  CO extends ISwarmStoreProviderOptions<P, T, DbType, DBO, ConnectorBasic, PO>,
  ConnectorMain extends ISwarmStoreConnector<P, T, DbType, DBO, ConnectorBasic, PO>
> {
  (
    swarmStoreConnectorConstructorOptions: TSwarmStoreConnectorConstructorOptions<P, T, DbType>
  ): ISwarmStoreOptionsConnectorFabric<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain>;
}

export interface IConnectionBridgeOptionsGetMainConnectorFabric<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>,
  ConnectorBasic extends ISwarmStoreConnectorBasic<P, T, DbType, DBO>,
  CO extends TSwarmStoreConnectorConnectionOptions<P, T, DbType, DBO, ConnectorBasic>,
  PO extends ISwarmStoreProviderOptions<P, T, DbType, DBO, ConnectorBasic, CO>,
  ConnectorMain extends ISwarmStoreConnector<P, T, DbType, DBO, ConnectorBasic, CO>
> {
  (
    swarmStoreConnectorConstructorOptions: TSwarmStoreConnectorConstructorOptions<P, T, DbType>
  ): ISwarmStoreOptionsConnectorFabric<P, T, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain>;
}

export interface ISwarmStoreDatabasesPersistentListFabric<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>,
  DBL extends Record<DBO['dbName'], DBO>
> {
  (persistentListOptions: ISwarmStoreConnectorDatabasesPersistentListConstructorParams): Promise<
    ISwarmStoreConnectorDatabasesPersistentList<P, T, DbType, DBO, DBL>
  >;
}

export interface IConnectionBridgeStorageOptions<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>,
  ConnectorBasic extends ISwarmStoreConnectorBasic<P, T, DbType, DBO>,
  CO extends TSwarmStoreConnectorConnectionOptions<P, T, DbType, DBO, ConnectorBasic>,
  PO extends ISwarmStoreProviderOptions<P, T, DbType, DBO, ConnectorBasic, CO>,
  ConnectorMain extends ISwarmStoreConnector<P, T, DbType, DBO, ConnectorBasic, CO>,
  MSI extends TSwarmMessageInstance | T,
  GAC extends TSwarmMessagesStoreGrantAccessCallback<P, Exclude<MSI, ISwarmMessageInstanceEncrypted>>,
  MCF extends ISwarmMessageConstructorWithEncryptedCacheFabric,
  ACO extends ISwarmMessageStoreAccessControlOptions<P, T, Exclude<MSI, ISwarmMessageInstanceEncrypted>, GAC>,
  CFO extends ISwarmStoreOptionsConnectorFabric<P, T, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain>,
  CBFO extends TSwarmStoreConnectorBasicFabric<P, T, DbType, DBO, ConnectorBasic>,
  O extends ISwarmMessageStoreOptionsWithConnectorFabric<
    P,
    T,
    DbType,
    DBO,
    ConnectorBasic,
    CO,
    PO,
    ConnectorMain,
    CFOD,
    MSI,
    GAC,
    MCF,
    ACO
  >,
  SMS extends ISwarmMessageStore<P, T, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain, CFOD, MSI, GAC, MCF, ACO, O>,
  SSDPLF extends ISwarmStoreDatabasesPersistentListFabric<P, T, DbType, DBO, Record<DBO['dbName'], DBO>>,
  CFOD extends TConnectionBridgeCFODefault<
    P,
    T,
    DbType,
    DBO,
    ConnectorBasic,
    CO,
    PO,
    ConnectorMain,
    CFO
  > = TConnectionBridgeCFODefault<P, T, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain, CFO>
> extends Omit<
    ISwarmMessageStoreOptions<P, T, DbType, DBO, ConnectorBasic, CO, MSI, GAC, MCF, ACO>,
    | 'userId'
    | 'credentials'
    | 'messageConstructors'
    | 'providerConnectionOptions'
    | 'persistentDatbasesList'
    | 'swarmMessageConstructorFabric'
    | 'cache'
  > {
  swarmMessageConstructorFabric: O['swarmMessageConstructorFabric'] | undefined;
  connectorBasicFabric: CBFO;
  getMainConnectorFabric:
    | IConnectionBridgeOptionsGetMainConnectorFabric<P, T, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain>
    | undefined;
  swarmMessageStoreInstanceFabric: () => SMS;
  swarmStoreDatabasesPersistentListFabric: SSDPLF;
  connectorMainFabric?: CFO;
}

export interface IConnectionBridgeOptionsUser {
  /**
   * profile of the user for the central auth provider
   *
   * @type {ICentralAuthorityOptions['user']['profile']}
   */
  profile?: ICentralAuthorityOptions['user']['profile'];
}

export interface IConnectionBridgeOptions<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>,
  ConnectorBasic extends ISwarmStoreConnectorBasic<P, T, DbType, DBO>,
  CO extends TSwarmStoreConnectorConnectionOptions<P, T, DbType, DBO, ConnectorBasic>,
  PO extends ISwarmStoreProviderOptions<P, T, DbType, DBO, ConnectorBasic, CO>,
  ConnectorMain extends ISwarmStoreConnector<P, T, DbType, DBO, ConnectorBasic, CO>,
  MSI extends TSwarmMessageInstance | T,
  GAC extends TSwarmMessagesStoreGrantAccessCallback<P, Exclude<MSI, ISwarmMessageInstanceEncrypted>>,
  MCF extends ISwarmMessageConstructorWithEncryptedCacheFabric,
  ACO extends ISwarmMessageStoreAccessControlOptions<P, T, Exclude<MSI, ISwarmMessageInstanceEncrypted>, GAC>,
  CFO extends ISwarmStoreOptionsConnectorFabric<P, T, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain>,
  CBFO extends TSwarmStoreConnectorBasicFabric<P, T, DbType, DBO, ConnectorBasic>,
  CD extends boolean,
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
  >,
  SSDPLF extends ISwarmStoreDatabasesPersistentListFabric<P, T, DbType, DBO, Record<DBO['dbName'], DBO>>,
  SRLZR extends ISerializer
> {
  swarmStoreConnectorType: P;
  user: IConnectionBridgeOptionsUser;
  auth: IConnectionBridgeOptionsAuth<CD>;
  /**
   * this is options for a swarm databases user will be
   * used to store a data.
   *
   * @type {ISwarmMessageStoreOptions<P>}
   * @memberof IConnectionBridgeOptions
   */
  storage: IConnectionBridgeStorageOptions<
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
    O,
    SMS,
    SSDPLF
  >;
  /**
   * specify options for the swarm connection native provider
   *
   * @memberof IConnectionBridgeOptions
   */
  nativeConnection: TNativeConnectionOptions<P>;
  /**
   * This serializer will be used for parsing/serialization of an various objects
   * to a string.
   *
   * @type {ISerializer}
   * @memberof IConnectionBridgeStorageOptions
   */
  serializer: SRLZR;
}

export interface IConnectionBridge<
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
  GAC extends TSwarmMessagesStoreGrantAccessCallback<P, Exclude<MSI, ISwarmMessageInstanceEncrypted>>,
  MCF extends ISwarmMessageConstructorWithEncryptedCacheFabric,
  ACO extends ISwarmMessageStoreAccessControlOptions<P, T, Exclude<MSI, ISwarmMessageInstanceEncrypted>, GAC>,
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
    SSDPLF,
    SRLZR
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
  >,
  SSDPLF extends ISwarmStoreDatabasesPersistentListFabric<P, T, DbType, DBO, Record<DBO['dbName'], DBO>>,
  SRLZR extends ISerializer
> {
  /**
   * used to authorize the user or get
   * a common information about the users
   * also connected to the swarm.
   *
   * @type {ICentralAuthority}
   * @memberof IConnectionBridge
   */
  readonly centralAuthorityConnection?: ICentralAuthority;
  /**
   * storage allows to add or read messages from
   * the swarm
   *
   * @type {ISwarmMessageStore<P>}
   * @memberof IConnectionBridge
   */
  readonly swarmMessageStore?: SMS;
  /**
   * allows to create messages, which can be stored in the swarm
   *
   * @type {ISwarmMessageConstructor}
   * @memberof IConnectionBridge
   */
  messageConstructor?: ISwarmMessageConstructor;

  /**
   * Fabric which provides instances of SwarmMessageEncryptedCache,
   * already connected to the storage and ready to use.
   *
   * @type {ISwarmMessageEncryptedCacheFabric}
   * @memberof IConnectionBridge
   */
  swarmMessageEncryptedCacheFabric?: ISwarmMessageEncryptedCacheFabric;

  /**
   * allows to construct SwarmMessagesConstructor with support of
   * encrypted cache storage and ready to use.
   *
   * @type {ISwarmMessageConstructorWithEncryptedCacheFabric}
   * @memberof IConnectionBridge
   */
  swarmMessageConstructorFabric?: ISwarmMessageConstructorWithEncryptedCacheFabric;

  /**
   * Connect to central authority and swarm. If the connection
   * will be succeed than the caConnection and storage
   * properties will be available.
   * If email or any other operations are necessary then
   * the promise returned will be resolved with Error
   * have a message with the problem description.
   *
   * @param {IConnectionBridgeOptions<P>} options
   * @returns {(Promise<Error | void>)}
   * @memberof IConnectionBridge
   */
  connect(options: CBO): Promise<Error | void>;

  /**
   * checks was a session started before and
   * if it's data is available for now.
   * If a session is availablr, the user
   * can try to connect without credentials.
   *
   * @param {(ISensitiveDataSessionStorageOptions | IConnectionBridgeOptions<P>)} [options]
   * @returns {Promise<boolean>}
   * @memberof IConnectionBridge
   */
  checkSessionAvailable(options?: ISensitiveDataSessionStorageOptions | CBO): Promise<boolean>;
  /**
   * Close all connections and release the options.
   * The connection can't be used anymore.
   *
   * @returns {(Promise<Error | void>)}
   * @memberof IConnectionBridge
   */
  close(): Promise<Error | void>;
}

export interface IConnectionBridgeOptionsDefault<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  CD extends boolean = true,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType> = TSwarmStoreDatabaseOptions<P, T, DbType>,
  MSI extends TSwarmMessageInstance | T = TSwarmMessageInstance | T,
  MCF extends ISwarmMessageConstructorWithEncryptedCacheFabric = ISwarmMessageConstructorWithEncryptedCacheFabric,
  GAC extends TSwarmMessagesStoreGrantAccessCallback<
    P,
    Exclude<MSI, ISwarmMessageInstanceEncrypted>
  > = TSwarmMessagesStoreGrantAccessCallback<P, Exclude<MSI, ISwarmMessageInstanceEncrypted>>,
  ACO extends ISwarmMessageStoreAccessControlOptions<
    P,
    T,
    Exclude<MSI, ISwarmMessageInstanceEncrypted>,
    GAC
  > = ISwarmMessageStoreAccessControlOptions<P, T, Exclude<MSI, ISwarmMessageInstanceEncrypted>, GAC>,
  ConnectorBasic extends ISwarmStoreConnectorBasic<P, T, DbType, DBO> = ISwarmStoreConnectorBasic<P, T, DbType, DBO>,
  CBFO extends TSwarmStoreConnectorBasicFabric<P, T, DbType, DBO, ConnectorBasic> = TSwarmStoreConnectorBasicFabric<
    P,
    T,
    DbType,
    DBO,
    ConnectorBasic
  >,
  CO extends TSwarmStoreConnectorConnectionOptions<P, T, DbType, DBO, ConnectorBasic> = TSwarmStoreConnectorConnectionOptions<
    P,
    T,
    DbType,
    DBO,
    ConnectorBasic
  >,
  PO extends ISwarmStoreProviderOptions<P, T, DbType, DBO, ConnectorBasic, CO> = ISwarmStoreProviderOptions<
    P,
    T,
    DbType,
    DBO,
    ConnectorBasic,
    CO
  >,
  ConnectorMain extends ISwarmStoreConnector<P, T, DbType, DBO, ConnectorBasic, CO> = ISwarmStoreConnector<
    P,
    T,
    DbType,
    DBO,
    ConnectorBasic,
    CO
  >,
  CFO extends ISwarmStoreOptionsConnectorFabric<
    P,
    T,
    DbType,
    DBO,
    ConnectorBasic,
    CO,
    PO,
    ConnectorMain
  > = ISwarmStoreOptionsConnectorFabric<P, T, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain>,
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
  > = ISwarmMessageStoreOptionsWithConnectorFabric<
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
  SSDPLF extends ISwarmStoreDatabasesPersistentListFabric<
    P,
    T,
    DbType,
    DBO,
    Record<DBO['dbName'], DBO>
  > = ISwarmStoreDatabasesPersistentListFabric<P, T, DbType, DBO, Record<DBO['dbName'], DBO>>,
  SRLZR extends ISerializer = ISerializer
> extends IConnectionBridgeOptions<
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
    SSDPLF,
    SRLZR
  > {}

export type TConnectionBridgeStorageOptionsDefault<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  CD extends boolean = true,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType> = TSwarmStoreDatabaseOptions<P, T, DbType>,
  MSI extends TSwarmMessageInstance | T = TSwarmMessageInstance | T
> = IConnectionBridgeOptionsDefault<P, T, DbType, CD, DBO, MSI>['storage'];

export interface IConnectionBridgeUnknown<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  CD extends boolean = true,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType> = TSwarmStoreDatabaseOptions<P, T, DbType>,
  MSI extends TSwarmMessageInstance | T = TSwarmMessageInstance | T,
  MCF extends ISwarmMessageConstructorWithEncryptedCacheFabric = ISwarmMessageConstructorWithEncryptedCacheFabric,
  GAC extends TSwarmMessagesStoreGrantAccessCallback<
    P,
    Exclude<MSI, ISwarmMessageInstanceEncrypted>
  > = TSwarmMessagesStoreGrantAccessCallback<P, Exclude<MSI, ISwarmMessageInstanceEncrypted>>,
  SSDPLF extends ISwarmStoreDatabasesPersistentListFabric<
    P,
    T,
    DbType,
    DBO,
    Record<DBO['dbName'], DBO>
  > = ISwarmStoreDatabasesPersistentListFabric<P, T, DbType, DBO, Record<DBO['dbName'], DBO>>,
  SRLZR extends ISerializer = ISerializer
> extends IConnectionBridge<
    P,
    T,
    DbType,
    DBO,
    any,
    any,
    any,
    any,
    any,
    any,
    MSI,
    GAC,
    MCF,
    any,
    any,
    CD,
    any,
    any,
    SSDPLF,
    SRLZR
  > {}
