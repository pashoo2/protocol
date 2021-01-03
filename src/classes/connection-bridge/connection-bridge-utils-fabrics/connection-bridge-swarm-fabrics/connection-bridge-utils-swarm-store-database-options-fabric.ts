import { getSwarmMessageStoreDBOClass } from '../../../swarm-message-store/swarm-message-store-connectors/swarm-message-store-connector-db-options/swarm-message-store-connector-db-options-class/swarm-message-store-connector-db-options-class-fabric';
import {
  TSwarmStoreValueTypes,
  TSwarmStoreDatabaseType,
  TSwarmStoreDatabaseOptions,
  TSwarmStoreDatabaseOptionsSerialized,
} from '../../../swarm-store-class/swarm-store-class.types';
import { ESwarmStoreConnector } from '../../../swarm-store-class/swarm-store-class.const';
import { TSwarmMessageInstance, ISwarmMessageConstructor } from '../../../swarm-message/swarm-message-constructor.types';
import { ISwarmStoreDBOGrandAccessCallbackBaseContext } from '../../../swarm-store-class/swarm-store-connectors/swarm-store-connetors.types';
import {
  ISwarmStoreConnectoDbOptionsUtilsGrandAccessCallbackContextFabric,
  ISwarmMessageStoreDatabaseOptionsWithMetaClass,
} from '../../../swarm-message-store/swarm-message-store-connectors/swarm-message-store-connector-db-options/swarm-store-connector-db-options.types';
import { ConstructorType } from '../../../../types/helper.types';
import { ISwarmMessageStoreConnectorUtilsDatabaseOptionsSerializerValidatorConstructorFabricParams } from '../../../swarm-message-store/swarm-message-store-connectors/swarm-message-store-connector-db-options/swarm-store-connector-db-options.types';
import { ISwarmMessageStoreConectorDbOptionsGrandAccessContextClassFabricParams } from '../../../swarm-message-store/swarm-message-store-connectors/swarm-message-store-connector-db-options/swarm-message-store-conector-db-options-grand-access-utils/swarm-store-conector-db-options-grand-access-context/swarm-store-conector-db-options-grand-access-context-classes/swarm-message-store-conector-db-options-grand-access-context-class/swarm-message-store-conector-db-options-grand-access-context-class.types';
import { IDatabaseOptionsClass } from '../../../swarm-store-class/swarm-store-class.types';
import { ISwarmMessageStoreConectorDbOptionsGrandAccessContextClassFabric } from '../../../swarm-message-store/types/swarm-message-store-db-options.types';
import { ISwarmMessageStoreConnectorDbOptionsClassFabric } from '../../types/connection-bridge-swarm-fabrics.types';
import { ISerializer } from '../../../../types/serialization.types';
import { IOptionsSerializerValidatorSerializer } from '../../../basic-classes/options-serializer-validator-class/options-serializer-validator-class.types';

export function getSwarmMessageStoreConnectorDBOClass<
  P extends ESwarmStoreConnector,
  T extends TSwarmStoreValueTypes<P>,
  DbType extends TSwarmStoreDatabaseType<P>,
  MSI extends TSwarmMessageInstance | T,
  CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>,
  DBOS extends TSwarmStoreDatabaseOptionsSerialized,
  SMC extends ISwarmMessageConstructor,
  CTXC extends ConstructorType<CTX>,
  SMSDBOGACF extends ISwarmMessageStoreConectorDbOptionsGrandAccessContextClassFabric<SMC, CTXC>
>(
  ContextBaseClass: CTXC,
  swarmMessageStoreDBOGrandAccessCallbackContextFabric: SMSDBOGACF,
  OptionsSerializerValidatorConstructor?: IDatabaseOptionsClass<P, T, DbType, DBO, DBOS>,
  additionalParams?: Omit<
    ISwarmMessageStoreConnectorUtilsDatabaseOptionsSerializerValidatorConstructorFabricParams<
      P,
      T,
      DbType,
      MSI,
      CTX,
      DBO,
      DBOS,
      SMC
    >,
    'grandAccessCallbackContextFabric'
  >
): ISwarmMessageStoreDatabaseOptionsWithMetaClass<P, T, DbType, MSI, CTX, DBO, DBOS, { swarmMessageConstructor: SMC }> {
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
  const SwarmMessageStoreDBOClass = getSwarmMessageStoreDBOClass<P, T, DbType, MSI, CTX, DBO, DBOS, SMC>(
    { ...additionalParams, grandAccessCallbackContextFabric },
    OptionsSerializerValidatorConstructor
  );

  return SwarmMessageStoreDBOClass;
}

export function getSwarmMessageStoreConnectorDBOClassFabric<
  P extends ESwarmStoreConnector,
  T extends TSwarmStoreValueTypes<P>,
  DbType extends TSwarmStoreDatabaseType<P>,
  MSI extends TSwarmMessageInstance | T,
  CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>,
  DBOS extends TSwarmStoreDatabaseOptionsSerialized,
  SMC extends ISwarmMessageConstructor,
  CTXC extends ConstructorType<CTX>,
  SMSDBOGACF extends ISwarmMessageStoreConectorDbOptionsGrandAccessContextClassFabric<SMC, CTXC>,
  DBOCF extends ISwarmMessageStoreConnectorDbOptionsClassFabric<P, T, DbType, MSI, CTX, DBO, DBOS, SMC, CTXC, SMSDBOGACF>,
  SRLZR extends ISerializer
>(serializer: SRLZR): DBOCF {
  const dboFabric = (
    ContextBaseClass: CTXC,
    swarmMessageStoreDBOGrandAccessCallbackContextFabric: SMSDBOGACF,
    OptionsSerializerValidatorConstructor?: IDatabaseOptionsClass<P, T, DbType, DBO, DBOS>,
    additionalParams?: Omit<
      ISwarmMessageStoreConnectorUtilsDatabaseOptionsSerializerValidatorConstructorFabricParams<
        P,
        T,
        DbType,
        MSI,
        CTX,
        DBO,
        DBOS,
        SMC
      >,
      'grandAccessCallbackContextFabric'
    >
  ): ISwarmMessageStoreDatabaseOptionsWithMetaClass<P, T, DbType, MSI, CTX, DBO, DBOS, { swarmMessageConstructor: SMC }> => {
    const additionalParamsResulted = {
      ...additionalParams,
      optionsSerializer: (serializer as unknown) as IOptionsSerializerValidatorSerializer<DBO, DBOS>,
    };
    const SwarmMessageStoreConnectorDBOClassCreated = getSwarmMessageStoreConnectorDBOClass<
      P,
      T,
      DbType,
      MSI,
      CTX,
      DBO,
      DBOS,
      SMC,
      CTXC,
      SMSDBOGACF
    >(
      ContextBaseClass,
      swarmMessageStoreDBOGrandAccessCallbackContextFabric,
      OptionsSerializerValidatorConstructor,
      additionalParamsResulted
    );
    return SwarmMessageStoreConnectorDBOClassCreated;
  };
  return dboFabric as DBOCF;
}
