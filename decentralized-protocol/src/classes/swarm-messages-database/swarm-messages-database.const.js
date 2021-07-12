export var ESwarmMessagesDatabaseOperation;
(function (ESwarmMessagesDatabaseOperation) {
    ESwarmMessagesDatabaseOperation["DELETE"] = "DELETE";
    ESwarmMessagesDatabaseOperation["ADD"] = "ADD";
})(ESwarmMessagesDatabaseOperation || (ESwarmMessagesDatabaseOperation = {}));
export var ESwarmMessagesDatabaseCacheEventsNames;
(function (ESwarmMessagesDatabaseCacheEventsNames) {
    ESwarmMessagesDatabaseCacheEventsNames["CACHE_UPDATED"] = "CACHE_UPDATED";
    ESwarmMessagesDatabaseCacheEventsNames["CACHE_UPDATING_STARTED"] = "CACHE_UPDATING_STARTED";
    ESwarmMessagesDatabaseCacheEventsNames["CACHE_UPDATING_OVER"] = "CACHE_UPDATING_OVER";
})(ESwarmMessagesDatabaseCacheEventsNames || (ESwarmMessagesDatabaseCacheEventsNames = {}));
export const SWARM_MESSAGES_DATABASE_MESSAGES_CACHE_ITEMS_COUNT_PER_IDLE_PERIOD_OF_50_MS = 20;
export const SWARM_MESSAGES_DATABASE_MESSAGES_CACHE_ITEMS_COUNT_LIMIT_DEFAULT = 5000;
export const SWARM_MESSAGES_DATABASE_MESSAGES_CACHE_ITEMS_MAX_PAGE_QUERY_ATTEMPTS_DEFAULT = 3;
export const SWARM_MESSAGES_DATABASE_MESSAGES_CACHE_UPDATE_RETRY_DELAY_MS = 100;
export const SWARM_MESSAGES_DATABASE_MESSAGES_EMITTED_UNIQ_ID_ADDRESS_PREFIX = 'ADDR::';
export const SWARM_MESSAGES_DATABASE_MESSAGES_MAX_ATTEMPTS_CACHE_UPDATE = 3;
//# sourceMappingURL=swarm-messages-database.const.js.map