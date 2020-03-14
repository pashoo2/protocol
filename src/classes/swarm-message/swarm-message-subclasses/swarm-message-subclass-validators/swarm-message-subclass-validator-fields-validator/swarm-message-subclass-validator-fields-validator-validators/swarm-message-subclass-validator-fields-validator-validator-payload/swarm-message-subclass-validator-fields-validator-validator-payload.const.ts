import {
  SWARM_MESSAGE_SUBCLASS_VALIDATOR_PAYLOAD_MAX_LENGTH_BYTES,
  SWARM_MESSAGE_SUBCLASS_VALIDATOR_PAYLOAD_MIN_LENGTH_BYTES,
} from 'classes/swarm-message/swarm-message-subclasses/swarm-message-subclass-validators/swarm-message-subclass-validator.const';

export const SwarmMessagePayloadValidationOptionsDefault = {
  payloadMaxLengthBytes: SWARM_MESSAGE_SUBCLASS_VALIDATOR_PAYLOAD_MAX_LENGTH_BYTES,
  payloadMinLengthBytes: SWARM_MESSAGE_SUBCLASS_VALIDATOR_PAYLOAD_MIN_LENGTH_BYTES,
};
