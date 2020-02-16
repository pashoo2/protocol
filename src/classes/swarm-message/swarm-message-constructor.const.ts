import {
  ISwarmMessageConstructorUtils,
  ESwarmMessageSignatureAlgorithms,
} from './swarm-message-constructor.types';
import { swarmMessageUtilSignatureGetStringForSignByMessageRaw } from './swarm-message-utils/swarm-message-utils-signature/swarm-message-utils-signature';
import { swarmMessageUtilsBodyParser } from './swarm-message-utils/swarm-message-utils-body-parser/swarm-message-utils-body-parser';
import { swarmMessageUtilsMessageParser } from './swarm-message-utils/swarm-message-utils-message-parser/swarm-message-utils-message-parser';
import { swarmMessageUtilsBodySerializer } from './swarm-message-utils/swarm-message-utils-body-serializer';
import { swarmMessageUtilsMessageSerializer } from './swarm-message-utils/swarm-message-utils-message-serializer/swarm-message-utils-message-serializer';
import { ISwarmMessageSerializerConstructorOptions } from './swarm-message-subclasses/swarm-message-subclass-serializer/swarm-message-subclass-serializer.types';

export const SWARM_MESSAGE_CONSTRUCTOR_OPTIONS_DEFAULTS_UTILS: ISwarmMessageConstructorUtils = {
  getDataToSignBySwarmMsg: swarmMessageUtilSignatureGetStringForSignByMessageRaw,
  messageBodyRawParser: swarmMessageUtilsBodyParser,
  messageParser: swarmMessageUtilsMessageParser,
  swarmMessageBodySerializer: swarmMessageUtilsBodySerializer,
  swarmMessageSerializer: swarmMessageUtilsMessageSerializer,
};

export const SWARM_MESSAGE_CONSTRUCTOR_OPTIONS_DEFAULTS_SERIALIZER_QUEUE_OPTIONS: ISwarmMessageSerializerConstructorOptions['queueOptions'] = undefined;

export const SWARM_MESSAGE_CONSTRUCTOR_OPTIONS_DEFAULTS_SERIALIZER = {
  alg: ESwarmMessageSignatureAlgorithms.ep256,
  queueOptions: SWARM_MESSAGE_CONSTRUCTOR_OPTIONS_DEFAULTS_SERIALIZER_QUEUE_OPTIONS,
};
