import { ConstructorType } from '../../../types/helper.types';
import { ISwarmStoreDBOGrandAccessCallbackBaseContext } from '../../swarm-store-class/swarm-store-connectors/swarm-store-connectors.types';
import { ICentralAuthority } from '../../central-authority-class/central-authority-class.types';
import {
  IDatabaseOptionsClass,
  TSwarmStoreValueTypes,
  TSwarmStoreDatabaseType,
  TSwarmStoreDatabaseOptions,
  TSwarmStoreDatabaseOptionsSerialized,
} from '../../swarm-store-class/swarm-store-class.types';
import {
  ISwarmMessageStoreConnectorUtilsDatabaseOptionsSerializerValidatorConstructorFabricParams,
  ISwarmMessageStoreDatabaseOptionsWithMetaConstructor,
} from '../../swarm-message-store/swarm-message-store-connectors/swarm-message-store-connector-db-options/swarm-store-connector-db-options.types';
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
import { ISwarmMessageConstructorWithEncryptedCacheFabric } from '../../swarm-message-encrypted-cache/swarm-message-encrypted-cache.types';
import { ISwarmMessageStoreWithEntriesCount } from '../../swarm-message-store/types/swarm-message-store.types';
import {
  ISwarmStoreWithConnector,
  TSwarmStoreConnectorAccessConrotllerGrantAccessCallback,
} from '../../swarm-store-class/swarm-store-class.types';
import { ISwarmMessageStoreConectorDbOptionsGrandAccessContextClassFabric } from '../../swarm-message-store/types/swarm-message-store-db-options.types';
import { JSONSchema7 } from 'json-schema';
import {
  ISwarmMessageInstanceEncrypted,
  ISwarmMessageInstanceDecrypted,
} from '../../swarm-message/swarm-message-constructor.types';

export interface ISwarmMessageStoreDatabaseGrandAccessBaseContextClassFabric<
  RT extends ConstructorType<ISwarmStoreDBOGrandAccessCallbackBaseContext>
> {
  (params: {
    centralAuthority: {
      isRunning: ICentralAuthority['isRunning'];
      getSwarmUserCredentials: ICentralAuthority['getSwarmUserCredentials'];
      getUserIdentity: ICentralAuthority['getUserIdentity'];
    };
    jsonSchemaValidator: (jsonSchema: JSONSchema7, valueToValidate: any) => Promise<void>;
  }): RT;
}

export interface ISwarmMessageStoreConnectorDbOptionsClassFabric<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmStoreValueTypes<P>,
  DbType extends TSwarmStoreDatabaseType<P>,
  MD extends ISwarmMessageInstanceDecrypted,
  CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>,
  DBOS extends TSwarmStoreDatabaseOptionsSerialized,
  SMC extends ISwarmMessageConstructor,
  CTXC extends ConstructorType<CTX>,
  SMSDBOGACF extends ISwarmMessageStoreConectorDbOptionsGrandAccessContextClassFabric<SMC, CTXC>,
  AP extends
    | Omit<
        Partial<
          ISwarmMessageStoreConnectorUtilsDatabaseOptionsSerializerValidatorConstructorFabricParams<
            P,
            ItemType,
            DbType,
            MD,
            CTX,
            DBO,
            DBOS,
            SMC
          >
        >,
        'grandAccessCallbackContextFabric'
      >
    | never = never
> {
  (
    ContextBaseClass: CTXC,
    swarmMessageStoreDBOGrandAccessCallbackFabric: SMSDBOGACF,
    additionalParams?: AP
  ): ISwarmMessageStoreDatabaseOptionsWithMetaConstructor<
    P,
    ItemType,
    DbType,
    MD,
    CTX,
    DBO,
    DBOS,
    { swarmMessageConstructor: SMC }
  >;
}

export interface ISwarmMessageStoreConnectorDbOptionsClassWithMetaFabric<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmStoreValueTypes<P>,
  DbType extends TSwarmStoreDatabaseType<P>,
  MD extends ISwarmMessageInstanceDecrypted,
  CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>,
  DBOS extends TSwarmStoreDatabaseOptionsSerialized,
  SMC extends ISwarmMessageConstructor,
  CTXC extends ConstructorType<CTX>,
  SMSDBOGACF extends ISwarmMessageStoreConectorDbOptionsGrandAccessContextClassFabric<SMC, CTXC>,
  AP extends
    | Omit<
        Partial<
          ISwarmMessageStoreConnectorUtilsDatabaseOptionsSerializerValidatorConstructorFabricParams<
            P,
            ItemType,
            DbType,
            MD,
            CTX,
            DBO,
            DBOS,
            SMC
          >
        >,
        'grandAccessCallbackContextFabric'
      >
    | never = never
> {
  (
    ContextBaseClass: CTXC,
    swarmMessageStoreDBOGrandAccessCallbackFabric: SMSDBOGACF,
    additionalParams?: AP
  ): IDatabaseOptionsClass<P, ItemType, DbType, DBO, DBOS>;
}

export interface ISwarmMessageStoreInstanceFabricWithSwarmStoreFabricAndOptionsSerializerAndDatabaseOptionsFabric<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>,
  ConnectorBasic extends ISwarmStoreConnectorBasicWithEntriesCount<
    P,
    T,
    DbType,
    DBO & ISwarmStoreDatabaseBaseOptions & { provider: P }
  >,
  CO extends TSwarmStoreConnectorConnectionOptions<P, T, DbType, DBO, ConnectorBasic>,
  PO extends ISwarmStoreProviderOptions<P, T, DbType, DBO, ConnectorBasic, CO>,
  ConnectorMain extends ISwarmStoreConnectorWithEntriesCount<
    P,
    T,
    DbType,
    DBO & ISwarmStoreDatabaseBaseOptions & { provider: P },
    ConnectorBasic,
    CO
  >,
  CFO extends ISwarmStoreOptionsConnectorFabric<P, T, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain>,
  MSI extends TSwarmMessageInstance | T,
  GAC extends TSwarmMessagesStoreGrantAccessCallback<P, Exclude<MSI, ISwarmMessageInstanceEncrypted>>,
  MCF extends ISwarmMessageConstructorWithEncryptedCacheFabric | undefined,
  ACO extends ISwarmMessageStoreAccessControlOptions<P, T, Exclude<MSI, ISwarmMessageInstanceEncrypted>, GAC> | undefined,
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
    MSI,
    GAC,
    MCF,
    ACO
  >,
  DBOS extends TSwarmStoreDatabaseOptionsSerialized,
  CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext,
  SMC extends ISwarmMessageConstructor,
  CTXC extends ConstructorType<CTX>,
  SMSDBOGACF extends ISwarmMessageStoreConectorDbOptionsGrandAccessContextClassFabric<SMC, CTXC>,
  DBOC extends ISwarmMessageStoreConnectorDbOptionsClassFabric<
    P,
    T,
    DbType,
    Exclude<Exclude<MSI, ISwarmMessageInstanceEncrypted>, T>,
    CTX,
    DBO,
    DBOS,
    SMC,
    CTXC,
    SMSDBOGACF
  >,
  SMS extends ISwarmMessageStoreWithEntriesCount<
    P,
    T,
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
      T,
      DbType,
      DBO & ISwarmStoreDatabaseBaseOptions & { provider: P },
      ConnectorBasic,
      CO,
      ConnectorMain
    >
> {
  (
    ContextBaseClass: CTXC,
    swarmMessageStoreDBOGrandAccessCallbackContextFabric: SMSDBOGACF,
    databaseOptionsClassFabric: DBOC,
    swarmMessageValidatorFabric?: (
      grantAccessCb: GAC | undefined
    ) => TSwarmStoreConnectorAccessConrotllerGrantAccessCallback<P, T, Exclude<Exclude<MSI, T>, ISwarmMessageInstanceEncrypted>>
  ): SMS;
}
