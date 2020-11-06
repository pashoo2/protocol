import { ISwarmMessageRaw, TSwarmMessageSignatureAlgorithm } from '../../swarm-message-constructor.types';
import { ISwarmMessageUtilSignatureGetStringForSignByMessageRaw } from './swarm-message-utils-signature.types';
import { SWARM_MESSAGE_UTIL_SIGNATURE_GET_STRING_FOR_SIGN_BY_MESSAGE_RAW_DELIMETER } from './swarm-message-utils-signature.const';

export const swarmMessageUtilSignatureGetStringForSignByMessageRaw: ISwarmMessageUtilSignatureGetStringForSignByMessageRaw = (
  msg: Omit<ISwarmMessageRaw, 'sig'>
) =>
  `${msg.alg}${SWARM_MESSAGE_UTIL_SIGNATURE_GET_STRING_FOR_SIGN_BY_MESSAGE_RAW_DELIMETER}${msg.uid}${SWARM_MESSAGE_UTIL_SIGNATURE_GET_STRING_FOR_SIGN_BY_MESSAGE_RAW_DELIMETER}${msg.bdy}`;
