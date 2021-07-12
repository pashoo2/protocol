import { IQueuedEncryptionClassBaseOptions } from '../../../../basic-classes/queued-encryption-class-base/queued-encryption-class-base.types';
import { ICentralAuthority } from '../../../../central-authority-class/central-authority-class.types';
import { ISwarmMessageRaw, TSwarmMessageSignatureAlgorithm } from '../../../swarm-message-constructor.types';
import { ISwarmMessageUtilSignatureGetStringForSignByMessageRaw } from '../../../swarm-message-utils/swarm-message-utils-signature/swarm-message-utils-signature.types';
export interface IMessageSignatureValidatorOptionsUtils {
    getDataToSignBySwarmMsg: ISwarmMessageUtilSignatureGetStringForSignByMessageRaw;
}
export interface IMessageSignatureValidatorOptions {
    queueOptions?: Required<IQueuedEncryptionClassBaseOptions['queueOptions']>;
    caConnection: ICentralAuthority;
    utils: IMessageSignatureValidatorOptionsUtils;
    algSupported: TSwarmMessageSignatureAlgorithm;
}
export interface ISwarmMessgeSubclassSignatureValidator {
    validateSignature(messageRaw: ISwarmMessageRaw): Promise<void>;
}
//# sourceMappingURL=swarm-message-subclass-validator-signature-validator.types.d.ts.map