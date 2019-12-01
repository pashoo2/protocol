import { expect } from 'chai';
import {
  DATE_MIN_NOT_VALID,
  DATE_MIN_VALID,
} from './validation-messaging.test.const';
import { validateUtilsTimestampNewMessage } from 'utils/validation-utils/validation-utils-timestamp';
import { getSecondsByMilliseconds } from 'utils/common-utils/common-utils-date-time';

export const runTestValidateMessagingTimestampsTest = () => {
  describe('validation of messages timestamps test', () => {
    it('validation of the minimum timestamp value - should return error', () => {
      const timestampMinNotValid = getSecondsByMilliseconds(
        DATE_MIN_NOT_VALID.getTime()
      );
      const result = validateUtilsTimestampNewMessage(timestampMinNotValid);

      expect(result)
        .to.be.an('error')
        .which.haveOwnProperty(
          'message',
          'The timestamp is less than the minimal valid timestamp'
        );
    });

    it('validation of the minimum timestamp value - should return true', () => {
      const timestampMinValid = getSecondsByMilliseconds(
        DATE_MIN_VALID.getTime()
      );
      const result = validateUtilsTimestampNewMessage(timestampMinValid);

      expect(result).to.be.equal(true);
    });

    it('validation of the minimum timestamp value - should return error to zero', () => {
      const result = validateUtilsTimestampNewMessage(0);

      expect(result)
        .to.be.an('error')
        .which.haveOwnProperty(
          'message',
          'Timestamp of a message must be defined'
        );
    });
  });
};
