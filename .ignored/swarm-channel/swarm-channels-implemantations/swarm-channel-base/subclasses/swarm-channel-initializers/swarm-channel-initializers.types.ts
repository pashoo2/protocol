import {
  ISwarmMessageStore,
  TSwarmMessagesStoreGrantAccessCallback,
  ISwarmMessageStoreAccessControlOptions,
  ISwarmMessageStoreOptionsWithConnectorFabric,
} from '../../../../../../src/classes/swarm-message-store/swarm-message-store.types';
import { ESwarmStoreConnector } from '../../../../../../src/classes/swarm-store-class/swarm-store-class.const';
import { ISecretStorage } from '../../../../../../src/classes/secret-storage-class/secret-storage-class.types';
import {
  TSwarmMessageSerialized,
  TSwarmMessageInstance,
} from '../../../../../../src/classes/swarm-message/swarm-message-constructor.types';
import {
  TSwarmStoreDatabaseType,
  ISwarmStoreConnectorBasic,
  TSwarmStoreConnectorConnectionOptions,
  TSwarmStoreDatabaseOptions,
  ISwarmStoreOptionsConnectorFabric,
  ISwarmStoreProviderOptions,
  ISwarmStoreConnector,
} from '../../../../../../src/classes/swarm-store-class/swarm-store-class.types';
import { ISwarmMessageConstructorWithEncryptedCacheFabric } from '../../../../../../src/classes/swarm-messgae-encrypted-cache/swarm-messgae-encrypted-cache.types';
import { ISwarmChannelBaseUsedInstances, ISwarmChannelBaseConstructorOptions } from '../../swarm-channel-base.types';

export interface ISwarmChannelBaseInitializerOptions<P extends ESwarmStoreConnector = ESwarmStoreConnector.OrbitDB> {
  instances: ISwarmChannelBaseUsedInstances<P>;
  channelOptions: ISwarmChannelBaseConstructorOptions;
}

/**
 * A result of a swarm channel's initialization.
 *
 * @export
 * @interface ISwarmChannelBaseInitializerResult
 * @template P
 */
export interface ISwarmChannelBaseInitializerResult<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  ConnectorBasic extends ISwarmStoreConnectorBasic<P, ItemType, DbType>,
  PO extends TSwarmStoreConnectorConnectionOptions<P, ItemType, DbType, ConnectorBasic>,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType>,
  CO extends ISwarmStoreProviderOptions<P, ItemType, DbType, ConnectorBasic, PO>,
  ConnectorMain extends ISwarmStoreConnector<P, ItemType, DbType, ConnectorBasic, PO, DBO>,
  CFO extends ISwarmStoreOptionsConnectorFabric<P, ItemType, DbType, ConnectorBasic, PO, CO, DBO, ConnectorMain>,
  MSI extends TSwarmMessageInstance | ItemType,
  GAC extends TSwarmMessagesStoreGrantAccessCallback<P, MSI>,
  MCF extends ISwarmMessageConstructorWithEncryptedCacheFabric | undefined,
  ACO extends ISwarmMessageStoreAccessControlOptions<P, ItemType, MSI, GAC> | undefined,
  O extends ISwarmMessageStoreOptionsWithConnectorFabric<
    P,
    ItemType,
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
  >
> {
  /**
   * Local database for storing meta information
   * about the channel locally.
   *
   * @type {ISecretStorage}
   * @memberof ISwarmChannelBaseInitializerResult
   */
  localMetaDb: ISecretStorage;

  /**
   * A database used for sharing messages
   * within the channel's memebers.
   *
   * @type {ISwarmMessageStore<P>}
   * @memberof ISwarmChannelBaseInitializerResult
   */
  messagesDb: ISwarmMessageStore<P, ItemType, DbType, ConnectorBasic, PO, DBO, CO, ConnectorMain, CFO, MSI, GAC, MCF, ACO, O>;

  /**
   * Swarm synced database used for storing
   * and sharing a metadata about the channel.
   *
   * @type {ISwarmMessageStore<P>}
   * @memberof ISwarmChannelBaseInitializerResult
   */
  sharedMetaDb?: ISwarmMessageStore<P, ItemType, DbType, ConnectorBasic, PO, DBO, CO, ConnectorMain, CFO, MSI, GAC, MCF, ACO, O>;
}

/**
 * Instance used for initializing a swarm channel.
 *
 * @export
 * @interface ISwarmChannelBaseInitializer
 * @template P
 */
export interface ISwarmChannelBaseInitializer<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  ConnectorBasic extends ISwarmStoreConnectorBasic<P, ItemType, DbType>,
  PO extends TSwarmStoreConnectorConnectionOptions<P, ItemType, DbType, ConnectorBasic>,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType>,
  CO extends ISwarmStoreProviderOptions<P, ItemType, DbType, ConnectorBasic, PO>,
  ConnectorMain extends ISwarmStoreConnector<P, ItemType, DbType, ConnectorBasic, PO, DBO>,
  CFO extends ISwarmStoreOptionsConnectorFabric<P, ItemType, DbType, ConnectorBasic, PO, CO, DBO, ConnectorMain>,
  MSI extends TSwarmMessageInstance | ItemType,
  GAC extends TSwarmMessagesStoreGrantAccessCallback<P, MSI>,
  MCF extends ISwarmMessageConstructorWithEncryptedCacheFabric | undefined,
  ACO extends ISwarmMessageStoreAccessControlOptions<P, ItemType, MSI, GAC> | undefined,
  O extends ISwarmMessageStoreOptionsWithConnectorFabric<
    P,
    ItemType,
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
  >
> {
  /**
   * Create and start a databases used for storing local and shared metadata,
   * messaging.
   *
   * @returns {Promise<ISwarmChannelBaseInitializerResult<P>>}
   * @memberof ISwarmChannelBaseInitializer
   */
  initialize(): Promise<
    ISwarmChannelBaseInitializerResult<
      P,
      ItemType,
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
    >
  >;
}

/**
 * Swarm message initializer constructor
 *
 * @export
 * @interface ISwarmChannelBaseInitializerConstructor
 * @template P
 */
export interface ISwarmChannelBaseInitializerConstructor<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  ConnectorBasic extends ISwarmStoreConnectorBasic<P, ItemType, DbType>,
  PO extends TSwarmStoreConnectorConnectionOptions<P, ItemType, DbType, ConnectorBasic>,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType>,
  CO extends ISwarmStoreProviderOptions<P, ItemType, DbType, ConnectorBasic, PO>,
  ConnectorMain extends ISwarmStoreConnector<P, ItemType, DbType, ConnectorBasic, PO, DBO>,
  CFO extends ISwarmStoreOptionsConnectorFabric<P, ItemType, DbType, ConnectorBasic, PO, CO, DBO, ConnectorMain>,
  MSI extends TSwarmMessageInstance | ItemType,
  GAC extends TSwarmMessagesStoreGrantAccessCallback<P, MSI>,
  MCF extends ISwarmMessageConstructorWithEncryptedCacheFabric | undefined,
  ACO extends ISwarmMessageStoreAccessControlOptions<P, ItemType, MSI, GAC> | undefined,
  O extends ISwarmMessageStoreOptionsWithConnectorFabric<
    P,
    ItemType,
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
  >
> {
  new (options: ISwarmChannelBaseInitializerOptions<P>): ISwarmChannelBaseInitializer<
    P,
    ItemType,
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
}
