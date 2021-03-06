import { ESwarmStoreConnector } from '../../../../swarm-store-class/swarm-store-class.const';
import {
  TSwarmMessageSerialized,
  TSwarmMessageInstance,
  ISwarmMessageConstructor,
} from '../../../../swarm-message/swarm-message-constructor.types';
import {
  TSwarmStoreDatabaseType,
  TSwarmStoreDatabaseOptions,
  TSwarmStoreConnectorConnectionOptions,
  ISwarmStoreProviderOptions,
  ISwarmStoreOptionsConnectorFabric,
  TSwarmStoreConnectorBasicFabric,
} from '../../../../swarm-store-class/swarm-store-class.types';
import {
  TSwarmMessagesStoreGrantAccessCallback,
  ISwarmMessageStoreAccessControlOptions,
  ISwarmMessageStoreOptionsWithConnectorFabric,
} from '../../../../swarm-message-store/types/swarm-message-store.types';
import { ISwarmMessageConstructorWithEncryptedCacheFabric } from '../../../../swarm-message-encrypted-cache/swarm-message-encrypted-cache.types';
import { ConstructorType } from '../../../../../types/helper.types';
import { ISwarmStoreDBOGrandAccessCallbackBaseContext } from '../../../../swarm-store-class/swarm-store-connectors/swarm-store-connectors.types';
import {
  TSwarmStoreDatabaseOptionsSerialized,
  ISwarmStoreDatabaseBaseOptions,
} from '../../../../swarm-store-class/swarm-store-class.types';
import { ISwarmMessageStoreConectorDbOptionsGrandAccessContextClassFabric } from '../../../../swarm-message-store/types/swarm-message-store-db-options.types';
import { ISwarmMessageStoreInstanceFabricWithSwarmStoreFabricAndOptionsSerializerAndDatabaseOptionsFabric } from '../../../types/connection-bridge-swarm-fabrics.types';
import { ISwarmStoreWithConnector } from '../../../../swarm-store-class/swarm-store-class.types';
import { ISwarmMessageStoreWithEntriesCount } from '../../../../swarm-message-store/types/swarm-message-store.types';
import { TConnectionBridgeCFODefault, IConnectionBridgeOptions } from '../../../types/connection-bridge.types';
import { ISerializer } from '../../../../../types/serialization.types';
import { IOptionsSerializerValidatorSerializer } from '../../../../basic-classes/options-serializer-validator-class/options-serializer-validator-class.types';
import { ISwarmMessageStoreConnectorUtilsDatabaseOptionsSerializerValidatorConstructorFabricParams } from '../../../../swarm-message-store/swarm-message-store-connectors/swarm-message-store-connector-db-options/swarm-store-connector-db-options.types';
import { ISwarmMessageInstanceEncrypted } from '../../../../swarm-message/swarm-message-constructor.types';
import {
  ISwarmStoreConnectorBasicWithEntriesCount,
  ISwarmStoreConnectorWithEntriesCount,
} from '../../../../swarm-store-class/swarm-store-class-extended/swarm-store-class-with-entries-count/swarm-store-class-with-entries-count.types';
import {
  ISwarmStoreDatabasesPersistentListFabric,
  IConnectionBridgeStorageOptions,
} from '../../../types/connection-bridge.types';
import {
  ISwarmMessageStoreDatabaseGrandAccessBaseContextClassFabric,
  ISwarmMessageStoreConnectorDbOptionsClassFabric,
} from '../../../types/connection-bridge-swarm-fabrics.types';

export interface IConnectionBridgeWithDatabaseOptionsClassAndDBListPeristentStorageAndSwarmMessageCountStorageOptions<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  MSI extends TSwarmMessageInstance | T,
  CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>,
  DBOE extends DBO & ISwarmStoreDatabaseBaseOptions & { provider: P },
  DBOS extends TSwarmStoreDatabaseOptionsSerialized,
  SMC extends ISwarmMessageConstructor,
  ConnectorBasic extends ISwarmStoreConnectorBasicWithEntriesCount<P, T, DbType, DBOE>,
  CO extends TSwarmStoreConnectorConnectionOptions<P, T, DbType, DBOE, ConnectorBasic>,
  PO extends ISwarmStoreProviderOptions<P, T, DbType, DBOE, ConnectorBasic, CO>,
  ConnectorMain extends ISwarmStoreConnectorWithEntriesCount<P, T, DbType, DBOE, ConnectorBasic, CO>,
  GAC extends TSwarmMessagesStoreGrantAccessCallback<P, Exclude<MSI, ISwarmMessageInstanceEncrypted>>,
  MCF extends ISwarmMessageConstructorWithEncryptedCacheFabric,
  ACO extends ISwarmMessageStoreAccessControlOptions<P, T, Exclude<MSI, ISwarmMessageInstanceEncrypted>, GAC>,
  CFO extends ISwarmStoreOptionsConnectorFabric<P, T, DbType, DBOE, ConnectorBasic, CO, PO, ConnectorMain>,
  CFOD extends TConnectionBridgeCFODefault<P, T, DbType, DBOE, ConnectorBasic, CO, PO, ConnectorMain, CFO>,
  CBFO extends TSwarmStoreConnectorBasicFabric<P, T, DbType, DBOE, ConnectorBasic>,
  O extends ISwarmMessageStoreOptionsWithConnectorFabric<
    P,
    T,
    DbType,
    DBOE,
    ConnectorBasic,
    CO,
    PO,
    ConnectorMain,
    CFOD,
    MSI,
    GAC,
    MCF,
    ACO
  >,
  SMS extends ISwarmMessageStoreWithEntriesCount<
    P,
    T,
    DbType,
    DBOE,
    ConnectorBasic,
    CO,
    PO,
    ConnectorMain,
    CFOD,
    MSI,
    GAC,
    MCF,
    ACO,
    O
  > &
    ISwarmStoreWithConnector<P, T, DbType, DBOE, ConnectorBasic, CO, ConnectorMain>,
  SSDPLF extends ISwarmStoreDatabasesPersistentListFabric<P, T, DbType, DBOE, Record<DBOE['dbName'], DBOE>>,
  CTXC extends ConstructorType<CTX>,
  SMSDBOGACF extends ISwarmMessageStoreConectorDbOptionsGrandAccessContextClassFabric<SMC, CTXC>,
  DBOCF extends ISwarmMessageStoreConnectorDbOptionsClassFabric<
    P,
    T,
    DbType,
    Exclude<Exclude<MSI, ISwarmMessageInstanceEncrypted>, T>,
    CTX,
    DBOE,
    DBOS,
    SMC,
    CTXC,
    SMSDBOGACF
  >,
  SRLZR extends ISerializer,
  DBOCFF extends (serializer: SRLZR) => DBOCF
> extends IConnectionBridgeStorageOptions<
    P,
    T,
    DbType,
    DBOE,
    ConnectorBasic,
    CO,
    PO,
    ConnectorMain,
    MSI,
    GAC,
    MCF,
    ACO,
    CFO,
    CBFO,
    O,
    SMS,
    SSDPLF,
    CFOD
  > {
  swarmMessageStoreInstanceFabric: () => never;
  swarmMessageStoreDatabaseGrandAccessBaseContextClassFabric: ISwarmMessageStoreDatabaseGrandAccessBaseContextClassFabric<CTXC>;

  swarmMessageStoreDBOGrandAccessCallbackFabric: SMSDBOGACF;
  swarmMessageStoreDatabaseOptionsClassFabricOfFabric: DBOCFF;
  swarmMessageStoreInstanceWithDBOClassFabric: ISwarmMessageStoreInstanceFabricWithSwarmStoreFabricAndOptionsSerializerAndDatabaseOptionsFabric<
    P,
    T,
    DbType,
    DBOE,
    ConnectorBasic,
    CO,
    PO,
    ConnectorMain,
    CFOD,
    MSI,
    GAC,
    MCF,
    ACO,
    O,
    DBOS,
    CTX,
    SMC,
    CTXC,
    SMSDBOGACF,
    DBOCF,
    SMS
  >;
}

export interface IConnectionBridgeWithDatabaseOptionsClassAndDBListPeristentStorageAndSwarmMessageCountOptions<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  MSI extends TSwarmMessageInstance | T,
  CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>,
  DBOE extends DBO & ISwarmStoreDatabaseBaseOptions & { provider: P },
  DBOS extends TSwarmStoreDatabaseOptionsSerialized,
  SMC extends ISwarmMessageConstructor,
  ConnectorBasic extends ISwarmStoreConnectorBasicWithEntriesCount<P, T, DbType, DBOE>,
  CO extends TSwarmStoreConnectorConnectionOptions<P, T, DbType, DBOE, ConnectorBasic>,
  PO extends ISwarmStoreProviderOptions<P, T, DbType, DBOE, ConnectorBasic, CO>,
  ConnectorMain extends ISwarmStoreConnectorWithEntriesCount<P, T, DbType, DBOE, ConnectorBasic, CO>,
  GAC extends TSwarmMessagesStoreGrantAccessCallback<P, Exclude<MSI, ISwarmMessageInstanceEncrypted>>,
  MCF extends ISwarmMessageConstructorWithEncryptedCacheFabric,
  ACO extends ISwarmMessageStoreAccessControlOptions<P, T, Exclude<MSI, ISwarmMessageInstanceEncrypted>, GAC>,
  CFO extends ISwarmStoreOptionsConnectorFabric<P, T, DbType, DBOE, ConnectorBasic, CO, PO, ConnectorMain>,
  CFOD extends TConnectionBridgeCFODefault<P, T, DbType, DBOE, ConnectorBasic, CO, PO, ConnectorMain, CFO>,
  CBFO extends TSwarmStoreConnectorBasicFabric<P, T, DbType, DBOE, ConnectorBasic>,
  CD extends boolean,
  O extends ISwarmMessageStoreOptionsWithConnectorFabric<
    P,
    T,
    DbType,
    DBOE,
    ConnectorBasic,
    CO,
    PO,
    ConnectorMain,
    CFOD,
    MSI,
    GAC,
    MCF,
    ACO
  >,
  SMS extends ISwarmMessageStoreWithEntriesCount<
    P,
    T,
    DbType,
    DBOE,
    ConnectorBasic,
    CO,
    PO,
    ConnectorMain,
    CFOD,
    MSI,
    GAC,
    MCF,
    ACO,
    O
  > &
    ISwarmStoreWithConnector<P, T, DbType, DBOE, ConnectorBasic, CO, ConnectorMain>,
  SSDPLF extends ISwarmStoreDatabasesPersistentListFabric<P, T, DbType, DBOE, Record<DBOE['dbName'], DBOE>>,
  CTXC extends ConstructorType<CTX>,
  SMSDBOGACF extends ISwarmMessageStoreConectorDbOptionsGrandAccessContextClassFabric<SMC, CTXC>,
  DBOCF extends ISwarmMessageStoreConnectorDbOptionsClassFabric<
    P,
    T,
    DbType,
    Exclude<Exclude<MSI, ISwarmMessageInstanceEncrypted>, T>,
    CTX,
    DBOE,
    DBOS,
    SMC,
    CTXC,
    SMSDBOGACF
  >,
  SRLZR extends ISerializer,
  DBOCFF extends (serializer: SRLZR) => DBOCF
> extends IConnectionBridgeOptions<
    P,
    T,
    DbType,
    DBOE,
    ConnectorBasic,
    CO,
    PO,
    ConnectorMain,
    MSI,
    GAC,
    MCF,
    ACO,
    CFO,
    CBFO,
    CD,
    O,
    SMS,
    SSDPLF,
    SRLZR
  > {
  storage: IConnectionBridgeWithDatabaseOptionsClassAndDBListPeristentStorageAndSwarmMessageCountStorageOptions<
    P,
    T,
    DbType,
    MSI,
    CTX,
    DBO,
    DBOE,
    DBOS,
    SMC,
    ConnectorBasic,
    CO,
    PO,
    ConnectorMain,
    GAC,
    MCF,
    ACO,
    CFO,
    CFOD,
    CBFO,
    O,
    SMS,
    SSDPLF,
    CTXC,
    SMSDBOGACF,
    DBOCF,
    SRLZR,
    DBOCFF
  >;
}
