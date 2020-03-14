import { calcCryptoKeyHash } from '../utils/encryption-keys-utils/encryption-keys-utils';
import { generatePasswordKeyByPasswordString } from '../utils/password-utils/derive-key.password-utils';
import { generateSaltString } from '../utils/encryption-utils/salt-utils';
import { expect, assert } from 'chai';

export const runTestEncryptionKeysUtils = () => {
  describe('encryption keys utils test', () => {
    it('test calcCryptoKeyHash util', async () => {
      const password = '12dfb@$M.)$#';
      let cycle = 0;

      while (cycle++ < 8) {
        const salt = generateSaltString(8);

        expect(salt).not.to.be.an('error');

        const pwdKey1 = await generatePasswordKeyByPasswordString(
          password,
          salt as string
        );
        const pwdKey2 = await generatePasswordKeyByPasswordString(
          password,
          salt as string
        );

        expect(pwdKey1).not.an('error');
        expect(pwdKey2).not.an('error');

        const pwdKey1Hash = await calcCryptoKeyHash(pwdKey1 as CryptoKey);
        const pwdKey1HashTwice = await calcCryptoKeyHash(pwdKey1 as CryptoKey);
        const pwdKey2Hash = await calcCryptoKeyHash(pwdKey2 as CryptoKey);

        expect(pwdKey1Hash).not.to.be.an('error');
        expect(pwdKey2Hash).not.to.be.an('error');
        expect(pwdKey1HashTwice).not.to.be.an('error');
        expect(pwdKey1Hash).to.be.a('string');
        expect(pwdKey2Hash).to.be.a('string');
        expect(pwdKey1HashTwice).to.be.a('string');
        assert(
          pwdKey1Hash === pwdKey1HashTwice,
          'The same keys must be resulted in the same hash'
        );
        assert(
          pwdKey1Hash === pwdKey2Hash,
          'Keys for the same password must be equal'
        );
      }
    }).timeout(20000);
  });
};
