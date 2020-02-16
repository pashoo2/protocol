import {
  ISwarmMessageBodyDeserialized,
  TSwarmMessageBodyRaw,
} from '../../swarm-message.types';
export interface ISwarmMessageUtilsBodyParser {
  (msgBody: TSwarmMessageBodyRaw): ISwarmMessageBodyDeserialized;
}
