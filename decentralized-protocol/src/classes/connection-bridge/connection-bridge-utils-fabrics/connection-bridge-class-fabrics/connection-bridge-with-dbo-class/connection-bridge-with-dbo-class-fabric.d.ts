import { ESwarmStoreConnector } from '../../../../swarm-store-class/swarm-store-class.const';
import { TSwarmMessageInstance, ISwarmMessageConstructor } from '../../../../swarm-message/swarm-message-constructor.types';
import { TSwarmStoreDatabaseOptions, TSwarmStoreConnectorConnectionOptions, ISwarmStoreProviderOptions, ISwarmStoreOptionsConnectorFabric, TSwarmStoreConnectorBasicFabric } from '../../../../swarm-store-class/swarm-store-class.types';
import { TSwarmMessagesStoreGrantAccessCallback, ISwarmMessageStoreAccessControlOptions, ISwarmMessageStoreOptionsWithConnectorFabric } from '../../../../swarm-message-store/types/swarm-message-store.types';
import { ISwarmMessageConstructorWithEncryptedCacheFabric } from '../../../../swarm-message-encrypted-cache/swarm-message-encrypted-cache.types';
import { ConstructorType } from '../../../../../types/helper.types';
import { ISwarmStoreDBOGrandAccessCallbackBaseContext } from '../../../../swarm-store-class/swarm-store-connectors/swarm-store-connetors.types';
import { ISwarmStoreDatabaseBaseOptions } from '../../../../swarm-store-class/swarm-store-class.types';
import { ISwarmMessageStoreConectorDbOptionsGrandAccessContextClassFabric } from '../../../../swarm-message-store/types/swarm-message-store-db-options.types';
import { ISwarmStoreWithConnector, TSwarmStoreOptionsOfDatabasesKnownList } from '../../../../swarm-store-class/swarm-store-class.types';
import { ISwarmMessageStoreWithEntriesCount, ISwarmMessageStoreEvents } from '../../../../swarm-message-store/types/swarm-message-store.types';
import { TConnectionBridgeCFODefault, TNativeConnectionType, TConnectionBridgeOptionsAuthCredentials } from '../../../types/connection-bridge.types';
import { IConnectionBridgeWithDatabaseOptionsClassAndDBListPeristentStorageAndSwarmMessageCountOptions } from './connection-bridge-with-dbo-class-fabric.types';
import { ISwarmStoreConnectorBasicWithEntriesCount, ISwarmStoreConnectorWithEntriesCount } from '../../../../swarm-store-class/swarm-store-class-extended/swarm-store-class-with-entries-count/swarm-store-class-with-entries-count.types';
import { ISwarmStoreDatabasesPersistentListFabric } from '../../../types/connection-bridge.types';
import { ISwarmMessageStoreConnectorDbOptionsClassFabric } from '../../../types/connection-bridge-swarm-fabrics.types';
import { ConnectionBridgeWithDBOClassEntriesCount } from './connection-bridge-with-dbo-class';
import { ISerializer } from '../../../../../types/serialization.types';
import { ISwarmMessageInstanceEncrypted } from '../../../../swarm-message/swarm-message-constructor.types';
export declare const createConnectionBridgeConnectionWithDBOClass: <P extends ESwarmStoreConnector, T extends string, DbType extends import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, MSI extends TSwarmMessageInstance | T, CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext, DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>, DBOE extends DBO & ISwarmStoreDatabaseBaseOptions & {
    provider: P;
}, DBOS extends string, SMC extends ISwarmMessageConstructor, ConnectorBasic extends ISwarmStoreConnectorBasicWithEntriesCount<P, T, DbType, DBOE>, CO extends TSwarmStoreConnectorConnectionOptions<P, T, DbType, DBOE, ConnectorBasic>, PO extends ISwarmStoreProviderOptions<P, T, DbType, DBOE, ConnectorBasic, CO>, ConnectorMain extends ISwarmStoreConnectorWithEntriesCount<P, T, DbType, DBOE, ConnectorBasic, CO>, GAC extends TSwarmMessagesStoreGrantAccessCallback<P, Exclude<MSI, ISwarmMessageInstanceEncrypted>, Record<string, unknown>>, MCF extends ISwarmMessageConstructorWithEncryptedCacheFabric, ACO extends ISwarmMessageStoreAccessControlOptions<P, T, Exclude<MSI, ISwarmMessageInstanceEncrypted>, GAC>, CFO extends ISwarmStoreOptionsConnectorFabric<P, T, DbType, DBOE, ConnectorBasic, CO, PO, ConnectorMain>, CFOD extends TConnectionBridgeCFODefault<P, T, DbType, DBOE, ConnectorBasic, CO, PO, ConnectorMain, CFO>, CBFO extends TSwarmStoreConnectorBasicFabric<P, T, DbType, DBOE, ConnectorBasic>, CD extends boolean, O extends ISwarmMessageStoreOptionsWithConnectorFabric<P, T, DbType, DBOE, ConnectorBasic, CO, PO, ConnectorMain, CFOD, MSI, GAC, MCF, ACO>, CBO extends IConnectionBridgeWithDatabaseOptionsClassAndDBListPeristentStorageAndSwarmMessageCountOptions<P, T, DbType, MSI, CTX, DBO, DBOE, DBOS, SMC, ConnectorBasic, CO, PO, ConnectorMain, GAC, MCF, ACO, CFO, CFOD, CBFO, CD, O, SMS, SSDPLF, CTXC, SMSDBOGACF, DBOCF, SRLZR, DBOCFF>, SMS extends ISwarmMessageStoreWithEntriesCount<P, T, DbType, DBOE, ConnectorBasic, CO, PO, ConnectorMain, CFOD, MSI, GAC, MCF, ACO, O> & ISwarmStoreWithConnector<P, T, DbType, DBOE, ConnectorBasic, CO, ConnectorMain>, SSDPLF extends ISwarmStoreDatabasesPersistentListFabric<P, T, DbType, DBOE, Record<DBOE["dbName"], DBOE>>, CTXC extends ConstructorType<CTX, any[]>, SMSDBOGACF extends ISwarmMessageStoreConectorDbOptionsGrandAccessContextClassFabric<SMC, CTXC>, DBOCF extends ISwarmMessageStoreConnectorDbOptionsClassFabric<P, T, DbType, Exclude<Exclude<MSI, ISwarmMessageInstanceEncrypted>, T>, CTX, DBOE, DBOS, SMC, CTXC, SMSDBOGACF, never>, DBOCFF extends (serializer: SRLZR) => DBOCF, E extends ISwarmMessageStoreEvents<P, T, DbType, DBOE> = ISwarmMessageStoreEvents<P, T, DbType, DBOE>, DBL extends TSwarmStoreOptionsOfDatabasesKnownList<P, T, DbType, DBOE> = TSwarmStoreOptionsOfDatabasesKnownList<P, T, DbType, DBOE>, NC extends TNativeConnectionType<P> = TNativeConnectionType<P>, SRLZR extends ISerializer<any> = ISerializer<any>>(options: CBO, credentials?: TConnectionBridgeOptionsAuthCredentials, useSessionIfExists?: boolean) => Promise<ConnectionBridgeWithDBOClassEntriesCount<P, T, DbType, MSI, CTX, DBO, DBOE, DBOS, SMC, ConnectorBasic, CO, PO, ConnectorMain, GAC, MCF, ACO, CFO, CFOD, CBFO, CD, O, CBO, SMS, SSDPLF, CTXC, SMSDBOGACF, DBOCF, DBOCFF, E, DBL, NC, SRLZR>>;
export declare const createConnectionBridgeConnectionWithDBOClassByOptions: (options: IConnectionBridgeWithDatabaseOptionsClassAndDBListPeristentStorageAndSwarmMessageCountOptions<any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any>, credentials?: TConnectionBridgeOptionsAuthCredentials, useSessionIfExists?: boolean) => Promise<ConnectionBridgeWithDBOClassEntriesCount<ESwarmStoreConnector, string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, string | TSwarmMessageInstance, ISwarmStoreDBOGrandAccessCallbackBaseContext, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType>, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}, string, ISwarmMessageConstructor, ISwarmStoreConnectorBasicWithEntriesCount<ESwarmStoreConnector, string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}>, import("../../../..").ISwarmStoreConnectorOrbitDBConnectionOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}, ISwarmStoreConnectorBasicWithEntriesCount<ESwarmStoreConnector, string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}>>, ISwarmStoreProviderOptions<ESwarmStoreConnector, string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}, ISwarmStoreConnectorBasicWithEntriesCount<ESwarmStoreConnector, string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}>, import("../../../..").ISwarmStoreConnectorOrbitDBConnectionOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}, ISwarmStoreConnectorBasicWithEntriesCount<ESwarmStoreConnector, string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}>>>, ISwarmStoreConnectorWithEntriesCount<ESwarmStoreConnector, string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}, ISwarmStoreConnectorBasicWithEntriesCount<ESwarmStoreConnector, string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}>, import("../../../..").ISwarmStoreConnectorOrbitDBConnectionOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}, ISwarmStoreConnectorBasicWithEntriesCount<ESwarmStoreConnector, string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}>>>, TSwarmMessagesStoreGrantAccessCallback<ESwarmStoreConnector, string | import("../../../../swarm-message/swarm-message-constructor.types").ISwarmMessageInstanceDecrypted, Record<string, unknown>>, ISwarmMessageConstructorWithEncryptedCacheFabric, ISwarmMessageStoreAccessControlOptions<ESwarmStoreConnector, string, string | import("../../../../swarm-message/swarm-message-constructor.types").ISwarmMessageInstanceDecrypted, TSwarmMessagesStoreGrantAccessCallback<ESwarmStoreConnector, string | import("../../../../swarm-message/swarm-message-constructor.types").ISwarmMessageInstanceDecrypted, Record<string, unknown>>>, ISwarmStoreOptionsConnectorFabric<ESwarmStoreConnector, string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}, ISwarmStoreConnectorBasicWithEntriesCount<ESwarmStoreConnector, string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}>, import("../../../..").ISwarmStoreConnectorOrbitDBConnectionOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}, ISwarmStoreConnectorBasicWithEntriesCount<ESwarmStoreConnector, string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}>>, ISwarmStoreProviderOptions<ESwarmStoreConnector, string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}, ISwarmStoreConnectorBasicWithEntriesCount<ESwarmStoreConnector, string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}>, import("../../../..").ISwarmStoreConnectorOrbitDBConnectionOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}, ISwarmStoreConnectorBasicWithEntriesCount<ESwarmStoreConnector, string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}>>>, ISwarmStoreConnectorWithEntriesCount<ESwarmStoreConnector, string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}, ISwarmStoreConnectorBasicWithEntriesCount<ESwarmStoreConnector, string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}>, import("../../../..").ISwarmStoreConnectorOrbitDBConnectionOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}, ISwarmStoreConnectorBasicWithEntriesCount<ESwarmStoreConnector, string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}>>>>, ISwarmStoreOptionsConnectorFabric<ESwarmStoreConnector, string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}, ISwarmStoreConnectorBasicWithEntriesCount<ESwarmStoreConnector, string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}>, import("../../../..").ISwarmStoreConnectorOrbitDBConnectionOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}, ISwarmStoreConnectorBasicWithEntriesCount<ESwarmStoreConnector, string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}>>, ISwarmStoreProviderOptions<ESwarmStoreConnector, string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}, ISwarmStoreConnectorBasicWithEntriesCount<ESwarmStoreConnector, string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}>, import("../../../..").ISwarmStoreConnectorOrbitDBConnectionOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}, ISwarmStoreConnectorBasicWithEntriesCount<ESwarmStoreConnector, string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}>>>, ISwarmStoreConnectorWithEntriesCount<ESwarmStoreConnector, string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}, ISwarmStoreConnectorBasicWithEntriesCount<ESwarmStoreConnector, string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}>, import("../../../..").ISwarmStoreConnectorOrbitDBConnectionOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}, ISwarmStoreConnectorBasicWithEntriesCount<ESwarmStoreConnector, string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}>>>>, import("../../../..").ISwarmStoreConnectorOrbitDbConnecectionBasicFabric<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}, ISwarmStoreConnectorBasicWithEntriesCount<ESwarmStoreConnector, string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}>>, boolean, ISwarmMessageStoreOptionsWithConnectorFabric<ESwarmStoreConnector, string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}, ISwarmStoreConnectorBasicWithEntriesCount<ESwarmStoreConnector, string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}>, import("../../../..").ISwarmStoreConnectorOrbitDBConnectionOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}, ISwarmStoreConnectorBasicWithEntriesCount<ESwarmStoreConnector, string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}>>, ISwarmStoreProviderOptions<ESwarmStoreConnector, string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}, ISwarmStoreConnectorBasicWithEntriesCount<ESwarmStoreConnector, string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}>, import("../../../..").ISwarmStoreConnectorOrbitDBConnectionOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}, ISwarmStoreConnectorBasicWithEntriesCount<ESwarmStoreConnector, string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}>>>, ISwarmStoreConnectorWithEntriesCount<ESwarmStoreConnector, string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}, ISwarmStoreConnectorBasicWithEntriesCount<ESwarmStoreConnector, string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}>, import("../../../..").ISwarmStoreConnectorOrbitDBConnectionOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}, ISwarmStoreConnectorBasicWithEntriesCount<ESwarmStoreConnector, string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}>>>, ISwarmStoreOptionsConnectorFabric<ESwarmStoreConnector, string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}, ISwarmStoreConnectorBasicWithEntriesCount<ESwarmStoreConnector, string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}>, import("../../../..").ISwarmStoreConnectorOrbitDBConnectionOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}, ISwarmStoreConnectorBasicWithEntriesCount<ESwarmStoreConnector, string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}>>, ISwarmStoreProviderOptions<ESwarmStoreConnector, string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}, ISwarmStoreConnectorBasicWithEntriesCount<ESwarmStoreConnector, string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}>, import("../../../..").ISwarmStoreConnectorOrbitDBConnectionOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}, ISwarmStoreConnectorBasicWithEntriesCount<ESwarmStoreConnector, string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}>>>, ISwarmStoreConnectorWithEntriesCount<ESwarmStoreConnector, string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}, ISwarmStoreConnectorBasicWithEntriesCount<ESwarmStoreConnector, string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}>, import("../../../..").ISwarmStoreConnectorOrbitDBConnectionOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}, ISwarmStoreConnectorBasicWithEntriesCount<ESwarmStoreConnector, string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}>>>>, string | TSwarmMessageInstance, TSwarmMessagesStoreGrantAccessCallback<ESwarmStoreConnector, string | import("../../../../swarm-message/swarm-message-constructor.types").ISwarmMessageInstanceDecrypted, Record<string, unknown>>, ISwarmMessageConstructorWithEncryptedCacheFabric, ISwarmMessageStoreAccessControlOptions<ESwarmStoreConnector, string, string | import("../../../../swarm-message/swarm-message-constructor.types").ISwarmMessageInstanceDecrypted, TSwarmMessagesStoreGrantAccessCallback<ESwarmStoreConnector, string | import("../../../../swarm-message/swarm-message-constructor.types").ISwarmMessageInstanceDecrypted, Record<string, unknown>>>>, IConnectionBridgeWithDatabaseOptionsClassAndDBListPeristentStorageAndSwarmMessageCountOptions<any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any, any>, ISwarmMessageStoreWithEntriesCount<ESwarmStoreConnector, string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}, ISwarmStoreConnectorBasicWithEntriesCount<ESwarmStoreConnector, string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}>, import("../../../..").ISwarmStoreConnectorOrbitDBConnectionOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}, ISwarmStoreConnectorBasicWithEntriesCount<ESwarmStoreConnector, string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}>>, ISwarmStoreProviderOptions<ESwarmStoreConnector, string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}, ISwarmStoreConnectorBasicWithEntriesCount<ESwarmStoreConnector, string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}>, import("../../../..").ISwarmStoreConnectorOrbitDBConnectionOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}, ISwarmStoreConnectorBasicWithEntriesCount<ESwarmStoreConnector, string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}>>>, ISwarmStoreConnectorWithEntriesCount<ESwarmStoreConnector, string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}, ISwarmStoreConnectorBasicWithEntriesCount<ESwarmStoreConnector, string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}>, import("../../../..").ISwarmStoreConnectorOrbitDBConnectionOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}, ISwarmStoreConnectorBasicWithEntriesCount<ESwarmStoreConnector, string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}>>>, ISwarmStoreOptionsConnectorFabric<ESwarmStoreConnector, string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}, ISwarmStoreConnectorBasicWithEntriesCount<ESwarmStoreConnector, string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}>, import("../../../..").ISwarmStoreConnectorOrbitDBConnectionOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}, ISwarmStoreConnectorBasicWithEntriesCount<ESwarmStoreConnector, string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}>>, ISwarmStoreProviderOptions<ESwarmStoreConnector, string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}, ISwarmStoreConnectorBasicWithEntriesCount<ESwarmStoreConnector, string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}>, import("../../../..").ISwarmStoreConnectorOrbitDBConnectionOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}, ISwarmStoreConnectorBasicWithEntriesCount<ESwarmStoreConnector, string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}>>>, ISwarmStoreConnectorWithEntriesCount<ESwarmStoreConnector, string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}, ISwarmStoreConnectorBasicWithEntriesCount<ESwarmStoreConnector, string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}>, import("../../../..").ISwarmStoreConnectorOrbitDBConnectionOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}, ISwarmStoreConnectorBasicWithEntriesCount<ESwarmStoreConnector, string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}>>>>, string | TSwarmMessageInstance, TSwarmMessagesStoreGrantAccessCallback<ESwarmStoreConnector, string | import("../../../../swarm-message/swarm-message-constructor.types").ISwarmMessageInstanceDecrypted, Record<string, unknown>>, ISwarmMessageConstructorWithEncryptedCacheFabric, ISwarmMessageStoreAccessControlOptions<ESwarmStoreConnector, string, string | import("../../../../swarm-message/swarm-message-constructor.types").ISwarmMessageInstanceDecrypted, TSwarmMessagesStoreGrantAccessCallback<ESwarmStoreConnector, string | import("../../../../swarm-message/swarm-message-constructor.types").ISwarmMessageInstanceDecrypted, Record<string, unknown>>>, ISwarmMessageStoreOptionsWithConnectorFabric<ESwarmStoreConnector, string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}, ISwarmStoreConnectorBasicWithEntriesCount<ESwarmStoreConnector, string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}>, import("../../../..").ISwarmStoreConnectorOrbitDBConnectionOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}, ISwarmStoreConnectorBasicWithEntriesCount<ESwarmStoreConnector, string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}>>, ISwarmStoreProviderOptions<ESwarmStoreConnector, string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}, ISwarmStoreConnectorBasicWithEntriesCount<ESwarmStoreConnector, string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}>, import("../../../..").ISwarmStoreConnectorOrbitDBConnectionOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}, ISwarmStoreConnectorBasicWithEntriesCount<ESwarmStoreConnector, string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}>>>, ISwarmStoreConnectorWithEntriesCount<ESwarmStoreConnector, string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}, ISwarmStoreConnectorBasicWithEntriesCount<ESwarmStoreConnector, string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}>, import("../../../..").ISwarmStoreConnectorOrbitDBConnectionOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}, ISwarmStoreConnectorBasicWithEntriesCount<ESwarmStoreConnector, string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}>>>, ISwarmStoreOptionsConnectorFabric<ESwarmStoreConnector, string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}, ISwarmStoreConnectorBasicWithEntriesCount<ESwarmStoreConnector, string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}>, import("../../../..").ISwarmStoreConnectorOrbitDBConnectionOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}, ISwarmStoreConnectorBasicWithEntriesCount<ESwarmStoreConnector, string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}>>, ISwarmStoreProviderOptions<ESwarmStoreConnector, string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}, ISwarmStoreConnectorBasicWithEntriesCount<ESwarmStoreConnector, string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}>, import("../../../..").ISwarmStoreConnectorOrbitDBConnectionOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}, ISwarmStoreConnectorBasicWithEntriesCount<ESwarmStoreConnector, string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}>>>, ISwarmStoreConnectorWithEntriesCount<ESwarmStoreConnector, string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}, ISwarmStoreConnectorBasicWithEntriesCount<ESwarmStoreConnector, string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}>, import("../../../..").ISwarmStoreConnectorOrbitDBConnectionOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}, ISwarmStoreConnectorBasicWithEntriesCount<ESwarmStoreConnector, string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}>>>>, string | TSwarmMessageInstance, TSwarmMessagesStoreGrantAccessCallback<ESwarmStoreConnector, string | import("../../../../swarm-message/swarm-message-constructor.types").ISwarmMessageInstanceDecrypted, Record<string, unknown>>, ISwarmMessageConstructorWithEncryptedCacheFabric, ISwarmMessageStoreAccessControlOptions<ESwarmStoreConnector, string, string | import("../../../../swarm-message/swarm-message-constructor.types").ISwarmMessageInstanceDecrypted, TSwarmMessagesStoreGrantAccessCallback<ESwarmStoreConnector, string | import("../../../../swarm-message/swarm-message-constructor.types").ISwarmMessageInstanceDecrypted, Record<string, unknown>>>>> & ISwarmStoreWithConnector<ESwarmStoreConnector, string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}, ISwarmStoreConnectorBasicWithEntriesCount<ESwarmStoreConnector, string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}>, import("../../../..").ISwarmStoreConnectorOrbitDBConnectionOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}, ISwarmStoreConnectorBasicWithEntriesCount<ESwarmStoreConnector, string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}>>, ISwarmStoreConnectorWithEntriesCount<ESwarmStoreConnector, string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}, ISwarmStoreConnectorBasicWithEntriesCount<ESwarmStoreConnector, string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}>, import("../../../..").ISwarmStoreConnectorOrbitDBConnectionOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}, ISwarmStoreConnectorBasicWithEntriesCount<ESwarmStoreConnector, string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}>>>>, ISwarmStoreDatabasesPersistentListFabric<ESwarmStoreConnector, string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}, Record<string, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}>>, ConstructorType<ISwarmStoreDBOGrandAccessCallbackBaseContext, any[]>, ISwarmMessageStoreConectorDbOptionsGrandAccessContextClassFabric<ISwarmMessageConstructor, ConstructorType<ISwarmStoreDBOGrandAccessCallbackBaseContext, any[]>>, ISwarmMessageStoreConnectorDbOptionsClassFabric<ESwarmStoreConnector, string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../../swarm-message/swarm-message-constructor.types").ISwarmMessageInstanceDecrypted, ISwarmStoreDBOGrandAccessCallbackBaseContext, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}, string, ISwarmMessageConstructor, ConstructorType<ISwarmStoreDBOGrandAccessCallbackBaseContext, any[]>, ISwarmMessageStoreConectorDbOptionsGrandAccessContextClassFabric<ISwarmMessageConstructor, ConstructorType<ISwarmStoreDBOGrandAccessCallbackBaseContext, any[]>>, never>, (serializer: ISerializer<any>) => ISwarmMessageStoreConnectorDbOptionsClassFabric<ESwarmStoreConnector, string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../../swarm-message/swarm-message-constructor.types").ISwarmMessageInstanceDecrypted, ISwarmStoreDBOGrandAccessCallbackBaseContext, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}, string, ISwarmMessageConstructor, ConstructorType<ISwarmStoreDBOGrandAccessCallbackBaseContext, any[]>, ISwarmMessageStoreConectorDbOptionsGrandAccessContextClassFabric<ISwarmMessageConstructor, ConstructorType<ISwarmStoreDBOGrandAccessCallbackBaseContext, any[]>>, never>, ISwarmMessageStoreEvents<ESwarmStoreConnector, string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}>, TSwarmStoreOptionsOfDatabasesKnownList<ESwarmStoreConnector, string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType, import("../../../..").ISwarmStoreConnectorOrbitDbDatabaseOptions<string, import("../../../..").ESwarmStoreConnectorOrbitDbDatabaseType> & ISwarmStoreDatabaseBaseOptions & {
    provider: ESwarmStoreConnector;
}>, import("../../../../../types").IPFS, ISerializer<any>>>;
//# sourceMappingURL=connection-bridge-with-dbo-class-fabric.d.ts.map