import assert from 'assert';
import {
  TSwarmStoreDatabaseOptionsSerialized,
  TSwarmStoreValueTypes,
  TSwarmStoreDatabaseType,
  TSwarmStoreDatabaseOptions,
  ISwarmStoreConnectorBasic,
} from '../../../../swarm-store-class/swarm-store-class.types';
import { ESwarmStoreConnector } from '../../../../swarm-store-class/swarm-store-class.const';
import { ISwarmStoreConnectoDbOptionsUtilsGrandAccessCallbackContext } from '../../../../swarm-store-class/swarm-store-connectors/swarm-store-connetors.types';
import { TSwarmMessageInstance } from '../../../../swarm-message/swarm-message-constructor.types';
import { ISwarmStoreConnectorUtilsDatabaseOptionsSerializerValidator } from '../../../../swarm-store-class/swarm-store-connectors/swarm-store-connetors.types';
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
import { ISwarmMessageStoreConnectorUtilsDatabaseOptionsSerializerValidatorConstructor } from '../swarm-store-connector-db-options.types';
import { ISwarmMessageStoreConnectorUtilsDatabaseOptionsSerializerValidatorConstructorParams } from '../swarm-store-connector-db-options.types';

export function createSwarmMessageStoreConnectorDBOptionsWithOptionsExtenderFabric<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmStoreValueTypes<P>,
  DbType extends TSwarmStoreDatabaseType<P>,
  CTX extends ISwarmStoreConnectoDbOptionsUtilsGrandAccessCallbackContext,
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
  BC extends ISwarmMessageStoreConnectorUtilsDatabaseOptionsSerializerValidatorConstructor<
    P,
    ItemType,
    DbType,
    MSI,
    CTX,
    DBO,
    DBOS
  >,
  META extends { swarmMessageStoreOptions: O },
  DBOE extends DBO & ISwarmStoreDatabaseBaseOptions & { provider: P },
  OEXTENDERFABRIC extends (options: O) => (dbOptions: DBO) => DBOE
>(
  BaseClass: BC,
  databaseOptionsExtenderFabric: OEXTENDERFABRIC
): BC & ConstructorType<ISwarmStoreConnectorUtilsDatabaseOptionsSerializerValidator<P, ItemType, DbType, DBOE, DBOS>> {
  assert(databaseOptionsExtenderFabric, 'Opions extender fabric is not provided');
  assert(typeof databaseOptionsExtenderFabric === 'function', 'Options extender fabric should be a function');
  class SwarmMessageStoreConnectorDBOptionsWithExtendedGrandAccessClass {
    constructor(
      params: ISwarmMessageStoreConnectorUtilsDatabaseOptionsSerializerValidatorConstructorParams<
        P,
        ItemType,
        DbType,
        MSI,
        CTX,
        DBOE,
        DBOS
      >,
      meta: META
    ) {
      const { options: dbOptions } = new BaseClass(params);
      const optionsExtender = this.__createdOptionsExtender(meta);
      const dbOptionsExtended = this.__extendDatabaseOptions(dbOptions, optionsExtender);
      return this.__createInstanceOfBaseClassWithDbOptionsExtended(params, dbOptionsExtended) as any;
    }

    protected __createdOptionsExtender(meta: META): (dbOptions: DBO) => DBOE {
      return databaseOptionsExtenderFabric(meta.swarmMessageStoreOptions);
    }

    protected __extendDatabaseOptions(dbOptions: DBO, optionsExtender: (dbOptions: DBO) => DBOE): DBOE {
      const dbOptionsCopy = { ...dbOptions };
      return optionsExtender(dbOptionsCopy);
    }

    protected __createInstanceOfBaseClassWithDbOptionsExtended(
      params: ISwarmMessageStoreConnectorUtilsDatabaseOptionsSerializerValidatorConstructorParams<
        P,
        ItemType,
        DbType,
        MSI,
        CTX,
        DBOE,
        DBOS
      >,
      dbOptionsExtended: DBOE
    ): ISwarmStoreConnectorUtilsDatabaseOptionsSerializerValidator<P, ItemType, DbType, DBOE, DBOS> {
      const paramsWithExtendedDbOptions = {
        ...params,
        options: dbOptionsExtended,
      };
      return new BaseClass(paramsWithExtendedDbOptions) as ISwarmStoreConnectorUtilsDatabaseOptionsSerializerValidator<
        P,
        ItemType,
        DbType,
        DBOE,
        DBOS
      >;
    }
  }
  return (SwarmMessageStoreConnectorDBOptionsWithExtendedGrandAccessClass as unknown) as BC &
    ConstructorType<ISwarmStoreConnectorUtilsDatabaseOptionsSerializerValidator<P, ItemType, DbType, DBOE, DBOS>>;
}
