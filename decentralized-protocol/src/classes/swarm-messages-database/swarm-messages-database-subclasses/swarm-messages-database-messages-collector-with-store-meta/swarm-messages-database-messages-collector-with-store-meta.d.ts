import { ISwarmMessageStore } from '../../../swarm-message-store/types/swarm-message-store.types';
import { ESwarmStoreConnector } from '../../../swarm-store-class/swarm-store-class.const';
import { TSwarmStoreDatabaseType, TSwarmStoreDatabaseOptions } from '../../../swarm-store-class/swarm-store-class.types';
import { ISwarmMessageInstanceDecrypted, TSwarmMessageSerialized } from '../../../swarm-message/swarm-message-constructor.types';
import { TSwarmStoreConnectorConnectionOptions, ISwarmStoreProviderOptions, ISwarmStoreOptionsConnectorFabric } from '../../../swarm-store-class/swarm-store-class.types';
import { TSwarmMessagesStoreGrantAccessCallback, ISwarmMessageStoreAccessControlOptions, ISwarmMessageStoreOptionsWithConnectorFabric } from '../../../swarm-message-store/types/swarm-message-store.types';
import { ISwarmMessageConstructorWithEncryptedCacheFabric } from '../../../swarm-message-encrypted-cache/swarm-message-encrypted-cache.types';
import { ISwarmStoreConnectorBasic, ISwarmStoreConnector } from '../../../swarm-store-class/swarm-store-class.types';
import { ISwarmMessagesDatabaseMessagesCollectorWithStorageMetaOptions, ISwarmMessagesStoreMeta } from '../../swarm-messages-database.messages-collector.types';
import { ISwarmMessagesDatabaseMessagesCollectorWithStoreMeta } from '../../swarm-messages-database.messages-collector.types';
export declare function createSwarmMessagesDatabaseMessagesCollectorWithStoreMetaInstance<P extends ESwarmStoreConnector, T extends TSwarmMessageSerialized, DbType extends TSwarmStoreDatabaseType<P>, DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>, ConnectorBasic extends ISwarmStoreConnectorBasic<P, T, DbType, DBO>, CO extends TSwarmStoreConnectorConnectionOptions<P, T, DbType, DBO, ConnectorBasic>, PO extends ISwarmStoreProviderOptions<P, T, DbType, DBO, ConnectorBasic, CO>, ConnectorMain extends ISwarmStoreConnector<P, T, DbType, DBO, ConnectorBasic, CO>, CFO extends ISwarmStoreOptionsConnectorFabric<P, T, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain>, GAC extends TSwarmMessagesStoreGrantAccessCallback<P, MD | T>, MCF extends ISwarmMessageConstructorWithEncryptedCacheFabric | undefined, ACO extends ISwarmMessageStoreAccessControlOptions<P, T, MD | T, GAC> | undefined, O extends ISwarmMessageStoreOptionsWithConnectorFabric<P, T, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain, CFO, MD | T, GAC, MCF, ACO>, SMS extends ISwarmMessageStore<P, T, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain, CFO, MD | T, GAC, MCF, ACO, O>, MD extends ISwarmMessageInstanceDecrypted, SMSMeta extends ISwarmMessagesStoreMeta>(options: ISwarmMessagesDatabaseMessagesCollectorWithStorageMetaOptions<P, T, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain, CFO, MD, GAC, MCF, ACO, O, SMS, SMSMeta>): ISwarmMessagesDatabaseMessagesCollectorWithStoreMeta<P, T, DBO, DbType, MD, SMSMeta>;
//# sourceMappingURL=swarm-messages-database-messages-collector-with-store-meta.d.ts.map