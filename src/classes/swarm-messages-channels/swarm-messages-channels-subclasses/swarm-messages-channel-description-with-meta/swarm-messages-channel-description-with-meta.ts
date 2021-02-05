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

  /**
   * TODO - add as constructor params constructor of swarm database connection and swarm messages channels list instance
   * to make it possible to create connection with the channel swarm database and manipulate with
   * the description directly from the instance.
   * Constructor arguments should be an object with props instead multiple arguments
   */
  constructor(
    private readonly __requestWithMetadata: ISwarmMessageStoreMessagingRequestWithMetaResult<P, MD>,
    private readonly __swarmMessagesChannelDescription: Error | ISwarmMessageChannelDescriptionRaw<P, T, DbType, DBO>
  ) {}
}
