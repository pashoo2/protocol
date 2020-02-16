import {
  TSwarmMessageSeriazlized,
  ISwarmMessageRaw,
} from '../../swarm-message-constructortypes';

export interface ISwarmMessageUtilsMessageSerializer {
  (msg: ISwarmMessageRaw): TSwarmMessageSeriazlized;
}
