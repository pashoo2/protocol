import {
  ISwarmMessageBodyDeserialized,
  TSwarmMessageBodyRaw,
} from '../../swarm-message.types';
export interface ISwarmMessageUtilsBodySerializer {
  (msgBody: ISwarmMessageBodyDeserialized): TSwarmMessageBodyRaw;
}
