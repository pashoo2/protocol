import { TSwarmMessageInstance, TSwarmMessageBodyRaw, TSwarmMessageBodyRawEncrypted } from '../../swarm-message-constructor.types';
import { ISwarmMessageEncryptedCache } from '../../../swarm-message-encrypted-cache/swarm-message-encrypted-cache.types';
import { IQueuedEncryptionClassBaseOptions, IQueuedEncryptionClassBase } from '../../../basic-classes/queued-encryption-class-base/queued-encryption-class-base.types';
import { ISwarmMessageRaw, TSwarmMessage, TSwarmMessageSerialized } from '../../swarm-message-constructor.types';
import { ISwarmMessageSubclassParserOptions, ISwarmMessageSubclassParser } from './swarm-message-subclass-parser.types';
export declare class SwarmMessageSubclassParser implements ISwarmMessageSubclassParser {
    protected constructorOptions?: ISwarmMessageSubclassParserOptions;
    protected msgDecryptQueue?: IQueuedEncryptionClassBase;
    protected encryptedCache?: ISwarmMessageEncryptedCache;
    protected get options(): ISwarmMessageSubclassParserOptions;
    protected get messageDecryptQueueOptions(): IQueuedEncryptionClassBaseOptions;
    constructor(options: ISwarmMessageSubclassParserOptions);
    parse: (message: TSwarmMessageSerialized) => Promise<TSwarmMessageInstance>;
    protected validateOptions(options: ISwarmMessageSubclassParserOptions): void;
    protected setOptions(options: ISwarmMessageSubclassParserOptions): void;
    protected startMessageDecryptQueue(): void;
    protected parseMessageToRaw(mesage: TSwarmMessageSerialized): Promise<ISwarmMessageRaw>;
    protected parseMessageRaw(messageRaw: ISwarmMessageRaw): Promise<TSwarmMessage>;
    protected decryptMessageBodyRaw(bodyRaw: TSwarmMessageBodyRawEncrypted): Promise<TSwarmMessageBodyRaw>;
    protected getSwarmMessageInstance(msg: TSwarmMessage, msgSerizlized: TSwarmMessageSerialized): TSwarmMessageInstance;
    protected readMessgeBodyFromCache(sig: string): Promise<string>;
}
//# sourceMappingURL=swarm-message-subclass-parser.d.ts.map