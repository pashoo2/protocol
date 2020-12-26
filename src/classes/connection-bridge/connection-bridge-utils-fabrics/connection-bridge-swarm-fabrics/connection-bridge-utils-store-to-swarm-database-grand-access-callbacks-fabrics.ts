import assert from 'assert';
import { TSwarmMessageUserIdentifierSerialized } from '../../../swarm-message/swarm-message-subclasses/swarm-message-subclass-validators/swarm-message-subclass-validator-fields-validator/swarm-message-subclass-validator-fields-validator-validators/swarm-message-subclass-validator-fields-validator-validator-user-identifier/swarm-message-subclass-validator-fields-validator-validator-user-identifier.types';
import { ICentralAuthority } from '../../../central-authority-class/central-authority-class.types';
import { getSwarmStoreConectorDbOptionsGrandAccessContextClass } from '../../../swarm-store-class/swarm-store-connectors/swarm-store-connector-options/swarm-store-connector-options-grand-access-context/swarm-store-conector-db-options-grand-access-context-base-class/swarm-store-conector-db-options-grand-access-context-class';
import { ConstructorType } from '../../../../types/helper.types';
import { ISwarmStoreDBOGrandAccessCallbackBaseContext } from '../../../swarm-store-class/swarm-store-connectors/swarm-store-connetors.types';

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
}): ConstructorType<ISwarmStoreDBOGrandAccessCallbackBaseContext> {
  const { centralAuthority } = params;
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
  };

  return getSwarmStoreConectorDbOptionsGrandAccessContextClass(swarmStoreConectorDbOptionsGrandAccessContextClassFabricParams);
}
