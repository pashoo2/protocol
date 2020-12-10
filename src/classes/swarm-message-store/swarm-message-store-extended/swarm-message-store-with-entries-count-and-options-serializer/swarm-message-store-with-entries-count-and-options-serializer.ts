import { ESwarmStoreConnector } from '../../../swarm-store-class/swarm-store-class.const';
import { TSwarmMessageSerialized, TSwarmMessageInstance } from '../../../swarm-message/swarm-message-constructor.types';
import {
  TSwarmStoreDatabaseType,
  TSwarmStoreConnectorConnectionOptions,
  TSwarmStoreDatabaseOptions,
  ISwarmStoreProviderOptions,
  ISwarmStoreOptionsConnectorFabric,
  TSwarmStoreOptionsOfDatabasesKnownList,
} from '../../../swarm-store-class/swarm-store-class.types';
import {
  TSwarmMessagesStoreGrantAccessCallback,
  ISwarmMessageStoreAccessControlOptions,
  ISwarmMessageStoreOptionsWithConnectorFabric,
  ISwarmMessageStoreEvents,
} from '../../swarm-message-store.types';
import { ISwarmMessageConstructorWithEncryptedCacheFabric } from '../../../swarm-message-encrypted-cache/swarm-messgae-encrypted-cache.types';
import {
  ISwarmStoreConnectorBasicWithEntriesCount,
  ISwarmStoreConnectorWithEntriesCount,
} from '../../../swarm-store-class/swarm-store-class-extended/swarm-store-class-with-entries-count/swarm-store-class-with-entries-count.types';
import { getClassSwarmMessageStoreWithEntriesCount } from 'classes/swarm-message-store/swarm-message-store-extended/swarm-message-store-with-entries-count/swarm-message-store-with-entries-count';
import { extendClassSwarmStoreWithOptionsConstructor } from '../../../swarm-store-class/swarm-store-class-extended/swarm-store-class-with-options-constructor/swarm-store-class-with-options-constructor-mixin';
import { ISwarmStoreOptionsClassConstructor } from '../../../swarm-store-class/swarm-store-class.types';

export function getClassSwarmMessageStoreWithEntriesCountAndOptionsSerializer<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>,
  ConnectorBasic extends ISwarmStoreConnectorBasicWithEntriesCount<P, ItemType, DbType, DBO>,
  PO extends TSwarmStoreConnectorConnectionOptions<P, ItemType, DbType, DBO, ConnectorBasic>,
  CO extends ISwarmStoreProviderOptions<P, ItemType, DbType, DBO, ConnectorBasic, PO>,
  ConnectorMain extends ISwarmStoreConnectorWithEntriesCount<P, ItemType, DbType, DBO, ConnectorBasic, PO>,
  CFO extends ISwarmStoreOptionsConnectorFabric<P, ItemType, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain>,
  MSI extends TSwarmMessageInstance | ItemType,
  GAC extends TSwarmMessagesStoreGrantAccessCallback<P, MSI>,
  MCF extends ISwarmMessageConstructorWithEncryptedCacheFabric | undefined,
  ACO extends ISwarmMessageStoreAccessControlOptions<P, ItemType, MSI, GAC> | undefined,
  O extends ISwarmMessageStoreOptionsWithConnectorFabric<
    P,
    ItemType,
    DbType,
    DBO,
    ConnectorBasic,
    PO,
    CO,
    ConnectorMain,
    CFO,
    MSI,
    GAC,
    MCF,
    ACO
  >,
  E extends ISwarmMessageStoreEvents<P, ItemType, DbType, DBO>,
  DBL extends TSwarmStoreOptionsOfDatabasesKnownList<P, ItemType, DbType, DBO>
>(SwarmStoreOptionsClass?: ISwarmStoreOptionsClassConstructor<P, ItemType, DbType, DBO, ConnectorBasic, PO>) {
  return extendClassSwarmStoreWithOptionsConstructor<P, ItemType, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain, CFO, O>(
    getClassSwarmMessageStoreWithEntriesCount<
      P,
      ItemType,
      DbType,
      DBO,
      ConnectorBasic,
      PO,
      CO,
      ConnectorMain,
      CFO,
      MSI,
      GAC,
      MCF,
      ACO,
      O,
      E,
      DBL
    >(),
    SwarmStoreOptionsClass
  );
}
