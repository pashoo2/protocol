import defaultsDeep from 'lodash.defaultsdeep';
import {
  TSwarmMessageTimestampSerialized,
  ISwarmMessageTimestampValidationOptions,
} from './swarm-message-subclass-validator-fields-validator-validator-timestamp.types';
import assert from 'assert';
import { getDateNowInSeconds } from 'utils/common-utils/common-utils-date-time-synced';
import { SWARM_MESSAGE_SUBCLASS_VALIDATOR_TIMESTAMP_OPTIONS_DEFAULT } from './swarm-message-subclass-validator-fields-validator-validator-timestamp.const';

/**
 * validate the timestamp format and
 * check whether it within the ttl defined
 * if ttlSeconds <= 0 than time to live
 * will not be validated
 *
 * @param {number} timestamp
 * @throws
 */
function validateTimestamp(
  timestamp: TSwarmMessageTimestampSerialized,
  options: Required<ISwarmMessageTimestampValidationOptions>
): void {
  assert(timestamp != null, 'Timestamp must be defined');
  if (typeof timestamp !== 'number') {
    assert.fail('Timestamp must be a number');
    return;
  }
  assert(Number.isInteger(timestamp), `Timestamp must be an integer`);

  const { maxDiffErrorSeconds, ttlSeconds, minValue, maxValue } = options;
  const currentTimestampSeconds = getDateNowInSeconds();

  if (ttlSeconds > 0 && timestamp < currentTimestampSeconds) {
    assert(
      currentTimestampSeconds - timestamp - maxDiffErrorSeconds < ttlSeconds,
      'The message was expired'
    );
  }
  assert(
    timestamp + maxDiffErrorSeconds > minValue,
    `Timestamp must be greater than ${minValue}`
  );
  assert(
    timestamp - maxDiffErrorSeconds < maxValue,
    `Timestamp must be less than ${maxValue}`
  );
}

export default (options?: ISwarmMessageTimestampValidationOptions) => (
  timestamp: TSwarmMessageTimestampSerialized
) =>
  validateTimestamp(
    timestamp,
    defaultsDeep(
      options,
      SWARM_MESSAGE_SUBCLASS_VALIDATOR_TIMESTAMP_OPTIONS_DEFAULT
    )
  );
