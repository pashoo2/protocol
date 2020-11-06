import { ISwarmMessageUtilsMessageSerializer } from './swarm-message-utils-message-serializer.types';

export const swarmMessageUtilsMessageSerializer: ISwarmMessageUtilsMessageSerializer = JSON.stringify.bind(JSON);
