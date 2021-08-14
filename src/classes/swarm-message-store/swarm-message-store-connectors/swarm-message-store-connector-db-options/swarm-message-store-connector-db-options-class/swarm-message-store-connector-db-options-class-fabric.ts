import { ESwarmStoreConnector } from 'classes/swarm-store-class/swarm-store-class.const';
import {
  TSwarmStoreValueTypes,
  TSwarmStoreDatabaseType,
  TSwarmStoreDatabaseOptions,
  TSwarmStoreDatabaseOptionsSerialized,
} from 'classes/swarm-store-class/swarm-store-class.types';
import {
  ISwarmMessageStoreDBOSerializerValidatorConstructorParams,
  ISwarmMessageStoreConnectorUtilsDatabaseOptionsSerializerValidatorWithMetaConstructorArguments,
} from '../swarm-store-connector-db-options.types';
import { IOptionsSerializerValidatorSerializer } from 'classes/basic-classes/options-serializer-validator-class/options-serializer-validator-class.types';
import { ISwarmMessageStoreConnectorUtilsDatabaseOptionsSerializerValidatorConstructorFabricParams } from '../swarm-store-connector-db-options.types';
import { ISwarmMessageStoreConnectorUtilsDbOptionsGrandAccessCallbackContextBinder } from '../swarm-store-connector-db-options.types';
import { swarmStoreConnectorDbOptionsGrandAccessContextBinderFabric } from '../swarm-message-store-conector-db-options-grand-access-utils/swarm-store-conector-db-options-grand-access-context/swarm-store-conector-db-options-grand-access-context-binder/swarm-store-conector-db-options-grand-access-context-binder-fabric';
import { swarmStoreConectorDbOptionsGrandAccessContextBinderToDatabaseOptionsFabric } from '../swarm-message-store-conector-db-options-grand-access-utils/swarm-store-conector-db-options-grand-access-context/swarm-store-conector-db-options-grand-access-context-binder-to-database-options/swarm-store-conector-db-options-grand-access-context-binder-to-database-options-fabric';
import { ISwarmMessageStoreConnectorDatabaseOptionsWithAccessControlleGrantCallbackBound } from '../swarm-store-connector-db-options.types';
import { ISwarmMessageStoreDatabaseOptionsWithMetaConstructor } from '../swarm-store-connector-db-options.types';
import { ConstructorType } from '../../../../../types/helper.types';
import { ISwarmStoreDBOSerializerValidator } from '../../../../swarm-store-class/swarm-store-connectors/swarm-store-connectors.types';
import { IDatabaseOptionsClass } from '../../../../swarm-store-class/swarm-store-class.types';
import {
  ISwarmMessageConstructor,
  ISwarmMessageInstanceDecrypted,
} from '../../../../swarm-message/swarm-message-constructor.types';
import {
  ISwarmStoreDBOGrandAccessCallbackBaseContext,
  ISwarmStoreConnectorUtilsDatabaseOptionsValidators,
} from 'classes/swarm-store-class/swarm-store-connectors/swarm-store-connectors.types';

export function getSwarmMessageStoreDBOClass<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmStoreValueTypes<P>,
  DbType extends TSwarmStoreDatabaseType<P>,
  MD extends ISwarmMessageInstanceDecrypted,
  CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>,
  DBOS extends TSwarmStoreDatabaseOptionsSerialized,
  SMC extends ISwarmMessageConstructor
>(
  params: ISwarmMessageStoreConnectorUtilsDatabaseOptionsSerializerValidatorConstructorFabricParams<
    P,
    ItemType,
    DbType,
    MD,
    CTX,
    DBO,
    DBOS,
    SMC
  >,
  DBOBaseClassSerializerValidator:
    | ConstructorType<ISwarmStoreDBOSerializerValidator<P, ItemType, DbType, DBO, DBOS>>
    | IDatabaseOptionsClass<P, ItemType, DbType, DBO, DBOS>
): ISwarmMessageStoreDatabaseOptionsWithMetaConstructor<
  P,
  ItemType,
  DbType,
  MD,
  CTX,
  DBO,
  DBOS,
  { swarmMessageConstructor: SMC }
> {
  const getDbOptionsSerializer = (): IOptionsSerializerValidatorSerializer<DBO, DBOS> =>
    params.optionsSerializer ?? (JSON as unknown as IOptionsSerializerValidatorSerializer<DBO, DBOS>);

  const createDBOValidators = (): ISwarmStoreConnectorUtilsDatabaseOptionsValidators<P, ItemType, DbType, DBO, DBOS> => {
    const validatorsFabric = params.validatorsFabric;
    return validatorsFabric();
  };

  const createGrandAccessCallbackContextBinder = (
    dbOptions: DBO,
    swarmMessageConstructor: SMC
  ): ISwarmMessageStoreConnectorUtilsDbOptionsGrandAccessCallbackContextBinder<P, ItemType, MD, CTX> => {
    const context = params.grandAccessCallbackContextFabric(dbOptions, swarmMessageConstructor);
    const grandAccessContextBinderFabric =
      params.grandAccessBinderFabric || swarmStoreConnectorDbOptionsGrandAccessContextBinderFabric;

    return grandAccessContextBinderFabric(context);
  };

  const createGrandAccessCallbackBinderForDBOptions =
    (): ISwarmMessageStoreConnectorDatabaseOptionsWithAccessControlleGrantCallbackBound<P, ItemType, DbType, MD, CTX, DBO> => {
      const grandAccessBinderForDBOptionsFabric =
        params.grandAccessBinderForDBOptionsFabric ?? swarmStoreConectorDbOptionsGrandAccessContextBinderToDatabaseOptionsFabric;
      return grandAccessBinderForDBOptionsFabric();
    };

  const extendDatabaseOptions = (options: {
    options: DBO | DBOS;
    meta: { swarmMessageConstructor: SMC };
  }): ISwarmMessageStoreDBOSerializerValidatorConstructorParams<P, ItemType, DbType, MD, CTX, DBO, DBOS> => {
    const {
      meta: { swarmMessageConstructor },
      options: dbOptions,
    } = options;

    if (!swarmMessageConstructor) {
      throw new Error('There is no swarm message constructor instance passed in the meta data');
    }

    const dbOptionsSerializer = getDbOptionsSerializer();
    const dbOptionsParsed = typeof dbOptions === 'string' ? dbOptionsSerializer.parse(dbOptions) : dbOptions;

    return {
      options: dbOptionsParsed,
      serializer: dbOptionsSerializer,
      validators: createDBOValidators(),
      grandAccessBinder: createGrandAccessCallbackContextBinder(dbOptionsParsed, swarmMessageConstructor),
      grandAccessBinderForDBOptions: createGrandAccessCallbackBinderForDBOptions(),
    };
  };
  class SwarmMessageStoreDBOptionsClassCreated extends DBOBaseClassSerializerValidator {
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
      super(extendDatabaseOptions(options));
    }
  }
  return SwarmMessageStoreDBOptionsClassCreated as ISwarmMessageStoreDatabaseOptionsWithMetaConstructor<
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
