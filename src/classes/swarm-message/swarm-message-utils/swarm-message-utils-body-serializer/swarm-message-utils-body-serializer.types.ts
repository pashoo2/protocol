import {
  ISwarmMessageBodyDeserialized,
  TSwarmMessageBodyRaw,
} from '../../swarm-message-constructor.types';
export interface ISwarmMessageUtilsBodySerializer {
  (msgBody: ISwarmMessageBodyDeserialized): TSwarmMessageBodyRaw;
}
