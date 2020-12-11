import { ISwarmStoreConnectoDbOptionsUtilsGrandAccessCallbackContext } from '../swarm-store-connector-db-options-helpers.types';

export class SwarmStoreConectorDbOptionsGrandAccessContext
  implements ISwarmStoreConnectoDbOptionsUtilsGrandAccessCallbackContext {
  currentUserId: string = '';
  public async isUserExists(user: string): Promise<boolean> {
    return true;
  }
}
