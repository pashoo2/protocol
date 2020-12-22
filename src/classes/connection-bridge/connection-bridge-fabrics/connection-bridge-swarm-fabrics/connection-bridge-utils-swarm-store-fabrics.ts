import { getClassSwarmMessageStoreWithEntriesCountAndOptionsSerializer } from '../../../swarm-message-store/swarm-message-store-extended/swarm-message-store-with-entries-count-and-options-serializer';
import { ESwarmStoreConnector } from '../../../swarm-store-class/swarm-store-class.const';
import {
  ISwarmStoreOptionsConnectorFabric,
  ISwarmStoreProviderOptions,
  TSwarmStoreConnectorConnectionOptions,
  TSwarmStoreDatabaseOptions,
  TSwarmStoreDatabaseType,
} from '../../../swarm-store-class/swarm-store-class.types';
import { ISwarmMessageConstructorWithEncryptedCacheFabric } from '../../../swarm-message-encrypted-cache/swarm-messgae-encrypted-cache.types';
import {
  ISwarmStoreConnectorBasicWithEntriesCount,
  ISwarmStoreConnectorWithEntriesCount,
} from '../../../swarm-store-class/swarm-store-class-extended/swarm-store-class-with-entries-count/swarm-store-class-with-entries-count.types';
import {
  ISwarmMessageStoreAccessControlOptions,
  ISwarmMessageStoreEvents,
  ISwarmMessageStoreOptionsWithConnectorFabric,
  TSwarmMessagesStoreGrantAccessCallback,
} from '../../../swarm-message-store/swarm-message-store.types';
import { TSwarmMessageInstance, TSwarmMessageSerialized } from '../../../swarm-message/swarm-message-constructor.types';
import {
  ISwarmStore,
  TSwarmStoreDatabaseOptionsSerialized,
  ISwarmStoreWithConnector,
} from '../../../swarm-store-class/swarm-store-class.types';
import { getSwarmMessageStoreWithDatabaseOptionsConstructorExtended } from '../../../swarm-message-store/swarm-message-store-extended/swarm-message-store-with-database-options-constructor-mixin/swarm-message-store-with-database-options-constructor-mixin';
import { ISwarmStoreConnectoDbOptionsUtilsGrandAccessCallbackContext } from '../../../swarm-store-class/swarm-store-connectors/swarm-store-connetors.types';
import { ISwarmMessageStoreConnectorUtilsDatabaseOptionsSerializerValidatorWithMetaConstructor } from '../../../swarm-message-store/swarm-message-store-connectors/swarm-store-connector-db-options/swarm-store-connector-db-options.types';
import { ISwarmMessageStoreOptionsWithEntriesCount } from '../../../swarm-message-store/swarm-message-store.types';

export function swarmMessageStoreInstanceFabricWithSwarmStoreFabricAndOptionsSerializer<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>,
  ConnectorBasic extends ISwarmStoreConnectorBasicWithEntriesCount<P, ItemType, DbType, DBO>,
  CO extends TSwarmStoreConnectorConnectionOptions<P, ItemType, DbType, DBO, ConnectorBasic>,
  PO extends ISwarmStoreProviderOptions<P, ItemType, DbType, DBO, ConnectorBasic, CO>,
  ConnectorMain extends ISwarmStoreConnectorWithEntriesCount<P, ItemType, DbType, DBO, ConnectorBasic, CO>,
  CFO extends ISwarmStoreOptionsConnectorFabric<P, ItemType, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain>,
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
    CO,
    PO,
    ConnectorMain,
    CFO,
    MSI,
    GAC,
    MCF,
    ACO
  >,
  E extends ISwarmMessageStoreEvents<P, ItemType, DbType, DBO>
>(): ISwarmMessageStoreOptionsWithEntriesCount<
  P,
  ItemType,
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
  O
> &
  ISwarmStoreWithConnector<P, ItemType, DbType, DBO, ConnectorBasic, CO, ConnectorMain> {
  const SwarmMessageStoreWithEntriesCount = getClassSwarmMessageStoreWithEntriesCountAndOptionsSerializer<
    P,
    ItemType,
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
    E
  >();
  return new SwarmMessageStoreWithEntriesCount();
}

export function swarmMessageStoreInstanceFabricWithSwarmStoreFabricAndOptionsSerializerAndDatabaseOptionsConstructor<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>,
  ConnectorBasic extends ISwarmStoreConnectorBasicWithEntriesCount<P, ItemType, DbType, DBO>,
  CO extends TSwarmStoreConnectorConnectionOptions<P, ItemType, DbType, DBO, ConnectorBasic>,
  PO extends ISwarmStoreProviderOptions<P, ItemType, DbType, DBO, ConnectorBasic, CO>,
  ConnectorMain extends ISwarmStoreConnectorWithEntriesCount<P, ItemType, DbType, DBO, ConnectorBasic, CO>,
  CFO extends ISwarmStoreOptionsConnectorFabric<P, ItemType, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain>,
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
    CO,
    PO,
    ConnectorMain,
    CFO,
    MSI,
    GAC,
    MCF,
    ACO
  >,
  E extends ISwarmMessageStoreEvents<P, ItemType, DbType, DBO>,
  DBOS extends TSwarmStoreDatabaseOptionsSerialized,
  CTX extends ISwarmStoreConnectoDbOptionsUtilsGrandAccessCallbackContext,
  DBOFSC extends ISwarmMessageStoreConnectorUtilsDatabaseOptionsSerializerValidatorWithMetaConstructor<
    P,
    ItemType,
    DbType,
    MSI,
    CTX,
    DBO,
    DBOS,
    { swarmMessageStoreOptions: O }
  >
>(
  SwarmStorDatabaseOptionsClass: DBOFSC
): ISwarmMessageStoreOptionsWithEntriesCount<
  P,
  ItemType,
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
  O
> &
  ISwarmStoreWithConnector<P, ItemType, DbType, DBO, ConnectorBasic, CO, ConnectorMain> {
  class SwarmMessageStoreWithEntriesCount extends getClassSwarmMessageStoreWithEntriesCountAndOptionsSerializer<
    P,
    ItemType,
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
    E
  >() {}
  class SwarmMessageStoreWithDbOptionsConstructor extends getSwarmMessageStoreWithDatabaseOptionsConstructorExtended<
    P,
    ItemType,
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
    typeof SwarmMessageStoreWithEntriesCount,
    DBOS,
    CTX,
    DBOFSC
  >(SwarmMessageStoreWithEntriesCount, SwarmStorDatabaseOptionsClass) {}
  return new SwarmMessageStoreWithDbOptionsConstructor();
}
