import { ESwarmConnectionClassSubclassType } from 'classes/swarm-connection-class/swarm-connection-class.types';

export const SWARM_CONNECTION_PASSWORD = '12345678910111213141516';

export const SWARM_CONNECTION_OPTIONS = {
    type: ESwarmConnectionClassSubclassType.IPFS,
    subclassOptions: {
      password: SWARM_CONNECTION_PASSWORD
    }
  };