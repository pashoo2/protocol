import { ESwarmStoreConnectorOrbitDbDatabaseType } from './../../../../../../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.const';
import { TSwarmStoreDatabaseOptions } from 'classes/swarm-store-class';
import { TSwarmStoreDatabaseType } from './../../../../../../swarm-store-class/swarm-store-class.types';
import { ESwarmStoreConnector } from 'classes/swarm-store-class/swarm-store-class.const';
import { TSwarmMessageSerialized } from 'classes/swarm-message/swarm-message-constructor.types';
import { ISwarmMessageChannelDescriptionRaw } from 'classes/swarm-messages-channels/types/swarm-messages-channel-instance.types';
export declare function swarmMessagesChannelV1GenerateNewSwarmChannelDescription<P extends ESwarmStoreConnector = ESwarmStoreConnector.OrbitDB, T extends TSwarmMessageSerialized = TSwarmMessageSerialized, DbType extends TSwarmStoreDatabaseType<P> = ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE, DBO extends TSwarmStoreDatabaseOptions<P, T, DbType> = TSwarmStoreDatabaseOptions<P, T, DbType>>(channelDescriptionPartial: Omit<Partial<ISwarmMessageChannelDescriptionRaw<P, T, DbType, DBO>>, 'dbOptions'> & {
    dbOptions: Partial<ISwarmMessageChannelDescriptionRaw<P, T, DbType, DBO>['dbOptions']>;
}): ISwarmMessageChannelDescriptionRaw<P, T, DbType, DBO>;
//# sourceMappingURL=swarm-messages-channel-v1-generate-new-channel-description.d.ts.map