import { ISwarmMessageUtilsBodyParser } from './swarm-message-utils-body-parser.types';

export const swarmMessageUtilsBodyParser: ISwarmMessageUtilsBodyParser = JSON.parse.bind(JSON);
