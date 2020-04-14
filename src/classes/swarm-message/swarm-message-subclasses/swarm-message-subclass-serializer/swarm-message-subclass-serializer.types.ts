import { ISwarmMessageSubclassFieldsValidator } from '../swarm-message-subclass-validators/swarm-message-subclass-validator-fields-validator/swarm-message-subclass-validator-fields-validator.types';
import { TSwarmMessageUserIdentifierSerialized } from '../swarm-message-subclass-validators/swarm-message-subclass-validator-fields-validator/swarm-message-subclass-validator-fields-validator-validators/swarm-message-subclass-validator-fields-validator-validator-user-identifier/swarm-message-subclass-validator-fields-validator-validator-user-identifier.types';
import { ISwarmMessageUtilSignatureGetStringForSignByMessageRaw } from '../../swarm-message-utils/swarm-message-utils-signature/swarm-message-utils-signature.types';
import { ICentralAuthority } from '../../../central-authority-class/central-authority-class.types';
import { IQueuedEncrypyionClassBaseOptions } from '../../../basic-classes/queued-encryption-class-base/queued-encryption-class-base.types';
import { ISwarmMessageUtilsBodySerializer } from '../../swarm-message-utils/swarm-message-utils-body-serializer/swarm-message-utils-body-serializer.types';
import { ISwarmMessageUtilsMessageSerializer } from '../../swarm-message-utils/swarm-message-utils-message-serializer/swarm-message-utils-message-serializer.types';
import { ISwarmMessageSubclassValidator } from '../swarm-message-subclass-validators/swarm-message-subclass-validator.types';
import { ISwarmMessageInstance } from '../../swarm-message-constructor.types';
import { TSwarmMessageSignatureAlgorithm } from '../../swarm-message-constructor.types';
import { ISwarmMessageBodyDeserialized } from '../../swarm-message-constructor.types';

export interface ISwarmMessageSerializerUtils {
  getDataToSignBySwarmMsg: ISwarmMessageUtilSignatureGetStringForSignByMessageRaw;
  swarmMessageBodySerializer: ISwarmMessageUtilsBodySerializer;
  swarmMessageSerializer: ISwarmMessageUtilsMessageSerializer;
}

/**
 * data about the user who will create
 * messages.
 *
 * @export
 * @interface ISwarmMessageSerializerUser
 */
export interface ISwarmMessageSerializerUser {
  /**
   * identity of the user who will be a creator of
   * swarm messages.
   *
   * @type {TSwarmMessageUserIdentifierSerialized}
   * @memberof ISwarmMessageSerializerUser
   */
  userId: TSwarmMessageUserIdentifierSerialized;
  /**
   * A crypto key which will be used for
   * messages signing.
   *
   * @type {CryptoKey}
   * @memberof ISwarmMessageSerializerUser
   */
  dataSignKey: CryptoKey;
}

/**
 * User for messages creation
 *
 * @export
 * @interface ISwarmMessageSerializerConstructorOptions
 */
export interface ISwarmMessageSerializerConstructorOptions {
  /**
   * options used for the message signing queue
   *
   * @type {Required<IQueuedEncrypyionClassBaseOptions['queueOptions']>}
   * @memberof ISwarmMessageSerializerConstructorOptions
   */
  queueOptions?: Required<IQueuedEncrypyionClassBaseOptions['queueOptions']>;
  /**
   * instance implemented connection to the CentralAuthority
   * to get information described in ISwarmMessageSerializerUser
   *
   * @type {ICentralAuthority}
   * @memberof ISwarmMessageSerializerConstructorOptions
   */
  caConnection: ICentralAuthority;
  /**
   * utils used for a message signing
   *
   * @type {ISwarmMessageSerializerUtils}
   * @memberof ISwarmMessageSerializerConstructorOptions
   */
  utils: ISwarmMessageSerializerUtils;
  /**
   * instance of the SwarmMessageFieldsValidator subclass
   *
   * @type {ISwarmMessageSubclassFieldsValidator}
   * @memberof ISwarmMessageSerializerConstructorOptions
   */
  messageValidator: ISwarmMessageSubclassValidator;
  /**
   * the algorithm used for messages signing
   *
   * @type {ESwarmMessageSignatureAlgorithmsDescription}
   * @memberof ISwarmMessageSerializerConstructorOptions
   */
  alg: TSwarmMessageSignatureAlgorithm;
}

/**
 * this class used for messages serizlization
 * before sending it to the swarm users.
 *
 * @export
 * @interface ISwarmMessageSerializer
 */
export interface ISwarmMessageSerializer {
  /**
   * serialize the message into a type
   * which can be used for sending of
   * a message into the swarm.
   * If a message's data is not valid
   * the method throws.
   *
   * @param {ISwarmMessageBodyDeserialized} msgBody
   * @returns {TSwarmMessageSerialized}
   * @memberof ISwarmMessageSerializer
   * @throws
   */
  serialize(
    msgBody: ISwarmMessageBodyDeserialized
  ): Promise<ISwarmMessageInstance>;
  /**
   * serialize the message as a private and
   * encrypt it's body with the key provided.
   *
   * @param {ISwarmMessageBodyDeserialized} msgBody
   * @param {CryptoKey} encryptWithKey - user's public key to encrypt
   * the message as a private
   * @returns {Promise<ISwarmMessageInstance>}
   * @memberof ISwarmMessageSerializer
   */
  serialize(
    msgBody: ISwarmMessageBodyDeserialized,
    encryptWithKey?: CryptoKey
  ): Promise<ISwarmMessageInstance>;
}
