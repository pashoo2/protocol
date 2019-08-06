export const CENTRAL_AUTHORITY_STORAGE_CREDENTIALS_STATUS = {
  NEW: 'NEW',
  CONNECTING: 'CONNECTING', // connecting to the secret storage
  CONNECTED: 'CONNECTED', // connected to the secret storage
  CONNECTION_FAILED: 'CONNECTION FAILED', // connection to the secret storage was failed by any reason
  ERROR: 'ERROR', // any error caused by a method execution
  PENDING: 'PENDING', // pending for any async operation and can't do any other operation till the current operation not ended up
};

export const CENTRAL_AUTHORITY_STORAGE_CREDENTIALS_KEYS_PREFIX = '____CASC';

/**
 * under this key all the main credentials:
 * 1) public encryption key - used for encrypt a messages directly for this key owner
 * 2) private encryption key - used to decrypt an encrypted by the public key messages
 * 3) data sign public key - this key is used by another users to verify a sign of a message
 * 4) data sign private key - this key is used by the key owner to sign a data
 * 5) user id - the global unique identity of the user in the network
 */
export const CENTRAL_AUTHORITY_STORAGE_CREDENTIALS_KEY_MAIN_CREDENTIALS = `${CENTRAL_AUTHORITY_STORAGE_CREDENTIALS_KEYS_PREFIX}_MAIN_CREDENTIALS`;
