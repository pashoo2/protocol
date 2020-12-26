import { ISwarmStoreDBOGrandAccessCallbackBaseContext } from 'classes/swarm-store-class/swarm-store-connectors/swarm-store-connetors.types';
import { ConstructorType } from 'types/helper.types';
import { ISwarmMessageStoreDbOptionsGrandAccessCallbackContext } from '../../../../../../types/swarm-message-store-db-options.types';
import { ISwarmMessageConstructor } from '../../../../../../../swarm-message/swarm-message-constructor.types';
import { ISwarmMessageStoreConectorDbOptionsGrandAccessContextClassFabricParams } from './swarm-message-store-conector-db-options-grand-access-context-class.types';
import { TSwarmMessageUserIdentifierSerialized } from '../../../../../../../swarm-message/swarm-message-subclasses/swarm-message-subclass-validators/swarm-message-subclass-validator-fields-validator/swarm-message-subclass-validator-fields-validator-validators/swarm-message-subclass-validator-fields-validator-validator-user-identifier/swarm-message-subclass-validator-fields-validator-validator-user-identifier.types';

export function getSwarmStoreConectorDbOptionsGrandAccessContextClass<
  SMC extends ISwarmMessageConstructor,
  BC extends ConstructorType<ISwarmStoreDBOGrandAccessCallbackBaseContext>
>(
  BaseContext: BC,
  params: ISwarmMessageStoreConectorDbOptionsGrandAccessContextClassFabricParams<SMC>
): BC & ConstructorType<ISwarmMessageStoreDbOptionsGrandAccessCallbackContext<SMC>> {
  class SwarmStoreConectorDbOptionsGrandAccessContextExtended
    extends BaseContext
    implements ISwarmMessageStoreDbOptionsGrandAccessCallbackContext<SMC> {
    get dbName(): string {
      return params.dbName;
    }

    get isPublicDb(): boolean {
      return params.isPublicDb;
    }

    get usersIdsWithWriteAccess(): TSwarmMessageUserIdentifierSerialized[] {
      return params.usersIdsWithWriteAccess;
    }

    get swarmMessageConstructor(): SMC {
      return params.swarmMessageConstructor;
    }
  }
  return SwarmStoreConectorDbOptionsGrandAccessContextExtended;
}
