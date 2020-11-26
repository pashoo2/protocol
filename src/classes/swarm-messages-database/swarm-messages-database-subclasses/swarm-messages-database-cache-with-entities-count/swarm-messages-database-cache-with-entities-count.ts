import { ESwarmStoreConnector } from '../../../swarm-store-class/swarm-store-class.const';
import { TSwarmMessageSerialized, ISwarmMessageInstanceDecrypted } from '../../../swarm-message/swarm-message-constructor.types';
import { TSwarmStoreDatabaseType, TSwarmStoreDatabaseOptions } from '../../../swarm-store-class/swarm-store-class.types';
import { ISwarmMessagesDatabaseCache, ISwarmMessagesDatabaseCacheOptions } from '../../swarm-messages-database.types';
import { SwarmMessagesDatabaseCache } from '../swarm-messages-database-cache/swarm-messages-database-cache';
import { ISwarmMessageStoreMessagingMethods } from '../../../swarm-message-store/swarm-message-store.types';

export class fSwarmMessagesDatabaseCacheWithEntitiesCount<
    P extends ESwarmStoreConnector,
    T extends TSwarmMessageSerialized,
    DbType extends TSwarmStoreDatabaseType<P>,
    DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>,
    MD extends ISwarmMessageInstanceDecrypted,
    SMSM extends ISwarmMessageStoreMessagingMethods<P, T, DbType, MD>,
    DCO extends ISwarmMessagesDatabaseCacheOptions<P, DbType, MD, SMSM>
  >
  extends SwarmMessagesDatabaseCache<P, T, DbType, DBO, MD, SMSM, DCO>
  implements ISwarmMessagesDatabaseCache<P, T, DbType, DBO, MD, SMSM> {}
