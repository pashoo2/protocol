import { ISwarmMessageConstructor } from '../../swarm-message';
import { ISwarmStoreConnectoDbOptionsUtilsGrandAccessCallbackContext } from '../../swarm-store-class/swarm-store-connectors/swarm-store-connetors.types';
import { TSwarmMessageUserIdentifierSerialized } from '../../swarm-message/swarm-message-subclasses/swarm-message-subclass-validators/swarm-message-subclass-validator-fields-validator/swarm-message-subclass-validator-fields-validator-validators/swarm-message-subclass-validator-fields-validator-validator-user-identifier/swarm-message-subclass-validator-fields-validator-validator-user-identifier.types';

export interface ISwarmMessageStoreConectorDbOptionsGrandAccessContext<SMC extends ISwarmMessageConstructor>
  extends ISwarmStoreConnectoDbOptionsUtilsGrandAccessCallbackContext {
  readonly dbName: string;
  readonly isPublicDb: boolean;
  readonly usersIdsWithWriteAccess: TSwarmMessageUserIdentifierSerialized[];
  readonly swarmMessageConstructor: SMC;
}
