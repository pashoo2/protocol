import {
  ISwarmMessageBodyDeserialized,
  TSwarmMessageBodyRaw,
} from '../../swarm-message-constructortypes';
export interface ISwarmMessageUtilsBodySerializer {
  (msgBody: ISwarmMessageBodyDeserialized): TSwarmMessageBodyRaw;
}
