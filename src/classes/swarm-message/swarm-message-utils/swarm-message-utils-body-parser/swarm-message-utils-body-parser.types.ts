import { ISwarmMessageBody, TSwarmMessageBodyRaw } from '../../swarm-message-constructor.types';
export interface ISwarmMessageUtilsBodyParser {
  (msgBody: TSwarmMessageBodyRaw): ISwarmMessageBody;
}
