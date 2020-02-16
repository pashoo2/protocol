import {
  ISwarmMessageBodyDeserialized,
  TSwarmMessageBodyRaw,
} from '../../swarm-message-constructor.types';
export interface ISwarmMessageUtilsBodyParser {
  (msgBody: TSwarmMessageBodyRaw): ISwarmMessageBodyDeserialized;
}
