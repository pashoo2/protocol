import { IMessageSignatureValidatorOptions } from './swarm-message-subclass-validator-signature-validator.types';
import { ISwarmMessageRaw } from '../../../swarm-message-constructor.types';
import { ICentralAuthority } from '../../../../central-authority-class/central-authority-class.types';
import { TSwarmMessageUserIdentifierSerialized } from '../../../../central-authority-class/central-authority-class-user-identity/central-authority-class-user-identity-validators/central-authority-common-validator-user-identifier/central-authority-common-validator-user-identifier.types';
import { IQueuedEncryptionClassBase } from '../../../../basic-classes/queued-encryption-class-base/queued-encryption-class-base.types';
import { ISwarmMessageUtilSignatureGetStringForSignByMessageRaw } from '../../../swarm-message-utils/swarm-message-utils-signature/swarm-message-utils-signature.types';
export declare class SwarmMessgeSubclassSignatureValidator {
    protected algSupported?: Array<IMessageSignatureValidatorOptions['algSupported']>;
    protected queueOptions: IMessageSignatureValidatorOptions['queueOptions'];
    protected caConnection?: ICentralAuthority;
    protected signVerificationQueue?: IQueuedEncryptionClassBase;
    protected getDataToSignBySwarmMsg?: ISwarmMessageUtilSignatureGetStringForSignByMessageRaw;
    protected signaturesValidatedCache: Record<string, string>;
    constructor(options: IMessageSignatureValidatorOptions);
    validateSignature: (messageRaw: ISwarmMessageRaw) => Promise<void>;
    protected validateOptions(options: IMessageSignatureValidatorOptions): void;
    protected setOptions(options: IMessageSignatureValidatorOptions): void;
    protected startSignatureVerificationQueue(): void;
    protected validateRawMessageFormat(messageRaw: ISwarmMessageRaw): void;
    protected getSenderSignPubKey(uid: TSwarmMessageUserIdentifierSerialized): Promise<Error | CryptoKey>;
    protected getHashForSignature(sig: string): string;
    protected addHashForSignature(sig: string, hash: string): void;
    protected validateSig(msgRaw: ISwarmMessageRaw, key: CryptoKey): Promise<boolean | Error>;
}
//# sourceMappingURL=swarm-message-subclass-validator-signature-validator.d.ts.map