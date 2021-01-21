import { JSONSchema7 } from 'json-schema';
import { ISwarmStoreDBOGrandAccessCallbackBaseContext } from 'classes/swarm-store-class/swarm-store-connectors/swarm-store-connetors.types';
import { TSwarmMessageUserIdentifierSerialized } from '../../../../../swarm-message/swarm-message-subclasses/swarm-message-subclass-validators/swarm-message-subclass-validator-fields-validator/swarm-message-subclass-validator-fields-validator-validators/swarm-message-subclass-validator-fields-validator-validator-user-identifier/swarm-message-subclass-validator-fields-validator-validator-user-identifier.types';
import { ISwarmStoreConnectorDbOptionsGrandAccessContextClassFabricParams } from './swarm-store-conector-db-options-grand-access-context-class.types';
import { ConstructorType } from '../../../../../../types/helper.types';
import { validateVerboseBySchema } from '../../../../../../utils/validation-utils/validation-utils';

export function getSwarmStoreConectorDbOptionsGrandAccessContextClass(
  params: ISwarmStoreConnectorDbOptionsGrandAccessContextClassFabricParams
): ConstructorType<ISwarmStoreDBOGrandAccessCallbackBaseContext> {
  class SwarmStoreConectorDbOptionsGrandAccessContext implements ISwarmStoreDBOGrandAccessCallbackBaseContext {
    get currentUserId(): TSwarmMessageUserIdentifierSerialized {
      return params.currentUserId;
    }

    async isUserValid(userId: TSwarmMessageUserIdentifierSerialized): Promise<true> {
      if (!(await params.isUserValid(userId))) {
        throw new Error('The user is not valid');
      }
      return true;
    }

    async jsonSchemaValidator(jsonSchema: JSONSchema7, valueToValidate: any): Promise<true> {
      const validationError = validateVerboseBySchema(jsonSchema, valueToValidate);
      if (!validationError) {
        throw validationError;
      }
      return true;
    }
  }

  return SwarmStoreConectorDbOptionsGrandAccessContext;
}
