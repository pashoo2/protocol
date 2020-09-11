import { ESwarmStoreConnector } from 'classes/swarm-store-class/swarm-store-class.const';
import {
  ISwarmChannelBaseInitializerConstructor,
  ISwarmChannelBaseInitializerOptions,
} from '../swarm-channel-initializers.types';

export class SwarmChannelBaseNewChannelInitializer<
  P extends ESwarmStoreConnector = ESwarmStoreConnector.OrbitDB
> implements ISwarmChannelBaseInitializerConstructor<P> {
  constructor(protected options: ISwarmChannelBaseInitializerOptions<P>) {}
}
