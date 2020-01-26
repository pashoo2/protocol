import { expect } from 'chai';
import { CentralAuthority } from '../../../classes/central-authority-class/central-authority-class';
import {
  CA_CLASS_OPTIONS_VALID_NO_PROFILE,
  CA_CLASS_OPTIONS_VALID_WITH_PROFILE,
} from './central-authority-class.test.const';
import {
  CA_CLASS_OPTIONS_NOT_VALID_PROVIDERS,
  CA_CLASS_OPTIONS_NOT_VALID_USER_CREDENTIALS,
} from './central-authority-class.test.const';

export const runTestCentralAuthority = () => {
  describe('Test central authority class', () => {
    describe('test central authrority class creation and connection', () => {
      it('create new instance must not throw an error', () => {
        expect(() => {
          new CentralAuthority();
        }).not.to.throw();
      });
      it('instance created must be instance of CentralAuthority', () => {
        expect(new CentralAuthority()).to.be.an.instanceof(CentralAuthority);
      });
      describe('tests of the Connct method for connecting to the central authority', () => {
        let caConnection: CentralAuthority;
        beforeEach(() => {
          caConnection = new CentralAuthority();
        });

        it('connect method with no options should not throw and must return an error', async () => {
          expect(caConnection).to.be.an.instanceof(CentralAuthority);
          expect(() => (caConnection as any).connect()).not.to.throw();
          await expect(
            (caConnection as any).connect()
          ).eventually.be.an.instanceof(Error);
        });

        it('connect method with not valid options should not throw and must return an error', async () => {
          expect(caConnection).to.be.an.instanceof(CentralAuthority);
          // error must be returned after the options validation
          expect(() => (caConnection as any).connect({})).not.to.throw();
          expect(caConnection.isRunning).to.be.equal(false);
          await expect(
            (caConnection as any).connect({})
          ).to.eventually.be.an.instanceOf(Error);
          expect(caConnection.isRunning).to.be.equal(false);
          await expect(
            caConnection.connect(CA_CLASS_OPTIONS_NOT_VALID_PROVIDERS)
          ).to.eventually.be.an.instanceOf(Error);
          expect(caConnection.isRunning).to.be.equal(false);
          await expect(
            caConnection.connect(CA_CLASS_OPTIONS_NOT_VALID_USER_CREDENTIALS)
          ).to.eventually.be.an.instanceOf(Error);
          expect(caConnection.isRunning).to.be.equal(false);
        }).timeout(30000);

        it('connect method with a valid options should not throw and must not return an error', async () => {
          expect(caConnection).to.be.an.instanceof(CentralAuthority);
          expect(caConnection.isRunning).to.be.equal(false);
          // error must be returned after the options validation
          await expect(
            caConnection.connect(CA_CLASS_OPTIONS_VALID_NO_PROFILE)
          ).to.eventually.not.be.an.instanceOf(Error);
          expect(caConnection.isRunning).to.be.equal(true);
          await expect(caConnection.disconnect()).eventually.not.to.be.an(
            'Error'
          );
        }).timeout(10000);

        it('connect method with a valid options and the user profile data should not throw and must not return an error', async () => {
          expect(caConnection).to.be.an.instanceof(CentralAuthority);
          expect(caConnection.isRunning).to.be.equal(false);
          // error must be returned after the options validation
          await expect(
            caConnection.connect(CA_CLASS_OPTIONS_VALID_WITH_PROFILE)
          ).to.eventually.not.be.an.instanceOf(Error);
          expect(caConnection.isRunning).to.be.equal(true);
          await expect(caConnection.disconnect()).eventually.not.to.be.an(
            'Error'
          );
        }).timeout(10000);
      });
    });
  });
};
