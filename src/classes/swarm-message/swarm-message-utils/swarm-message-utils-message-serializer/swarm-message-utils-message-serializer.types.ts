import { TSwarmMessageSerialized, ISwarmMessageRaw } from '../../swarm-message-constructor.types';

export interface ISwarmMessageUtilsMessageSerializer {
  (msg: ISwarmMessageRaw): TSwarmMessageSerialized;
}
