import { ESwarmStoreConnector } from 'classes/swarm-store-class/swarm-store-class.const';
import {
  TSwarmStoreValueTypes,
  TSwarmStoreDatabaseType,
  TSwarmStoreDatabaseOptions,
  TSwarmStoreDatabaseOptionsSerialized,
} from 'classes/swarm-store-class/swarm-store-class.types';
import { TSwarmMessageInstance } from 'classes/swarm-message/swarm-message-constructor.types';
import { ISwarmMessageStoreConnectorUtilsDatabaseOptionsSerializerValidatorConstructorParams } from '../swarm-store-connector-db-options.types';
import { SwarmMessageStoreConnectorDBOptionsClass } from './swarm-message-store-connector-db-options-class';
import {
  IOptionsSerializerValidatorConstructorParams,
  IOptionsSerializerValidatorSerializer,
} from 'classes/basic-classes/options-serializer-validator-class/options-serializer-validator-class.types';
import { swarmStoreConnectorDbOptionsValidatorsInstanceFabric } from '../swarm-message-store-connector-db-options-validators/swarm-store-connector-db-options-validators-fabric';
import { ISwarmMessageStoreConnectorUtilsDatabaseOptionsSerializerValidatorConstructorFabricParams } from '../swarm-store-connector-db-options.types';
import { ISwarmMessageStoreConnectorUtilsDbOptionsGrandAccessCallbackContextBinder } from '../swarm-store-connector-db-options.types';
import { swarmStoreConnectorDbOptionsGrandAccessContextBinderFabric } from '../swarm-message-store-conector-db-options-grand-access-utils/swarm-store-conector-db-options-grand-access-context/swarm-store-conector-db-options-grand-access-context-binder/swarm-store-conector-db-options-grand-access-context-binder-fabric';
import { swarmStoreConectorDbOptionsGrandAccessContextBinderToDatabaseOptionsFabric } from '../swarm-message-store-conector-db-options-grand-access-utils/swarm-store-conector-db-options-grand-access-context/swarm-store-conector-db-options-grand-access-context-binder-to-database-options/swarm-store-conector-db-options-grand-access-context-binder-to-database-options-fabric';
import { ISwarmMessageStoreConnectorDatabaseOptionsWithAccessControlleGrantCallbackBound } from '../swarm-store-connector-db-options.types';
import { ISwarmMessageStoreConnectorUtilsDatabaseOptionsSerializerValidatorWithMetaConstructor } from '../swarm-store-connector-db-options.types';
import { IDatabaseOptionsSerializerValidatorConstructor } from '../../../../swarm-store-class/swarm-store-class.types';
import {
  ISwarmDbOptionsGrandAccessCbCTX,
  ISwarmStoreConnectorUtilsDatabaseOptionsValidators,
} from 'classes/swarm-store-class/swarm-store-connectors/swarm-store-connetors.types';

export function getSwarmMessageStoreConnectorDbOptionsClass<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmStoreValueTypes<P>,
  DbType extends TSwarmStoreDatabaseType<P>,
  MSI extends TSwarmMessageInstance | ItemType,
  CTX extends ISwarmDbOptionsGrandAccessCbCTX,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>,
  DBOS extends TSwarmStoreDatabaseOptionsSerialized
>(
  params: ISwarmMessageStoreConnectorUtilsDatabaseOptionsSerializerValidatorConstructorFabricParams<
    P,
    ItemType,
    DbType,
    MSI,
    CTX,
    DBO,
    DBOS
  >,
  OptionsSerializerValidatorConstructor?: IDatabaseOptionsSerializerValidatorConstructor<P, ItemType, DbType, DBO, DBOS>
): IDatabaseOptionsSerializerValidatorConstructor<P, ItemType, DbType, DBO, DBOS> {
  const ConstructorToUse = (OptionsSerializerValidatorConstructor ??
    SwarmMessageStoreConnectorDBOptionsClass) as ISwarmMessageStoreConnectorUtilsDatabaseOptionsSerializerValidatorWithMetaConstructor<
    P,
    ItemType,
    DbType,
    MSI,
    CTX,
    DBO,
    DBOS
  >;
  const getDbOptionsSerializer = (): IOptionsSerializerValidatorSerializer<DBO, DBOS> =>
    params.optionsSerializer ?? ((JSON as unknown) as IOptionsSerializerValidatorSerializer<DBO, DBOS>);

  const createValidators = (): ISwarmStoreConnectorUtilsDatabaseOptionsValidators<P, ItemType, DbType, DBO, DBOS> => {
    const validatorsFabric = params.validatorsFabric ?? swarmStoreConnectorDbOptionsValidatorsInstanceFabric;
    return validatorsFabric<P, ItemType, DbType, DBO, DBOS>() as ISwarmStoreConnectorUtilsDatabaseOptionsValidators<
      P,
      ItemType,
      DbType,
      DBO,
      DBOS
    >;
  };

  const createGrandAccessContextBinder = (
    dbOptions: DBO
  ): ISwarmMessageStoreConnectorUtilsDbOptionsGrandAccessCallbackContextBinder<P, ItemType, MSI, CTX> => {
    const context = params.grandAccessCallbackContextFabric(dbOptions);
    const grandAccessContextBinderFabric =
      params.grandAccessBinderFabric || swarmStoreConnectorDbOptionsGrandAccessContextBinderFabric;

    return grandAccessContextBinderFabric(context);
  };

  const createGrandAccessBinderForDBOptions = (): ISwarmMessageStoreConnectorDatabaseOptionsWithAccessControlleGrantCallbackBound<
    P,
    ItemType,
    DbType,
    MSI,
    CTX,
    DBO
  > => {
    const grandAccessBinderForDBOptionsFabric =
      params.grandAccessBinderForDBOptionsFabric ?? swarmStoreConectorDbOptionsGrandAccessContextBinderToDatabaseOptionsFabric;
    return grandAccessBinderForDBOptionsFabric();
  };

  const extendOptions = (options: {
    options: DBO | DBOS;
  }): ISwarmMessageStoreConnectorUtilsDatabaseOptionsSerializerValidatorConstructorParams<
    P,
    ItemType,
    DbType,
    MSI,
    CTX,
    DBO,
    DBOS
  > => {
    const dbOptionsSerializer = getDbOptionsSerializer();
    const dbOptionsParsed = typeof options.options === 'string' ? dbOptionsSerializer.parse(options.options) : options.options;

    return {
      options: dbOptionsParsed,
      serializer: dbOptionsSerializer,
      validators: createValidators(),
      grandAccessBinder: createGrandAccessContextBinder(dbOptionsParsed),
      grandAccessBinderForDBOptions: createGrandAccessBinderForDBOptions(),
    };
  };
  return class SwarmMessageStoreConnectorDBOptionsClassCreated extends ConstructorToUse {
    constructor(options: Pick<IOptionsSerializerValidatorConstructorParams<DBO, DBOS>, 'options'>) {
      super(extendOptions(options));
    }
  };
}
