import { ISwarmMessageRaw } from '../../swarm-message.types';
import { TSwarmMessageSignatureAlgorithm } from '../../swarm-message.types';
export interface ISwarmMessageUtilSignatureGetStringForSignByMessageRaw {
  (msg: Omit<ISwarmMessageRaw, 'sig'>): string;
}
