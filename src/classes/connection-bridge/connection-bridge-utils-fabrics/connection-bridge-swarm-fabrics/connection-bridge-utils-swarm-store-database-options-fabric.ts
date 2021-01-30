import { getSwarmMessageStoreDBOClass } from '../../../swarm-message-store/swarm-message-store-connectors/swarm-message-store-connector-db-options/swarm-message-store-connector-db-options-class/swarm-message-store-connector-db-options-class-fabric';
import {
  TSwarmStoreValueTypes,
  TSwarmStoreDatabaseType,
  TSwarmStoreDatabaseOptions,
  TSwarmStoreDatabaseOptionsSerialized,
} from '../../../swarm-store-class/swarm-store-class.types';
import { ESwarmStoreConnector } from '../../../swarm-store-class/swarm-store-class.const';
import { ISwarmMessageConstructor, ISwarmMessageInstanceDecrypted } from '../../../swarm-message/swarm-message-constructor.types';
import {
  ISwarmStoreDBOGrandAccessCallbackBaseContext,
  ISwarmStoreConnectorUtilsDatabaseOptionsValidatorsInstanceConstructor,
} from '../../../swarm-store-class/swarm-store-connectors/swarm-store-connetors.types';
import {
  ISwarmStoreConnectoDbOptionsUtilsGrandAccessCallbackContextFabric,
  ISwarmMessageStoreDatabaseOptionsWithMetaConstructor,
} from '../../../swarm-message-store/swarm-message-store-connectors/swarm-message-store-connector-db-options/swarm-store-connector-db-options.types';
import { ConstructorType } from '../../../../types/helper.types';
import { ISwarmMessageStoreConnectorUtilsDatabaseOptionsSerializerValidatorConstructorFabricParams } from '../../../swarm-message-store/swarm-message-store-connectors/swarm-message-store-connector-db-options/swarm-store-connector-db-options.types';
import { ISwarmMessageStoreConectorDbOptionsGrandAccessContextClassFabricParams } from '../../../swarm-message-store/swarm-message-store-connectors/swarm-message-store-connector-db-options/swarm-message-store-conector-db-options-grand-access-utils/swarm-store-conector-db-options-grand-access-context/swarm-store-conector-db-options-grand-access-context-classes/swarm-message-store-conector-db-options-grand-access-context-class/swarm-message-store-conector-db-options-grand-access-context-class.types';
import { ISwarmMessageStoreConectorDbOptionsGrandAccessContextClassFabric } from '../../../swarm-message-store/types/swarm-message-store-db-options.types';
import { ISwarmMessageStoreConnectorDbOptionsClassFabric } from '../../types/connection-bridge-swarm-fabrics.types';
import { ISerializer } from '../../../../types/serialization.types';
import { IOptionsSerializerValidatorSerializer } from '../../../basic-classes/options-serializer-validator-class/options-serializer-validator-class.types';
import {
  swarmStoreConnectorDbOptionsValidatorsWithGACValidationClassFabric,
  SwarmStoreConnectorDbOptionsValidators,
} from '../../../swarm-message-store/swarm-message-store-connectors/swarm-message-store-connector-db-options/swarm-message-store-connector-db-options-validators';
import { validateGrantAccessCallbackWithContextSerializable } from '../../../swarm-message-store/swarm-message-store-utils/swarm-message-store-validators/swarm-message-store-validator-grant-access-callback';
import { IDatabaseOptionsClass } from '../../../swarm-store-class/swarm-store-class.types';
import { SwarmMessageStoreDBOptionsClass } from '../../../swarm-message-store/swarm-message-store-connectors/swarm-message-store-connector-db-options/swarm-message-store-connector-db-options-class/swarm-message-store-connector-db-options-class';
import { ISwarmStoreDBOSerializerValidator } from '../../../swarm-store-class/swarm-store-connectors/swarm-store-connetors.types';

export function getSwarmMessageStoreConnectorDBOClass<
  P extends ESwarmStoreConnector,
  T extends TSwarmStoreValueTypes<P>,
  DbType extends TSwarmStoreDatabaseType<P>,
  MD extends ISwarmMessageInstanceDecrypted,
  CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>,
  DBOS extends TSwarmStoreDatabaseOptionsSerialized,
  SMC extends ISwarmMessageConstructor,
  CTXC extends ConstructorType<CTX>,
  SMSDBOGACF extends ISwarmMessageStoreConectorDbOptionsGrandAccessContextClassFabric<SMC, CTXC>
>(
  ContextBaseClass: CTXC,
  swarmMessageStoreDBOGrandAccessCallbackContextFabric: SMSDBOGACF,
  DBOBaseClassSerializerValidator:
    | ConstructorType<ISwarmStoreDBOSerializerValidator<P, T, DbType, DBO, DBOS>>
    | IDatabaseOptionsClass<P, T, DbType, DBO, DBOS>,
  additionalParams: Omit<
    ISwarmMessageStoreConnectorUtilsDatabaseOptionsSerializerValidatorConstructorFabricParams<
      P,
      T,
      DbType,
      MD,
      CTX,
      DBO,
      DBOS,
      SMC
    >,
    'grandAccessCallbackContextFabric'
  >
): ISwarmMessageStoreDatabaseOptionsWithMetaConstructor<P, T, DbType, MD, CTX, DBO, DBOS, { swarmMessageConstructor: SMC }> {
  const grandAccessCallbackContextFabric: ISwarmStoreConnectoDbOptionsUtilsGrandAccessCallbackContextFabric<
    P,
    DbType,
    T,
    DBO,
    SMC,
    CTX
  > = (dbOptions: DBO, swarmMessageConstructor: SMC): CTX => {
    const params: ISwarmMessageStoreConectorDbOptionsGrandAccessContextClassFabricParams<SMC> = {
      dbName: dbOptions.dbName,
      isPublicDb: Boolean(dbOptions.isPublic),
      usersIdsWithWriteAccess: dbOptions.write || [],
      swarmMessageConstructor,
    };
    const SwarmMessagesStoreDBOGrandAccessCallbackContextClass = swarmMessageStoreDBOGrandAccessCallbackContextFabric(
      ContextBaseClass,
      params
    );
    return new SwarmMessagesStoreDBOGrandAccessCallbackContextClass();
  };
  const SwarmMessageStoreDBOClass = getSwarmMessageStoreDBOClass<P, T, DbType, MD, CTX, DBO, DBOS, SMC>(
    { ...additionalParams, grandAccessCallbackContextFabric },
    DBOBaseClassSerializerValidator
  );

  return SwarmMessageStoreDBOClass;
}

export function getSwarmMessageStoreConnectorDBOClassFabric<
  P extends ESwarmStoreConnector,
  T extends TSwarmStoreValueTypes<P>,
  DbType extends TSwarmStoreDatabaseType<P>,
  MD extends ISwarmMessageInstanceDecrypted,
  CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>,
  DBOS extends TSwarmStoreDatabaseOptionsSerialized,
  SMC extends ISwarmMessageConstructor,
  CTXC extends ConstructorType<CTX>,
  SMSDBOGACF extends ISwarmMessageStoreConectorDbOptionsGrandAccessContextClassFabric<SMC, CTXC>,
  DBOCF extends ISwarmMessageStoreConnectorDbOptionsClassFabric<P, T, DbType, MD, CTX, DBO, DBOS, SMC, CTXC, SMSDBOGACF>,
  SRLZR extends ISerializer
>(serializer: SRLZR): DBOCF {
  const DboValidatorClass = swarmStoreConnectorDbOptionsValidatorsWithGACValidationClassFabric<P, T, DbType, DBO, DBOS>(
    SwarmStoreConnectorDbOptionsValidators as ISwarmStoreConnectorUtilsDatabaseOptionsValidatorsInstanceConstructor<
      P,
      T,
      DbType,
      DBO,
      DBOS
    >,
    validateGrantAccessCallbackWithContextSerializable
  );
  const dboFabric = (
    ContextBaseClass: CTXC,
    swarmMessageStoreDBOGrandAccessCallbackContextFabric: SMSDBOGACF,
    additionalParams?: Omit<
      ISwarmMessageStoreConnectorUtilsDatabaseOptionsSerializerValidatorConstructorFabricParams<
        P,
        T,
        DbType,
        MD,
        CTX,
        DBO,
        DBOS,
        SMC
      >,
      'grandAccessCallbackContextFabric'
    >
  ): ISwarmMessageStoreDatabaseOptionsWithMetaConstructor<P, T, DbType, MD, CTX, DBO, DBOS, { swarmMessageConstructor: SMC }> => {
    const fabricDBOValidator = () => new DboValidatorClass();
    const additionalParamsResulted = {
      ...additionalParams,
      optionsSerializer: (serializer as unknown) as IOptionsSerializerValidatorSerializer<DBO, DBOS>,
      validatorsFabric: fabricDBOValidator,
    };
    class SwarmMessageStoreDBOptionsBaseClass extends SwarmMessageStoreDBOptionsClass<P, T, DbType, MD, CTX, DBO, DBOS> {}
    const SwarmMessageStoreConnectorDBOClassCreated = getSwarmMessageStoreConnectorDBOClass<
      P,
      T,
      DbType,
      MD,
      CTX,
      DBO,
      DBOS,
      SMC,
      CTXC,
      SMSDBOGACF
    >(
      ContextBaseClass,
      swarmMessageStoreDBOGrandAccessCallbackContextFabric,
      SwarmMessageStoreDBOptionsBaseClass,
      additionalParamsResulted
    );
    return SwarmMessageStoreConnectorDBOClassCreated;
  };
  return dboFabric as DBOCF;
}
