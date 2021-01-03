import { ESwarmStoreConnector } from 'classes/swarm-store-class/swarm-store-class.const';
import {
  TSwarmStoreValueTypes,
  TSwarmStoreDatabaseType,
  TSwarmStoreDatabaseOptions,
  TSwarmStoreDatabaseOptionsSerialized,
} from 'classes/swarm-store-class/swarm-store-class.types';
import { TSwarmMessageInstance } from 'classes/swarm-message/swarm-message-constructor.types';
import {
  ISwarmMessageStoreDBOSerializerValidatorConstructorParams,
  ISwarmMessageStoreConnectorUtilsDatabaseOptionsSerializerValidatorWithMetaConstructorArguments,
} from '../swarm-store-connector-db-options.types';
import { SwarmMessageStoreDBOptionsClass } from './swarm-message-store-connector-db-options-class';
import { IOptionsSerializerValidatorSerializer } from 'classes/basic-classes/options-serializer-validator-class/options-serializer-validator-class.types';
import { swarmStoreConnectorDbOptionsValidatorsInstanceFabric } from '../swarm-message-store-connector-db-options-validators/swarm-store-connector-db-options-validators-fabric';
import { ISwarmMessageStoreConnectorUtilsDatabaseOptionsSerializerValidatorConstructorFabricParams } from '../swarm-store-connector-db-options.types';
import { ISwarmMessageStoreConnectorUtilsDbOptionsGrandAccessCallbackContextBinder } from '../swarm-store-connector-db-options.types';
import { swarmStoreConnectorDbOptionsGrandAccessContextBinderFabric } from '../swarm-message-store-conector-db-options-grand-access-utils/swarm-store-conector-db-options-grand-access-context/swarm-store-conector-db-options-grand-access-context-binder/swarm-store-conector-db-options-grand-access-context-binder-fabric';
import { swarmStoreConectorDbOptionsGrandAccessContextBinderToDatabaseOptionsFabric } from '../swarm-message-store-conector-db-options-grand-access-utils/swarm-store-conector-db-options-grand-access-context/swarm-store-conector-db-options-grand-access-context-binder-to-database-options/swarm-store-conector-db-options-grand-access-context-binder-to-database-options-fabric';
import { ISwarmMessageStoreConnectorDatabaseOptionsWithAccessControlleGrantCallbackBound } from '../swarm-store-connector-db-options.types';
import { ISwarmMessageStoreDatabaseOptionsWithMetaClass } from '../swarm-store-connector-db-options.types';
import { IDatabaseOptionsClass } from '../../../../swarm-store-class/swarm-store-class.types';
import { ISwarmMessageConstructor } from '../../../../swarm-message/swarm-message-constructor.types';
import {
  ISwarmStoreDBOGrandAccessCallbackBaseContext,
  ISwarmStoreConnectorUtilsDatabaseOptionsValidators,
} from 'classes/swarm-store-class/swarm-store-connectors/swarm-store-connetors.types';

export function getSwarmMessageStoreDBOClass<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmStoreValueTypes<P>,
  DbType extends TSwarmStoreDatabaseType<P>,
  MSI extends TSwarmMessageInstance | ItemType,
  CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>,
  DBOS extends TSwarmStoreDatabaseOptionsSerialized,
  SMC extends ISwarmMessageConstructor
>(
  params: ISwarmMessageStoreConnectorUtilsDatabaseOptionsSerializerValidatorConstructorFabricParams<
    P,
    ItemType,
    DbType,
    MSI,
    CTX,
    DBO,
    DBOS,
    SMC
  >,
  OptionsSerializerValidatorConstructor?: IDatabaseOptionsClass<P, ItemType, DbType, DBO, DBOS>
): ISwarmMessageStoreDatabaseOptionsWithMetaClass<P, ItemType, DbType, MSI, CTX, DBO, DBOS, { swarmMessageConstructor: SMC }> {
  const ConstructorToUse = (OptionsSerializerValidatorConstructor ??
    SwarmMessageStoreDBOptionsClass) as ISwarmMessageStoreDatabaseOptionsWithMetaClass<P, ItemType, DbType, MSI, CTX, DBO, DBOS>;
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
    dbOptions: DBO,
    swarmMessageConstructor: SMC
  ): ISwarmMessageStoreConnectorUtilsDbOptionsGrandAccessCallbackContextBinder<P, ItemType, MSI, CTX> => {
    const context = params.grandAccessCallbackContextFabric(dbOptions, swarmMessageConstructor);
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
    meta: { swarmMessageConstructor: SMC };
  }): ISwarmMessageStoreDBOSerializerValidatorConstructorParams<P, ItemType, DbType, MSI, CTX, DBO, DBOS> => {
    const dbOptionsSerializer = getDbOptionsSerializer();
    const {
      meta: { swarmMessageConstructor },
      options: dbOptions,
    } = options;
    const dbOptionsParsed = typeof dbOptions === 'string' ? dbOptionsSerializer.parse(dbOptions) : dbOptions;

    return {
      options: dbOptionsParsed,
      serializer: dbOptionsSerializer,
      validators: createValidators(),
      grandAccessBinder: createGrandAccessContextBinder(dbOptionsParsed, swarmMessageConstructor),
      grandAccessBinderForDBOptions: createGrandAccessBinderForDBOptions(),
    };
  };
  class SwarmMessageStoreDBOptionsClassCreated extends ConstructorToUse {
    constructor(
      options: Pick<
        ISwarmMessageStoreConnectorUtilsDatabaseOptionsSerializerValidatorWithMetaConstructorArguments<
          P,
          ItemType,
          DbType,
          DBO,
          { swarmMessageConstructor: SMC }
        >,
        'options' | 'meta'
      >
    ) {
      super(extendOptions(options));
    }
  }
  return SwarmMessageStoreDBOptionsClassCreated as ISwarmMessageStoreDatabaseOptionsWithMetaClass<
    P,
    ItemType,
    DbType,
    MSI,
    CTX,
    DBO,
    DBOS,
    { swarmMessageConstructor: SMC }
  >;
}
