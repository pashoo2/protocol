import { ISwarmMessageUtilsMessageParser } from './swarm-message-utils-message-parser.types';

export const swarmMessageUtilsMessageParser: ISwarmMessageUtilsMessageParser = JSON.parse.bind(JSON);
