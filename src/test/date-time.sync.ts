import {
    expect,
} from 'chai';
import { getNetworkTime } from 'utils/common-utils/common-utils-date-sync';

export const runDateTimeSyncTest = () => {
    describe('Date time sync test', async () => {
        it('get date time from NTP server', async () => {
            let idx = 0;
            while((idx += 1) < 10) {
                await expect(getNetworkTime()).to.eventually.fulfilled.not.to.be.an('error');
            }
        })
    })
}