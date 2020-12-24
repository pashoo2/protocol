import { TSwarmMessageUserIdentifierSerialized } from '../../../../../swarm-message/swarm-message-subclasses/swarm-message-subclass-validators/swarm-message-subclass-validator-fields-validator/swarm-message-subclass-validator-fields-validator-validators/swarm-message-subclass-validator-fields-validator-validator-user-identifier/swarm-message-subclass-validator-fields-validator-validator-user-identifier.types';

export interface ISwarmStoreConnectorDbOptionsGrandAccessContextClassFabricParams {
  readonly currentUserId: TSwarmMessageUserIdentifierSerialized;
  isUserValid(uesr: TSwarmMessageUserIdentifierSerialized): Promise<boolean>;
}
