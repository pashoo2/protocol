import { ISwarmMessageRaw } from '../../swarm-message-constructortypes';

export interface ISwarmMessageUtilSignatureGetStringForSignByMessageRaw {
  (msg: Omit<ISwarmMessageRaw, 'sig'>): string;
}
