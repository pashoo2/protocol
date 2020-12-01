import {
  ISwarmMessageStore,
  ISwarmMessageStoreMessagingRequestWithMetaResult,
} from '../../../swarm-message-store/swarm-message-store.types';
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
} from '../../../swarm-message-store/swarm-message-store.types';
import { ISwarmMessageConstructorWithEncryptedCacheFabric } from '../../../swarm-messgae-encrypted-cache/swarm-messgae-encrypted-cache.types';
import { ISwarmStoreConnectorBasic, ISwarmStoreConnector } from '../../../swarm-store-class/swarm-store-class.types';
import {
  ISwarmMessagesDatabaseMessagesCollectorWithStorageMetaOptions,
  ISwarmMessagesStoreMeta,
} from '../../swarm-messages-database.messages-collector.types';
import { ISwarmMessagesDatabaseMessagesCollectorWithStoreMeta } from '../../swarm-messages-database.messages-collector.types';
import { SwarmMessagesDatabaseMessagesCollector } from '../swarm-messages-database-messages-collector';

class SwarmMessagesDatabaseMessagesCollectorWithStoreMeta<
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
    SMSMeta extends ISwarmMessagesStoreMeta
  >
  extends SwarmMessagesDatabaseMessagesCollector<
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
    MD
  >
  implements ISwarmMessagesDatabaseMessagesCollectorWithStoreMeta<P, DbType, MD, SMSMeta> {
  protected get _swarmMesssagesStore(): SMS {
    return this._options.swarmMessageStore;
  }

  constructor(
    protected _options: ISwarmMessagesDatabaseMessagesCollectorWithStorageMetaOptions<
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
    >
  ) {
    super(_options);
  }

  public async collectWithMeta(
    dbName: string,
    options: TSwarmStoreDatabaseIteratorMethodArgument<P, DbType>
  ): Promise<Array<ISwarmMessageStoreMessagingRequestWithMetaResult<P, MD> | undefined>> {
    const result = await this._swarmMesssagesStore.collectWithMeta(dbName, options);

    // TODO - need to check all the results
    return result as Array<ISwarmMessageStoreMessagingRequestWithMetaResult<P, MD> | undefined>;
  }

  public async getStoreMeta(): Promise<SMSMeta> {
    return this._options.getSwarmMessageStoreMeta(this._swarmMesssagesStore);
  }
}

export function createSwarmMessagesDatabaseMessagesCollectorWithStoreMetaInstance<
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
  SMSMeta extends ISwarmMessagesStoreMeta
>(
  options: ISwarmMessagesDatabaseMessagesCollectorWithStorageMetaOptions<
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
  >
): ISwarmMessagesDatabaseMessagesCollectorWithStoreMeta<P, DbType, MD, SMSMeta> {
  return new SwarmMessagesDatabaseMessagesCollectorWithStoreMeta(options);
}