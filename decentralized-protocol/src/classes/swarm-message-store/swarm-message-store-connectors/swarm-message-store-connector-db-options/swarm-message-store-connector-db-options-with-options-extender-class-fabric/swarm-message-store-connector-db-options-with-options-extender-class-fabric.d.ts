import { TSwarmStoreDatabaseOptionsSerialized, TSwarmStoreValueTypes, TSwarmStoreDatabaseType, TSwarmStoreDatabaseOptions, ISwarmStoreConnectorBasic } from '../../../../swarm-store-class/swarm-store-class.types';
import { ESwarmStoreConnector } from '../../../../swarm-store-class/swarm-store-class.const';
import { ISwarmStoreDBOGrandAccessCallbackBaseContext } from '../../../../swarm-store-class/swarm-store-connectors/swarm-store-connetors.types';
import { ISwarmMessageInstanceDecrypted } from '../../../../swarm-message/swarm-message-constructor.types';
import { ISwarmStoreDBOSerializerValidator } from '../../../../swarm-store-class/swarm-store-connectors/swarm-store-connetors.types';
import { ConstructorType } from '../../../../../types/helper.types';
import { TSwarmStoreConnectorConnectionOptions, ISwarmStoreProviderOptions, ISwarmStoreConnector, ISwarmStoreOptionsConnectorFabric } from '../../../../swarm-store-class/swarm-store-class.types';
import { TSwarmMessagesStoreGrantAccessCallback, ISwarmMessageStoreAccessControlOptions, ISwarmMessageStoreOptionsWithConnectorFabric } from '../../../types/swarm-message-store.types';
import { ISwarmMessageConstructorWithEncryptedCacheFabric } from '../../../../swarm-message-encrypted-cache/swarm-message-encrypted-cache.types';
import { ISwarmStoreDatabaseBaseOptions } from '../../../../swarm-store-class/swarm-store-class.types';
import { ISwarmMessageStoreDatabaseOptionsExtender } from '../../../types/swarm-message-store-utils.types';
import { PromiseResolveType } from '../../../../../types/promise.types';
import { ISwarmMessageStoreDatabaseOptionsWithMetaConstructor } from '../swarm-store-connector-db-options.types';
export declare function createSwarmMessageStoreDBOWithOptionsExtenderFabric<P extends ESwarmStoreConnector, ItemType extends TSwarmStoreValueTypes<P>, DbType extends TSwarmStoreDatabaseType<P>, CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext, DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>, ConnectorBasic extends ISwarmStoreConnectorBasic<P, ItemType, DbType, DBO>, CO extends TSwarmStoreConnectorConnectionOptions<P, ItemType, DbType, DBO, ConnectorBasic>, PO extends ISwarmStoreProviderOptions<P, ItemType, DbType, DBO, ConnectorBasic, CO>, ConnectorMain extends ISwarmStoreConnector<P, ItemType, DbType, DBO, ConnectorBasic, CO>, CFO extends ISwarmStoreOptionsConnectorFabric<P, ItemType, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain>, MD extends ISwarmMessageInstanceDecrypted, GAC extends TSwarmMessagesStoreGrantAccessCallback<P, MD | ItemType>, MCF extends ISwarmMessageConstructorWithEncryptedCacheFabric | undefined, ACO extends ISwarmMessageStoreAccessControlOptions<P, ItemType, MD | ItemType, GAC> | undefined, O extends ISwarmMessageStoreOptionsWithConnectorFabric<P, ItemType, DbType, DBO, ConnectorBasic, CO, PO, ConnectorMain, CFO, MD | ItemType, GAC, MCF, ACO>, DBOS extends TSwarmStoreDatabaseOptionsSerialized, SSDOC extends ISwarmMessageStoreDatabaseOptionsWithMetaConstructor<P, ItemType, DbType, MD, CTX, DBO, DBOS, {
    swarmMessageStoreOptions: O;
    swarmMessageConstructor: PromiseResolveType<ReturnType<NonNullable<MCF>>>;
}>, META extends {
    swarmMessageStoreOptions: O;
    swarmMessageConstructor: PromiseResolveType<ReturnType<NonNullable<MCF>>>;
}, DBOE extends DBO & ISwarmStoreDatabaseBaseOptions & {
    provider: P;
}, OEXTENDERFABRIC extends (options: O) => ISwarmMessageStoreDatabaseOptionsExtender<P, ItemType, DbType, DBO, DBOE, PromiseResolveType<ReturnType<NonNullable<MCF>>>>>(BaseClass: SSDOC, databaseOptionsExtenderFabric: OEXTENDERFABRIC): SSDOC & ConstructorType<ISwarmStoreDBOSerializerValidator<P, ItemType, DbType, DBOE, DBOS>>;
//# sourceMappingURL=swarm-message-store-connector-db-options-with-options-extender-class-fabric.d.ts.map