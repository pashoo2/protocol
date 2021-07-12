import { TSwarmMessageUserIdentifierSerialized } from '../../../central-authority-class/central-authority-class-user-identity/central-authority-class-user-identity-validators/central-authority-common-validator-user-identifier/central-authority-common-validator-user-identifier.types';
import { ISwarmMessageUtilSignatureGetStringForSignByMessageRaw } from '../../swarm-message-utils/swarm-message-utils-signature/swarm-message-utils-signature.types';
import { ICentralAuthority } from '../../../central-authority-class/central-authority-class.types';
import { IQueuedEncryptionClassBaseOptions } from '../../../basic-classes/queued-encryption-class-base/queued-encryption-class-base.types';
import { ISwarmMessageUtilsBodySerializer } from '../../swarm-message-utils/swarm-message-utils-body-serializer/swarm-message-utils-body-serializer.types';
import { ISwarmMessageUtilsMessageSerializer } from '../../swarm-message-utils/swarm-message-utils-message-serializer/swarm-message-utils-message-serializer.types';
import { ISwarmMessageSubclassValidator } from '../swarm-message-subclass-validators/swarm-message-subclass-validator.types';
import { TSwarmMessageInstance } from '../../swarm-message-constructor.types';
import { TSwarmMessageSignatureAlgorithm } from '../../swarm-message-constructor.types';
import { ISwarmMessageBodyDeserialized } from '../../swarm-message-constructor.types';
export interface ISwarmMessageSerializerUtils {
    getDataToSignBySwarmMsg: ISwarmMessageUtilSignatureGetStringForSignByMessageRaw;
    swarmMessageBodySerializer: ISwarmMessageUtilsBodySerializer;
    swarmMessageSerializer: ISwarmMessageUtilsMessageSerializer;
}
export interface ISwarmMessageSerializerUser {
    userId: TSwarmMessageUserIdentifierSerialized;
    dataSignKey: CryptoKey;
}
export interface ISwarmMessageSerializerConstructorOptions {
    queueOptions?: Required<IQueuedEncryptionClassBaseOptions['queueOptions']>;
    caConnection: ICentralAuthority;
    utils: ISwarmMessageSerializerUtils;
    messageValidator: ISwarmMessageSubclassValidator;
    alg: TSwarmMessageSignatureAlgorithm;
}
export interface ISwarmMessageSerializer {
    serialize(msgBody: ISwarmMessageBodyDeserialized): Promise<TSwarmMessageInstance>;
    serialize(msgBody: ISwarmMessageBodyDeserialized, encryptWithKey?: CryptoKey): Promise<TSwarmMessageInstance>;
}
//# sourceMappingURL=swarm-message-subclass-serializer.types.d.ts.map