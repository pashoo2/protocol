import { MarkOptional } from 'ts-essentials';
import { ISwarmMessageChannelDescriptionRaw, ISwarmMessagesChannelConstructorOptions } from '../../../../../types/swarm-messages-channel-instance.types';
import { ISwarmMessagesDatabaseConnectOptions, ISwarmMessagesDatabaseCache, ISwarmMessagesDatabaseCacheOptions } from '../../../../../../swarm-messages-database/swarm-messages-database.types';
import { ISwarmMessagesDatabaseMessagesCollector } from '../../../../../../swarm-messages-database/swarm-messages-database.messages-collector.types';
import { ISwarmMessageInstanceDecrypted, TSwarmMessageSerialized } from '../../../../../../swarm-message/swarm-message-constructor.types';
import { ISwarmMessageStore, TSwarmMessagesStoreGrantAccessCallback, ISwarmMessageStoreAccessControlOptions, ISwarmMessageStoreOptionsWithConnectorFabric } from '../../../../../../swarm-message-store/types/swarm-message-store.types';
import { ESwarmStoreConnector } from '../../../../../../swarm-store-class/swarm-store-class.const';
import { TSwarmStoreDatabaseType, TSwarmStoreDatabaseOptions, ISwarmStoreConnectorBasic, TSwarmStoreConnectorConnectionOptions, ISwarmStoreProviderOptions, ISwarmStoreConnector, ISwarmStoreOptionsConnectorFabric } from '../../../../../../swarm-store-class/swarm-store-class.types';
import { ISwarmMessageConstructorWithEncryptedCacheFabric } from '../../../../../../swarm-message-encrypted-cache/swarm-message-encrypted-cache.types';
import { ISwarmMessagesChannel } from '../../../../../types/swarm-messages-channel-instance.types';
import { ISwarmMessagesChannelV1DefaultFabricOptions } from './types/swarm-messages-channel-v1-fabric-async-default.types';
export declare function getSwarmMessagesChannelV1InstanveWithDefaults<P extends ESwarmStoreConnector, T extends TSwarmMessageSerialized, DbType extends TSwarmStoreDatabaseType<P>, DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>, ConnectorBasic extends ISwarmStoreConnectorBasic<P, T, DbType, DBO>, CO extends TSwarmStoreConnectorConnectionOptions<P, T, DbType, DBO, ConnectorBasic>, PO extends ISwarmStoreProviderOptions<P, T, DbType, DBO, ConnectorBasic, CO>, ConnectorMain extends ISwarmStoreConnector<P, T, DbType, DBO, ConnectorBasic, CO>, CFO extends ISwarmStoreOptionsConnectorFabric<P, T, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain>, GAC extends TSwarmMessagesStoreGrantAccessCallback<P, MD | T>, MCF extends ISwarmMessageConstructorWithEncryptedCacheFabric | undefined, ACO extends ISwarmMessageStoreAccessControlOptions<P, T, MD | T, GAC> | undefined, O extends ISwarmMessageStoreOptionsWithConnectorFabric<P, T, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain, CFO, MD | T, GAC, MCF, ACO>, SMS extends ISwarmMessageStore<P, T, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain, CFO, MD | T, GAC, MCF, ACO, O>, MD extends ISwarmMessageInstanceDecrypted, SMSM extends ISwarmMessagesDatabaseMessagesCollector<P, DbType, MD>, DCO extends ISwarmMessagesDatabaseCacheOptions<P, DbType, MD, SMSM>, DCCRT extends ISwarmMessagesDatabaseCache<P, T, DbType, DBO, MD, SMSM>, OPT extends ISwarmMessagesDatabaseConnectOptions<P, T, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain, CFO, GAC, MCF, ACO, O, SMS, MD, SMSM, DCO, DCCRT>, CHD extends ISwarmMessageChannelDescriptionRaw<P, T, DbType, DBO> = ISwarmMessageChannelDescriptionRaw<P, T, DbType, DBO>, CHCO extends MarkOptional<ISwarmMessagesChannelConstructorOptions<P, T, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain, CFO, GAC, MCF, ACO, O, SMS, MD, SMSM, DCO, DCCRT, OPT, CHD>, 'passwordEncryptedChannelEncryptionQueue' | 'utils'> = MarkOptional<ISwarmMessagesChannelConstructorOptions<P, T, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain, CFO, GAC, MCF, ACO, O, SMS, MD, SMSM, DCO, DCCRT, OPT, CHD>, 'passwordEncryptedChannelEncryptionQueue' | 'utils'>>(options: ISwarmMessagesChannelV1DefaultFabricOptions<P, T, MD, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain, CFO, GAC, MCF, ACO, O, SMS, SMSM, DCO, DCCRT, OPT, CHD, CHCO>): Promise<typeof options['SwarmMessagesChannelConstructorWithHelperConstuctorsSupport'] extends never ? ISwarmMessagesChannel<P, T, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain, CFO, GAC, MCF, ACO, O, SMS, MD> : InstanceType<typeof options['SwarmMessagesChannelConstructorWithHelperConstuctorsSupport']>>;
//# sourceMappingURL=swarm-messages-channel-v1-fabric-async-default.d.ts.map