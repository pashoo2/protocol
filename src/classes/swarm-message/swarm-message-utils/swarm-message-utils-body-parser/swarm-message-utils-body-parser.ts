import { ISwarmMessageUtilsBodyParser } from './swarm-message-utils-body-parser.types';

export const swarmMessageUtilsBodySParser: ISwarmMessageUtilsBodyParser = JSON.parse.bind(
  JSON
);
