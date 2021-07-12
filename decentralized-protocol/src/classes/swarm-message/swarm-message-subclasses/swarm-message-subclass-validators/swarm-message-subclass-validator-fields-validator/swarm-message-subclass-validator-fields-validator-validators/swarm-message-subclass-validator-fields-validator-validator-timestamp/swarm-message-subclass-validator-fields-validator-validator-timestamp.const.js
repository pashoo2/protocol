import { CONST_VALIDATION_VALUES_TIMESTAMP_UNIX_MIN_S } from "../../../../../../../const/const-validation-values/const-validation-values-messaging-date";
import { getDateNowInSeconds } from "../../../../../../../utils";
import { CONST_VALUES_RESTRICTIONS_COMMON_CURRENT_DATE_MAX_ERROR_SECONDS } from "../../../../../../../const/const-values-restrictions-common";
export const SWARM_MESSAGE_SUBCLASS_VALIDATOR_TIMESTAMP_MAX_TIME_TO_LIVE_SECONDS = 24 * 60 * 60;
export const SWARM_MESSAGE_SUBCLASS_VALIDATOR_TIMESTAMP_OPTIONS_DEFAULT = {
    ttl: SWARM_MESSAGE_SUBCLASS_VALIDATOR_TIMESTAMP_MAX_TIME_TO_LIVE_SECONDS,
    minValue: CONST_VALIDATION_VALUES_TIMESTAMP_UNIX_MIN_S,
    get maxValue() {
        return getDateNowInSeconds();
    },
    maxDiffErrorSeconds: CONST_VALUES_RESTRICTIONS_COMMON_CURRENT_DATE_MAX_ERROR_SECONDS,
};
//# sourceMappingURL=swarm-message-subclass-validator-fields-validator-validator-timestamp.const.js.map