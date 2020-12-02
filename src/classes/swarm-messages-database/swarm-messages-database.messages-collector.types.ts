import {
  ESwarmStoreConnector,
  ISwarmStoreConnector,
  ISwarmStoreConnectorBasic,
  ISwarmStoreOptionsConnectorFabric,
  ISwarmStoreProviderOptions,
  TSwarmStoreConnectorConnectionOptions,
  TSwarmStoreDatabaseIteratorMethodArgument,
  TSwarmStoreDatabaseOptions,
  TSwarmStoreDatabaseType,
} from '../swarm-store-class';
import { ISwarmMessageInstanceDecrypted, TSwarmMessageInstance, TSwarmMessageSerialized } from '../swarm-message';
import {
  ISwarmMessageStore,
  ISwarmMessageStoreAccessControlOptions,
  ISwarmMessageStoreMessagingRequestWithMetaResult,
  ISwarmMessageStoreOptionsWithConnectorFabric,
  TSwarmMessagesStoreGrantAccessCallback,
} from '../swarm-message-store';
import { ISwarmMessageConstructorWithEncryptedCacheFabric } from '../swarm-message-encrypted-cache';

/**
 * Meta information about swarm messages store.
 * Usefull when it is necessary e.g. to know overall count of a messages
 * stored and can be read.
 *
 * @export
 * @interface ISwarmMessagesStoreMeta
 */
export interface ISwarmMessagesStoreMeta {
  messagesStoredCount: number;
}

export interface ISwarmMessagesDatabaseMessagesCollectorOptions<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>,
  ConnectorBasic extends ISwarmStoreConnectorBasic<P, T, DbType, DBO>,
  CO extends TSwarmStoreConnectorConnectionOptions<P, T, DbType, DBO, ConnectorBasic>,
  PO extends ISwarmStoreProviderOptions<P, T, DbType, DBO, ConnectorBasic, CO>,
  ConnectorMain extends ISwarmStoreConnector<P, T, DbType, DBO, ConnectorBasic, CO>,
  CFO extends ISwarmStoreOptionsConnectorFabric<P, T, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain>,
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
    CO,
    PO,
    ConnectorMain,
    CFO,
    MSI,
    GAC,
    MCF,
    ACO
  >,
  SMS extends ISwarmMessageStore<P, T, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain, CFO, MSI, GAC, MCF, ACO, O>
> {
  swarmMessageStore: SMS;
}

export interface ISwarmMessagesDatabaseMessagesCollectorWithStorageMetaOptions<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>,
  ConnectorBasic extends ISwarmStoreConnectorBasic<P, T, DbType, DBO>,
  CO extends TSwarmStoreConnectorConnectionOptions<P, T, DbType, DBO, ConnectorBasic>,
  PO extends ISwarmStoreProviderOptions<P, T, DbType, DBO, ConnectorBasic, CO>,
  ConnectorMain extends ISwarmStoreConnector<P, T, DbType, DBO, ConnectorBasic, CO>,
  CFO extends ISwarmStoreOptionsConnectorFabric<P, T, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain>,
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
    CO,
    PO,
    ConnectorMain,
    CFO,
    MSI,
    GAC,
    MCF,
    ACO
  >,
  SMS extends ISwarmMessageStore<P, T, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain, CFO, MSI, GAC, MCF, ACO, O>,
  SMSMeta extends ISwarmMessagesStoreMeta
> extends ISwarmMessagesDatabaseMessagesCollectorOptions<
    P,
    T,
    DbType,
    DBO,
    ConnectorBasic,
    CO,
    PO,
    ConnectorMain,
    CFO,
    MSI,
    GAC,
    MCF,
    ACO,
    O,
    SMS
  > {
  getSwarmMessageStoreMeta(swarmMessageStore: SMS, dbName: DBO['dbName']): Promise<SMSMeta>;
}

/**
 * It's used only for messages collecting from a swarm database.
 *
 * @export
 * @interface ISwarmMessagesDatabaseCacheOptionsDbInstance
 * @template P
 * @template DbType
 * @template MD
 */
export interface ISwarmMessagesDatabaseMessagesCollector<
  P extends ESwarmStoreConnector,
  DbType extends TSwarmStoreDatabaseType<P>,
  MD extends ISwarmMessageInstanceDecrypted
> {
  /**
   * Requests messages stored from the database it's connected to.
   *
   * @param {string} dbName - name of the database
   * @param {TSwarmStoreDatabaseIteratorMethodArgument<P, DbType>} query - query options
   * @returns {(Promise<Array<ISwarmMessageStoreMessagingRequestWithMetaResult<P, MD> | undefined>>)}
   * @memberof ISwarmMessagesDatabaseCacheOptionsDbInstance
   */
  collectWithMeta(
    dbName: string,
    query: TSwarmStoreDatabaseIteratorMethodArgument<P, DbType>
  ): Promise<Array<ISwarmMessageStoreMessagingRequestWithMetaResult<P, MD> | undefined>>;
}

/**
 * Collector which provided some additional meta information about the
 * messages store it handles.
 *
 * Usefull when it is necessary to know e.g. overall count of a messages
 * stored and can be read.
 *
 * @export
 * @interface ISwarmMessagesDatabaseMessagesCollectorWithEntitiesCount
 * @extends {ISwarmMessagesDatabaseMessagesCollector<P, DbType, MD>}
 * @template P
 * @template DbType
 * @template MD
 */
export interface ISwarmMessagesDatabaseMessagesCollectorWithStoreMeta<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>,
  DbType extends TSwarmStoreDatabaseType<P>,
  MD extends ISwarmMessageInstanceDecrypted,
  SMSMeta extends ISwarmMessagesStoreMeta
> extends ISwarmMessagesDatabaseMessagesCollector<P, DbType, MD> {
  /**
   * Meta information about the store handled
   */
  getStoreMeta(dbName: DBO['dbName']): Promise<SMSMeta>;
}

export interface ISwarmMessagesDatabaseMessagesCollectorFabric<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>,
  ConnectorBasic extends ISwarmStoreConnectorBasic<P, T, DbType, DBO>,
  CO extends TSwarmStoreConnectorConnectionOptions<P, T, DbType, DBO, ConnectorBasic>,
  PO extends ISwarmStoreProviderOptions<P, T, DbType, DBO, ConnectorBasic, CO>,
  ConnectorMain extends ISwarmStoreConnector<P, T, DbType, DBO, ConnectorBasic, CO>,
  CFO extends ISwarmStoreOptionsConnectorFabric<P, T, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain>,
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
    CO,
    PO,
    ConnectorMain,
    CFO,
    MSI,
    GAC,
    MCF,
    ACO
  >,
  SMS extends ISwarmMessageStore<P, T, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain, CFO, MSI, GAC, MCF, ACO, O>,
  MD extends ISwarmMessageInstanceDecrypted,
  OPTS extends ISwarmMessagesDatabaseMessagesCollectorOptions<
    P,
    T,
    DbType,
    DBO,
    ConnectorBasic,
    CO,
    PO,
    ConnectorMain,
    CFO,
    MSI,
    GAC,
    MCF,
    ACO,
    O,
    SMS
  >,
  RT extends ISwarmMessagesDatabaseMessagesCollector<P, DbType, MD>
> {
  (options: OPTS): RT;
}

export interface ISwarmMessagesDatabaseMessagesCollectorWithStoreMetaFabric<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>,
  ConnectorBasic extends ISwarmStoreConnectorBasic<P, T, DbType, DBO>,
  CO extends TSwarmStoreConnectorConnectionOptions<P, T, DbType, DBO, ConnectorBasic>,
  PO extends ISwarmStoreProviderOptions<P, T, DbType, DBO, ConnectorBasic, CO>,
  ConnectorMain extends ISwarmStoreConnector<P, T, DbType, DBO, ConnectorBasic, CO>,
  CFO extends ISwarmStoreOptionsConnectorFabric<P, T, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain>,
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
    CO,
    PO,
    ConnectorMain,
    CFO,
    MSI,
    GAC,
    MCF,
    ACO
  >,
  SMS extends ISwarmMessageStore<P, T, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain, CFO, MSI, GAC, MCF, ACO, O>,
  MD extends ISwarmMessageInstanceDecrypted,
  SMSMeta extends ISwarmMessagesStoreMeta,
  OPTS extends ISwarmMessagesDatabaseMessagesCollectorWithStorageMetaOptions<
    P,
    T,
    DbType,
    DBO,
    ConnectorBasic,
    CO,
    PO,
    ConnectorMain,
    CFO,
    MSI,
    GAC,
    MCF,
    ACO,
    O,
    SMS,
    SMSMeta
  >,
  RT extends ISwarmMessagesDatabaseMessagesCollectorWithStoreMeta<P, T, DBO, DbType, MD, SMSMeta>
> {
  (options: OPTS): RT;
}
