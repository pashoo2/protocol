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

/**
 * A minimal count to read before stop the cache update process if the last batch returned
 * SWARM_MESSAGES_DATABASE_EXPECTED_RESULTED_NEW_MESSAGES_READ_AT_THE_BATCH_COUNT_EXPECTED_TO_STOP_PROCESS
 * messages
 */
export const SWARM_MESSAGES_DATABASE_CACHE_EXPECTED_MESSAGES_OVERALL_TO_READ_AT_THE_BATCH_MIN_COUNT_BEFORE_STOP_CAHCHE_UPDATE = 50;

/**
 * The minimal messages count expected to read at the batch to stop the cache update
 */
export const SWARM_MESSAGES_DATABASE_EXPECTED_NEW_MESSAGES_TO_READ_AT_THE_BATCH_MIN_COUNT_BEFORE_STOP_CAHCHE_UPDATE = 6;

/**
 * This messages count is expected to read from the database at the last batch of cache update to decide that all
 * messages were read from the database.
 */
export const SWARM_MESSAGES_DATABASE_EXPECTED_RESULTED_NEW_MESSAGES_READ_AT_THE_BATCH_COUNT_EXPECTED_TO_STOP_PROCESS = 0;
