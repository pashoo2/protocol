import { ISwarmMessageConstructor, ISwarmMessageConstructorOptionsRequired, TSwarmMessageInstance, TSwarmMessageConstructorArgumentBody, TSwarmMessageConstructorOptions, TSwarmMessageSerialized } from './swarm-message-constructor.types';
import { ISwarmMessageSubclassParser, ISwarmMessageSubclassParserOptions } from './swarm-message-subclasses/swarm-message-subclass-parser/swarm-message-subclass-parser.types';
import { ISwarmMessageSerializer, ISwarmMessageSerializerConstructorOptions } from './swarm-message-subclasses/swarm-message-subclass-serializer/swarm-message-subclass-serializer.types';
import { ICentralAuthority } from '../central-authority-class/central-authority-class.types';
import { TSwarmMessageConstructorArgumentBodyPrivate } from './swarm-message-constructor.types';
import { ISwarmMessageEncryptedCache } from '../swarm-message-encrypted-cache/swarm-message-encrypted-cache.types';
import { IMessageValidatorOptions, ISwarmMessageSubclassValidator } from './swarm-message-subclasses/swarm-message-subclass-validators/swarm-message-subclass-validator.types';
export declare class SwarmMessageConstructor implements ISwarmMessageConstructor {
    caConnection?: ICentralAuthority;
    encryptedCache?: ISwarmMessageEncryptedCache;
    protected constructorOptions?: ISwarmMessageConstructorOptionsRequired;
    protected validator?: ISwarmMessageSubclassValidator;
    protected serializer?: ISwarmMessageSerializer;
    protected parser?: ISwarmMessageSubclassParser;
    protected get options(): ISwarmMessageConstructorOptionsRequired;
    protected get optionsForSwarmMessageParser(): ISwarmMessageSubclassParserOptions;
    protected get optionsForSwarmMessageSerizlizer(): ISwarmMessageSerializerConstructorOptions;
    protected get optionsForSwarmMessageValidator(): IMessageValidatorOptions;
    constructor(options: TSwarmMessageConstructorOptions);
    construct: <T extends string | TSwarmMessageConstructorArgumentBody>(message: T) => Promise<TSwarmMessageInstance>;
    protected validateOptions(options: TSwarmMessageConstructorOptions): void;
    protected extendOptionsByDefaults(options: TSwarmMessageConstructorOptions): ISwarmMessageConstructorOptionsRequired;
    protected runSwarmMessageValidator(): void;
    protected runSwarmMessageParser(): Promise<void>;
    protected runSwarmMessageSerizlizer(): void;
    protected setOptions(options: TSwarmMessageConstructorOptions): void;
    protected addPrivateMessageToCache(msg: TSwarmMessageInstance): Promise<void>;
    protected parse(msg: TSwarmMessageSerialized): Promise<TSwarmMessageInstance>;
    protected serialize(msg: TSwarmMessageConstructorArgumentBody | TSwarmMessageConstructorArgumentBodyPrivate): Promise<TSwarmMessageInstance>;
    private addPrivateMessageBodyToCache;
}
//# sourceMappingURL=swarm-message-constructor.d.ts.map