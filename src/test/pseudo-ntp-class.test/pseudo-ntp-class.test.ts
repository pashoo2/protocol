import { expect } from 'chai';
import { PseudoNTPClass } from 'classes/pseudo-ntp-class/pseudo-ntp-class';
import { PSEUDO_NTP_CLASS_SERVERS_POOL } from './pseudo-ntp-class.test.const';

export const runTestPseudoNtpClass = () => {
  describe('Tests for pseudo ntp class', () => {
    it('Check constructor not failed the defaults', () => {
      expect(
        () =>
          new PseudoNTPClass({
            serversPool: [...PSEUDO_NTP_CLASS_SERVERS_POOL],
          })
      ).to.not.throw();
    });

    it('Check call of the start() method not failed', () => {
      const pseudoNTP = new PseudoNTPClass({
        serversPool: [...PSEUDO_NTP_CLASS_SERVERS_POOL],
      });

      expect(() => pseudoNTP.start()).not.to.throw();
    });

    it(`Check the event ${PseudoNTPClass.Event.TIME_SYNC} emitted`, async () => {
      const maxOffsetSeconds = 10;
      const syncIntervalS = 10;
      const pseudoNTP = new PseudoNTPClass({
        serversPool: [...PSEUDO_NTP_CLASS_SERVERS_POOL],
        maxOffsetErrorS: maxOffsetSeconds,
        syncIntervalS,
      });
      const eventName = PseudoNTPClass.Event.TIME_SYNC;

      expect(() => pseudoNTP.start()).not.to.throw();
      await expect(
        new Promise((res, rej) => {
          const timeout = setTimeout(() => {
            pseudoNTP.removeAllListeners(eventName);
            rej(new Error('Timed out'));
          }, syncIntervalS * 1000);
          pseudoNTP.addListener(eventName, (diffSeconds) => {
            if (timeout) {
              clearTimeout(timeout);
            }
            if (diffSeconds > maxOffsetSeconds) {
              res(diffSeconds);
            } else {
              rej(new Error('The difference is less than the maximum error'));
            }
          });
        })
      ).to.eventually.fulfilled.with.a('number');
    }).timeout(60000);

    it(`Check the event ${PseudoNTPClass.Event.TIME_SYNC} emitted multiple times during an interval`, async () => {
      const mustCalledTimes = 3;
      const maxOffsetSeconds = 10;
      const syncIntervalS = 3;
      const pseudoNTP = new PseudoNTPClass({
        serversPool: [...PSEUDO_NTP_CLASS_SERVERS_POOL],
        maxOffsetErrorS: maxOffsetSeconds,
        syncIntervalS,
      });
      const eventName = PseudoNTPClass.Event.TIME_SYNC;
      let timesEmitted = 0;

      expect(() => pseudoNTP.start()).not.to.throw();
      await expect(
        new Promise((res, rej) => {
          const timeout = setTimeout(() => {
            pseudoNTP.removeAllListeners(eventName);
            rej(new Error('Timed out'));
          }, syncIntervalS * 1000 * (mustCalledTimes + 1));
          pseudoNTP.addListener(eventName, () => {
            timesEmitted += 1;
            if (timesEmitted >= mustCalledTimes) {
              res();
            }
          });
        })
      ).to.eventually.fulfilled;
    }).timeout(120000);
  });
};
