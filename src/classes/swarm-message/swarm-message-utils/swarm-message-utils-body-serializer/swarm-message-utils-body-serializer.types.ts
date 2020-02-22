import {
  ISwarmMessageBody,
  TSwarmMessageBodyRaw,
} from '../../swarm-message-constructor.types';
export interface ISwarmMessageUtilsBodySerializer {
  (msgBody: ISwarmMessageBody): TSwarmMessageBodyRaw;
}
