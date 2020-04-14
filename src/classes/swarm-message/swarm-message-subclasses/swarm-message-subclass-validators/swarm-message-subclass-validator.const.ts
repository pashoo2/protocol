/**
 * Set the default maximum value of the payload to 1000 bytes
 * or a characters for a string values.
 * It must be increased for a non-text values
 */
export const SWARM_MESSAGE_SUBCLASS_VALIDATOR_PAYLOAD_MAX_LENGTH_BYTES = 100000;

/**
 * Set the default minimum value of the payload to 2 bytes
 * or a characters for a string values.
 * It must be increased for a non-text values
 */
export const SWARM_MESSAGE_SUBCLASS_VALIDATOR_PAYLOAD_MIN_LENGTH_BYTES = 2;

/** the maximum length for the body in private messages */
export const SWARM_MESSAGE_SUBCLASS_VALIDATOR_BODY_ENCRYPTED_MAX_LENGTH_BYTES = 100000;

/** the minimum length for the body in private messages */
export const SWARM_MESSAGE_SUBCLASS_VALIDATOR_BODY_ENCRYPTED_MIN_LENGTH_BYTES = 256;
