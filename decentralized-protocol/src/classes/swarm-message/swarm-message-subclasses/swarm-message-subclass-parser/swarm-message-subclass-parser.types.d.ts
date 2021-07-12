import { ISwarmMessageSubclassValidator } from '../swarm-message-subclass-validators/swarm-message-subclass-validator.types';
import { ISwarmMessageUtilsMessageParser } from '../../swarm-message-utils/swarm-message-utils-message-parser/swarm-message-utils-message-parser.types';
import { ISwarmMessageUtilsBodyParser } from '../../swarm-message-utils/swarm-message-utils-body-parser';
import { IQueuedEncryptionClassBaseOptions } from '../../../basic-classes/queued-encryption-class-base/queued-encryption-class-base.types';
import { ISwarmMessageEncryptedCache } from '../../../swarm-message-encrypted-cache/swarm-message-encrypted-cache.types';
import { TSwarmMessageSerialized, TSwarmMessageInstance } from '../../swarm-message-constructor.types';
export interface ISwarmMessageSubclassParserUtils {
    messageParser: ISwarmMessageUtilsMessageParser;
    messageBodyRawParser: ISwarmMessageUtilsBodyParser;
}
export interface ISwarmMessageSubclassParserOptions {
    validator: ISwarmMessageSubclassValidator;
    utils: ISwarmMessageSubclassParserUtils;
    queueOptions?: IQueuedEncryptionClassBaseOptions['queueOptions'];
    decryptionKey?: CryptoKey;
    encryptedCache?: ISwarmMessageEncryptedCache;
}
export interface ISwarmMessageSubclassParser {
    parse(message: TSwarmMessageSerialized): Promise<TSwarmMessageInstance>;
}
//# sourceMappingURL=swarm-message-subclass-parser.types.d.ts.map