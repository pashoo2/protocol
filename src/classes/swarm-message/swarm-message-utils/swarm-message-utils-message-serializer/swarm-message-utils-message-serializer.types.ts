import {
  TSwarmMessageSeriazlized,
  ISwarmMessageRaw,
} from '../../swarm-message-constructor.types';

export interface ISwarmMessageUtilsMessageSerializer {
  (msg: ISwarmMessageRaw): TSwarmMessageSeriazlized;
}
