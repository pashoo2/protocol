import { ISwarmMessageUtilsBodySerializer } from './swarm-message-utils-body-serializer.types';

export const swarmMessageUtilsBodySerializer: ISwarmMessageUtilsBodySerializer = JSON.stringify.bind(JSON);
