import { getDateNowInSeconds } from "./..";
import { CONST_VALIDATION_VALUES_TIMESTAMP_UNIX_MIN_S } from "../../const/const-validation-values/const-validation-values-messaging-date";
export function validateUtilsTimestampNewMessage(timestampSeconds) {
    if (!timestampSeconds) {
        return new Error('Timestamp of a message must be defined');
    }
    if (typeof timestampSeconds !== 'number') {
        return new Error('Timestamp of a message must be a number');
    }
    if (timestampSeconds < CONST_VALIDATION_VALUES_TIMESTAMP_UNIX_MIN_S) {
        return new Error('The timestamp is less than the minimal valid timestamp');
    }
    if (timestampSeconds > getDateNowInSeconds()) {
        return new Error('The timestamp is greater than the maximum valid timestamp');
    }
    return true;
}
//# sourceMappingURL=validation-utils-timestamp.js.map