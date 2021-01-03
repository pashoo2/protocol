import assert from 'assert';
import {
  TSwarmStoreDatabaseOptionsSerialized,
  TSwarmStoreValueTypes,
  TSwarmStoreDatabaseType,
  TSwarmStoreDatabaseOptions,
  ISwarmStoreConnectorBasic,
} from '../../../../swarm-store-class/swarm-store-class.types';
import { ESwarmStoreConnector } from '../../../../swarm-store-class/swarm-store-class.const';
import { ISwarmStoreDBOGrandAccessCallbackBaseContext } from '../../../../swarm-store-class/swarm-store-connectors/swarm-store-connetors.types';
import { TSwarmMessageInstance } from '../../../../swarm-message/swarm-message-constructor.types';
import { ISwarmStoreDBOSerializerValidator } from '../../../../swarm-store-class/swarm-store-connectors/swarm-store-connetors.types';
import { ConstructorType } from '../../../../../types/helper.types';
import {
  TSwarmStoreConnectorConnectionOptions,
  ISwarmStoreProviderOptions,
  ISwarmStoreConnector,
  ISwarmStoreOptionsConnectorFabric,
} from '../../../../swarm-store-class/swarm-store-class.types';
import {
  TSwarmMessagesStoreGrantAccessCallback,
  ISwarmMessageStoreAccessControlOptions,
  ISwarmMessageStoreOptionsWithConnectorFabric,
} from '../../../types/swarm-message-store.types';
import { ISwarmMessageConstructorWithEncryptedCacheFabric } from '../../../../swarm-message-encrypted-cache/swarm-messgae-encrypted-cache.types';
import { ISwarmStoreDatabaseBaseOptions } from '../../../../swarm-store-class/swarm-store-class.types';
import { ISwarmMessageStoreDatabaseOptionsExtender } from '../../../types/swarm-message-store-utils.types';
import { PromiseResolveType } from '../../../../../types/promise.types';
import {
  ISwarmMessageStoreDBOSerializerValidatorConstructorParams,
  ISwarmMessageStoreConnectorUtilsDatabaseOptionsSerializerValidatorConstructorByDBO,
} from '../swarm-store-connector-db-options.types';

export function createSwarmMessageStoreDBOWithOptionsExtenderFabric<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmStoreValueTypes<P>,
  DbType extends TSwarmStoreDatabaseType<P>,
  CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>,
  ConnectorBasic extends ISwarmStoreConnectorBasic<P, ItemType, DbType, DBO>,
  CO extends TSwarmStoreConnectorConnectionOptions<P, ItemType, DbType, DBO, ConnectorBasic>,
  PO extends ISwarmStoreProviderOptions<P, ItemType, DbType, DBO, ConnectorBasic, CO>,
  ConnectorMain extends ISwarmStoreConnector<P, ItemType, DbType, DBO, ConnectorBasic, CO>,
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
  DBOS extends TSwarmStoreDatabaseOptionsSerialized,
  BC extends ISwarmMessageStoreConnectorUtilsDatabaseOptionsSerializerValidatorConstructorByDBO<P, ItemType, DbType, DBO, DBOS>,
  META extends { swarmMessageStoreOptions: O; swarmMessageConstructor: PromiseResolveType<ReturnType<NonNullable<MCF>>> },
  DBOE extends DBO & ISwarmStoreDatabaseBaseOptions & { provider: P },
  OEXTENDERFABRIC extends (
    options: O
  ) => ISwarmMessageStoreDatabaseOptionsExtender<P, ItemType, DbType, DBO, DBOE, PromiseResolveType<ReturnType<NonNullable<MCF>>>>
>(
  BaseClass: BC,
  databaseOptionsExtenderFabric: OEXTENDERFABRIC
): BC & ConstructorType<ISwarmStoreDBOSerializerValidator<P, ItemType, DbType, DBOE, DBOS>> {
  assert(databaseOptionsExtenderFabric, 'Opions extender fabric is not provided');
  assert(typeof databaseOptionsExtenderFabric === 'function', 'Options extender fabric should be a function');
  class SwarmMessageStoreDBOWithExtendedGrandAccessClass {
    constructor(
      params: ISwarmMessageStoreDBOSerializerValidatorConstructorParams<P, ItemType, DbType, MSI, CTX, DBOE, DBOS> & {
        meta: META;
      }
    ) {
      const { meta, options: dbOptions } = params;
      const { swarmMessageConstructor, swarmMessageStoreOptions } = meta;
      const optionsExtender = this.__createdOptionsExtender(swarmMessageStoreOptions);
      const dbOptionsExtended = this.__extendDatabaseOptions(dbOptions as DBO, swarmMessageConstructor, optionsExtender);
      const paramsWithExtendedDbOptions = {
        ...params,
        options: dbOptionsExtended,
      };
      // we have to use the BaseClass constructor twice for consistency, because we may need
      // the same logic for options not extended and options extended.
      const dboClassInstance = new BaseClass(paramsWithExtendedDbOptions) as ISwarmStoreDBOSerializerValidator<
        P,
        ItemType,
        DbType,
        DBOE,
        DBOS
      >;
      return dboClassInstance as any;
    }

    protected __createdOptionsExtender(
      swarmMessageStoreOptions: O
    ): ISwarmMessageStoreDatabaseOptionsExtender<
      P,
      ItemType,
      DbType,
      DBO,
      DBOE,
      PromiseResolveType<ReturnType<NonNullable<MCF>>>
    > {
      return databaseOptionsExtenderFabric(swarmMessageStoreOptions);
    }

    protected __extendDatabaseOptions(
      dbOptions: DBO,
      swarmMessageConstructor: PromiseResolveType<ReturnType<NonNullable<MCF>>>,
      optionsExtender: ISwarmMessageStoreDatabaseOptionsExtender<
        P,
        ItemType,
        DbType,
        DBO,
        DBOE,
        PromiseResolveType<ReturnType<NonNullable<MCF>>>
      >
    ): DBOE {
      const dbOptionsCopy = { ...dbOptions };
      return optionsExtender(dbOptionsCopy, swarmMessageConstructor);
    }
  }
  return (SwarmMessageStoreDBOWithExtendedGrandAccessClass as unknown) as BC &
    ConstructorType<ISwarmStoreDBOSerializerValidator<P, ItemType, DbType, DBOE, DBOS>>;
}
