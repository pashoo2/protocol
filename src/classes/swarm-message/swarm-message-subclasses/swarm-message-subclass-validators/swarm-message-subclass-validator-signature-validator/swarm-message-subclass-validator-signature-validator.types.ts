import { IQueuedEncrypyionClassBaseOptions } from '../../../../basic-classes/queued-encryption-class-base/queued-encryption-class-base.types';
import { ICentralAuthority } from '../../../../central-authority-class/central-authority-class.types';
import {
  ISwarmMessageRaw,
  TSwarmMessageSignatureAlgorithm,
} from '../../../swarm-message.types';
import { ISwarmMessageUtilSignatureGetStringForSignByMessageRaw } from '../../../swarm-message-utils/swarm-message-utils-signature/swarm-message-utils-signature.types';

export interface IMessageSignatureValidatorOptionsUtils {
  getDataToSignBySwarmMsg: ISwarmMessageUtilSignatureGetStringForSignByMessageRaw;
}

/**
 * class is necessary to validate message's signature.
 *
 *
 * @export
 * @interface IMessageSignatureValidatorOptions
 */
export interface IMessageSignatureValidatorOptions {
  queueOptions?: Required<IQueuedEncrypyionClassBaseOptions['queueOptions']>;
  caConnection: ICentralAuthority;
  utils: IMessageSignatureValidatorOptionsUtils;
  algSupported: TSwarmMessageSignatureAlgorithm;
}

export interface ISwarmMessgeSubclassSignatureValidator {
  /**
   * validates message signature
   *
   * @param {ISwarmMessageRaw} messageRaw
   * @returns {Promise<void>}
   * @memberof ISwarmMessgeSubclassSignatureValidator
   * @throws - throw an error if message have an invalid format
   * or if failed to get the user's sign public key,
   * or if the signature for the message is not valid.
   */
  validateSignature(messageRaw: ISwarmMessageRaw): Promise<void>;
}
