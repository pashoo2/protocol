import { ICentralAuthority } from '../../central-authority-class/central-authority-class.types';
import { ConstructorType } from '../../../types/helper.types';
import { ISwarmStoreConnectorDbOptionsGrandAccessContextClassFabricParams } from '../../swarm-store-class/swarm-store-connectors/swarm-store-connector-options/swarm-store-connector-options-grand-access-context/swarm-store-conector-db-options-grand-access-context-base-class/swarm-store-conector-db-options-grand-access-context-class.types';
import { ESwarmStoreConnector } from '../../swarm-store-class/swarm-store-class.const';
import {
  TSwarmStoreValueTypes,
  TSwarmStoreDatabaseType,
  TSwarmStoreDatabaseOptions,
  TSwarmStoreDatabaseOptionsSerialized,
} from '../../swarm-store-class/swarm-store-class.types';
import { TSwarmMessageInstance, ISwarmMessageConstructor } from '../../swarm-message/swarm-message-constructor.types';
import { ISwarmStoreConnectoDbOptionsUtilsGrandAccessCallbackContext } from '../../swarm-store-class/swarm-store-connectors/swarm-store-connetors.types';
import { ISwarmMessageStoreConnectorUtilsDatabaseOptionsSerializerValidatorWithMetaConstructor } from '../../swarm-message-store/swarm-message-store-connectors/swarm-message-store-connector-db-options/swarm-store-connector-db-options.types';

export interface ISwarmStoreDatabaseGrandAccessBaseContextClassConnectionBridgeFabric {
  (params: {
    centralAuthority: {
      isRunning: ICentralAuthority['isRunning'];
      getSwarmUserCredentials: ICentralAuthority['getSwarmUserCredentials'];
      getUserIdentity: ICentralAuthority['getUserIdentity'];
    };
  }): ConstructorType<ISwarmStoreConnectorDbOptionsGrandAccessContextClassFabricParams>;
}

export interface ISwarmMessageStoreConnectorDbOptionsClassConnectionBridgeFabric<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmStoreValueTypes<P>,
  DbType extends TSwarmStoreDatabaseType<P>,
  MSI extends TSwarmMessageInstance | ItemType,
  CTX extends ISwarmStoreConnectoDbOptionsUtilsGrandAccessCallbackContext,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>,
  DBOS extends TSwarmStoreDatabaseOptionsSerialized,
  SMC extends ISwarmMessageConstructor
> {
  (
    ContextBaseClass: ConstructorType<CTX>,
    SwarmMessageConstructor: SMC,
    OptionsSerializerValidatorConstructor?: ISwarmMessageStoreConnectorUtilsDatabaseOptionsSerializerValidatorWithMetaConstructor<
      P,
      ItemType,
      DbType,
      MSI,
      CTX,
      DBO,
      DBOS
    >
  ): ISwarmMessageStoreConnectorUtilsDatabaseOptionsSerializerValidatorWithMetaConstructor<
    P,
    ItemType,
    DbType,
    MSI,
    CTX,
    DBO,
    DBOS
  >;
}
