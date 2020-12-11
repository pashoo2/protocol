import { ESwarmStoreConnector } from '../../../swarm-store-class.const';
import {
  TSwarmStoreValueTypes,
  TSwarmStoreDatabaseType,
  TSwarmStoreDatabaseOptions,
  TSwarmStoreDatabaseOptionsSerialized,
} from '../../../swarm-store-class.types';
import { TSwarmMessageInstance } from '../../../../swarm-message/swarm-message-constructor.types';
import {
  ISwarmStoreConnectorUtilsDatabaseOptionsSerializerValidatorConstructor,
  ISwarmStoreConnectorUtilsDatabaseOptionsSerializerValidatorConstructorParams,
} from '../swarm-store-connector-db-options-helpers.types';
import { SwarmStoreConnectorDBOptionsClass } from './swarm-store-connector-orbit-db-options-class';
import {
  IOptionsSerializerValidatorConstructorParams,
  IOptionsSerializerValidatorSerializer,
} from '../../../../basic-classes/options-serializer-validator-class/options-serializer-validator-class.types';
import { swarmStoreConnectorDbOptionsValidatorsInstanceFabric } from '../swarm-store-connector-db-options-validators/swarm-store-connector-db-options-validators-fabric';
import {
  ISwarmStoreConnectoDbOptionsUtilsGrandAccessCallbackContext,
  ISwarmStoreConnectorUtilsDatabaseOptionsSerializerValidatorConstructorFabricParams,
} from '../swarm-store-connector-db-options-helpers.types';
import {
  ISwarmStoreConnectorUtilsDatabaseOptionsValidators,
  ISwarmStoreConnectorUtilsDbOptionsGrandAccessCallbackContextBinder,
} from '../swarm-store-connector-db-options-helpers.types';
import { swarmStoreConnectorDbOptionsGrandAccessContextBinderFabric } from '../swarm-store-conector-db-options-grand-access-context-binder/swarm-store-conector-db-options-grand-access-context-binder-fabric';
import { swarmStoreConectorDbOptionsGrandAccessContextBinderToDatabaseOptionsFabric } from '../swarm-store-conector-db-options-grand-access-context-binder-to-database-options/swarm-store-conector-db-options-grand-access-context-binder-to-database-options-fabric';
import { ISwarmStoreConnectorDatabaseOptionsWithAccessControlleGrantCallbackBound } from '../swarm-store-connector-db-options-helpers.types';

export function swarmStoreConnectorDbOptionsClassFabric<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmStoreValueTypes<P>,
  DbType extends TSwarmStoreDatabaseType<P>,
  MSI extends TSwarmMessageInstance | ItemType,
  CTX extends ISwarmStoreConnectoDbOptionsUtilsGrandAccessCallbackContext,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>,
  DBOS extends TSwarmStoreDatabaseOptionsSerialized
>(
  params: ISwarmStoreConnectorUtilsDatabaseOptionsSerializerValidatorConstructorFabricParams<
    P,
    ItemType,
    DbType,
    MSI,
    CTX,
    DBO,
    DBOS
  >,
  OptionsSerializerValidatorConstructor?: ISwarmStoreConnectorUtilsDatabaseOptionsSerializerValidatorConstructor<
    P,
    ItemType,
    DbType,
    MSI,
    CTX,
    DBO,
    DBOS
  >
) {
  const ConstructorToUse = (OptionsSerializerValidatorConstructor ??
    SwarmStoreConnectorDBOptionsClass) as ISwarmStoreConnectorUtilsDatabaseOptionsSerializerValidatorConstructor<
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

  const createGrandAccessContextBinder = (): ISwarmStoreConnectorUtilsDbOptionsGrandAccessCallbackContextBinder<
    P,
    ItemType,
    MSI,
    CTX
  > => {
    const context = params.grandAccessCallbackContextFabric();
    const grandAccessContextBinderFabric =
      params.grandAccessBinderFabric || swarmStoreConnectorDbOptionsGrandAccessContextBinderFabric;

    return grandAccessContextBinderFabric(context);
  };

  const createGrandAccessBinderForDBOptions = (): ISwarmStoreConnectorDatabaseOptionsWithAccessControlleGrantCallbackBound<
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

  const extendOptions = (
    options: Pick<IOptionsSerializerValidatorConstructorParams<DBO, DBOS>, 'options'>
  ): ISwarmStoreConnectorUtilsDatabaseOptionsSerializerValidatorConstructorParams<P, ItemType, DbType, MSI, CTX, DBO, DBOS> => {
    return {
      ...options,
      serializer: getDbOptionsSerializer(),
      validators: createValidators(),
      grandAccessBinder: createGrandAccessContextBinder(),
      grandAccessBinderForDBOptions: createGrandAccessBinderForDBOptions(),
    };
  };
  return class SwarmStoreConnectorDBOptionsClassCreated extends ConstructorToUse {
    constructor(options: Pick<IOptionsSerializerValidatorConstructorParams<DBO, DBOS>, 'options'>) {
      super(extendOptions(options));
    }
  };
}
