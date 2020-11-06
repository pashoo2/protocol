import {
  TSwarmStoreDatabaseEntityAddress,
  TSwarmStoreDatabaseEntityKey,
  TSwarmStoreDatabaseType,
} from '../../../swarm-store-class/swarm-store-class.types';
import { ESwarmStoreConnector } from '../../../swarm-store-class/swarm-store-class.const';
import { ISwarmMessagesDatabaseMesssageMeta } from '../../swarm-messages-database.types';
import { ESwarmStoreConnectorOrbitDbDatabaseType } from '../../../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.const';
import { ISwarmMessagesDatabaseMessagesCacheMessageDescription } from './swarm-messages-database-cache.types';
import {
  ISwarmMessageStoreMessageWithMeta,
  ISwarmMessageStoreMessagingRequestWithMetaResult,
} from '../../../swarm-message-store/swarm-message-store.types';
import { TSwarmStoreDatabaseEntityUniqueIndex } from '../../../swarm-store-class/swarm-store-class.types';
import { isValidSwarmMessageDecryptedFormat } from '../../../swarm-message-store/swarm-message-store-utils/swarm-message-store-validators/swarm-message-store-validator-swarm-message';
import { whetherSwarmMessagesDecryptedAreEqual } from '../../../swarm-message/swarm-message-utils/swarm-message-utils-common/swarm-message-utils-common-decrypted';

export const checkMessageAddress = <P extends ESwarmStoreConnector, DbType extends TSwarmStoreDatabaseType<P>>(
  messageUniqAddress: any,
  dbType: DbType
): messageUniqAddress is DbType extends ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE
  ? undefined
  : TSwarmStoreDatabaseEntityAddress<P> => {
  const isFeedStore = dbType === ESwarmStoreConnectorOrbitDbDatabaseType.FEED;
  const isKeyValueStore = dbType === ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE;

  if (isFeedStore) {
    if (!messageUniqAddress) {
      throw new Error('The message should have an address for a feed store');
    }
  }
  if (isKeyValueStore) {
    if (messageUniqAddress) {
      throw new Error('The message should not have an address for a key-value store');
    }
  }
  return true;
};

export const checkMessageKey = <P extends ESwarmStoreConnector, DbType extends TSwarmStoreDatabaseType<P>>(
  key: any,
  dbType: DbType
): key is DbType extends ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE ? TSwarmStoreDatabaseEntityKey<P> : undefined => {
  const isFeedStore = dbType === ESwarmStoreConnectorOrbitDbDatabaseType.FEED;
  const isKeyValueStore = dbType === ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE;

  if (isFeedStore) {
    if (key) {
      throw new Error('The message should not have a key for a feed store');
    }
  }
  if (isKeyValueStore) {
    if (!key) {
      throw new Error('The message should have a key for a key-value store');
    }
  }
  return true;
};

export const getMessagesMetaByAddressAndKey = <P extends ESwarmStoreConnector, DbType extends TSwarmStoreDatabaseType<P>>(
  messageUniqAddress: DbType extends ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE
    ? undefined
    : TSwarmStoreDatabaseEntityAddress<P>,
  key: DbType extends ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE ? TSwarmStoreDatabaseEntityKey<P> : undefined,
  dbType: DbType
): ISwarmMessagesDatabaseMesssageMeta<P, DbType> => {
  if (checkMessageAddress(messageUniqAddress, dbType) && checkMessageKey(key, dbType)) {
    return {
      messageUniqAddress,
      key,
    };
  }
  throw new Error('Meta information is not valid for this database type');
};

export const createMessagesMetaByAddressAndKey = <P extends ESwarmStoreConnector, DbType extends TSwarmStoreDatabaseType<P>>(
  messageUniqAddress: DbType extends ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE
    ? TSwarmStoreDatabaseEntityAddress<P> | undefined
    : TSwarmStoreDatabaseEntityAddress<P>,
  key: DbType extends ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE ? TSwarmStoreDatabaseEntityKey<P> : undefined,
  dbType: DbType
): ISwarmMessagesDatabaseMesssageMeta<P, DbType> => {
  const isFeedStore = dbType === ESwarmStoreConnectorOrbitDbDatabaseType.FEED;
  const isKeyValueStore = dbType === ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE;

  if (isFeedStore) {
    checkMessageAddress(messageUniqAddress, dbType);
  }
  if (isKeyValueStore) {
    checkMessageKey(key, dbType);
  }
  return getMessagesMetaByAddressAndKey<P, DbType>(
    (isKeyValueStore ? undefined : messageUniqAddress) as DbType extends ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE
      ? undefined
      : TSwarmStoreDatabaseEntityAddress<P>,
    (isFeedStore ? undefined : key) as DbType extends ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE
      ? TSwarmStoreDatabaseEntityKey<P>
      : undefined,
    dbType
  );
};

export const getMessageMetaForMessageWithMeta = <P extends ESwarmStoreConnector, DbType extends TSwarmStoreDatabaseType<P>>(
  swarmMessageWithMeta: ISwarmMessageStoreMessageWithMeta<P>,
  dbType: DbType
): ISwarmMessagesDatabaseMesssageMeta<P, DbType> => {
  const { key, messageAddress } = swarmMessageWithMeta;
  return createMessagesMetaByAddressAndKey<P, DbType>(
    (messageAddress as unknown) as DbType extends ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE
      ? TSwarmStoreDatabaseEntityAddress<P> | undefined
      : TSwarmStoreDatabaseEntityAddress<P>,
    (key as unknown) as DbType extends ESwarmStoreConnectorOrbitDbDatabaseType.KEY_VALUE
      ? TSwarmStoreDatabaseEntityKey<P>
      : undefined,
    dbType
  );
};

export const getMessageUniqIndexByMeta = <P extends ESwarmStoreConnector, DbType extends TSwarmStoreDatabaseType<P>>(
  messageMeta: ISwarmMessagesDatabaseMesssageMeta<P, DbType>,
  dbType: DbType
): TSwarmStoreDatabaseEntityUniqueIndex<P, DbType> => {
  if (dbType === ESwarmStoreConnectorOrbitDbDatabaseType.FEED) {
    const { messageUniqAddress } = messageMeta;

    if (!messageUniqAddress) {
      throw new Error('Message unique address should be defined for a feed store');
    }
    return (messageUniqAddress as unknown) as TSwarmStoreDatabaseEntityUniqueIndex<P, DbType>;
  } else {
    const { key } = messageMeta;

    if (!key) {
      throw new Error('Message key should be defined for a key-value store');
    }
    return (key as unknown) as TSwarmStoreDatabaseEntityUniqueIndex<P, DbType>;
  }
};

export const getMessagesUniqIndexesByMeta = <P extends ESwarmStoreConnector, DbType extends TSwarmStoreDatabaseType<P>>(
  messagesMeta: Set<ISwarmMessagesDatabaseMesssageMeta<P, DbType>>,
  dbType: DbType
): Array<TSwarmStoreDatabaseEntityUniqueIndex<P, DbType>> => {
  const resultedArray = [];

  for (const messageMeta of messagesMeta) {
    resultedArray.push(getMessageUniqIndexByMeta(messageMeta, dbType));
  }
  return resultedArray;
};

export const getMessageDescriptionForMessageWithMeta = <
  P extends ESwarmStoreConnector,
  DbType extends TSwarmStoreDatabaseType<P>
>(
  swarmMessageWithMeta: ISwarmMessageStoreMessageWithMeta<P>,
  dbType: DbType
): ISwarmMessagesDatabaseMessagesCacheMessageDescription<P, DbType> => {
  const messageMeta = getMessageMetaForMessageWithMeta(swarmMessageWithMeta, dbType);
  return {
    messageMeta,
    messageEntry: swarmMessageWithMeta.message,
  };
};
/**
 * Check whether the arguments are a values have the valid SwarmMessageDecrypted format
 * and the same.
 *
 * @param {ISwarmMessageStoreMessagingRequestWithMetaResult<ESwarmStoreConnector>} first
 * @param {ISwarmMessageStoreMessagingRequestWithMetaResult<ESwarmStoreConnector>} second
 * @returns {boolean}
 */
export const _checkWhetherSameSwarmMessagesDecrypted = (
  first: ISwarmMessageStoreMessagingRequestWithMetaResult<ESwarmStoreConnector> | undefined,
  second: ISwarmMessageStoreMessagingRequestWithMetaResult<ESwarmStoreConnector> | undefined
): boolean => {
  if (!first || !second || first instanceof Error || second instanceof Error) {
    return false;
  }
  return (
    isValidSwarmMessageDecryptedFormat(first) &&
    isValidSwarmMessageDecryptedFormat(second) &&
    whetherSwarmMessagesDecryptedAreEqual(first, second)
  );
};
