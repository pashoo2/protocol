import { ISwarmMessageSerializerUser } from './swarm-message-subclass-serializer.types';
import { ISwarmMessageBody, TSwarmMessageBodyRawEncrypted } from '../../swarm-message-constructor.types';
import { TSwarmMessageInstance } from '../../swarm-message-constructor.types';
import { TSwarmMessageBodyRaw, ISwarmMessageRaw } from '../../swarm-message-constructor.types';
import { ISwarmMessageBodyDeserialized } from '../../swarm-message-constructor.types';
import { IQueuedEncryptionClassBase, IQueuedEncryptionClassBaseOptions } from '../../../basic-classes/queued-encryption-class-base/queued-encryption-class-base.types';
import { ISwarmMessageSerializerConstructorOptions, ISwarmMessageSerializer } from './swarm-message-subclass-serializer.types';
export declare class SwarmMessageSerializer implements ISwarmMessageSerializer {
    protected msgSignEncryptQueue?: IQueuedEncryptionClassBase;
    protected constructorOptions?: ISwarmMessageSerializerConstructorOptions;
    protected user?: ISwarmMessageSerializerUser;
    protected get options(): ISwarmMessageSerializerConstructorOptions;
    protected get messageEncryptAndSignQueueOptions(): IQueuedEncryptionClassBaseOptions;
    constructor(options: ISwarmMessageSerializerConstructorOptions);
    serialize: (msgBody: ISwarmMessageBodyDeserialized, encryptWithKey?: CryptoKey) => Promise<TSwarmMessageInstance>;
    protected validateConstructorOptions(options: ISwarmMessageSerializerConstructorOptions): void;
    protected setUserInfo(): void;
    protected startMessagesSigningQueue(): void;
    protected setConstructorOptions(options: ISwarmMessageSerializerConstructorOptions): void;
    protected validateMessageBody(msgBody: ISwarmMessageBodyDeserialized): void;
    protected serializeMessageBody(msgBody: ISwarmMessageBodyDeserialized): ISwarmMessageBody;
    protected getMessageBodySerialized(msgBody: ISwarmMessageBody, encryptWithKey?: CryptoKey): Promise<TSwarmMessageBodyRaw>;
    protected encryptMessageBodyRaw(msgBody: TSwarmMessageBodyRaw, encryptWithKey: CryptoKey): Promise<TSwarmMessageBodyRawEncrypted>;
    protected getMessageRawWithoutSignature(msgBodySerialized: TSwarmMessageBodyRaw): Omit<ISwarmMessageRaw, 'sig'>;
    protected signSwarmMessageRaw(msgRawUnsigned: Omit<ISwarmMessageRaw, 'sig'>): Promise<ISwarmMessageRaw['sig'] | Error>;
    protected getMessageSignedSerialized(msgRawUnsigned: Omit<ISwarmMessageRaw, 'sig'>, msgBody: ISwarmMessageBody, signature: ISwarmMessageRaw['sig'], isPrivate: boolean): TSwarmMessageInstance;
}
//# sourceMappingURL=swarm-message-subclass-serializer.d.ts.map