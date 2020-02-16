import {
  TSwarmMessageSeriazlized,
  ISwarmMessageRaw,
} from '../../swarm-message-constructor.types';

export interface ISwarmMessageUtilsMessageParser {
  (msg: TSwarmMessageSeriazlized): ISwarmMessageRaw;
}
