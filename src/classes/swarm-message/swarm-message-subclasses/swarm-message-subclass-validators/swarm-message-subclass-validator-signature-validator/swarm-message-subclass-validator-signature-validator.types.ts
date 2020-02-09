import { IQueuedEncrypyionClassBaseOptions } from '../../../../basic-classes/queued-encryption-class-base/queued-encryption-class-base.types';
import { ICentralAuthority } from '../../../../central-authority-class/central-authority-class.types';
import { ISwarmMessageRaw } from '../../../swarm-message.types';

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
