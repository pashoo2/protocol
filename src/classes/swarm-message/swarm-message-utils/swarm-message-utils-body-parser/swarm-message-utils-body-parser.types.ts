import {
  ISwarmMessageBodyDeserialized,
  TSwarmMessageBodyRaw,
} from '../../swarm-message-constructortypes';
export interface ISwarmMessageUtilsBodyParser {
  (msgBody: TSwarmMessageBodyRaw): ISwarmMessageBodyDeserialized;
}
