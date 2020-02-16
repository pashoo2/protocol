import {
  TSwarmMessageSeriazlized,
  ISwarmMessageRaw,
} from '../../swarm-message.types';

export interface ISwarmMessageUtilsMessageSerializer {
  (msg: ISwarmMessageRaw): TSwarmMessageSeriazlized;
}
