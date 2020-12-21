import { ISwarmStoreConnectoDbOptionsUtilsGrandAccessCallbackContext } from '../../../../swarm-store-class/swarm-store-connectors/swarm-store-connetors.types';

export class SwarmStoreConectorDbOptionsGrandAccessContext
  implements ISwarmStoreConnectoDbOptionsUtilsGrandAccessCallbackContext {
  currentUserId: string = '';
  public async isUserExists(user: string): Promise<boolean> {
    return true;
  }
}
