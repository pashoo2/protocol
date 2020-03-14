import { expect, assert } from 'chai';
import {
  getTimeDiffWithSyncServerSeconds,
  getCurrentDateSynced,
  getDateNowInSeconds,
} from 'utils/common-utils/common-utils-date-time-synced';
import { CONST_VALUES_RESTRICTIONS_COMMON_CURRENT_DATE_MAX_ERROR_SECONDS } from 'const/const-values-restrictions-common';
import { delay } from 'utils/common-utils/common-utils-timer';
import { DATE_TIME_COMMON_CURRENT_DATE_UPDATE_INTERVAL_SECONDS } from 'const/common-date-time/common-date-time-main';

export const runTestClientTimeSynced = () => {
  describe('common-utils-date-time-synced module tests', () => {
    describe('getTimeDiffWithSyncServerSeconds', () => {
      it('getTimeDiffWithSyncServerSeconds - not throw', () => {
        expect(() => getTimeDiffWithSyncServerSeconds()).to.not.throw();
      });
      it('getTimeDiffWithSyncServerSeconds - return a number', () => {
        expect(getTimeDiffWithSyncServerSeconds()).to.be.a('number');
      });
      it(`getTimeDiffWithSyncServerSeconds - return a number equals to zero or greater than ${CONST_VALUES_RESTRICTIONS_COMMON_CURRENT_DATE_MAX_ERROR_SECONDS}`, () => {
        const timeDiffSeconds = getTimeDiffWithSyncServerSeconds();

        assert(
          timeDiffSeconds === 0 ||
            timeDiffSeconds >
              CONST_VALUES_RESTRICTIONS_COMMON_CURRENT_DATE_MAX_ERROR_SECONDS,
          'The time difference with the server must equal to 0 or be greater than the maximum error allowed'
        );
      });
      it(`getTimeDiffWithSyncServerSeconds - return a number equals to a previous if called sync`, () => {
        const timeDiffSeconds = getTimeDiffWithSyncServerSeconds();
        const timeDiffSecondsNext = getTimeDiffWithSyncServerSeconds();

        expect(timeDiffSeconds).to.equal(timeDiffSecondsNext);
      });
    });

    describe('getCurrentDateSynced', () => {
      it('getCurrentDateSynced - should return the same Date object each sync call', () => {
        const date1 = getCurrentDateSynced();
        const date2 = getCurrentDateSynced();
        const date3 = getCurrentDateSynced();

        assert(
          date1 === date2,
          'dates (date1===date2) must be the same on each call'
        );
        assert(
          date1 === date3,
          'dates (date1===date2) must be the same on each call'
        );
      });
      it('getCurrentDateSynced - should not returns the same object after some delay', async () => {
        const date1 = getCurrentDateSynced();

        await delay(
          (DATE_TIME_COMMON_CURRENT_DATE_UPDATE_INTERVAL_SECONDS + 1) * 1000
        );

        const date2 = getCurrentDateSynced();
        const date3 = getCurrentDateSynced();

        assert(
          date1 !== date2,
          'dates shoulf not be the same after some delay since the last call'
        );
        assert(date2 === date3, 'dates shoulf be the same each sync call');
      }).timeout(4000);
    });

    describe('getCurrentDateSynced', () => {
      it('getDateNowInSeconds - should return the same number each sync call', () => {
        const date1 = getDateNowInSeconds();
        const date2 = getDateNowInSeconds();
        const date3 = getDateNowInSeconds();

        assert(
          date1 === date2,
          'dates (date1===date2) must be the same on each call'
        );
        assert(
          date1 === date3,
          'dates (date1===date2) must be the same on each call'
        );
      });

      it('getDateNowInSeconds - should not returns the same number after some delay', async () => {
        const date1 = getDateNowInSeconds();

        await delay(
          (DATE_TIME_COMMON_CURRENT_DATE_UPDATE_INTERVAL_SECONDS + 2) * 1000
        );

        const date2 = getDateNowInSeconds();
        const date3 = getDateNowInSeconds();

        assert(
          date1 !== date2,
          'dates shoulf not be the same after some delay since the last call'
        );
        assert(date2 === date3, 'dates shoulf be the same each sync call');
      }).timeout(4000);
    });
  });
};
