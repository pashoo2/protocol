export enum ESwarmMessagesDatabaseCacheEventsNames {
  CACHE_UPDATING = 'CACHE_UPDATING',
  CACHE_UPDATED = 'CACHE_UPDATED',
}

/**
 * TODO - add such option in the instance's options
 * This the default count of a messages items per one
 * database request.
 */
export const SWARM_MESSAGES_DATABASE_MESSAGES_CACHE_ITEMS_COUNT_PER_PAGE_DEFAULT = 20;

/**
 * How many messages can be read from the database per one cache update.
 */
export const SWARM_MESSAGES_DATABASE_MESSAGES_CACHE_ITEMS_COUNT_LIMIT_DEFAULT = 500;

/**
 * Maximum attempt count if query of an items page was failed.
 */
export const SWARM_MESSAGES_DATABASE_MESSAGES_CACHE_ITEMS_MAX_PAGE_QUERY_ATTEMPTS_DEFAULT = 3;

/**
 * Delay before the next attempt to read messages in the cache if the previous was failed.
 */
export const SWARM_MESSAGES_DATABASE_MESSAGES_CACHE_UPDATE_RETRY_DELAY_MS = 100;
