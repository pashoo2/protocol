import {
  TSwarmMessageSeriazlized,
  ISwarmMessageRaw,
} from '../../swarm-message.types';

export interface ISwarmMessageUtilsMessageParser {
  (msg: TSwarmMessageSeriazlized): ISwarmMessageRaw;
}
