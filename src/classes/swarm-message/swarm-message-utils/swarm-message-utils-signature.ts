import { ISwarmMessageRaw } from '../swarm-message.types';

export const swarmMessageUtilSignatureGetStringForSignByMessageRaw = (
  msg: Omit<ISwarmMessageRaw, 'sig'>
) => `${msg.uid}_-_-${msg.bdy}`;
