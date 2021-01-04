import {
  ISwarmMessageStore,
  ISwarmMessageStoreMessagingRequestWithMetaResult,
} from '../../../swarm-message-store/types/swarm-message-store.types';
import { ESwarmStoreConnector } from '../../../swarm-store-class/swarm-store-class.const';
import {
  TSwarmStoreDatabaseType,
  TSwarmStoreDatabaseOptions,
  TSwarmStoreDatabaseIteratorMethodArgument,
} from '../../../swarm-store-class/swarm-store-class.types';
import { ISwarmMessageInstanceDecrypted, TSwarmMessageSerialized } from '../../../swarm-message/swarm-message-constructor.types';
import {
  TSwarmStoreConnectorConnectionOptions,
  ISwarmStoreProviderOptions,
  ISwarmStoreOptionsConnectorFabric,
} from '../../../swarm-store-class/swarm-store-class.types';
import { TSwarmMessageInstance } from '../../../swarm-message/swarm-message-constructor.types';
import {
  TSwarmMessagesStoreGrantAccessCallback,
  ISwarmMessageStoreAccessControlOptions,
  ISwarmMessageStoreOptionsWithConnectorFabric,
} from '../../../swarm-message-store/types/swarm-message-store.types';
import { ISwarmMessageConstructorWithEncryptedCacheFabric } from '../../../swarm-message-encrypted-cache/swarm-messgae-encrypted-cache.types';
import { ISwarmStoreConnectorBasic, ISwarmStoreConnector } from '../../../swarm-store-class/swarm-store-class.types';
import { ISwarmMessagesDatabaseMessagesCollector } from '../../swarm-messages-database.messages-collector.types';
import { ISwarmMessagesDatabaseMessagesCollectorOptions } from '../../swarm-messages-database.messages-collector.types';

export class SwarmMessagesDatabaseMessagesCollector<
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
  MD extends ISwarmMessageInstanceDecrypted
> implements ISwarmMessagesDatabaseMessagesCollector<P, DbType, MD> {
  protected get _swarmMesssagesStore(): SMS {
    return this._options.swarmMessageStore;
  }

  constructor(
    protected _options: ISwarmMessagesDatabaseMessagesCollectorOptions<
      P,
      T,
      DbType,
      DBO,
      ConnectorBasic,
      CO,
      PO,
      ConnectorMain,
      CFO,
      MD,
      GAC,
      MCF,
      ACO,
      O,
      SMS
    >
  ) {
    if (!_options.swarmMessageStore) {
      throw new Error('An instance of the SwarmMessageStore should be provided in the options');
    }
  }

  public async collectWithMeta(
    dbName: string,
    options: TSwarmStoreDatabaseIteratorMethodArgument<P, DbType>
  ): Promise<Array<ISwarmMessageStoreMessagingRequestWithMetaResult<P, MD> | undefined>> {
    const result = await this._swarmMesssagesStore.collectWithMeta(dbName, options);

    // TODO - need to check all the results
    return result as Array<ISwarmMessageStoreMessagingRequestWithMetaResult<P, MD> | undefined>;
  }
}

export function createSwarmMessagesDatabaseMessagesCollectorInstance<
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
  MD extends ISwarmMessageInstanceDecrypted
>(
  options: ISwarmMessagesDatabaseMessagesCollectorOptions<
    P,
    T,
    DbType,
    DBO,
    ConnectorBasic,
    CO,
    PO,
    ConnectorMain,
    CFO,
    MD,
    GAC,
    MCF,
    ACO,
    O,
    SMS
  >
): ISwarmMessagesDatabaseMessagesCollector<P, DbType, MD> {
  return new SwarmMessagesDatabaseMessagesCollector(options);
}
