/**
 * Deley before retries of the cache update planned.
 */
export const SWARM_MESSAGES_DATABASE_CACHE_PLANNED_CACHE_UPDATE_FAILED_RETRY_DELAY_MS = 100;

/**
 * Timeout for one batch of database quering result during messsages cache update
 */
export const SWARM_MESSAGES_DATABASE_CACHE_PLANNED_CACHE_UPDATE_BATCH_TIMEOUT_MS = 100000000; //TODO - set to 100;

/**
 * Milliseconds to wait before adding messages from the pending queue to the cache
 */
export const SWARM_MESSAGES_DATABASE_CACHE_ADD_TO_CACHE_MESSAGES_PENDING_DEBOUNCE_MS = 100;

export const SWARM_MESSAGES_DATABASE_CACHE_UPDATE_ON_MESSAGE_DELETE_MS = 350;
