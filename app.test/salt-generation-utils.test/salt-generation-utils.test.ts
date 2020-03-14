import { TSaltUtilsSaltType } from '../../utils/encryption-utils/salt-utils.types';
import {
  importSalt,
  generateSalt,
  generateSaltNative,
  generateSaltString,
} from '../../utils/encryption-utils/salt-utils';
import { expect } from 'chai';
import { isValidSalt } from '../../utils/encryption-utils/salt-utils';
import {
  SALT_GENERATION_UTILS_SALT_MAX_LENGTH_BYTES,
  SALT_GENERATION_UTILS_SALT_MIN_LENGTH_BYTES,
} from '../../utils/encryption-utils/salt-utils.const';
import { crypto } from '../../utils/data-sign-utils/main.data-sign-utils.const';

export function runTestSaltUtils() {
  describe('test encryption salt utils', () => {
    it('salt validation utils - should be valid', () => {
      let saltStringMinCharacters = '';
      let idx = 0;

      while (idx++ < SALT_GENERATION_UTILS_SALT_MIN_LENGTH_BYTES) {
        saltStringMinCharacters += '1';
      }
      expect(isValidSalt(saltStringMinCharacters)).to.equal(true);

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
      let saltStringMaxCharacters = '';
      let idx = 0;

      while (idx++ < SALT_GENERATION_UTILS_SALT_MAX_LENGTH_BYTES + 1) {
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

    it('salt generation utils - should generate a valid salt', () => {
      const saltGeneratedMinLenght = generateSalt(
        SALT_GENERATION_UTILS_SALT_MIN_LENGTH_BYTES
      );

      expect(saltGeneratedMinLenght).to.be.a('Uint8Array');
      expect(isValidSalt(saltGeneratedMinLenght)).to.equal(true);

      const saltGeneratedMaxLenght = generateSalt(
        SALT_GENERATION_UTILS_SALT_MAX_LENGTH_BYTES
      );

      expect(saltGeneratedMaxLenght).to.be.a('Uint8Array');
      expect(isValidSalt(saltGeneratedMaxLenght)).to.equal(true);
    });

    it('salt generation utils - return an Error cause the length is not in the valid interval', () => {
      const saltGeneratedMinLenght = generateSalt(
        SALT_GENERATION_UTILS_SALT_MIN_LENGTH_BYTES - 1
      );

      expect(saltGeneratedMinLenght).to.be.a('Error');
      expect(isValidSalt(saltGeneratedMinLenght)).to.equal(false);

      const saltGeneratedMaxLenght = generateSalt(
        SALT_GENERATION_UTILS_SALT_MAX_LENGTH_BYTES + 1
      );

      expect(saltGeneratedMaxLenght).to.be.a('Error');
      expect(isValidSalt(saltGeneratedMaxLenght)).to.equal(false);
    });

    it('salt generation utils - generate salt with not valid length - should return false on valildation', () => {
      const saltGeneratedMinLenght = generateSaltNative(
        SALT_GENERATION_UTILS_SALT_MIN_LENGTH_BYTES - 1
      );

      expect(isValidSalt(saltGeneratedMinLenght)).to.equal(false);

      const saltGeneratedMaxLenght = generateSaltNative(
        SALT_GENERATION_UTILS_SALT_MAX_LENGTH_BYTES + 1
      );

      expect(isValidSalt(saltGeneratedMaxLenght)).to.equal(false);
    });

    it('salt generation utils - generate salt string should return a valid salt', () => {
      const saltGeneratedMinLenght = generateSaltString(
        SALT_GENERATION_UTILS_SALT_MIN_LENGTH_BYTES
      );

      expect(saltGeneratedMinLenght).to.be.a('string');
      expect(isValidSalt(saltGeneratedMinLenght)).to.equal(true);

      const saltGeneratedMaxLenght = generateSaltString(
        SALT_GENERATION_UTILS_SALT_MAX_LENGTH_BYTES
      );

      expect(saltGeneratedMaxLenght).to.be.a('string');
      expect(isValidSalt(saltGeneratedMaxLenght)).to.equal(true);
    });

    it('salt generation utils - generate salt string with a length which is not in the valid interval should return Error', () => {
      const saltGeneratedMinLenght = generateSaltString(
        SALT_GENERATION_UTILS_SALT_MIN_LENGTH_BYTES - 1
      );

      expect(saltGeneratedMinLenght).to.be.a('Error');
      expect(isValidSalt(saltGeneratedMinLenght)).to.equal(false);

      const saltGeneratedMaxLenght = generateSaltString(
        SALT_GENERATION_UTILS_SALT_MAX_LENGTH_BYTES + 1
      );

      expect(saltGeneratedMaxLenght).to.be.a('Error');
      expect(isValidSalt(saltGeneratedMaxLenght)).to.equal(false);
    });

    it('salt import utils - should import salt string as an instance of UInt8Array', () => {
      const saltGeneratedMinLenght = generateSaltString(
        SALT_GENERATION_UTILS_SALT_MIN_LENGTH_BYTES
      );

      expect(saltGeneratedMinLenght).to.be.a('string');
      expect(isValidSalt(saltGeneratedMinLenght)).to.equal(true);

      const saltGeneratedMaxLenght = generateSaltString(
        SALT_GENERATION_UTILS_SALT_MAX_LENGTH_BYTES
      );

      expect(saltGeneratedMaxLenght).to.be.a('string');
      expect(isValidSalt(saltGeneratedMaxLenght)).to.equal(true);

      const saltGeneratedMinLenghtUInt8Array = importSalt(
        saltGeneratedMinLenght as TSaltUtilsSaltType
      );

      expect(saltGeneratedMinLenghtUInt8Array).to.be.a('Uint8Array');
      expect(isValidSalt(saltGeneratedMinLenghtUInt8Array)).to.equal(true);

      const saltGeneratedMaxLenghtUInt8Array = importSalt(
        saltGeneratedMinLenght as TSaltUtilsSaltType
      );

      expect(saltGeneratedMaxLenghtUInt8Array).to.be.a('Uint8Array');
      expect(isValidSalt(saltGeneratedMaxLenghtUInt8Array)).to.equal(true);
    });

    it('salt import utils - should import salt Uint8Array as an instance of UInt8Array', () => {
      const saltGeneratedMinLenght = generateSalt(
        SALT_GENERATION_UTILS_SALT_MIN_LENGTH_BYTES
      );

      expect(isValidSalt(saltGeneratedMinLenght)).to.equal(true);

      const saltGeneratedMaxLenght = generateSalt(
        SALT_GENERATION_UTILS_SALT_MAX_LENGTH_BYTES
      );

      expect(isValidSalt(saltGeneratedMaxLenght)).to.equal(true);

      const saltGeneratedMinLenghtUInt8Array = importSalt(
        saltGeneratedMinLenght as TSaltUtilsSaltType
      );

      expect(saltGeneratedMinLenghtUInt8Array).to.be.a('Uint8Array');
      expect(isValidSalt(saltGeneratedMinLenghtUInt8Array)).to.equal(true);

      const saltGeneratedMaxLenghtUInt8Array = importSalt(
        saltGeneratedMinLenght as TSaltUtilsSaltType
      );

      expect(saltGeneratedMaxLenghtUInt8Array).to.be.a('Uint8Array');
      expect(isValidSalt(saltGeneratedMaxLenghtUInt8Array)).to.equal(true);
    });
  });
}
