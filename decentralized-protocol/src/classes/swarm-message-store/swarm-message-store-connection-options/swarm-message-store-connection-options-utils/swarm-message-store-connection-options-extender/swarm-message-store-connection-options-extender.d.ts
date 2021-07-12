import { ESwarmStoreConnector } from '../../../../swarm-store-class/swarm-store-class.const';
import { TSwarmMessageInstance, TSwarmMessageSerialized } from '../../../../swarm-message/swarm-message-constructor.types';
import { ISwarmStoreConnector, ISwarmStoreConnectorBasic, ISwarmStoreOptionsConnectorFabric, ISwarmStoreProviderOptions, TSwarmStoreConnectorConnectionOptions, TSwarmStoreDatabaseOptions, TSwarmStoreDatabaseType } from '../../../../swarm-store-class/swarm-store-class.types';
import { ISwarmMessageStoreAccessControlOptions, ISwarmMessageStoreOptionsWithConnectorFabric, TSwarmMessagesStoreGrantAccessCallback } from '../../../types/swarm-message-store.types';
import { ISwarmMessageConstructorWithEncryptedCacheFabric } from '../../../../swarm-message-encrypted-cache/swarm-message-encrypted-cache.types';
import { ISwarmMessageInstanceEncrypted } from '../../../../swarm-message/swarm-message-constructor.types';
export declare function extendSwarmMessageStoreConnectionOptionsWithAccessControlAndConnectorSpecificOptions<P extends ESwarmStoreConnector.OrbitDB, T extends TSwarmMessageSerialized, DbType extends TSwarmStoreDatabaseType<P>, DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>, ConnectorBasic extends ISwarmStoreConnectorBasic<P, T, DbType, DBO>, PO extends TSwarmStoreConnectorConnectionOptions<P, T, DbType, DBO, ConnectorBasic>, CO extends ISwarmStoreProviderOptions<P, T, DbType, DBO, ConnectorBasic, PO>, ConnectorMain extends ISwarmStoreConnector<P, T, DbType, DBO, ConnectorBasic, PO>, CFO extends ISwarmStoreOptionsConnectorFabric<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain>, MSI extends TSwarmMessageInstance | T, GAC extends TSwarmMessagesStoreGrantAccessCallback<P, Exclude<MSI, ISwarmMessageInstanceEncrypted>>, MCF extends ISwarmMessageConstructorWithEncryptedCacheFabric | undefined, ACO extends ISwarmMessageStoreAccessControlOptions<P, T, Exclude<MSI, ISwarmMessageInstanceEncrypted>, GAC> | undefined, O extends ISwarmMessageStoreOptionsWithConnectorFabric<P, T, DbType, DBO, ConnectorBasic, PO, CO, ConnectorMain, CFO, MSI, GAC, MCF, ACO>>(options: O): Promise<O>;
//# sourceMappingURL=swarm-message-store-connection-options-extender.d.ts.map