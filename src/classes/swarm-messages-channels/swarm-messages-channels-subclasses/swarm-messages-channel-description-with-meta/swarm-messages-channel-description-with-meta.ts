import { ESwarmStoreConnector } from '../../../swarm-store-class/swarm-store-class.const';
import { TSwarmMessageSerialized, ISwarmMessageInstanceDecrypted } from '../../../swarm-message/swarm-message-constructor.types';
import {
  TSwarmStoreDatabaseType,
  TSwarmStoreDatabaseOptions,
  TSwarmStoreDatabaseEntityAddress,
} from '../../../swarm-store-class/swarm-store-class.types';
import {
  ISwarmMessagesChannelDescriptionWithMetadata,
  ISwarmMessageChannelDescriptionRaw,
} from '../../types/swarm-messages-channel.types';
import { ISwarmMessageStoreMessagingRequestWithMetaResult } from '../../../swarm-message-store/types/swarm-message-store.types';
import { TSwarmStoreDatabaseEntityKey } from '../../../swarm-store-class/swarm-store-class.types';

export class SwarmMessagesChannelDescriptionWithMeta<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  MD extends ISwarmMessageInstanceDecrypted,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>
> implements ISwarmMessagesChannelDescriptionWithMetadata<P, T, MD, DbType, DBO> {
  get channelDescription(): Error | ISwarmMessageChannelDescriptionRaw<P, T, DbType, DBO> {
    return this.__swarmMessagesChannelDescription;
  }

  get message(): Error | MD {
    return this.__requestWithMetadata.message;
  }

  get dbName(): string {
    return this.__requestWithMetadata.dbName;
  }

  get messageAddress(): Error | undefined | TSwarmStoreDatabaseEntityAddress<P> {
    return this.__requestWithMetadata.messageAddress;
  }

  get key(): Error | TSwarmStoreDatabaseEntityKey<P> | undefined {
    return this.__requestWithMetadata.key;
  }

  constructor(
    private __requestWithMetadata: ISwarmMessageStoreMessagingRequestWithMetaResult<P, MD>,
    private __swarmMessagesChannelDescription: Error | ISwarmMessageChannelDescriptionRaw<P, T, DbType, DBO>
  ) {}
}
