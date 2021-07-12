import { ESwarmStoreConnectorOrbitDbDatabaseType } from '../../../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.const';
import { isValidSwarmMessageDecryptedFormat } from '../../../swarm-message-store/swarm-message-store-utils/swarm-message-store-validators/swarm-message-store-validator-swarm-message';
import { ifSwarmMessagesDecryptedEqual } from '../../../swarm-message/swarm-message-utils/swarm-message-utils-common/swarm-message-utils-common-decrypted';
export const checkMessageAddress = (messageUniqAddress, dbType) => {
    const isFeedStore = dbType === ESwarmStoreConnectorOrbitDbDatabaseType.FEED;
    if (isFeedStore) {
        if (!messageUniqAddress) {
            throw new Error('The message should have an address for a feed store');
        }
    }
    return true;
};
export const checkMessageKey = (key, dbType) => {
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
export const getMessagesMetaByAddressAndKey = (messageUniqAddress, key, dbType) => {
    if (checkMessageAddress(messageUniqAddress, dbType) && checkMessageKey(key, dbType)) {
        return {
            messageUniqAddress,
            key,
        };
    }
    throw new Error('Meta information is not valid for this database type');
};
export const createMessagesMetaByAddressAndKey = (messageUniqAddress, key, dbType) => {
    const isFeedStore = dbType === ESwarmStoreConnectorOrbitDbDatabaseType.FEED;
    checkMessageAddress(messageUniqAddress, dbType);
    checkMessageKey(key, dbType);
    return getMessagesMetaByAddressAndKey(messageUniqAddress, (isFeedStore ? undefined : key), dbType);
};
export const getMessageMetaForMessageWithMeta = (swarmMessageWithMeta, dbType) => {
    const { key, messageAddress } = swarmMessageWithMeta;
    return createMessagesMetaByAddressAndKey(messageAddress, key, dbType);
};
const getMessageFeedStoreMetaByMessageEntityAddress = (messageAddress) => {
    return {
        key: undefined,
        messageUniqAddress: messageAddress,
    };
};
const getMessageKeyValueStoreMetaByMessageEntityKey = (messageKey) => {
    return {
        key: messageKey,
        messageUniqAddress: undefined,
    };
};
export const getMessageMetaByUniqIndex = (messageUniqIndex, dbType) => {
    if (dbType === ESwarmStoreConnectorOrbitDbDatabaseType.FEED) {
        return getMessageFeedStoreMetaByMessageEntityAddress(messageUniqIndex);
    }
    else {
        return getMessageKeyValueStoreMetaByMessageEntityKey(messageUniqIndex);
    }
};
export const getMessageUniqIndexByMeta = (messageMeta, dbType) => {
    if (dbType === ESwarmStoreConnectorOrbitDbDatabaseType.FEED) {
        const { messageUniqAddress } = messageMeta;
        if (!messageUniqAddress) {
            throw new Error('Message unique address should be defined for a feed store');
        }
        return messageUniqAddress;
    }
    else {
        const { key } = messageMeta;
        if (!key) {
            throw new Error('Message key should be defined for a key-value store');
        }
        return key;
    }
};
export const getMessagesUniqIndexesByMeta = (messagesMeta, dbType) => {
    const resultedArray = [];
    for (const messageMeta of messagesMeta) {
        resultedArray.push(getMessageUniqIndexByMeta(messageMeta, dbType));
    }
    return resultedArray;
};
export const getMessageDescriptionForMessageWithMeta = (swarmMessageWithMeta, dbType) => {
    const messageMeta = getMessageMetaForMessageWithMeta(swarmMessageWithMeta, dbType);
    return {
        messageMeta,
        messageEntry: swarmMessageWithMeta.message,
    };
};
export function _whetherSwarmMessagesDecryptedEqual(first, second) {
    if (!first || !second || first instanceof Error || second instanceof Error) {
        return false;
    }
    return (isValidSwarmMessageDecryptedFormat(first) &&
        isValidSwarmMessageDecryptedFormat(second) &&
        ifSwarmMessagesDecryptedEqual(first, second));
}
export function compareTwoSwarmMessageStoreMessagingRequestWithMetaResults(firstResult, secondResult) {
    if (firstResult === secondResult) {
        return true;
    }
    if (firstResult == null) {
        return secondResult == null;
    }
    if (secondResult == null) {
        return firstResult == null;
    }
    if (firstResult.dbName !== secondResult.dbName) {
        return false;
    }
    const firstResultSwarmMessage = firstResult.message;
    const secondResultSwarmMessage = secondResult.message;
    if (firstResultSwarmMessage === secondResultSwarmMessage) {
        return true;
    }
    if (firstResultSwarmMessage instanceof Error !== secondResultSwarmMessage instanceof Error) {
        return false;
    }
    return _whetherSwarmMessagesDecryptedEqual(firstResultSwarmMessage, secondResultSwarmMessage);
}
//# sourceMappingURL=swarm-messages-database-cache.utils.js.map