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
} from '../../../swarm-message-store/types/swarm-message-store.types';
import {
  TSwarmMessageInstance,
  TSwarmMessageSerialized,
  ISwarmMessageConstructor,
} from '../../../swarm-message/swarm-message-constructor.types';
import {
  TSwarmStoreDatabaseOptionsSerialized,
  ISwarmStoreWithConnector,
} from '../../../swarm-store-class/swarm-store-class.types';
import { getSwarmMessageStoreWithDatabaseOptionsConstructorExtended } from '../../../swarm-message-store/swarm-message-store-extended/swarm-message-store-with-database-options-constructor-mixin/swarm-message-store-with-database-options-constructor-mixin';
import { ISwarmDbOptionsGrandAccessCbCTX } from '../../../swarm-store-class/swarm-store-connectors/swarm-store-connetors.types';
import { ISwarmMessageStoreConnectorUtilsDatabaseOptionsSerializerValidatorWithMetaConstructor } from '../../../swarm-message-store/swarm-message-store-connectors/swarm-message-store-connector-db-options/swarm-store-connector-db-options.types';
import { ISwarmMessageStoreWithEntriesCount } from '../../../swarm-message-store/types/swarm-message-store.types';
import {
  ISwarmStoreDatabaseBaseOptions,
  IDatabaseOptionsSerializerValidatorConstructor,
} from '../../../swarm-store-class/swarm-store-class.types';
import { createSwarmMessageStoreConnectorDBOptionsWithOptionsExtenderFabric } from '../../../swarm-message-store/swarm-message-store-connectors/swarm-message-store-connector-db-options/swarm-message-store-connector-db-options-with-options-extender-class-fabric/swarm-message-store-connector-db-options-with-options-extender-class-fabric';
import { createSwarmMessageStoreUtilsExtenderOrbitDBDatabaseOptionsWithAccessControl } from '../../../swarm-message-store/swarm-message-store-connectors/swarm-message-store-connector-db-options/swarm-message-store-conector-db-options-grand-access-utils/swarm-store-connector-db-options-helpers-access-control-extend-with-common-checks/swarm-store-connector-db-options-helpers-access-control-extend-with-common-checks';
import { ConstructorType } from '../../../../types/helper.types';
import { ISwarmMessageStoreConnectorDbOptionsClassFabric } from '../../types/connection-bridge-swarm-fabrics.types';
import { ISwarmMessageStoreConectorDbOptionsGrandAccessContextClassFabric } from '../../../swarm-message-store/types/swarm-message-store-db-options.types';

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
>(): ISwarmMessageStoreWithEntriesCount<
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
  CTX extends ISwarmDbOptionsGrandAccessCbCTX,
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
): ISwarmMessageStoreWithEntriesCount<
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

export function getSwarmMessageStoreInstanceFabricWithSwarmStoreFabricAndOptionsSerializerAndDatabaseOptionsExtendedConstructor<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>,
  DBOE extends DBO & ISwarmStoreDatabaseBaseOptions & { provider: P },
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
    DBOE,
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
  E extends ISwarmMessageStoreEvents<P, ItemType, DbType, DBOE>,
  DBOS extends TSwarmStoreDatabaseOptionsSerialized,
  CTX extends ISwarmDbOptionsGrandAccessCbCTX,
  SSDOC extends IDatabaseOptionsSerializerValidatorConstructor<P, ItemType, DbType, DBO, DBOS>,
  OEXTENDERFABRIC extends (options: O) => (dbOptions: DBO) => DBOE
>(
  SwarmStorDatabaseOptionsClass: SSDOC,
  databaseOptionsExtenderFabric: OEXTENDERFABRIC
): ISwarmMessageStoreWithEntriesCount<
  P,
  ItemType,
  DbType,
  DBOE,
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
  ISwarmStoreWithConnector<P, ItemType, DbType, DBOE, ConnectorBasic, CO, ConnectorMain> {
  class DatabaseOptionsConstructorWithExtender extends createSwarmMessageStoreConnectorDBOptionsWithOptionsExtenderFabric<
    P,
    ItemType,
    DbType,
    CTX,
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
    DBOS,
    SSDOC,
    { swarmMessageStoreOptions: O },
    DBOE,
    OEXTENDERFABRIC
  >(SwarmStorDatabaseOptionsClass, databaseOptionsExtenderFabric) {}
  class SwarmMessageStoreWithEntriesCount extends getClassSwarmMessageStoreWithEntriesCountAndOptionsSerializer<
    P,
    ItemType,
    DbType,
    DBOE,
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
    DBOE,
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
    typeof DatabaseOptionsConstructorWithExtender
  >(SwarmMessageStoreWithEntriesCount, DatabaseOptionsConstructorWithExtender) {}
  return new SwarmMessageStoreWithDbOptionsConstructor();
}

// TODO - add ConnectionBridgeClass to support this fabric along with a ContextBaseClass fabcric
export function getSwarmMessageStoreInstanceFabricWithSwarmStoreFabricAndOptionsSerializerAndDatabaseOptionsExtendedConstructorWithDefaultParams<
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
    DBO & ISwarmStoreDatabaseBaseOptions & { provider: P },
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
  E extends ISwarmMessageStoreEvents<P, ItemType, DbType, DBO & ISwarmStoreDatabaseBaseOptions & { provider: P }>,
  DBOS extends TSwarmStoreDatabaseOptionsSerialized,
  CTX extends ISwarmDbOptionsGrandAccessCbCTX,
  SMC extends ISwarmMessageConstructor,
  CTXC extends ConstructorType<CTX>,
  SMSDBOGACF extends ISwarmMessageStoreConectorDbOptionsGrandAccessContextClassFabric<SMC, CTXC>,
  DBOC extends ISwarmMessageStoreConnectorDbOptionsClassFabric<P, ItemType, DbType, MSI, CTX, DBO, DBOS, SMC, CTXC, SMSDBOGACF>
>(
  ContextBaseClass: CTXC,
  swarmMessageConstructor: SMC,
  swarmMessageStoreDBOGrandAccessCallbackContextFabric: SMSDBOGACF,
  databaseOptionsClassFabric: DBOC
): ISwarmMessageStoreWithEntriesCount<
  P,
  ItemType,
  DbType,
  DBO & ISwarmStoreDatabaseBaseOptions & { provider: P },
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
  ISwarmStoreWithConnector<
    P,
    ItemType,
    DbType,
    DBO & ISwarmStoreDatabaseBaseOptions & { provider: P },
    ConnectorBasic,
    CO,
    ConnectorMain
  > {
  const DatabaseOptionsClass = databaseOptionsClassFabric(
    ContextBaseClass,
    swarmMessageConstructor,
    swarmMessageStoreDBOGrandAccessCallbackContextFabric
  );
  return getSwarmMessageStoreInstanceFabricWithSwarmStoreFabricAndOptionsSerializerAndDatabaseOptionsExtendedConstructor<
    P,
    ItemType,
    DbType,
    DBO,
    DBO & ISwarmStoreDatabaseBaseOptions & { provider: P },
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
    E,
    DBOS,
    InstanceType<typeof ContextBaseClass>,
    typeof DatabaseOptionsClass,
    (options: O) => (dbOptions: DBO) => DBO & ISwarmStoreDatabaseBaseOptions & { provider: P }
  >(
    DatabaseOptionsClass,
    createSwarmMessageStoreUtilsExtenderOrbitDBDatabaseOptionsWithAccessControl as (
      options: O
    ) => (dbOptions: DBO) => DBO & ISwarmStoreDatabaseBaseOptions & { provider: P }
  );
}
