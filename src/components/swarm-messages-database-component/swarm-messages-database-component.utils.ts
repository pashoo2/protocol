import { ESwarmStoreConnector } from '../../classes/swarm-store-class/swarm-store-class.const';
import {
  TSwarmMessageDatabaseMessagesCached,
  ISwarmMessagesDatabaseCacheOptions,
  ISwarmMessagesDatabaseCache,
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
import { TSwarmStoreDatabaseOptions } from '../../classes/swarm-store-class/swarm-store-class.types';
import { TSwarmMessageUserIdentifierSerialized } from '../../classes/swarm-message/swarm-message-subclasses/swarm-message-subclass-validators/swarm-message-subclass-validator-fields-validator/swarm-message-subclass-validator-fields-validator-validators/swarm-message-subclass-validator-fields-validator-validator-user-identifier/swarm-message-subclass-validator-fields-validator-validator-user-identifier.types';
import { ISwarmMessagesDatabaseConnector } from '../../classes/swarm-messages-database/swarm-messages-database.types';
import { TSwarmMessageInstance } from '../../classes/swarm-message/swarm-message-constructor.types';
import {
  TSwarmStoreDatabaseType,
  TSwarmStoreDatabaseEntityKey,
  TSwarmStoreDatabaseEntityAddress,
} from '../../classes/swarm-store-class/swarm-store-class.types';
import { ISwarmMessagesDatabaseMessagesCollector } from '../../classes/swarm-messages-database/swarm-messages-database.messages-collector.types';

export const setMessageListener = <
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>,
  MSI extends TSwarmMessageInstance | T,
  MD extends ISwarmMessageInstanceDecrypted,
  SMSM extends ISwarmMessagesDatabaseMessagesCollector<P, DbType, MD>,
  DCO extends ISwarmMessagesDatabaseCacheOptions<P, DbType, MD, SMSM>,
  DCCRT extends ISwarmMessagesDatabaseCache<P, T, DbType, DBO, MD, SMSM>,
  DB extends ISwarmMessagesDatabaseConnector<
    P,
    T,
    DbType,
    DBO,
    never,
    never,
    never,
    never,
    never,
    MSI,
    never,
    never,
    never,
    never,
    never,
    MD,
    SMSM,
    DCO,
    DCCRT,
    never
  >
>(
  db: DB,
  messagesListener: (message: ISwarmMessagesDatabaseMessageDescription<P>) => void
): (() => void) => {
  const listener = (
    dbName: DBO['dbName'],
    message: MD,
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
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>,
  MSI extends TSwarmMessageInstance | T,
  MD extends ISwarmMessageInstanceDecrypted,
  SMSM extends ISwarmMessagesDatabaseMessagesCollector<P, DbType, MD>,
  DCO extends ISwarmMessagesDatabaseCacheOptions<P, DbType, MD, SMSM>,
  DCCRT extends ISwarmMessagesDatabaseCache<P, T, DbType, DBO, MD, SMSM>,
  DB extends ISwarmMessagesDatabaseConnector<
    P,
    T,
    DbType,
    DBO,
    never,
    never,
    never,
    never,
    never,
    MSI,
    never,
    never,
    never,
    never,
    never,
    MD,
    SMSM,
    DCO,
    DCCRT,
    never
  >
>(
  db: DB,
  messagesDeleteListener: (message: ISwarmMessagesDatabaseDeleteMessageDescription<P>) => void
): (() => void) => {
  const listener = (
    dbName: DBO['dbName'],
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
  DBO extends TSwarmStoreDatabaseOptions<P, T, DbType>,
  MSI extends TSwarmMessageInstance | T,
  MD extends ISwarmMessageInstanceDecrypted,
  SMSM extends ISwarmMessagesDatabaseMessagesCollector<P, DbType, MD>,
  DCO extends ISwarmMessagesDatabaseCacheOptions<P, DbType, MD, SMSM>,
  DCCRT extends ISwarmMessagesDatabaseCache<P, T, DbType, DBO, MD, SMSM>,
  DB extends ISwarmMessagesDatabaseConnector<
    P,
    T,
    DbType,
    DBO,
    never,
    never,
    never,
    never,
    never,
    MSI,
    never,
    never,
    never,
    never,
    never,
    MD,
    SMSM,
    DCO,
    DCCRT,
    never
  >
>(
  db: DB,
  cacheUpdateListener: (messages: TSwarmMessageDatabaseMessagesCached<P, DbType, MD> | undefined) => unknown
): (() => void) => {
  const listener = (messages: TSwarmMessageDatabaseMessagesCached<P, DbType, MD> | undefined) => {
    cacheUpdateListener(messages);
  };
  db.emitter.addListener(ESwarmMessagesDatabaseCacheEventsNames.CACHE_UPDATED, listener);
  return () => {
    db.emitter.removeListener(ESwarmMessagesDatabaseCacheEventsNames.CACHE_UPDATED, listener);
  };
};
