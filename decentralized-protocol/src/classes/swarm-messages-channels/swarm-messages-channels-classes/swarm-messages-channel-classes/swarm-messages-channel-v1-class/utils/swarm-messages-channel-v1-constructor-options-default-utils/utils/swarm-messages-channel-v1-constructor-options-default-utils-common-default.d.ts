import { ESwarmStoreConnector, TSwarmStoreDatabaseOptions, TSwarmStoreDatabaseType } from '../../../../../../../swarm-store-class';
import { TSwarmMessageSerialized } from '../../../../../../../swarm-message';
import { SWARM_MESSAGES_CHANNEL_ENCRYPTION } from '../../../../../../const/swarm-messages-channels-main.const';
import { ISwarmMessagesChannelDatabaseNameGeneratorByChannelDescription, ISwarmMessagesChannelMessageIssuerByChannelDescription } from '../../../../../../types';
export declare function getSwarmMessageIssuerByChannelDescriptionUtilityDefault<P extends ESwarmStoreConnector, T extends TSwarmMessageSerialized, DbType extends TSwarmStoreDatabaseType<P>, DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>>(getSwarmMessagesIssuerCodeBySwarmMessagesChannelEncryptionType: (encryption: SWARM_MESSAGES_CHANNEL_ENCRYPTION) => string, getSwarmMessagesIssuerCodeBySwarmMessagesChannelDatabaseType: (dbType: DbType) => string, joinParts: (...paths: string[]) => string): ISwarmMessagesChannelMessageIssuerByChannelDescription<P, T, DbType, DBO>;
export declare function getDatabaseNameByChannelDescriptionUtilityDefault<P extends ESwarmStoreConnector, T extends TSwarmMessageSerialized, DbType extends TSwarmStoreDatabaseType<P>, DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>>(getSwarmMessagesIssuerByChannelDescription: ISwarmMessagesChannelMessageIssuerByChannelDescription<P, T, DbType, DBO>, joinParts: (...paths: string[]) => string): ISwarmMessagesChannelDatabaseNameGeneratorByChannelDescription<P, T, DbType, DBO>;
//# sourceMappingURL=swarm-messages-channel-v1-constructor-options-default-utils-common-default.d.ts.map