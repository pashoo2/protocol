import assert from 'assert';
import { TSwarmMessageUserIdentifierSerialized } from '../../../central-authority-class/central-authority-class-user-identity/central-authority-class-user-identity-validators/central-authority-common-validator-user-identifier/central-authority-common-validator-user-identifier.types';
import { ICentralAuthority } from '../../../central-authority-class/central-authority-class.types';
import { getSwarmStoreConectorDbOptionsGrandAccessContextClass } from '../../../swarm-store-class/swarm-store-connectors/swarm-store-connector-options/swarm-store-connector-options-grand-access-context/swarm-store-conector-db-options-grand-access-context-base-class/swarm-store-conector-db-options-grand-access-context-class';
import { ConstructorType } from '../../../../types/helper.types';
import { ISwarmStoreDBOGrandAccessCallbackBaseContext } from '../../../swarm-store-class/swarm-store-connectors/swarm-store-connetors.types';
import { JSONSchema7 } from 'json-schema';

/**
 * Create a base context for the Grand access callback binder
 *
 * @export
 * @param {{
 *   centralAuthority: {
 *     isRunning: ICentralAuthority['isRunning'];
 *     getSwarmUserCredentials: ICentralAuthority['getSwarmUserCredentials'];
 *     getUserIdentity: ICentralAuthority['getUserIdentity'];
 *   };
 * }} params
 * @returns {ConstructorType<ISwarmStoreConnectorDbOptionsGrandAccessContextClassFabricParams>}
 */
export function createSwarmStoreDatabaseGrandAccessBaseContextClass(params: {
  centralAuthority: {
    isRunning: ICentralAuthority['isRunning'];
    getSwarmUserCredentials: ICentralAuthority['getSwarmUserCredentials'];
    getUserIdentity: ICentralAuthority['getUserIdentity'];
  };
  jsonSchemaValidator: (jsonSchema: JSONSchema7, valueToValidate: any) => Promise<void>;
}): ConstructorType<ISwarmStoreDBOGrandAccessCallbackBaseContext> {
  const { centralAuthority, jsonSchemaValidator } = params;
  async function isUserValid(userId: TSwarmMessageUserIdentifierSerialized): Promise<boolean> {
    assert(centralAuthority.isRunning, 'Central authority instance should be running');
    return Boolean(await centralAuthority.getSwarmUserCredentials(userId));
  }
  const swarmStoreConectorDbOptionsGrandAccessContextClassFabricParams = {
    get currentUserId(): TSwarmMessageUserIdentifierSerialized {
      const currentUserId = centralAuthority.getUserIdentity();
      if (currentUserId instanceof Error) {
        throw currentUserId;
      }
      return currentUserId;
    },
    isUserValid,
    jsonSchemaValidator,
  };

  return getSwarmStoreConectorDbOptionsGrandAccessContextClass(swarmStoreConectorDbOptionsGrandAccessContextClassFabricParams);
}
