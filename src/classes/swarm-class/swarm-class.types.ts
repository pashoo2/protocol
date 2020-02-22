import { ICentralAuthorityUser } from 'classes/central-authority-class/central-authority-class.types';

export interface ISwarmConnectionOptions {
  user: ICentralAuthorityUser;
}

export interface ISwarm {
  connect(options: ISwarmConnectionOptions): Promise<void>;
  disconnect(): Promise<void>;
}
