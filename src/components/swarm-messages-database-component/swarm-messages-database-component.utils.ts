import { SwarmMessagesDatabase } from '../../classes/swarm-messages-database/swarm-messages-database';
import { ESwarmStoreConnector } from '../../classes/swarm-store-class/swarm-store-class.const';
import {
  ISwarmMessagesDatabaseConnectOptions,
  TSwarmMessageDatabaseMessagesCached,
} from '../../classes/swarm-messages-database/swarm-messages-database.types';
import {
  ISwarmMessageInstanceDecrypted,
  TSwarmMessageSerialized,
} from '../../classes/swarm-message/swarm-message-constructor.types';
import {
  ISwarmMessagesDatabaseMessageDescription,
  ISwarmMessagesDatabaseDeleteMessageDescription,
} from './swarm-messages-database-component.types';
import { ESwarmMessageStoreEventNames } from '../../classes/swarm-message-store/swarm-message-store.const';
import { ESwarmMessagesDatabaseCacheEventsNames } from '../../classes/swarm-messages-database/swarm-messages-database.const';
import { ISwarmStoreConnectorBasic, ISwarmStoreConnector } from '../../classes/swarm-store-class/swarm-store-class.types';
import { ISwarmMessageStoreOptionsWithConnectorFabric } from '../../classes/swarm-message-store/swarm-message-store.types';
import { TSwarmMessageUserIdentifierSerialized } from '../../classes/swarm-message/swarm-message-subclasses/swarm-message-subclass-validators/swarm-message-subclass-validator-fields-validator/swarm-message-subclass-validator-fields-validator-validators/swarm-message-subclass-validator-fields-validator-validator-user-identifier/swarm-message-subclass-validator-fields-validator-validator-user-identifier.types';
import {
  TSwarmStoreDatabaseType,
  TSwarmStoreDatabaseEntityKey,
  TSwarmStoreDatabaseEntityAddress,
} from '../../classes/swarm-store-class/swarm-store-class.types';

export const connectToDatabase = async <
  P extends ESwarmStoreConnector = ESwarmStoreConnector.OrbitDB,
  T extends TSwarmMessageSerialized = TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P> = TSwarmStoreDatabaseType<P>,
  ConnectorBasic extends ISwarmStoreConnectorBasic<ESwarmStoreConnector.OrbitDB, T, DbType> = ISwarmStoreConnectorBasic<
    ESwarmStoreConnector.OrbitDB,
    T,
    DbType
  >,
  ConnectorMain extends ISwarmStoreConnector<P, T, DbType, ConnectorBasic> = ISwarmStoreConnector<P, T, DbType, ConnectorBasic>,
  O extends ISwarmMessageStoreOptionsWithConnectorFabric<
    P,
    T,
    DbType,
    ConnectorBasic,
    ConnectorMain
  > = ISwarmMessageStoreOptionsWithConnectorFabric<P, T, DbType, ConnectorBasic, ConnectorMain>
>(
  options: ISwarmMessagesDatabaseConnectOptions<P, T, DbType, ConnectorBasic, ConnectorMain, O>
): Promise<SwarmMessagesDatabase<P, T, DbType, ConnectorBasic, ConnectorMain, O>> => {
  const db = new SwarmMessagesDatabase<P, T, DbType, ConnectorBasic, ConnectorMain, O>();

  await db.connect(options);
  return db;
};

export const setMessageListener = <
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  ConnectorBasic extends ISwarmStoreConnectorBasic<ESwarmStoreConnector.OrbitDB, T, DbType>,
  ConnectorMain extends ISwarmStoreConnector<P, T, DbType, ConnectorBasic>,
  O extends ISwarmMessageStoreOptionsWithConnectorFabric<P, T, DbType, ConnectorBasic, ConnectorMain>,
  DB extends SwarmMessagesDatabase<P, T, DbType, ConnectorBasic, ConnectorMain, O>
>(
  db: DB,
  messagesListener: (message: ISwarmMessagesDatabaseMessageDescription<P>) => void
): (() => void) => {
  const listener = (
    dbName: string,
    message: ISwarmMessageInstanceDecrypted,
    // the global unique address of the message in the swarm
    messageAddress: TSwarmStoreDatabaseEntityAddress<P>,
    // for key-value store it will be the key
    key?: TSwarmStoreDatabaseEntityKey<P>
  ) => {
    messagesListener({
      message,
      id: messageAddress,
      key,
    });
  };
  db.emitter.addListener(ESwarmMessageStoreEventNames.NEW_MESSAGE, listener);
  return () => {
    db.emitter.removeListener(ESwarmMessageStoreEventNames.NEW_MESSAGE, listener);
  };
};

export const setMessageDeleteListener = <
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  ConnectorBasic extends ISwarmStoreConnectorBasic<ESwarmStoreConnector.OrbitDB, T, DbType>,
  ConnectorMain extends ISwarmStoreConnector<P, T, DbType, ConnectorBasic>,
  O extends ISwarmMessageStoreOptionsWithConnectorFabric<P, T, DbType, ConnectorBasic, ConnectorMain>,
  DB extends SwarmMessagesDatabase<P, T, DbType, ConnectorBasic, ConnectorMain, O>
>(
  db: DB,
  messagesDeleteListener: (message: ISwarmMessagesDatabaseDeleteMessageDescription<P>) => void
): (() => void) => {
  const listener = (
    dbName: string,
    // the user who removed the message
    userId: TSwarmMessageUserIdentifierSerialized,
    // the global unique address (hash) of the DELETE message in the swarm
    messageAddress: TSwarmStoreDatabaseEntityAddress<P>,
    // the global unique address (hash) of the DELETED message in the swarm
    messageDeletedAddress: TSwarmStoreDatabaseEntityAddress<P> | undefined,
    // for key-value store it will be the key for the value,
    // for feed store it will be hash of the message which deleted by this one.
    key: TSwarmStoreDatabaseEntityKey<P> | undefined
  ) => {
    messagesDeleteListener({
      id: messageAddress,
      idDeleted: messageDeletedAddress,
      key,
      userId,
    });
  };

  db.emitter.addListener(ESwarmMessageStoreEventNames.DELETE_MESSAGE, listener);
  return () => db.emitter.removeListener(ESwarmMessageStoreEventNames.DELETE_MESSAGE, listener);
};

export const setCacheUpdateListener = <
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  ConnectorBasic extends ISwarmStoreConnectorBasic<ESwarmStoreConnector.OrbitDB, T, DbType>,
  ConnectorMain extends ISwarmStoreConnector<P, T, DbType, ConnectorBasic>,
  O extends ISwarmMessageStoreOptionsWithConnectorFabric<P, T, DbType, ConnectorBasic, ConnectorMain>,
  DB extends SwarmMessagesDatabase<P, T, DbType, ConnectorBasic, ConnectorMain, O>
>(
  db: DB,
  cacheUpdateListener: (messages: TSwarmMessageDatabaseMessagesCached<P, DbType> | undefined) => unknown
) => {
  const listener = (messages: TSwarmMessageDatabaseMessagesCached<P, DbType> | undefined) => {
    cacheUpdateListener(messages);
  };
  db.emitter.addListener(ESwarmMessagesDatabaseCacheEventsNames.CACHE_UPDATED, listener);
  return () => db.emitter.removeListener(ESwarmMessagesDatabaseCacheEventsNames.CACHE_UPDATED, listener);
};
