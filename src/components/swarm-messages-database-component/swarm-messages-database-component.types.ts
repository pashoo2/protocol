import { ISwarmMessageInstanceDecrypted } from '../../classes/swarm-message/swarm-message-constructor.types';

export interface ISwarmMessagesDatabaseMessageDescription {
  id: string;
  key?: string;
  message: ISwarmMessageInstanceDecrypted;
}
