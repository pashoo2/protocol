import { ESwarmStoreConnector } from '../../../swarm-store-class/swarm-store-class.const';
import { TSwarmMessageSerialized, ISwarmMessageInstanceDecrypted } from '../../../swarm-message/swarm-message-constructor.types';
import { TSwarmStoreDatabaseType, TSwarmStoreDatabaseOptions, TSwarmStoreDatabaseEntityAddress } from '../../../swarm-store-class/swarm-store-class.types';
import { ISwarmMessagesChannelDescriptionWithMetadata, ISwarmMessageChannelDescriptionRaw } from '../../types/swarm-messages-channel-instance.types';
import { ISwarmMessageStoreMessagingRequestWithMetaResult } from '../../../swarm-message-store/types/swarm-message-store.types';
import { TSwarmStoreDatabaseEntityKey } from '../../../swarm-store-class/swarm-store-class.types';
export declare class SwarmMessagesChannelDescriptionWithMeta<P extends ESwarmStoreConnector, T extends TSwarmMessageSerialized, MD extends ISwarmMessageInstanceDecrypted, DbType extends TSwarmStoreDatabaseType<P>, DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>> implements ISwarmMessagesChannelDescriptionWithMetadata<P, T, MD, DbType, DBO> {
    private readonly __requestWithMetadata;
    private readonly __swarmMessagesChannelDescription;
    get channelDescription(): Error | ISwarmMessageChannelDescriptionRaw<P, T, DbType, DBO>;
    get message(): Error | MD;
    get dbName(): string;
    get messageAddress(): Error | undefined | TSwarmStoreDatabaseEntityAddress<P>;
    get key(): Error | TSwarmStoreDatabaseEntityKey<P> | undefined;
    constructor(__requestWithMetadata: ISwarmMessageStoreMessagingRequestWithMetaResult<P, MD>, __swarmMessagesChannelDescription: Error | ISwarmMessageChannelDescriptionRaw<P, T, DbType, DBO>);
}
//# sourceMappingURL=swarm-messages-channel-description-with-meta.d.ts.map