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
import { TSwarmMessageSerialized, ISwarmMessageInstanceDecrypted } from '../../../swarm-message/swarm-message-constructor.types';
import {
  TSwarmStoreDatabaseOptionsSerialized,
  ISwarmStoreWithConnector,
} from '../../../swarm-store-class/swarm-store-class.types';
import { getSwarmMessageStoreWithDatabaseOptionsConstructorExtended } from '../../../swarm-message-store/swarm-message-store-extended/swarm-message-store-with-database-options-constructor-mixin/swarm-message-store-with-database-options-constructor-mixin';
import { ISwarmStoreDBOGrandAccessCallbackBaseContext } from '../../../swarm-store-class/swarm-store-connectors/swarm-store-connetors.types';
import { ISwarmMessageStoreDatabaseOptionsWithMetaConstructor } from '../../../swarm-message-store/swarm-message-store-connectors/swarm-message-store-connector-db-options/swarm-store-connector-db-options.types';
import { ISwarmMessageStoreWithEntriesCount } from '../../../swarm-message-store/types/swarm-message-store.types';
import {
  ISwarmStoreDatabaseBaseOptions,
  TSwarmStoreConnectorAccessConrotllerGrantAccessCallback,
} from '../../../swarm-store-class/swarm-store-class.types';
import { createSwarmMessageStoreDBOWithOptionsExtenderFabric } from '../../../swarm-message-store/swarm-message-store-connectors/swarm-message-store-connector-db-options/swarm-message-store-connector-db-options-with-options-extender-class-fabric/swarm-message-store-connector-db-options-with-options-extender-class-fabric';
import { createSwarmMessageStoreUtilsExtenderOrbitDBDatabaseOptionsWithAccessControlAndGrandAccessCallbackBoundToContext } from '../../../swarm-message-store/swarm-message-store-connectors/swarm-message-store-connector-db-options/swarm-message-store-conector-db-options-grand-access-utils/swarm-store-connector-db-options-helpers-access-control-extend-with-common-checks/swarm-store-connector-db-options-helpers-access-control-extend-with-common-checks';
import { ConstructorType } from '../../../../types/helper.types';
import { ISwarmMessageStoreConnectorDbOptionsClassFabric } from '../../types/connection-bridge-swarm-fabrics.types';
import { ISwarmMessageStoreConectorDbOptionsGrandAccessContextClassFabric } from '../../../swarm-message-store/types/swarm-message-store-db-options.types';
import { PromiseResolveType } from '../../../../types/promise.types';
import { getMessageValidatorForGrandAccessCallbackBound } from '../../../swarm-message-store/swarm-message-store-connectors/swarm-message-store-connector-db-options/swarm-message-store-conector-db-options-grand-access-utils/swarm-message-store-conector-db-options-grand-access-utils-common-grand-access-checker/swarm-message-store-conector-db-options-grand-access-utils-common-grand-access-checker';
import { ISwarmMessageStoreDatabaseOptionsExtender } from '../../../swarm-message-store/types/swarm-message-store-utils.types';
import { swarmStoreOptionsClassFabric } from '../../../swarm-store-class/swarm-store-class-helpers/swarm-store-options-helpers/swarm-store-options-class-fabric/swarm-store-options-class-fabric';

export function swarmMessageStoreInstanceFabricWithSwarmStoreFabricAndOptionsSerializer<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>,
  ConnectorBasic extends ISwarmStoreConnectorBasicWithEntriesCount<P, T, DbType, DBO>,
  CO extends TSwarmStoreConnectorConnectionOptions<P, T, DbType, DBO, ConnectorBasic>,
  PO extends ISwarmStoreProviderOptions<P, T, DbType, DBO, ConnectorBasic, CO>,
  ConnectorMain extends ISwarmStoreConnectorWithEntriesCount<P, T, DbType, DBO, ConnectorBasic, CO>,
  CFO extends ISwarmStoreOptionsConnectorFabric<P, T, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain>,
  MD extends ISwarmMessageInstanceDecrypted,
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
  E extends ISwarmMessageStoreEvents<P, T, DbType, DBO>
>(): ISwarmMessageStoreWithEntriesCount<P, T, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain, CFO, MD | T, GAC, MCF, ACO, O> &
  ISwarmStoreWithConnector<P, T, DbType, DBO, ConnectorBasic, CO, ConnectorMain> {
  const SwarmStoreOptionsClass = swarmStoreOptionsClassFabric<P, T, DbType, DBO, ConnectorBasic, CO, O>();
  const SwarmMessageStoreWithEntriesCount = getClassSwarmMessageStoreWithEntriesCountAndOptionsSerializer<
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
    E,
    typeof SwarmStoreOptionsClass
  >(SwarmStoreOptionsClass);
  return new SwarmMessageStoreWithEntriesCount();
}

export function getSwarmMessageStoreInstanceFabricWithSwarmStoreFabricAndOptionsSerializerAndDatabaseOptionsExtendedConstructor<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>,
  DBOE extends DBO & ISwarmStoreDatabaseBaseOptions & { provider: P },
  ConnectorBasic extends ISwarmStoreConnectorBasicWithEntriesCount<P, T, DbType, DBO>,
  CO extends TSwarmStoreConnectorConnectionOptions<P, T, DbType, DBO, ConnectorBasic>,
  PO extends ISwarmStoreProviderOptions<P, T, DbType, DBO, ConnectorBasic, CO>,
  ConnectorMain extends ISwarmStoreConnectorWithEntriesCount<P, T, DbType, DBO, ConnectorBasic, CO>,
  CFO extends ISwarmStoreOptionsConnectorFabric<P, T, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain>,
  MD extends ISwarmMessageInstanceDecrypted,
  GAC extends TSwarmMessagesStoreGrantAccessCallback<P, MD | T>,
  MCF extends ISwarmMessageConstructorWithEncryptedCacheFabric | undefined,
  ACO extends ISwarmMessageStoreAccessControlOptions<P, T, MD | T, GAC> | undefined,
  O extends ISwarmMessageStoreOptionsWithConnectorFabric<
    P,
    T,
    DbType,
    DBOE,
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
  E extends ISwarmMessageStoreEvents<P, T, DbType, DBOE>,
  DBOS extends TSwarmStoreDatabaseOptionsSerialized,
  CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext,
  SSDOC extends ISwarmMessageStoreDatabaseOptionsWithMetaConstructor<
    P,
    T,
    DbType,
    MD,
    CTX,
    DBO,
    DBOS,
    { swarmMessageStoreOptions: O; swarmMessageConstructor: PromiseResolveType<ReturnType<NonNullable<MCF>>> }
  >,
  OEXTENDERFABRIC extends (
    options: O
  ) => ISwarmMessageStoreDatabaseOptionsExtender<P, T, DbType, DBO, DBOE, PromiseResolveType<ReturnType<NonNullable<MCF>>>>
>(
  SwarmStoreDatabaseOptionsClass: SSDOC,
  databaseOptionsExtenderFabric: OEXTENDERFABRIC
): ISwarmMessageStoreWithEntriesCount<P, T, DbType, DBOE, ConnectorBasic, CO, PO, ConnectorMain, CFO, MD, GAC, MCF, ACO, O> &
  ISwarmStoreWithConnector<P, T, DbType, DBOE, ConnectorBasic, CO, ConnectorMain> {
  const DatabaseOptionsConstructorWithExtender = createSwarmMessageStoreDBOWithOptionsExtenderFabric<
    P,
    T,
    DbType,
    CTX,
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
    DBOS,
    SSDOC,
    { swarmMessageStoreOptions: O; swarmMessageConstructor: PromiseResolveType<ReturnType<NonNullable<MCF>>> },
    DBOE,
    OEXTENDERFABRIC
  >(SwarmStoreDatabaseOptionsClass, databaseOptionsExtenderFabric);
  const SwarmStoreOptionsClass = swarmStoreOptionsClassFabric<P, T, DbType, DBO, ConnectorBasic, CO, O>();
  const SwarmMessageStoreWithEntriesCount = getClassSwarmMessageStoreWithEntriesCountAndOptionsSerializer<
    P,
    T,
    DbType,
    DBOE,
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
    E,
    typeof SwarmStoreOptionsClass
  >(SwarmStoreOptionsClass);
  const SwarmMessageStoreWithDbOptionsConstructor = getSwarmMessageStoreWithDatabaseOptionsConstructorExtended<
    P,
    T,
    DbType,
    DBOE,
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
    typeof SwarmMessageStoreWithEntriesCount,
    DBOS,
    CTX,
    typeof DatabaseOptionsConstructorWithExtender
  >(SwarmMessageStoreWithEntriesCount, DatabaseOptionsConstructorWithExtender);
  return new SwarmMessageStoreWithDbOptionsConstructor();
}

export function getSwarmMessageStoreInstanceFabricWithSwarmStoreFabricAndOptionsSerializerAndDatabaseOptionsExtendedConstructorWithDefaultParams<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>,
  ConnectorBasic extends ISwarmStoreConnectorBasicWithEntriesCount<P, T, DbType, DBO>,
  CO extends TSwarmStoreConnectorConnectionOptions<P, T, DbType, DBO, ConnectorBasic>,
  PO extends ISwarmStoreProviderOptions<P, T, DbType, DBO, ConnectorBasic, CO>,
  ConnectorMain extends ISwarmStoreConnectorWithEntriesCount<P, T, DbType, DBO, ConnectorBasic, CO>,
  CFO extends ISwarmStoreOptionsConnectorFabric<P, T, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain>,
  MD extends ISwarmMessageInstanceDecrypted,
  GAC extends TSwarmMessagesStoreGrantAccessCallback<P, MD | T>,
  MCF extends ISwarmMessageConstructorWithEncryptedCacheFabric | undefined,
  ACO extends ISwarmMessageStoreAccessControlOptions<P, T, MD | T, GAC> | undefined,
  O extends ISwarmMessageStoreOptionsWithConnectorFabric<
    P,
    T,
    DbType,
    DBO & ISwarmStoreDatabaseBaseOptions & { provider: P },
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
  E extends ISwarmMessageStoreEvents<P, T, DbType, DBO & ISwarmStoreDatabaseBaseOptions & { provider: P }>,
  DBOS extends TSwarmStoreDatabaseOptionsSerialized,
  CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext,
  CTXC extends ConstructorType<CTX>,
  SMSDBOGACF extends ISwarmMessageStoreConectorDbOptionsGrandAccessContextClassFabric<
    PromiseResolveType<ReturnType<NonNullable<MCF>>>,
    CTXC
  >,
  DBOC extends ISwarmMessageStoreConnectorDbOptionsClassFabric<
    P,
    T,
    DbType,
    MD,
    CTX,
    DBO,
    DBOS,
    PromiseResolveType<ReturnType<NonNullable<MCF>>>,
    CTXC,
    SMSDBOGACF
  >
>(
  ContextBaseClass: CTXC,
  swarmMessageStoreDBOGrandAccessCallbackContextFabric: SMSDBOGACF,
  databaseOptionsClassFabric: DBOC,
  swarmMessageValidatorFabric: (
    grantAccessCb: GAC
  ) => TSwarmStoreConnectorAccessConrotllerGrantAccessCallback<P, T, MD> = getMessageValidatorForGrandAccessCallbackBound
): ISwarmMessageStoreWithEntriesCount<
  P,
  T,
  DbType,
  DBO & ISwarmStoreDatabaseBaseOptions & { provider: P },
  ConnectorBasic,
  CO,
  PO,
  ConnectorMain,
  CFO,
  MD | T,
  GAC,
  MCF,
  ACO,
  O
> &
  ISwarmStoreWithConnector<
    P,
    T,
    DbType,
    DBO & ISwarmStoreDatabaseBaseOptions & { provider: P },
    ConnectorBasic,
    CO,
    ConnectorMain
  > {
  const DatabaseOptionsClass = databaseOptionsClassFabric(ContextBaseClass, swarmMessageStoreDBOGrandAccessCallbackContextFabric);
  const dboExtender = (
    options: O
  ): ISwarmMessageStoreDatabaseOptionsExtender<
    P,
    T,
    DbType,
    DBO,
    DBO & ISwarmStoreDatabaseBaseOptions & { provider: P },
    PromiseResolveType<ReturnType<NonNullable<MCF>>>
  > =>
    createSwarmMessageStoreUtilsExtenderOrbitDBDatabaseOptionsWithAccessControlAndGrandAccessCallbackBoundToContext<
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
      O
    >(options, swarmMessageValidatorFabric) as ISwarmMessageStoreDatabaseOptionsExtender<
      P,
      T,
      DbType,
      DBO,
      DBO & ISwarmStoreDatabaseBaseOptions & { provider: P },
      PromiseResolveType<ReturnType<NonNullable<MCF>>>
    >;

  const swarmMessagesStoreInstance = getSwarmMessageStoreInstanceFabricWithSwarmStoreFabricAndOptionsSerializerAndDatabaseOptionsExtendedConstructor<
    P,
    T,
    DbType,
    DBO,
    DBO & ISwarmStoreDatabaseBaseOptions & { provider: P },
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
    E,
    DBOS,
    InstanceType<typeof ContextBaseClass>,
    typeof DatabaseOptionsClass,
    (
      options: O
    ) => ISwarmMessageStoreDatabaseOptionsExtender<
      P,
      T,
      DbType,
      DBO,
      DBO & ISwarmStoreDatabaseBaseOptions & { provider: P },
      PromiseResolveType<ReturnType<NonNullable<MCF>>>
    >
  >(DatabaseOptionsClass, dboExtender);
  return swarmMessagesStoreInstance;
}
