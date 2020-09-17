import {
  TSwarmMessageSerialized,
  ISwarmMessageRaw,
} from '../../swarm-message-constructor.types';

export interface ISwarmMessageUtilsMessageParser {
  (msg: TSwarmMessageSerialized): ISwarmMessageRaw;
}
