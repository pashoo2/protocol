import {
  TSwarmMessageSeriazlized,
  ISwarmMessageRaw,
} from '../../swarm-message-constructortypes';

export interface ISwarmMessageUtilsMessageParser {
  (msg: TSwarmMessageSeriazlized): ISwarmMessageRaw;
}
