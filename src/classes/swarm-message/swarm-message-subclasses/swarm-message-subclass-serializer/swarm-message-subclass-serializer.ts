import assert from 'assert';
import { isCryptoKeyDataSign } from '../../../../utils/encryption-keys-utils/encryption-keys-utils';
import { QueuedEncryptionClassBase } from '../../../basic-classes/queued-encryption-class-base/queued-encryption-class-base';
import { ISwarmMessageSerializerUser } from './swarm-message-subclass-serializer.types';
import CentralAuthorityIdentity from '../../../central-authority-class/central-authority-class-user-identity/central-authority-class-user-identity';
import {
  TSwarmMessageBodyRaw,
  ISwarmMessageRaw,
} from '../../swarm-message-constructortypes';
import {
  ISwarmMessageBodyDeserialized,
  TSwarmMessageSerialized,
} from '../../swarm-message-constructortypes';
import {
  IQueuedEncrypyionClassBase,
  IQueuedEncrypyionClassBaseOptions,
} from '../../../basic-classes/queued-encryption-class-base/queued-encryption-class-base.types';
import {
  ISwarmMessageSerializerConstructorOptions,
  ISwarmMessageSerializer,
} from './swarm-message-subclass-serializer.types';

export class SwarmMessageSerializer implements ISwarmMessageSerializer {
  protected msgSignQueue?: IQueuedEncrypyionClassBase;

  protected constructorOptions?: ISwarmMessageSerializerConstructorOptions;

  protected user?: ISwarmMessageSerializerUser;

  protected get options(): ISwarmMessageSerializerConstructorOptions {
    if (!this.constructorOptions) {
      throw new Error('Options are not defined');
    }
    return this.constructorOptions;
  }

  /**
   * returns an options for messages signing
   * queue
   *
   * @readonly
   * @protected
   * @type {IQueuedEncrypyionClassBaseOptions}
   * @memberof SwarmMessageSerializer
   */
  protected get messageSignQueueOptions(): IQueuedEncrypyionClassBaseOptions {
    const { user } = this;

    if (!user) {
      throw new Error("The current user's infromation is not defined");
    }
    return {
      ...this.options.queueOptions,
      keys: {
        signKey: user.dataSignKey,
      },
    };
  }

  constructor(options: ISwarmMessageSerializerConstructorOptions) {
    this.setConstructorOptions(options);
  }

  /**
   * sign and serizlize the message
   *
   * @memberof SwarmMessageSerializer
   */
  public serialize = async (
    msgBody: ISwarmMessageBodyDeserialized
  ): Promise<TSwarmMessageSerialized> => {
    this.validateMessageBody(msgBody);

    const bodySeriazlized = this.getMessageBodySerialized(msgBody);
    const swarmMessageNotSigned = this.getMessageRawWithoutSignature(
      bodySeriazlized
    );
    const signature = await this.signSwarmMessageRaw(swarmMessageNotSigned);

    if (signature instanceof Error) {
      throw new Error('Failed to sign the message');
    }
    return this.getMessageSignedSerialized(swarmMessageNotSigned, signature);
  };

  /**
   * validates options used for messages creation
   *
   * @protected
   * @param {ISwarmMessageSerializerConstructorOptions} options
   * @memberof SwarmMessageSerializer
   * @throws
   */
  protected validateConstructorOptions(
    options: ISwarmMessageSerializerConstructorOptions
  ): void {
    assert(!!options, 'The options must be defined');
    assert(typeof options === 'object', 'The options must be an object');
    assert(options.messageValidator, 'Message field validator must be defined');
    assert(
      typeof options.messageValidator.validateMessageBody === 'function',
      'Message field validator incorrectly implements interface, cause there is no "validateMessageBody method"'
    );
    assert(
      options.caConnection,
      'Connection to the CentralAuthority is not provided'
    );
    assert(
      typeof options.alg === 'string',
      'The algorithm value must be a string'
    );

    const { utils } = options;

    assert(utils, 'Utils must be provided in options');
    assert(
      typeof utils.getDataToSignBySwarmMsg === 'function',
      'getDataToSignBySwarmMsg function must be provided in utils option'
    );
    assert(
      typeof utils.swarmMessageBodySerializer === 'function',
      'swarmMessageBodySerializer function must be provided in utils option'
    );
    assert(
      typeof utils.swarmMessageSerializer === 'function',
      'swarmMessageSerializer function must be provided in utils option'
    );
  }

  /**
   * get user identity and crypto keys
   * of the current user
   *
   * @protected
   * @memberof SwarmMessageSerializer
   */
  protected setUserInfo() {
    const { caConnection } = this.options;
    const currentUserId = caConnection.getUserIdentity();

    assert(
      !(currentUserId instanceof Error),
      'Failed to read an identity of the crurrent user from connection to the central authority'
    );

    const userIdSerialized = new CentralAuthorityIdentity(
      currentUserId as string
    ).identityDescritptionSerialized;

    assert(
      !(userIdSerialized instanceof Error),
      'The user identity serialized is not valid'
    );

    const dataSignCryptoKeyPair = caConnection.getUserDataSignKeyPair();

    if (dataSignCryptoKeyPair instanceof Error) {
      throw new Error(
        'Failed to read data sign key pairs of the current user from a connection to the central authority'
      );
    }

    const dataSignKey = isCryptoKeyDataSign(dataSignCryptoKeyPair.privateKey)
      ? dataSignCryptoKeyPair.privateKey
      : dataSignCryptoKeyPair.publicKey;

    assert(
      isCryptoKeyDataSign(dataSignKey),
      'There is not key may used for data signing returned by the conntion to the central authority'
    );
    this.user = {
      dataSignKey: dataSignCryptoKeyPair.privateKey,
      userId: userIdSerialized as string,
    };
  }

  /**
   * creates queue for a message signing
   *
   * @protected
   * @memberof SwarmMessageSerializer
   */
  protected startMessagesSigningQueue() {
    this.msgSignQueue = new QueuedEncryptionClassBase(
      this.messageSignQueueOptions
    );
  }

  /**
   * set options used for messages construction
   *
   * @protected
   * @param {ISwarmMessageSerializerConstructorOptions} options
   * @memberof SwarmMessageSerializer
   */
  protected setConstructorOptions(
    options: ISwarmMessageSerializerConstructorOptions
  ) {
    this.validateConstructorOptions(options);
    this.constructorOptions = options;
    this.setUserInfo();
    this.startMessagesSigningQueue();
  }

  /**
   * validates message's body, throws if it's
   * not valid.
   *
   * @protected
   * @param {ISwarmMessageBodyDeserialized} msgBody
   * @memberof SwarmMessageSerializer
   */
  protected validateMessageBody(msgBody: ISwarmMessageBodyDeserialized) {
    const { messageValidator } = this.options;

    messageValidator.validateMessageBody(msgBody);
  }

  /**
   * seriazlize message body
   *
   * @protected
   * @param {ISwarmMessageBodyDeserialized} msgBody
   * @returns {TSwarmMessageBodyRaw}
   * @memberof SwarmMessageSerializer
   */
  protected getMessageBodySerialized(
    msgBody: ISwarmMessageBodyDeserialized
  ): TSwarmMessageBodyRaw {
    const { utils } = this.options;

    return utils.swarmMessageBodySerializer(msgBody);
  }

  /**
   * returns swarm message not signed
   *
   * @protected
   * @param {TSwarmMessageBodyRaw} msgBodySerialized
   * @memberof SwarmMessageSerializer
   */
  protected getMessageRawWithoutSignature(
    msgBodySerialized: TSwarmMessageBodyRaw
  ): Omit<ISwarmMessageRaw, 'sig'> {
    if (!this.user) {
      throw new Error('The current user data is not defined');
    }
    return {
      bdy: msgBodySerialized,
      alg: this.options.alg,
      uid: this.user.userId,
    };
  }

  /**
   * returns signature for the message
   *
   * @protected
   * @param {Omit<ISwarmMessageRaw, 'sig'>} msgRawUnsigned
   * @returns {ISwarmMessageRaw['sig']}
   * @memberof SwarmMessageSerializer
   */
  protected async signSwarmMessageRaw(
    msgRawUnsigned: Omit<ISwarmMessageRaw, 'sig'>
  ): Promise<ISwarmMessageRaw['sig'] | Error> {
    if (!this.user) {
      throw new Error('The user info is not defined');
    }
    if (!this.msgSignQueue) {
      throw new Error('The messages sign queue was not started');
    }

    const { utils } = this.options;
    const dataToSign = utils.getDataToSignBySwarmMsg(msgRawUnsigned);

    return this.msgSignQueue.signData(dataToSign, this.user.dataSignKey);
  }

  /**
   * returns message serialized
   *
   * @protected
   * @param {Omit<ISwarmMessageRaw, 'sig'>} msgRawUnsigned
   * @param {ISwarmMessageRaw['sig']} signature
   * @returns
   * @memberof SwarmMessageSerializer
   */
  protected getMessageSignedSerialized(
    msgRawUnsigned: Omit<ISwarmMessageRaw, 'sig'>,
    signature: ISwarmMessageRaw['sig']
  ) {
    const { utils } = this.options;

    return utils.swarmMessageSerializer({
      ...msgRawUnsigned,
      sig: signature,
    });
  }
}
