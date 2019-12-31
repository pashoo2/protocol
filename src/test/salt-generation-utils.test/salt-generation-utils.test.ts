import { expect } from 'chai';
import { isValidSalt } from '../../utils/encryption-utils/salt-utils';
import {
  SALT_GENERATION_UTILS_SALT_MAX_LENGTH_BYTES,
  SALT_GENERATION_UTILS_SALT_MIN_LENGTH_BYTES,
} from '../../utils/encryption-utils/salt-utils.const';

export function runTestSaltUtils() {
  describe('test encryption salt utils', () => {
    it('salt validation utils - should be valid', () => {
      let saltStringMinCharacters = '';
      let idx = 0;

      while (idx++ <= SALT_GENERATION_UTILS_SALT_MIN_LENGTH_BYTES) {
        saltStringMinCharacters += '1';
      }
      expect(isValidSalt(saltStringMinCharacters)).to.equal(true);

      let saltStringMaxCharacters = '';
      idx = 0;

      while (idx++ <= SALT_GENERATION_UTILS_SALT_MAX_LENGTH_BYTES) {
        saltStringMaxCharacters += '1';
      }

      expect(isValidSalt(saltStringMaxCharacters)).to.equal(true);

      const randomBytesMinValue = crypto.getRandomValues(
        new Uint8Array(SALT_GENERATION_UTILS_SALT_MIN_LENGTH_BYTES)
      );

      expect(isValidSalt(randomBytesMinValue)).to.equal(true);

      const randomBytesMaxValue = crypto.getRandomValues(
        new Uint8Array(SALT_GENERATION_UTILS_SALT_MAX_LENGTH_BYTES)
      );

      expect(isValidSalt(randomBytesMaxValue)).to.equal(true);
    });

    it('salt validation utils - shoul return false', () => {
      let saltStringMinCharacters = '';
      let idx = 0;

      while (idx++ <= SALT_GENERATION_UTILS_SALT_MIN_LENGTH_BYTES - 1) {
        saltStringMinCharacters += '1';
      }
      expect(isValidSalt(saltStringMinCharacters)).to.equal(false);

      let saltStringMaxCharacters = '';
      idx = 0;

      while (idx++ <= SALT_GENERATION_UTILS_SALT_MAX_LENGTH_BYTES + 1) {
        saltStringMaxCharacters += '1';
      }

      expect(isValidSalt(saltStringMaxCharacters)).to.equal(false);

      const randomBytesMinValue = crypto.getRandomValues(
        new Uint8Array(SALT_GENERATION_UTILS_SALT_MIN_LENGTH_BYTES - 1)
      );

      expect(isValidSalt(randomBytesMinValue)).to.equal(false);

      const randomBytesMaxValue = crypto.getRandomValues(
        new Uint8Array(SALT_GENERATION_UTILS_SALT_MAX_LENGTH_BYTES + 1)
      );

      expect(isValidSalt(randomBytesMaxValue)).to.equal(false);
    });
  });
}
