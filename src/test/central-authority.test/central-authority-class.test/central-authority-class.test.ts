import { expect } from 'chai';
import { isCryptoKeyPair } from 'utils/encryption-keys-utils/encryption-keys-utils';

import { CentralAuthority } from '../../../classes/central-authority-class/central-authority-class';
import {
  CA_SWARM_USER_CRYPTO_KEY_DATA_ENCRYPTION_PRIVATE_USAGES,
  CA_SWARM_USER_CRYPTO_KEY_DATA_ENCRYPTION_PUBLIC_USAGES,
  CA_SWARM_USER_CRYPTO_KEY_DATA_SIGN_PRIVATE_USAGES,
  CA_SWARM_USER_CRYPTO_KEY_DATA_SIGN_PUBLIC_USAGES,
} from '../../../classes/central-authority-class/central-authority-class-const/central-authority-class-const-crypto-keys-usages';
import { importCryptoCredentialsFromAString } from '../../../classes/central-authority-class/central-authority-utils-common/central-authority-utils-crypto-credentials/central-authority-utils-crypto-credentials';
import { checkIsValidExportedCryptoCredentialsToString } from '../../../classes/central-authority-class/central-authority-validators/central-authority-validators-crypto-keys/central-authority-validators-crypto-keys';
import { isCryptoKeyIncludesUsages } from '../../../utils/encryption-keys-utils/encryption-keys-utils';
import {
  CA_CLASS_OPTIONS_VALID_NO_PROFILE,
  CA_CLASS_OPTIONS_NOT_VALID_PROVIDERS,
  CA_CLASS_OPTIONS_NOT_VALID_USER_CREDENTIALS,
} from './central-authority-class.test.const';
import { checkIsValidCryptoCredentials } from '../../../classes/central-authority-class/central-authority-validators/central-authority-validators-crypto-keys/central-authority-validators-crypto-keys';
import {
  CA_CLASS_USER_IDENTITY_NOT_VALID_NO_DELIMETER,
  CA_CLASS_USER_IDENTITY_NOT_VALID_NO_VERSION,
  CA_CLASS_USER_IDENTITY_NOT_VALID_NO_AUTH_PROVIDER_URL,
  CA_CLASS_USER_IDENTITY_NOT_VALID_NO_USER_IDENTITY,
} from './central-authority-class.test.const';
import {
  CA_SWARM_CREDENTIALS_PROVIDER_TEST_USERIDENTITY,
  CA_SWARM_CREDENTIALS_PROVIDER_TEST_USERIDENTITY_SECOND,
} from '../central-authority-swarm-credentials-provider/central-authority-swarm-credentials-provider.const';
import { TCentralAuthorityUserCryptoCredentials } from '../../../classes/central-authority-class/central-authority-class-types/central-authority-class-types-crypto-credentials';
import { validateUserIdentity } from '../../../classes/central-authority-class/central-authority-validators/central-authority-validators-auth-credentials/central-authority-validators-auth-credentials';
import {
  getDataEncryptionPubKeyByCryptoCredentials,
  getDataSignPubKeyByCryptoCredentials,
} from '../../../classes/central-authority-class/central-authority-utils-common/central-authority-utils-crypto-credentials/central-authority-utils-crypto-credentials-crypto-keys';
import {
  CA_CLASS_OPTIONS_VALID_WITH_PROFILE,
  CA_CLASS_USER_IDENTITY_NOT_EXISTS_AUTH_PROVIDER_YARU,
  CA_CLASS_USER_IDENTITY_NOT_EXISTS_AUTH_PROVIDER_MAILRU,
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
      describe('tests of the Connct and Disconnect methods for connecting to the central authority', () => {
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
          expect(caConnection.isRunning).to.be.equal(false);
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
          expect(caConnection.isRunning).to.be.equal(false);
        }).timeout(10000);
      });

      describe('test of a methods to get swarm users credentials', () => {
        let caConnection: CentralAuthority;
        const context = {} as any;
        beforeEach(async function() {
          this.timeout(10000);
          caConnection = new CentralAuthority();
          await expect(
            caConnection.connect(CA_CLASS_OPTIONS_VALID_NO_PROFILE)
          ).to.eventually.not.be.an.instanceof(Error);
          expect(caConnection.isRunning).to.be.equal(true);
        });
        afterEach(async function() {
          this.timeout(10000);
          expect(caConnection).to.be.an.instanceof(CentralAuthority);
          await expect(
            caConnection.disconnect()
          ).to.eventually.not.be.an.instanceof(Error);
          expect(caConnection.isRunning).to.be.equal(false);
        });
        it('check getSwarmUserCredentials method user identity not exists auth providers', async () => {
          expect(caConnection).to.be.an.instanceof(CentralAuthority);
          expect(caConnection.isRunning).to.be.equal(true);
          await expect(
            (caConnection as any).getSwarmUserCredentials(
              CA_CLASS_USER_IDENTITY_NOT_EXISTS_AUTH_PROVIDER_YARU
            )
          ).to.eventually.be.an.instanceOf(Error);
          await expect(
            (caConnection as any).getSwarmUserCredentials(
              CA_CLASS_USER_IDENTITY_NOT_EXISTS_AUTH_PROVIDER_MAILRU
            )
          ).to.eventually.be.an.instanceOf(Error);
        }).timeout(10000);

        it('check getSwarmUserCredentials method user identity not valid', async () => {
          expect(caConnection).to.be.an.instanceof(CentralAuthority);
          expect(caConnection.isRunning).to.be.equal(true);
          await expect(
            (caConnection as any).getSwarmUserCredentials()
          ).to.eventually.be.an.instanceOf(Error);
          await expect(
            (caConnection as any).getSwarmUserCredentials('')
          ).to.eventually.be.an.instanceOf(Error);
          await expect(
            (caConnection as any).getSwarmUserCredentials({})
          ).to.eventually.be.an.instanceOf(Error);
          await expect(
            (caConnection as any).getSwarmUserCredentials(
              CA_CLASS_USER_IDENTITY_NOT_VALID_NO_DELIMETER
            )
          ).to.eventually.be.an.instanceOf(Error);
          await expect(
            (caConnection as any).getSwarmUserCredentials(
              CA_CLASS_USER_IDENTITY_NOT_VALID_NO_VERSION
            )
          ).to.eventually.be.an.instanceOf(Error);
          await expect(
            (caConnection as any).getSwarmUserCredentials(
              CA_CLASS_USER_IDENTITY_NOT_VALID_NO_AUTH_PROVIDER_URL
            )
          ).to.eventually.be.an.instanceOf(Error);
          await expect(
            (caConnection as any).getSwarmUserCredentials(
              CA_CLASS_USER_IDENTITY_NOT_VALID_NO_USER_IDENTITY
            )
          ).to.eventually.be.an.instanceOf(Error);
        }).timeout(15000);

        it('check getSwarmUserCredentials method user identity exists auth providers', async () => {
          expect(caConnection).to.be.an.instanceof(CentralAuthority);
          expect(caConnection.isRunning).to.be.equal(true);
          expect(
            validateUserIdentity(
              CA_SWARM_CREDENTIALS_PROVIDER_TEST_USERIDENTITY
            )
          ).to.be.equal(true);
          await expect(
            caConnection.getSwarmUserCredentials(
              CA_SWARM_CREDENTIALS_PROVIDER_TEST_USERIDENTITY
            )
          ).eventually.not.to.be.an('error');

          const cryptoCredentials = await caConnection.getSwarmUserCredentials(
            CA_SWARM_CREDENTIALS_PROVIDER_TEST_USERIDENTITY
          );

          expect(cryptoCredentials)
            .not.to.be.equal(null)
            .to.be.equal(undefined);
          expect(checkIsValidCryptoCredentials(cryptoCredentials)).to.be.equal(
            true
          );
          expect(
            (cryptoCredentials as TCentralAuthorityUserCryptoCredentials)
              .userIdentity
          ).to.be.equal(CA_SWARM_CREDENTIALS_PROVIDER_TEST_USERIDENTITY);

          expect(
            validateUserIdentity(
              CA_SWARM_CREDENTIALS_PROVIDER_TEST_USERIDENTITY_SECOND
            )
          ).to.be.equal(true);
          await expect(
            caConnection.getSwarmUserCredentials(
              CA_SWARM_CREDENTIALS_PROVIDER_TEST_USERIDENTITY_SECOND
            )
          ).eventually.not.to.be.an('error');

          const cryptoCredentialsSecond = await caConnection.getSwarmUserCredentials(
            CA_SWARM_CREDENTIALS_PROVIDER_TEST_USERIDENTITY_SECOND
          );

          expect(cryptoCredentialsSecond)
            .not.to.be.equal(null)
            .to.be.equal(undefined);
          expect(
            checkIsValidCryptoCredentials(cryptoCredentialsSecond)
          ).to.be.equal(true);
          expect(
            (cryptoCredentialsSecond as TCentralAuthorityUserCryptoCredentials)
              .userIdentity
          ).to.be.equal(CA_SWARM_CREDENTIALS_PROVIDER_TEST_USERIDENTITY_SECOND);
          context.firstIdentityCredentials = cryptoCredentials;
          context.secodIdentityCredentials = cryptoCredentialsSecond;
        }).timeout(10000);

        it('check getSwarmUserEncryptionPubKey method user identity exists auth providers', async () => {
          expect(caConnection).to.be.an.instanceof(CentralAuthority);
          expect(caConnection.isRunning).to.be.equal(true);
          expect(context).to.be.an('object');
          expect(context.firstIdentityCredentials).to.be.an('object');
          expect(context.secodIdentityCredentials).to.be.an('object');

          const {
            firstIdentityCredentials,
            secodIdentityCredentials,
          } = context;

          expect(
            checkIsValidCryptoCredentials(firstIdentityCredentials)
          ).to.be.equal(true);
          expect(
            checkIsValidCryptoCredentials(secodIdentityCredentials)
          ).to.be.equal(true);

          const expectedPubKeyFirstIdentity = getDataEncryptionPubKeyByCryptoCredentials(
            firstIdentityCredentials as TCentralAuthorityUserCryptoCredentials
          );

          expect(expectedPubKeyFirstIdentity)
            .to.be.an.instanceof(CryptoKey)
            .that.have.property('usages')
            .which.is.an('array')
            .contain.all.members(
              CA_SWARM_USER_CRYPTO_KEY_DATA_ENCRYPTION_PUBLIC_USAGES
            ); // the key is used to encrypt a data for the user with this public key, then the user must decrypt it by the private key
          await expect(
            caConnection.getSwarmUserEncryptionPubKey(
              firstIdentityCredentials as TCentralAuthorityUserCryptoCredentials
            )
          )
            .eventually.not.to.be.an('error')
            .that.is.equal(expectedPubKeyFirstIdentity);

          const expectedPubKeySecondIdentity = getDataEncryptionPubKeyByCryptoCredentials(
            secodIdentityCredentials as TCentralAuthorityUserCryptoCredentials
          );

          expect(expectedPubKeySecondIdentity)
            .to.be.an.instanceof(CryptoKey)
            .that.have.property('usages')
            .which.is.an('array')
            .contain.all.members(
              CA_SWARM_USER_CRYPTO_KEY_DATA_ENCRYPTION_PUBLIC_USAGES
            );
          await expect(
            caConnection.getSwarmUserEncryptionPubKey(
              secodIdentityCredentials as TCentralAuthorityUserCryptoCredentials
            )
          )
            .eventually.not.to.be.an('error')
            .that.is.equal(expectedPubKeySecondIdentity);
        }).timeout(10000);

        it('check getSwarmUserSignPubKey method for user identity on existing auth providers', async () => {
          expect(caConnection).to.be.an.instanceof(CentralAuthority);
          expect(caConnection.isRunning).to.be.equal(true);
          expect(context).to.be.an('object');
          expect(context.firstIdentityCredentials).to.be.an('object');
          expect(context.secodIdentityCredentials).to.be.an('object');

          const {
            firstIdentityCredentials,
            secodIdentityCredentials,
          } = context;

          expect(
            checkIsValidCryptoCredentials(firstIdentityCredentials)
          ).to.be.equal(true);
          expect(
            checkIsValidCryptoCredentials(secodIdentityCredentials)
          ).to.be.equal(true);

          const expectedPubKeyFirstIdentity = getDataSignPubKeyByCryptoCredentials(
            firstIdentityCredentials as TCentralAuthorityUserCryptoCredentials
          );

          expect(expectedPubKeyFirstIdentity)
            .to.be.an.instanceof(CryptoKey)
            .that.have.property('usages')
            .which.is.an('array')
            .contain.all.members(
              CA_SWARM_USER_CRYPTO_KEY_DATA_SIGN_PUBLIC_USAGES
            );
          await expect(
            caConnection.getSwarmUserEncryptionPubKey(
              firstIdentityCredentials as TCentralAuthorityUserCryptoCredentials
            )
          )
            .eventually.not.to.be.an('error')
            .that.is.equal(expectedPubKeyFirstIdentity);

          const expectedPubKeySecondIdentity = getDataSignPubKeyByCryptoCredentials(
            secodIdentityCredentials as TCentralAuthorityUserCryptoCredentials
          );

          expect(expectedPubKeySecondIdentity)
            .to.be.an.instanceof(CryptoKey)
            .that.have.property('usages')
            .which.is.an('array')
            .contain.all.members(
              CA_SWARM_USER_CRYPTO_KEY_DATA_SIGN_PUBLIC_USAGES
            );
          await expect(
            caConnection.getSwarmUserEncryptionPubKey(
              secodIdentityCredentials as TCentralAuthorityUserCryptoCredentials
            )
          )
            .eventually.not.to.be.an('error')
            .that.is.equal(expectedPubKeySecondIdentity);
        }).timeout(10000);

        it('check getUserEncryptionKeyPair method return a valid keypair', () => {
          expect(caConnection).to.be.an.instanceof(CentralAuthority);
          expect(caConnection.isRunning).to.be.equal(true);
          expect(caConnection.getUserEncryptionKeyPair()).to.not.be.an('Error');

          const currentUserDataEncryptionCryptoKeyPair = caConnection.getUserEncryptionKeyPair();

          expect(currentUserDataEncryptionCryptoKeyPair).not.to.be.an('Error');
          expect(
            isCryptoKeyPair(currentUserDataEncryptionCryptoKeyPair)
          ).to.be.equal(true);

          const {
            privateKey,
            publicKey,
          } = currentUserDataEncryptionCryptoKeyPair as CryptoKeyPair;

          expect(
            isCryptoKeyIncludesUsages(
              publicKey,
              CA_SWARM_USER_CRYPTO_KEY_DATA_ENCRYPTION_PUBLIC_USAGES
            )
          ).to.be.equal(true);
          expect(
            isCryptoKeyIncludesUsages(
              privateKey,
              CA_SWARM_USER_CRYPTO_KEY_DATA_ENCRYPTION_PRIVATE_USAGES
            )
          ).to.be.equal(true);
        });

        it('check getUserDataSignKeyPair method return a valid keypair', async () => {
          expect(caConnection).to.be.an.instanceof(CentralAuthority);
          expect(caConnection.isRunning).to.be.equal(true);
          expect(caConnection.getUserDataSignKeyPair()).to.not.be.an('Error');

          const currentUserDataEncryptionCryptoKeyPair = caConnection.getUserDataSignKeyPair();

          expect(currentUserDataEncryptionCryptoKeyPair).not.to.be.an('Error');
          expect(
            isCryptoKeyPair(currentUserDataEncryptionCryptoKeyPair)
          ).to.be.equal(true);

          const {
            privateKey,
            publicKey,
          } = currentUserDataEncryptionCryptoKeyPair as CryptoKeyPair;

          expect(
            isCryptoKeyIncludesUsages(
              publicKey,
              CA_SWARM_USER_CRYPTO_KEY_DATA_SIGN_PUBLIC_USAGES
            )
          ).to.be.equal(true);
          expect(
            isCryptoKeyIncludesUsages(
              privateKey,
              CA_SWARM_USER_CRYPTO_KEY_DATA_SIGN_PRIVATE_USAGES
            )
          ).to.be.equal(true);
        });

        it('check exportCryptoCredentials method return a valid keypair', async () => {
          expect(caConnection).to.be.an.instanceof(CentralAuthority);
          expect(caConnection.isRunning).to.be.equal(true);

          await expect(
            caConnection.exportCryptoCredentials()
          ).to.eventually.fulfilled.with.not.an('Error');

          const exportedCryptoCredentials = await caConnection.exportCryptoCredentials();

          expect(exportedCryptoCredentials).not.to.be.an('Error');
          expect(exportedCryptoCredentials).to.be.a('String');
          expect(
            checkIsValidExportedCryptoCredentialsToString(
              exportedCryptoCredentials
            )
          ).to.be.equal(true);

          const cryptoCredentialsImported = await importCryptoCredentialsFromAString(
            exportedCryptoCredentials
          );

          expect(cryptoCredentialsImported).not.to.be.an('Error');
          expect(
            checkIsValidCryptoCredentials(cryptoCredentialsImported)
          ).to.be.equal(true);
        }).timeout(5000);
      });
    });
  });
};
