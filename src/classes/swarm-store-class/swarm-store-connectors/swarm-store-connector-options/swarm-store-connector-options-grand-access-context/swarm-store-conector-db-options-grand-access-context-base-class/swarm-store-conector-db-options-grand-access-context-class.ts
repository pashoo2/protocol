import { ISwarmStoreDBOGrandAccessCallbackBaseContext } from 'classes/swarm-store-class/swarm-store-connectors/swarm-store-connetors.types';
import { TSwarmMessageUserIdentifierSerialized } from '../../../../../swarm-message/swarm-message-subclasses/swarm-message-subclass-validators/swarm-message-subclass-validator-fields-validator/swarm-message-subclass-validator-fields-validator-validators/swarm-message-subclass-validator-fields-validator-validator-user-identifier/swarm-message-subclass-validator-fields-validator-validator-user-identifier.types';
import { ISwarmStoreConnectorDbOptionsGrandAccessContextClassFabricParams } from './swarm-store-conector-db-options-grand-access-context-class.types';
import { ConstructorType } from '../../../../../../types/helper.types';

export function getSwarmStoreConectorDbOptionsGrandAccessContextClass(
  params: ISwarmStoreConnectorDbOptionsGrandAccessContextClassFabricParams
): ConstructorType<ISwarmStoreDBOGrandAccessCallbackBaseContext> {
  return class SwarmStoreConectorDbOptionsGrandAccessContext implements ISwarmStoreDBOGrandAccessCallbackBaseContext {
    get currentUserId(): TSwarmMessageUserIdentifierSerialized {
      return params.currentUserId;
    }

    async isUserValid(userId: TSwarmMessageUserIdentifierSerialized): Promise<boolean> {
      return await params.isUserValid(userId);
    }
  };
}
