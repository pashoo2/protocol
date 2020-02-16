import { expect } from 'chai';
import { CentralAuthority } from '../../classes/central-authority-class/central-authority-class';
import { ICentralAuthority } from '../../classes/central-authority-class/central-authority-class.types';
import { CA_CLASS_OPTIONS_VALID_NO_PROFILE } from 'test/central-authority.test/central-authority-class.test/central-authority-class.test.const.shared';
import { SwarmMessageConstructor } from '../../classes/swarm-message/swarm-message-constructor';

export const runSwarmMessageConstructorTests = () => {
  describe('SwarmMessageConstructor tests', async () => {
    let caConnection: ICentralAuthority;

    before(async () => {
      caConnection = new CentralAuthority();

      const result = await caConnection.connect(
        CA_CLASS_OPTIONS_VALID_NO_PROFILE
      );

      expect(result).not.to.be.an.instanceof(Error);
      expect(caConnection.isRunning).to.equal(true);
    });

    describe('SwarmMessageConstructor constructor tests', () => {
      test('SwarmMessageConstructor with no options should throw', () => {
        expect(() => new (SwarmMessageConstructor as any)()).to.throw();
      });
      test('SwarmMessageConstructor with empty object instead of options should throw', () => {
        expect(() => new (SwarmMessageConstructor as any)({})).to.throw();
      });
      test('SwarmMessageConstructor only with the "caConnection" options should not throw', () => {
        expect(
          () =>
            new SwarmMessageConstructor({
              caConnection,
            })
        ).to.throw();
      });
    });
  });
};
