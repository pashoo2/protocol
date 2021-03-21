import { JSONSchema7 } from 'json-schema';
import { ISwarmStoreDBOGrandAccessCallbackBaseContext } from 'classes/swarm-store-class/swarm-store-connectors/swarm-store-connetors.types';
import { TSwarmMessageUserIdentifierSerialized } from '../../../../../central-authority-class/central-authority-class-user-identity/central-authority-class-user-identity-validators/central-authority-common-validator-user-identifier/central-authority-common-validator-user-identifier.types';
import { ISwarmStoreConnectorDbOptionsGrandAccessContextClassFabricParams } from './swarm-store-conector-db-options-grand-access-context-class.types';
import { ConstructorType } from '../../../../../../types/helper.types';

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

    async jsonSchemaValidator(jsonSchema: JSONSchema7, valueToValidate: any): Promise<void> {
      return await params.jsonSchemaValidator(jsonSchema, valueToValidate);
    }
  }

  return SwarmStoreConectorDbOptionsGrandAccessContext;
}
