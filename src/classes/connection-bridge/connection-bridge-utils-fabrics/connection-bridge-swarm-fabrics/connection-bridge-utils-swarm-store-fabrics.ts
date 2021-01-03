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
import { TSwarmMessageInstance, TSwarmMessageSerialized } from '../../../swarm-message/swarm-message-constructor.types';
import {
  TSwarmStoreDatabaseOptionsSerialized,
  ISwarmStoreWithConnector,
} from '../../../swarm-store-class/swarm-store-class.types';
import { getSwarmMessageStoreWithDatabaseOptionsConstructorExtended } from '../../../swarm-message-store/swarm-message-store-extended/swarm-message-store-with-database-options-constructor-mixin/swarm-message-store-with-database-options-constructor-mixin';
import { ISwarmStoreDBOGrandAccessCallbackBaseContext } from '../../../swarm-store-class/swarm-store-connectors/swarm-store-connetors.types';
import { ISwarmMessageStoreConnectorUtilsDatabaseOptionsSerializerValidatorWithMetaConstructor } from '../../../swarm-message-store/swarm-message-store-connectors/swarm-message-store-connector-db-options/swarm-store-connector-db-options.types';
import { ISwarmMessageStoreWithEntriesCount } from '../../../swarm-message-store/types/swarm-message-store.types';
import {
  ISwarmStoreDatabaseBaseOptions,
  IDatabaseOptionsClass,
  TSwarmStoreConnectorAccessConrotllerGrantAccessCallback,
} from '../../../swarm-store-class/swarm-store-class.types';
import { createSwarmMessageStoreDBOWithOptionsExtenderFabric } from '../../../swarm-message-store/swarm-message-store-connectors/swarm-message-store-connector-db-options/swarm-message-store-connector-db-options-with-options-extender-class-fabric/swarm-message-store-connector-db-options-with-options-extender-class-fabric';
import { createSwarmMessageStoreUtilsExtenderOrbitDBDatabaseOptionsWithAccessControl } from '../../../swarm-message-store/swarm-message-store-connectors/swarm-message-store-connector-db-options/swarm-message-store-conector-db-options-grand-access-utils/swarm-store-connector-db-options-helpers-access-control-extend-with-common-checks/swarm-store-connector-db-options-helpers-access-control-extend-with-common-checks';
import { ConstructorType } from '../../../../types/helper.types';
import { ISwarmMessageStoreConnectorDbOptionsClassFabric } from '../../types/connection-bridge-swarm-fabrics.types';
import { ISwarmMessageStoreConectorDbOptionsGrandAccessContextClassFabric } from '../../../swarm-message-store/types/swarm-message-store-db-options.types';
import { PromiseResolveType } from '../../../../types/promise.types';
import { TCentralAuthorityUserIdentity } from '../../../central-authority-class/central-authority-class-types/central-authority-class-types-common';
import { getMessageValidatorUnbound } from '../../../swarm-message-store/swarm-message-store-connectors/swarm-message-store-connector-db-options/swarm-message-store-conector-db-options-grand-access-utils/swarm-message-store-conector-db-options-grand-access-utils-common-grand-access-checker/swarm-message-store-conector-db-options-grand-access-utils-common-grand-access-checker';
import { ISwarmMessageStoreDatabaseOptionsExtender } from '../../../swarm-message-store/types/swarm-message-store-utils.types';

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
  CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext,
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
  const SwarmMessageStoreWithDbOptionsConstructor = getSwarmMessageStoreWithDatabaseOptionsConstructorExtended<
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
  >(SwarmMessageStoreWithEntriesCount, SwarmStorDatabaseOptionsClass);
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
  CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext,
  SSDOC extends IDatabaseOptionsClass<P, ItemType, DbType, DBO, DBOS>,
  OEXTENDERFABRIC extends (
    options: O
  ) => ISwarmMessageStoreDatabaseOptionsExtender<P, ItemType, DbType, DBO, DBOE, PromiseResolveType<ReturnType<NonNullable<MCF>>>>
>(
  SwarmStoreDatabaseOptionsClass: SSDOC,
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
  const DatabaseOptionsConstructorWithExtender = createSwarmMessageStoreDBOWithOptionsExtenderFabric<
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
    { swarmMessageStoreOptions: O; swarmMessageConstructor: PromiseResolveType<ReturnType<NonNullable<MCF>>> },
    DBOE,
    OEXTENDERFABRIC
  >(SwarmStoreDatabaseOptionsClass, databaseOptionsExtenderFabric);
  const SwarmMessageStoreWithEntriesCount = getClassSwarmMessageStoreWithEntriesCountAndOptionsSerializer<
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
  >();
  const SwarmMessageStoreWithDbOptionsConstructor = getSwarmMessageStoreWithDatabaseOptionsConstructorExtended<
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
  >(SwarmMessageStoreWithEntriesCount, DatabaseOptionsConstructorWithExtender);
  return new SwarmMessageStoreWithDbOptionsConstructor();
}

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
  CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext,
  CTXC extends ConstructorType<CTX>,
  SMSDBOGACF extends ISwarmMessageStoreConectorDbOptionsGrandAccessContextClassFabric<
    PromiseResolveType<ReturnType<NonNullable<MCF>>>,
    CTXC
  >,
  DBOC extends ISwarmMessageStoreConnectorDbOptionsClassFabric<
    P,
    ItemType,
    DbType,
    MSI,
    CTX,
    DBO,
    DBOS,
    PromiseResolveType<ReturnType<NonNullable<MCF>>>,
    CTXC,
    SMSDBOGACF
  >
>(
  ContextBaseClass: CTXC,
  swarmMessageConstructor: PromiseResolveType<ReturnType<NonNullable<MCF>>>,
  swarmMessageStoreDBOGrandAccessCallbackContextFabric: SMSDBOGACF,
  databaseOptionsClassFabric: DBOC,
  swarmMessageValidatorFabric: (
    dboptions: DBO,
    swarmMessageConstructor: PromiseResolveType<ReturnType<NonNullable<MCF>>>,
    grantAccessCb: GAC | undefined,
    currentUserId: TCentralAuthorityUserIdentity
  ) => TSwarmStoreConnectorAccessConrotllerGrantAccessCallback<P, ItemType, MSI> = getMessageValidatorUnbound
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
  const dboExtender = (
    options: O
  ): ISwarmMessageStoreDatabaseOptionsExtender<
    P,
    ItemType,
    DbType,
    DBO,
    DBO & ISwarmStoreDatabaseBaseOptions & { provider: P },
    PromiseResolveType<ReturnType<NonNullable<MCF>>>
  > =>
    createSwarmMessageStoreUtilsExtenderOrbitDBDatabaseOptionsWithAccessControl<
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
    >(options, swarmMessageValidatorFabric) as ISwarmMessageStoreDatabaseOptionsExtender<
      P,
      ItemType,
      DbType,
      DBO,
      DBO & ISwarmStoreDatabaseBaseOptions & { provider: P },
      PromiseResolveType<ReturnType<NonNullable<MCF>>>
    >;

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
    (
      options: O
    ) => ISwarmMessageStoreDatabaseOptionsExtender<
      P,
      ItemType,
      DbType,
      DBO,
      DBO & ISwarmStoreDatabaseBaseOptions & { provider: P },
      PromiseResolveType<ReturnType<NonNullable<MCF>>>
    >
  >(DatabaseOptionsClass, dboExtender);
}
