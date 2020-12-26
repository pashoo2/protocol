import { ConstructorType } from '../../../types/helper.types';
import { ISwarmDbOptionsGrandAccessCbCTX } from '../../swarm-store-class/swarm-store-connectors/swarm-store-connetors.types';
import { ICentralAuthority } from '../../central-authority-class/central-authority-class.types';
import {
  IDatabaseOptionsSerializerValidatorConstructor,
  TSwarmStoreValueTypes,
  TSwarmStoreDatabaseType,
  TSwarmStoreDatabaseOptions,
  TSwarmStoreDatabaseOptionsSerialized,
} from '../../swarm-store-class/swarm-store-class.types';
import { ISwarmMessageStoreConnectorUtilsDatabaseOptionsSerializerValidatorConstructorFabricParams } from '../../swarm-message-store/swarm-message-store-connectors/swarm-message-store-connector-db-options/swarm-store-connector-db-options.types';
import { ESwarmStoreConnector } from '../../swarm-store-class/swarm-store-class.const';
import {
  TSwarmMessageInstance,
  ISwarmMessageConstructor,
  TSwarmMessageSerialized,
} from '../../swarm-message/swarm-message-constructor.types';
import {
  ISwarmStoreConnectorBasicWithEntriesCount,
  ISwarmStoreConnectorWithEntriesCount,
} from '../../swarm-store-class/swarm-store-class-extended/swarm-store-class-with-entries-count/swarm-store-class-with-entries-count.types';
import {
  TSwarmStoreConnectorConnectionOptions,
  ISwarmStoreProviderOptions,
  ISwarmStoreOptionsConnectorFabric,
  ISwarmStoreDatabaseBaseOptions,
} from '../../swarm-store-class/swarm-store-class.types';
import {
  TSwarmMessagesStoreGrantAccessCallback,
  ISwarmMessageStoreAccessControlOptions,
  ISwarmMessageStoreOptionsWithConnectorFabric,
} from '../../swarm-message-store/types/swarm-message-store.types';
import { ISwarmMessageConstructorWithEncryptedCacheFabric } from '../../swarm-message-encrypted-cache/swarm-messgae-encrypted-cache.types';
import { ISwarmMessageStoreWithEntriesCount } from '../../swarm-message-store/types/swarm-message-store.types';
import { ISwarmStoreWithConnector } from '../../swarm-store-class/swarm-store-class.types';
import { ISwarmMessageStoreConectorDbOptionsGrandAccessContextClassFabric } from '../../swarm-message-store/types/swarm-message-store-db-options.types';

export interface ISwarmMessageStoreDatabaseGrandAccessBaseContextClassFabric<
  RT extends ConstructorType<ISwarmDbOptionsGrandAccessCbCTX>
> {
  (params: {
    centralAuthority: {
      isRunning: ICentralAuthority['isRunning'];
      getSwarmUserCredentials: ICentralAuthority['getSwarmUserCredentials'];
      getUserIdentity: ICentralAuthority['getUserIdentity'];
    };
  }): RT;
}

export interface ISwarmMessageStoreConnectorDbOptionsClassFabric<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmStoreValueTypes<P>,
  DbType extends TSwarmStoreDatabaseType<P>,
  MSI extends TSwarmMessageInstance | ItemType,
  CTX extends ISwarmDbOptionsGrandAccessCbCTX,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>,
  DBOS extends TSwarmStoreDatabaseOptionsSerialized,
  SMC extends ISwarmMessageConstructor,
  CTXC extends ConstructorType<CTX>,
  SMSDBOGACF extends ISwarmMessageStoreConectorDbOptionsGrandAccessContextClassFabric<SMC, CTXC>,
  OSVC extends IDatabaseOptionsSerializerValidatorConstructor<P, ItemType, DbType, DBO, DBOS> | never = never,
  AP extends
    | Omit<
        ISwarmMessageStoreConnectorUtilsDatabaseOptionsSerializerValidatorConstructorFabricParams<
          P,
          ItemType,
          DbType,
          MSI,
          CTX,
          DBO,
          DBOS
        >,
        'grandAccessCallbackContextFabric'
      >
    | never = never
> {
  (
    ContextBaseClass: CTXC,
    swarmMessageConstructor: SMC,
    swarmMessageStoreDBOGrandAccessCallbackFabric: SMSDBOGACF,
    OptionsSerializerValidatorConstructor?: OSVC,
    additionalParams?: AP
  ): IDatabaseOptionsSerializerValidatorConstructor<P, ItemType, DbType, DBO, DBOS>;
}

export interface ISwarmMessageStoreInstanceFabricWithSwarmStoreFabricAndOptionsSerializerAndDatabaseOptionsFabric<
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
  DBOS extends TSwarmStoreDatabaseOptionsSerialized,
  CTX extends ISwarmDbOptionsGrandAccessCbCTX,
  SMC extends ISwarmMessageConstructor,
  CTXC extends ConstructorType<CTX>,
  SMSDBOGACF extends ISwarmMessageStoreConectorDbOptionsGrandAccessContextClassFabric<SMC, CTXC>,
  DBOC extends ISwarmMessageStoreConnectorDbOptionsClassFabric<P, ItemType, DbType, MSI, CTX, DBO, DBOS, SMC, CTXC, SMSDBOGACF>,
  SMS extends ISwarmMessageStoreWithEntriesCount<
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
    >
> {
  (
    ContextBaseClass: CTXC,
    swarmMessageConstructor: SMC,
    swarmMessageStoreDBOGrandAccessCallbackContextFabric: SMSDBOGACF,
    databaseOptionsClassFabric: DBOC
  ): SMS;
}
