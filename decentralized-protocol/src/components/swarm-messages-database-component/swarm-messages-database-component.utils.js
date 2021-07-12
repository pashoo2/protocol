import { ESwarmMessageStoreEventNames } from '../../classes/swarm-message-store/swarm-message-store.const';
import { ESwarmMessagesDatabaseCacheEventsNames } from '../../classes/swarm-messages-database/swarm-messages-database.const';
export const setMessageListener = (db, messagesListener) => {
    const listener = (dbName, message, messageAddress, key) => {
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
export const setMessageDeleteListener = (db, messagesDeleteListener) => {
    const listener = (dbName, userId, messageAddress, messageDeletedAddress, key) => {
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
export const setCacheUpdateListener = (db, cacheUpdateListener) => {
    const listener = (messages) => {
        cacheUpdateListener(messages);
    };
    db.emitter.addListener(ESwarmMessagesDatabaseCacheEventsNames.CACHE_UPDATED, listener);
    return () => {
        db.emitter.removeListener(ESwarmMessagesDatabaseCacheEventsNames.CACHE_UPDATED, listener);
    };
};
//# sourceMappingURL=swarm-messages-database-component.utils.js.map