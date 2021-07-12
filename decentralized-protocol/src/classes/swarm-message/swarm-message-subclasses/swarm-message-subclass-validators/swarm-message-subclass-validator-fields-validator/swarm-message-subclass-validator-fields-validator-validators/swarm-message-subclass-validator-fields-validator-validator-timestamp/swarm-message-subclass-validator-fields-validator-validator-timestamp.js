import defaultsDeep from 'lodash.defaultsdeep';
import assert from 'assert';
import { getDateNowInSeconds } from "../../../../../../../utils";
import { SWARM_MESSAGE_SUBCLASS_VALIDATOR_TIMESTAMP_OPTIONS_DEFAULT } from './swarm-message-subclass-validator-fields-validator-validator-timestamp.const';
function validateTimestamp(timestamp, options) {
    assert(timestamp != null, 'Timestamp must be defined');
    if (typeof timestamp !== 'number') {
        assert.fail('Timestamp must be a number');
        return;
    }
    assert(Number.isInteger(timestamp), `Timestamp must be an integer`);
    const { maxDiffErrorSeconds, ttlSeconds, minValue, maxValue } = options;
    const currentTimestampSeconds = getDateNowInSeconds();
    if (ttlSeconds > 0 && timestamp < currentTimestampSeconds) {
        assert(currentTimestampSeconds - timestamp - maxDiffErrorSeconds < ttlSeconds, 'The message was expired');
    }
    assert(timestamp + maxDiffErrorSeconds > minValue, `Timestamp must be greater than ${minValue}`);
    assert(timestamp - maxDiffErrorSeconds < maxValue, `Timestamp must be less than ${maxValue}`);
}
export const createValidateTimestamp = (options) => (timestamp) => validateTimestamp(timestamp, defaultsDeep(options, SWARM_MESSAGE_SUBCLASS_VALIDATOR_TIMESTAMP_OPTIONS_DEFAULT));
//# sourceMappingURL=swarm-message-subclass-validator-fields-validator-validator-timestamp.js.map