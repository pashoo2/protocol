import { IMessageSignatureValidatorOptions } from './swarm-message-subclass-validator-signature-validator.types';
import assert from 'assert';
import { ISwarmMessageRaw } from '../../../swarm-message-constructor.types';
import { ICentralAuthority } from '../../../../central-authority-class/central-authority-class.types';
import { TSwarmMessageUserIdentifierSerialized } from '../swarm-message-subclass-validator-fields-validator/swarm-message-subclass-validator-fields-validator-validators/swarm-message-subclass-validator-fields-validator-validator-user-identifier/swarm-message-subclass-validator-fields-validator-validator-user-identifier.types';
import { isCryptoKeyDataVerify } from '../../../../../utils/encryption-keys-utils/encryption-keys-utils';
import { QueuedEncryptionClassBase } from '../../../../basic-classes/queued-encryption-class-base/queued-encryption-class-base';
import { IQueuedEncrypyionClassBase } from '../../../../basic-classes/queued-encryption-class-base/queued-encryption-class-base.types';
import { swarmMessageUtilSignatureGetStringForSignByMessageRaw } from '../../../swarm-message-utils/swarm-message-utils-signature/swarm-message-utils-signature';
import { ISwarmMessageUtilSignatureGetStringForSignByMessageRaw } from '../../../swarm-message-utils/swarm-message-utils-signature/swarm-message-utils-signature.types';

export class SwarmMessgeSubclassSignatureValidator {
  protected algSupported?: Array<
    IMessageSignatureValidatorOptions['algSupported']
  >;

  protected queueOptions: IMessageSignatureValidatorOptions['queueOptions'];

  protected caConnection?: ICentralAuthority;

  protected signVerificationQueue?: IQueuedEncrypyionClassBase;

  protected getDataToSignBySwarmMsg?: ISwarmMessageUtilSignatureGetStringForSignByMessageRaw;

  constructor(options: IMessageSignatureValidatorOptions) {
    this.setOptions(options);
    this.startSignatureVerificationQueue();
  }

  public validateSignature = async (
    messageRaw: ISwarmMessageRaw
  ): Promise<void> => {
    this.validateRawMessageFormat(messageRaw);

    const { uid } = messageRaw;
    const userSignPubKey = await this.getSenderSignPubKey(uid);

    assert(
      isCryptoKeyDataVerify(userSignPubKey),
      'Failed to get a valid key for the signature verification'
    );
    assert(
      !(
        (await this.validateSig(
          messageRaw,
          userSignPubKey as CryptoKey
        )) instanceof Error
      ),
      'The signature of the message is not valid'
    );
  };

  protected validateOptions(options: IMessageSignatureValidatorOptions) {
    assert(options, 'An options must be defined');
    assert(typeof options === 'object', 'The options must be an object');

    const { queueOptions, caConnection } = options;

    assert(
      !!caConnection,
      'Central authority connection must be provided in options'
    );
    assert(
      typeof caConnection.getSwarmUserSignPubKey === 'function',
      'Central authority connection must have the method getSwarmUserSignPubKey'
    );
    assert(options.utils, 'Utils must be provided in options');
    assert(typeof options.utils === 'object', 'Utils must be an object');

    if (queueOptions) {
      assert(
        typeof queueOptions === 'object',
        'The queue options must be an object'
      );
    }

    const { getDataToSignBySwarmMsg } = options.utils;

    assert(
      typeof getDataToSignBySwarmMsg === 'function',
      'getDataToSignBySwarmMsg must be provided'
    );
  }

  protected setOptions(options: IMessageSignatureValidatorOptions) {
    this.validateOptions(options);

    const { utils, queueOptions, algSupported, caConnection } = options;
    const { getDataToSignBySwarmMsg } = utils;

    this.caConnection = caConnection;
    this.queueOptions = queueOptions;
    this.getDataToSignBySwarmMsg = getDataToSignBySwarmMsg;
    this.algSupported =
      typeof algSupported === 'string' ? [algSupported] : algSupported;
  }

  protected startSignatureVerificationQueue() {
    this.signVerificationQueue = new QueuedEncryptionClassBase({
      queueOptions: this.queueOptions,
    });
  }

  protected validateRawMessageFormat(messageRaw: ISwarmMessageRaw): void {
    assert(!!messageRaw, 'Message is not defined');
    assert(typeof messageRaw === 'object', 'Message must be an object');

    const { bdy, uid, sig, alg } = messageRaw;

    assert(!!bdy, 'A body of the message must be defined');
    assert(
      typeof bdy === 'string',
      'Body of the message deserialized must be a string'
    );
    assert(!!uid, 'A user identifier of the message must not be empty');
    assert(
      typeof uid === 'string',
      'A user identifier of the message must be a string'
    );
    assert(sig, 'A signature of the message must not be empty');
    assert(
      typeof sig === 'string',
      'A signature of the message must be a string'
    );
    assert(
      typeof alg === 'string',
      "Algorithm of the message's singature must be a string"
    );
    assert(
      this.algSupported && this.algSupported.includes(alg),
      "The algorithm of the message's signature is not supported"
    );
  }

  protected getSenderSignPubKey(uid: TSwarmMessageUserIdentifierSerialized) {
    assert(
      !!this.caConnection,
      'there is no connection to the central authority to get the user public key for data sign'
    );
    return !!this.caConnection && this.caConnection.getSwarmUserSignPubKey(uid);
  }

  protected validateSig(msgRaw: ISwarmMessageRaw, key: CryptoKey) {
    const data = swarmMessageUtilSignatureGetStringForSignByMessageRaw(msgRaw);
    const sig = msgRaw.sig;

    assert(this.signVerificationQueue, 'signVerificationQueue is not started');
    return (
      !!this.signVerificationQueue &&
      this.signVerificationQueue.verifyData(data, sig, key)
    );
  }
}
