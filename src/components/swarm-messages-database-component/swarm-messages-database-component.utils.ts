import { SwarmMessagesDatabase } from '../../classes/swarm-messages-database/swarm-messages-database';
import { ESwarmStoreConnector } from '../../classes/swarm-store-class/swarm-store-class.const';
import { ISwarmMessagesDatabaseConnectOptions } from '../../classes/swarm-messages-database/swarm-messages-database.types';
import { ISwarmMessageInstanceDecrypted } from '../../classes/swarm-message/swarm-message-constructor.types';
import {
  ISwarmMessagesDatabaseMessageDescription,
  ISwarmMessagesDatabaseDeleteMessageDescription,
} from './swarm-messages-database-component.types';
import { ESwarmMessageStoreEventNames } from '../../classes/swarm-message-store/swarm-message-store.const';
import {
  TSwarmStoreValueTypes,
  TSwarmStoreDatabaseType,
  TSwarmStoreDatabaseEntityKey,
  TSwarmStoreDatabaseEntityAddress,
  TSwarmStoreDatabaseEntityUniqueIndex,
} from '../../classes/swarm-store-class/swarm-store-class.types';

export const connectToDatabase = async <
  P extends ESwarmStoreConnector = ESwarmStoreConnector.OrbitDB,
  V extends TSwarmStoreValueTypes<P> = TSwarmStoreValueTypes<P>,
  DbType extends TSwarmStoreDatabaseType<P> = TSwarmStoreDatabaseType<P>
>(
  options: ISwarmMessagesDatabaseConnectOptions<P, V, DbType>
): Promise<SwarmMessagesDatabase<P, V, DbType>> => {
  const db = new SwarmMessagesDatabase<P, V, DbType>();

  await db.connect(options);
  return db;
};

export const setMessageListener = <
  P extends ESwarmStoreConnector = ESwarmStoreConnector.OrbitDB,
  V extends TSwarmStoreValueTypes<P> = TSwarmStoreValueTypes<P>,
  DbType extends TSwarmStoreDatabaseType<P> = TSwarmStoreDatabaseType<P>,
  T extends SwarmMessagesDatabase<P, V, DbType> = SwarmMessagesDatabase<
    ESwarmStoreConnector.OrbitDB,
    V,
    DbType
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
  T extends SwarmMessagesDatabase<P, V, DbType> = SwarmMessagesDatabase<
    ESwarmStoreConnector.OrbitDB,
    V,
    DbType
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
    // for key-value store it will be the key for the value,
    // for feed store it will be hash of the message which deleted by this one.
    keyOrAddress?: TSwarmStoreDatabaseEntityUniqueIndex<P, DbType>
  ) => {
    messagesDeleteListener({
      id: messageAddress,
      keyOrIdRemoved: keyOrAddress,
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
