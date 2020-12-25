import { getSwarmMessageStoreConnectorDbOptionsClass } from '../../../swarm-message-store/swarm-message-store-connectors/swarm-message-store-connector-db-options/swarm-message-store-connector-db-options-class/swarm-message-store-connector-db-options-class-fabric';
import {
  TSwarmStoreValueTypes,
  TSwarmStoreDatabaseType,
  TSwarmStoreDatabaseOptions,
  TSwarmStoreDatabaseOptionsSerialized,
} from '../../../swarm-store-class/swarm-store-class.types';
import { ESwarmStoreConnector } from '../../../swarm-store-class/swarm-store-class.const';
import { TSwarmMessageInstance, ISwarmMessageConstructor } from '../../../swarm-message/swarm-message-constructor.types';
import { ISwarmStoreConnectoDbOptionsUtilsGrandAccessCallbackContext } from '../../../swarm-store-class/swarm-store-connectors/swarm-store-connetors.types';
import { ISwarmStoreConnectoDbOptionsUtilsGrandAccessCallbackContextFabric } from '../../../swarm-message-store/swarm-message-store-connectors/swarm-message-store-connector-db-options/swarm-store-connector-db-options.types';
import { ConstructorType } from '../../../../types/helper.types';
import { getSwarmStoreConectorDbOptionsGrandAccessContextClass } from '../../../swarm-message-store/swarm-message-store-connectors/swarm-message-store-connector-db-options/swarm-message-store-conector-db-options-grand-access-utils/swarm-store-conector-db-options-grand-access-context/swarm-store-conector-db-options-grand-access-context-classes/swarm-message-store-conector-db-options-grand-access-context-class/swarm-message-store-conector-db-options-grand-access-context-class';
import { ISwarmMessageStoreConnectorUtilsDatabaseOptionsSerializerValidatorConstructorFabricParams } from '../../../swarm-message-store/swarm-message-store-connectors/swarm-message-store-connector-db-options/swarm-store-connector-db-options.types';
import { ISwarmMessageStoreConectorDbOptionsGrandAccessContextClassFabricParams } from '../../../swarm-message-store/swarm-message-store-connectors/swarm-message-store-connector-db-options/swarm-message-store-conector-db-options-grand-access-utils/swarm-store-conector-db-options-grand-access-context/swarm-store-conector-db-options-grand-access-context-classes/swarm-message-store-conector-db-options-grand-access-context-class/swarm-message-store-conector-db-options-grand-access-context-class.types';
import { IDatabaseOptionsSerializerValidatorConstructor } from '../../../swarm-store-class/swarm-store-class.types';

export function getSwarmMessageStoreConnectorDbOptionsClassConnectionBridgeUtil<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmStoreValueTypes<P>,
  DbType extends TSwarmStoreDatabaseType<P>,
  MSI extends TSwarmMessageInstance | ItemType,
  CTX extends ISwarmStoreConnectoDbOptionsUtilsGrandAccessCallbackContext,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>,
  DBOS extends TSwarmStoreDatabaseOptionsSerialized,
  SMC extends ISwarmMessageConstructor
>(
  ContextBaseClass: ConstructorType<CTX>,
  swarmMessageConstructor: SMC,
  OptionsSerializerValidatorConstructor?: IDatabaseOptionsSerializerValidatorConstructor<P, ItemType, DbType, DBO, DBOS>,
  additionalParams?: Omit<
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
): IDatabaseOptionsSerializerValidatorConstructor<P, ItemType, DbType, DBO, DBOS> {
  const grandAccessCallbackContextFabric: ISwarmStoreConnectoDbOptionsUtilsGrandAccessCallbackContextFabric<
    P,
    DbType,
    ItemType,
    DBO,
    CTX
  > = (dbOptions: DBO): CTX => {
    const params: ISwarmMessageStoreConectorDbOptionsGrandAccessContextClassFabricParams<SMC> = {
      dbName: dbOptions.dbName,
      isPublicDb: Boolean(dbOptions.isPublic),
      usersIdsWithWriteAccess: dbOptions.write || [],
      swarmMessageConstructor,
    };
    const Class = getSwarmStoreConectorDbOptionsGrandAccessContextClass<SMC, typeof ContextBaseClass>(ContextBaseClass, params);
    return new Class();
  };
  return getSwarmMessageStoreConnectorDbOptionsClass<P, ItemType, DbType, MSI, CTX, DBO, DBOS>(
    { ...additionalParams, grandAccessCallbackContextFabric },
    OptionsSerializerValidatorConstructor
  );
}
