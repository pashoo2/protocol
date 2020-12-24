import { ISwarmMessageConstructor } from '../../../../../../../swarm-message/swarm-message-constructor.types';
import { TSwarmMessageUserIdentifierSerialized } from '../../../../../../../swarm-message/swarm-message-subclasses/swarm-message-subclass-validators/swarm-message-subclass-validator-fields-validator/swarm-message-subclass-validator-fields-validator-validators/swarm-message-subclass-validator-fields-validator-validator-user-identifier/swarm-message-subclass-validator-fields-validator-validator-user-identifier.types';

export interface ISwarmMessageStoreConectorDbOptionsGrandAccessContextClassFabricParams<SMC extends ISwarmMessageConstructor> {
  readonly dbName: string;
  readonly isPublicDb: boolean;
  readonly usersIdsWithWriteAccess: TSwarmMessageUserIdentifierSerialized[];
  readonly SwarmMessageConstructor: SMC;
}
