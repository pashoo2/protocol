import { EventEmitter } from 'classes/basic-classes/event-emitter-class-base/event-emitter-class-base.types';
import { TUserIdentity } from '../../src/types/users.types';
import { ISwarmMessageConstructor } from '../../src/classes/swarm-message/swarm-message-constructor.types';
import { ISecretStorage } from '../../src/classes/secret-storage-class/secret-storage-class.types';
import { ESwarmStoreConnector } from '../../src/classes/swarm-store-class/swarm-store-class.const';
import { SwarmChannelType, SwarmChannelStatus, SwarmChannelEvents } from './swarm-channel.const';
import { ISwarmMessageInstanceDecrypted, TSwarmMessageConstructorBodyMessage } from '../../src/classes/swarm-message/swarm-message-constructor.types';
export declare type TSwarmChannelId = string;
export declare type TSwarmChannelPassworCryptodKeyExported = string;
export declare type TSwarmChannelPasswordHash = string;
export interface ISwarmChannelDescriptionFieldsMain {
    readonly id: TSwarmChannelId;
    readonly type: SwarmChannelType;
}
export interface ISwarmChannelLocalMeta extends ISwarmChannelDescriptionFieldsMain {
    name: string;
    blacklist: TUserIdentity[];
    passworCryptodKeyExported?: TSwarmChannelPassworCryptodKeyExported;
}
export interface ISwarmChannelSharedMeta extends ISwarmChannelDescriptionFieldsMain {
    name: string;
    ownerId: TUserIdentity;
    isPublic: boolean;
    participants: TUserIdentity[];
    description: string;
    passwordHash?: TSwarmChannelPasswordHash;
}
export interface ISwarmChannelDescriptionFieldsBase extends ISwarmChannelDescriptionFieldsMain {
    localMeta: ISwarmChannelLocalMeta;
    sharedMeta: ISwarmChannelSharedMeta;
}
export declare type TSwarmChannelEvents<A = any> = {
    [key in SwarmChannelEvents]: A;
};
export interface ISwarmChannelStateFields<ET = any, E extends TSwarmChannelEvents<ET> = TSwarmChannelEvents> {
    messagesList: ISwarmMessageInstanceDecrypted[];
    keyValueStore?: Record<string, ISwarmMessageInstanceDecrypted>;
    status: SwarmChannelStatus;
    events: EventEmitter<E>;
    isEncrypted: boolean;
}
export interface ISwarmChannelInitializationOptions<P extends ESwarmStoreConnector = ESwarmStoreConnector.OrbitDB> {
    messageConstructor: ISwarmMessageConstructor;
    secretStorage: ISecretStorage;
    swarmMessageStoreConnector: any;
}
export interface ISwarmChannelMethodsBase {
    initialize(initOptions: ISwarmChannelInitializationOptions): Promise<void>;
    updateLocalMeta(localMeta: Partial<ISwarmChannelLocalMeta>): Promise<void>;
    updateSharedMeta(sharedMeta: Partial<ISwarmChannelSharedMeta>): Promise<void>;
    addMessage(swarmMessage: TSwarmMessageConstructorBodyMessage, key?: string): Promise<void>;
    close(): Promise<void>;
    addParticipant?(id: TUserIdentity): Promise<void>;
    removeParticipant?(id: TUserIdentity): Promise<void>;
    addNewChannel?(channelId: string, meta: Partial<ISwarmChannelSharedMeta>): Promise<void>;
    removeChannel?(channelId: string): Promise<void>;
}
export declare type TSwarmChannelConstructorOptions = [Required<ISwarmChannelDescriptionFieldsBase>] | [Required<ISwarmChannelDescriptionFieldsBase>, string] | [TSwarmChannelId, SwarmChannelType] | [TSwarmChannelId, SwarmChannelType, string];
export interface ISwarmChannel<ET = any, E extends TSwarmChannelEvents<ET> = TSwarmChannelEvents> extends ISwarmChannelMethodsBase, ISwarmChannelDescriptionFieldsBase, ISwarmChannelStateFields<ET, E> {
    new (description: Required<ISwarmChannelDescriptionFieldsBase>): ISwarmChannel<ET, E>;
    new (description: Required<ISwarmChannelDescriptionFieldsBase>, password: string): ISwarmChannel<ET, E>;
    new (id: TSwarmChannelId, type: SwarmChannelType): ISwarmChannel<ET, E>;
    new (id: TSwarmChannelId, type: SwarmChannelType, password: string): ISwarmChannel<ET, E>;
}
//# sourceMappingURL=swarm-channel.types.d.ts.map