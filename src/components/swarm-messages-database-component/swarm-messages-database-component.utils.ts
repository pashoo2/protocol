import { SwarmMessagesDatabase } from '../../classes/swarm-messages-database/swarm-messages-database';
import { ESwarmStoreConnector } from '../../classes/swarm-store-class/swarm-store-class.const';
import {
  ISwarmMessagesDatabaseConnectOptions,
  TSwarmMessageDatabaseMessagesCached,
} from '../../classes/swarm-messages-database/swarm-messages-database.types';
import { ISwarmMessageInstanceDecrypted } from '../../classes/swarm-message/swarm-message-constructor.types';
import {
  ISwarmMessagesDatabaseMessageDescription,
  ISwarmMessagesDatabaseDeleteMessageDescription,
} from './swarm-messages-database-component.types';
import { ESwarmMessageStoreEventNames } from '../../classes/swarm-message-store/swarm-message-store.const';
import { ESwarmMessagesDatabaseCacheEventsNames } from '../../classes/swarm-messages-database/swarm-messages-database.const';
import { ISwarmStoreConnectorBasic } from '../../classes/swarm-store-class/swarm-store-class.types';
import {
  TSwarmStoreValueTypes,
  TSwarmStoreDatabaseType,
  TSwarmStoreDatabaseEntityKey,
  TSwarmStoreDatabaseEntityAddress,
} from '../../classes/swarm-store-class/swarm-store-class.types';

export const connectToDatabase = async <
  P extends ESwarmStoreConnector = ESwarmStoreConnector.OrbitDB,
  V extends TSwarmStoreValueTypes<P> = TSwarmStoreValueTypes<P>,
  DbType extends TSwarmStoreDatabaseType<P> = TSwarmStoreDatabaseType<P>,
  ConnectorBasic extends ISwarmStoreConnectorBasic<
    ESwarmStoreConnector.OrbitDB,
    V,
    DbType
  > = ISwarmStoreConnectorBasic<ESwarmStoreConnector.OrbitDB, V, DbType>
>(
  options: ISwarmMessagesDatabaseConnectOptions<P, V, DbType, ConnectorBasic>
): Promise<SwarmMessagesDatabase<P, V, DbType, ConnectorBasic>> => {
  const db = new SwarmMessagesDatabase<P, V, DbType, ConnectorBasic>();

  await db.connect(options);
  return db;
};

export const setMessageListener = <
  P extends ESwarmStoreConnector = ESwarmStoreConnector.OrbitDB,
  V extends TSwarmStoreValueTypes<P> = TSwarmStoreValueTypes<P>,
  DbType extends TSwarmStoreDatabaseType<P> = TSwarmStoreDatabaseType<P>,
  ConnectorBasic extends ISwarmStoreConnectorBasic<
    ESwarmStoreConnector.OrbitDB,
    V,
    DbType
  > = ISwarmStoreConnectorBasic<ESwarmStoreConnector.OrbitDB, V, DbType>,
  T extends SwarmMessagesDatabase<
    P,
    V,
    DbType,
    ConnectorBasic
  > = SwarmMessagesDatabase<
    ESwarmStoreConnector.OrbitDB,
    V,
    DbType,
    ConnectorBasic
  >
>(
  db: T,
  messagesListener: (
    message: ISwarmMessagesDatabaseMessageDescription<P>
  ) => void
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
    db.emitter.removeListener(
      ESwarmMessageStoreEventNames.NEW_MESSAGE,
      listener
    );
  };
};

export const setMessageDeleteListener = <
  P extends ESwarmStoreConnector = ESwarmStoreConnector.OrbitDB,
  V extends TSwarmStoreValueTypes<P> = TSwarmStoreValueTypes<P>,
  DbType extends TSwarmStoreDatabaseType<P> = TSwarmStoreDatabaseType<P>,
  ConnectorBasic extends ISwarmStoreConnectorBasic<
    ESwarmStoreConnector.OrbitDB,
    V,
    DbType
  > = ISwarmStoreConnectorBasic<ESwarmStoreConnector.OrbitDB, V, DbType>,
  T extends SwarmMessagesDatabase<
    P,
    V,
    DbType,
    ConnectorBasic
  > = SwarmMessagesDatabase<
    ESwarmStoreConnector.OrbitDB,
    V,
    DbType,
    ConnectorBasic
  >
>(
  db: T,
  messagesDeleteListener: (
    message: ISwarmMessagesDatabaseDeleteMessageDescription<P>
  ) => void
): (() => void) => {
  const listener = (
    dbName: string,
    // the user who removed the message
    userId: string,
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
  return () =>
    db.emitter.removeListener(
      ESwarmMessageStoreEventNames.DELETE_MESSAGE,
      listener
    );
};

export const setCacheUpdateListener = <
  P extends ESwarmStoreConnector = ESwarmStoreConnector.OrbitDB,
  V extends TSwarmStoreValueTypes<P> = TSwarmStoreValueTypes<P>,
  DbType extends TSwarmStoreDatabaseType<P> = TSwarmStoreDatabaseType<P>,
  ConnectorBasic extends ISwarmStoreConnectorBasic<
    ESwarmStoreConnector.OrbitDB,
    V,
    DbType
  > = ISwarmStoreConnectorBasic<ESwarmStoreConnector.OrbitDB, V, DbType>,
  T extends SwarmMessagesDatabase<
    P,
    V,
    DbType,
    ConnectorBasic
  > = SwarmMessagesDatabase<
    ESwarmStoreConnector.OrbitDB,
    V,
    DbType,
    ConnectorBasic
  >
>(
  db: T,
  cacheUpdateListener: (
    messages: TSwarmMessageDatabaseMessagesCached<P, DbType> | undefined
  ) => unknown
) => {
  const listener = (
    messages: TSwarmMessageDatabaseMessagesCached<P, DbType> | undefined
  ) => {
    cacheUpdateListener(messages);
  };
  db.emitter.addListener(
    ESwarmMessagesDatabaseCacheEventsNames.CACHE_UPDATED,
    listener
  );
  return () =>
    db.emitter.removeListener(
      ESwarmMessagesDatabaseCacheEventsNames.CACHE_UPDATED,
      listener
    );
};
