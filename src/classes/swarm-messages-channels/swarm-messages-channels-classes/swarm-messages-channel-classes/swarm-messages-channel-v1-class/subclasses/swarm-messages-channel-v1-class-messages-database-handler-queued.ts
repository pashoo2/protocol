import { ISwarmMessageConstructorWithEncryptedCacheFabric } from '../../../../../swarm-message-encrypted-cache/swarm-message-encrypted-cache.types';
import { ESwarmStoreConnector } from '../../../../../swarm-store-class/swarm-store-class.const';
import {
  ISwarmStoreConnector,
  ISwarmStoreConnectorBasic,
  ISwarmStoreOptionsConnectorFabric,
  ISwarmStoreProviderOptions,
  TSwarmStoreConnectorConnectionOptions,
  TSwarmStoreDatabaseOptions,
  TSwarmStoreDatabaseType,
} from '../../../../../swarm-store-class/swarm-store-class.types';
import {
  ISwarmMessageInstanceDecrypted,
  TSwarmMessageSerialized,
} from '../../../../../swarm-message/swarm-message-constructor.types';
import {
  ISwarmMessageStore,
  ISwarmMessageStoreAccessControlOptions,
  ISwarmMessageStoreOptionsWithConnectorFabric,
  TSwarmMessagesStoreGrantAccessCallback,
} from '../../../../../swarm-message-store/types/swarm-message-store.types';
import {
  ISwarmMessagesDatabaseCacheOptions,
  ISwarmMessagesDatabaseCache,
  ISwarmMessagesDatabaseConnectOptions,
} from '../../../../../swarm-messages-database/swarm-messages-database.types';
import { ISwarmMessagesDatabaseMessagesCollector } from '../../../../../swarm-messages-database/swarm-messages-database.messages-collector.types';
import { SwarmMessagesChannelV1DatabaseHandler } from './swarm-messages-channel-v1-class-messages-database-handler';
import { SWARM_MESSAGES_CHANNEL_V1_DATABASE_CONNECTOR_OPERATIONS_TIMEOUT_DEFAULT_MS } from '../const/swarm-messages-channel-v1-class-timeouts.const';
import { decoratorAsyncQueueConcurentMixinDefault } from '../../../../../basic-classes/async-queue-class-base';

/**
 * Helper class that helps in maintaining
 * a channel's swarm messages database.
 *
 * @export
 * @interface ISwarmMessagesChannelV1DatabaseHandler
 * @extends {(Pick<ISwarmMessagesChannel<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain, CFO, GAC, MCF, ACO, O, SMS, MD>, 'addMessage' | 'deleteMessage' | 'collect' | 'collectWithMeta' | 'setPasswordForMessagesEncryption'>)}
 * @template P
 * @template T
 * @template DbType
 * @template DBO
 * @template ConnectorBasic
 * @template CO
 * @template PO
 * @template ConnectorMain
 * @template CFO
 * @template GAC
 * @template MCF
 * @template ACO
 * @template O
 * @template SMS
 * @template MD
 * @template SMSM
 * @template DCO
 * @template DCCRT
 * @template OPT
 */
@decoratorAsyncQueueConcurentMixinDefault(
  SWARM_MESSAGES_CHANNEL_V1_DATABASE_CONNECTOR_OPERATIONS_TIMEOUT_DEFAULT_MS,
  'restartDatabaseConnectorInstanceWithDbOptions',
  'addMessage',
  'deleteMessage',
  'collect',
  'collectWithMeta'
)
export class SwarmMessagesChannelV1DatabaseHandlerQueued<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>,
  ConnectorBasic extends ISwarmStoreConnectorBasic<P, T, DbType, DBO>,
  CO extends TSwarmStoreConnectorConnectionOptions<P, T, DbType, DBO, ConnectorBasic>,
  PO extends ISwarmStoreProviderOptions<P, T, DbType, DBO, ConnectorBasic, CO>,
  ConnectorMain extends ISwarmStoreConnector<P, T, DbType, DBO, ConnectorBasic, CO>,
  CFO extends ISwarmStoreOptionsConnectorFabric<P, T, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain>,
  GAC extends TSwarmMessagesStoreGrantAccessCallback<P, MD | T>,
  MCF extends ISwarmMessageConstructorWithEncryptedCacheFabric | undefined,
  ACO extends ISwarmMessageStoreAccessControlOptions<P, T, MD | T, GAC> | undefined,
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
    MD | T,
    GAC,
    MCF,
    ACO
  >,
  SMS extends ISwarmMessageStore<P, T, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain, CFO, MD | T, GAC, MCF, ACO, O>,
  MD extends ISwarmMessageInstanceDecrypted,
  SMSM extends ISwarmMessagesDatabaseMessagesCollector<P, DbType, MD>,
  DCO extends ISwarmMessagesDatabaseCacheOptions<P, DbType, MD, SMSM>,
  DCCRT extends ISwarmMessagesDatabaseCache<P, T, DbType, DBO, MD, SMSM>,
  OPT extends ISwarmMessagesDatabaseConnectOptions<
    P,
    T,
    DbType,
    DBO,
    ConnectorBasic,
    CO,
    PO,
    ConnectorMain,
    CFO,
    GAC,
    MCF,
    ACO,
    O,
    SMS,
    MD,
    SMSM,
    DCO,
    DCCRT
  >
> extends SwarmMessagesChannelV1DatabaseHandler<
  P,
  T,
  DbType,
  DBO,
  ConnectorBasic,
  CO,
  PO,
  ConnectorMain,
  CFO,
  GAC,
  MCF,
  ACO,
  O,
  SMS,
  MD,
  SMSM,
  DCO,
  DCCRT,
  OPT
> {}
