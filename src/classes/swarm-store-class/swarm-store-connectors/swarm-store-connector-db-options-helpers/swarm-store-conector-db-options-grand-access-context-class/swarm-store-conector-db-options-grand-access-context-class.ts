import { ISwarmStoreConnectoDbOptionsUtilsGrandAccessCallbackContext } from '../swarm-store-connector-db-options-helpers.types';

export class SwarmStoreConectorDbOptionsGrandAccessContext
  implements ISwarmStoreConnectoDbOptionsUtilsGrandAccessCallbackContext {
  public async isUserExists(): Promise<boolean> {
    return true;
  }
}
