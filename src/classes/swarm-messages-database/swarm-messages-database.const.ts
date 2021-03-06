export enum ESwarmMessagesDatabaseOperation {
  DELETE = 'DELETE',
  ADD = 'ADD',
}

export enum ESwarmMessagesDatabaseCacheEventsNames {
  // cache has updated with a message
  CACHE_UPDATED = 'CACHE_UPDATED',
  // full cache update has just started
  CACHE_UPDATING_STARTED = 'CACHE_UPDATING_STARTED',
  // full cache update has just ended
  CACHE_UPDATING_OVER = 'CACHE_UPDATING_OVER',
}

/**
 * TODO - add such option in the instance's options
 * This the default count of a messages items per one
 * database request.
 */
export const SWARM_MESSAGES_DATABASE_MESSAGES_CACHE_ITEMS_COUNT_PER_IDLE_PERIOD_OF_50_MS = 20;

/**
 * How many messages can be read from the database per one cache update.
 */
export const SWARM_MESSAGES_DATABASE_MESSAGES_CACHE_ITEMS_COUNT_LIMIT_DEFAULT = 5000;

/**
 * Maximum attempt count if query of an items page was failed.
 */
export const SWARM_MESSAGES_DATABASE_MESSAGES_CACHE_ITEMS_MAX_PAGE_QUERY_ATTEMPTS_DEFAULT = 3;

/**
 * Delay before the next attempt to read messages in the cache if the previous was failed.
 */
export const SWARM_MESSAGES_DATABASE_MESSAGES_CACHE_UPDATE_RETRY_DELAY_MS = 100;

/**
 * Prefix for a message's address which used as a uniq messge's identity (e.g. for DELETE
 * messages) to put into the list of messages already emitted as a new or delete
 */
export const SWARM_MESSAGES_DATABASE_MESSAGES_EMITTED_UNIQ_ID_ADDRESS_PREFIX = 'ADDR::';

/**
 * Maximum attempts to upate cache
 */
export const SWARM_MESSAGES_DATABASE_MESSAGES_MAX_ATTEMPTS_CACHE_UPDATE = 3;
