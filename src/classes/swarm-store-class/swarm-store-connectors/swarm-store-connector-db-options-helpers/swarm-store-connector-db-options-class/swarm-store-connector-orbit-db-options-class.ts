import { OptionsSerializerValidator } from '../../../../basic-classes/options-serializer-validator-class/options-serializer-validator-class';
import {
  TSwarmStoreDatabaseOptionsSerialized,
  TSwarmStoreValueTypes,
  TSwarmStoreDatabaseType,
  TSwarmStoreDatabaseOptions,
} from '../../../swarm-store-class.types';
import { ESwarmStoreConnector } from '../../../swarm-store-class.const';
import {
  ISwarmStoreConnectorUtilsDatabaseOptionsSerializerValidatorConstructor,
  ISwarmStoreConnectoDbOptionsUtilsGrandAccessCallbackContext,
} from '../swarm-store-connector-db-options-helpers.types';
import { TSwarmMessageInstance } from '../../../../swarm-message/swarm-message-constructor.types';
import { ISwarmStoreConnectorUtilsDatabaseOptionsSerializerValidatorConstructorParams } from '../swarm-store-connector-db-options-helpers.types';

export class SwarmStoreConnectorDBOptionsClass<
    P extends ESwarmStoreConnector,
    ItemType extends TSwarmStoreValueTypes<P>,
    DbType extends TSwarmStoreDatabaseType<P>,
    MSI extends TSwarmMessageInstance | ItemType,
    CTX extends ISwarmStoreConnectoDbOptionsUtilsGrandAccessCallbackContext,
    DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>,
    DBOS extends TSwarmStoreDatabaseOptionsSerialized
  >
  extends OptionsSerializerValidator<DBO, DBOS>
  implements ISwarmStoreConnectorUtilsDatabaseOptionsSerializerValidatorConstructor<P, ItemType, DbType, MSI, CTX, DBO, DBOS> {
  constructor(
    params: ISwarmStoreConnectorUtilsDatabaseOptionsSerializerValidatorConstructorParams<P, ItemType, DbType, MSI, CTX, DBO, DBOS>
  ) {
    super(params);
    // this._setContextBinder;
  }
}
