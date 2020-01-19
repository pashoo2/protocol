import {
  CA_AUTH_CREDENTIALS_USER_IDENTITY_PROP_NAME,
  CA_CREDENTIALS_CRYPTO_KEYS_KEY_NAME,
} from './../../classes/central-authority-class/central-authority-class-const/central-authority-class-const-auth-credentials';
import {
  exportCryptoCredentialsToString,
  importCryptoCredentialsFromAString,
} from './../../classes/central-authority-class/central-authority-utils-common/central-authority-utils-crypto-credentials/central-authority-utils-crypto-credentials';
import { TCentralAuthorityUserCryptoCredentials } from 'classes/central-authority-class/central-authority-class-types/central-authority-class-types';
import { generateUUID } from './../../utils/identity-utils/identity-utils';
import {
  CA_USER_IDENTITY_VERSION_PROP_NAME,
  CA_USER_IDENTITY_AUTH_PROVIDER_IDENTIFIER_PROP_NAME,
  CA_USER_IDENTITY_USER_UNIQUE_IDENTFIER_PROP_NAME,
  CA_USER_IDENTITY_VERSIONS,
} from './../../classes/central-authority-class/central-authority-class-user-identity/central-authority-class-user-identity.const';
import {
  generateCryptoCredentialsWithUserIdentityV1,
  generateCryptoCredentialsWithUserIdentityV2,
} from 'classes/central-authority-class/central-authority-utils-common/central-authority-util-crypto-keys/central-authority-util-crypto-keys';
import {
  compareCryptoCredentials,
  compareAuthProvidersIdentities,
} from 'classes/central-authority-class/central-authority-utils-common/central-authority-utils-crypto-credentials/central-authority-utils-crypto-credentials';
import { expect } from 'chai';

export const runTestCentralAuthorityUtils = () => {
  describe('CA utils test', () => {
    describe('CA utils crypto credentials', () => {
      it('test compare auth providers identity', () => {
        expect(compareAuthProvidersIdentities()).to.be.equal(true);
        expect(
          compareAuthProvidersIdentities('http://firebase.com')
        ).to.be.equal(true);
        expect(
          compareAuthProvidersIdentities('http://firebase.com')
        ).to.be.equal(true);
        expect(
          compareAuthProvidersIdentities('http://firebase.com', 'firebase.com/')
        ).to.be.equal(true);
        expect(
          compareAuthProvidersIdentities(
            'https://watcha3-191815.firebaseio.com',
            'https://watcha3-191815.firebaseio.com/',
            'watcha3-191815.firebaseio.com',
            'watcha3-191815.firebaseio.com/',
            ' https://Watcha3-191815.firebaseiO.COM   ',
            '     Https://Watcha3-191815.firebaseiO.COM'
          )
        ).to.be.equal(true);
      });
      it('test compare crypto credentials', async () => {
        // credentials must be the same idependently to the version
        // of the user identity
        const uuid = generateUUID();
        const authProvider = 'https://auth.provider.com';
        const cryptoCredentialsV1 = await generateCryptoCredentialsWithUserIdentityV1(
          {
            [CA_USER_IDENTITY_VERSION_PROP_NAME]:
              CA_USER_IDENTITY_VERSIONS['01'],
            [CA_USER_IDENTITY_USER_UNIQUE_IDENTFIER_PROP_NAME]: uuid,
            [CA_USER_IDENTITY_AUTH_PROVIDER_IDENTIFIER_PROP_NAME]: authProvider,
          }
        );

        expect(cryptoCredentialsV1).not.to.be.an('Error');

        const cryptoCredentialsV2 = await generateCryptoCredentialsWithUserIdentityV2(
          {
            [CA_USER_IDENTITY_USER_UNIQUE_IDENTFIER_PROP_NAME]: uuid,
            [CA_USER_IDENTITY_AUTH_PROVIDER_IDENTIFIER_PROP_NAME]: authProvider,
          }
        );

        expect(cryptoCredentialsV2).not.to.be.an('Error');
        await expect(
          compareCryptoCredentials(
            cryptoCredentialsV1 as TCentralAuthorityUserCryptoCredentials,
            cryptoCredentialsV1 as TCentralAuthorityUserCryptoCredentials
          )
        ).to.eventually.be.equal(true);
        await expect(
          compareCryptoCredentials(
            cryptoCredentialsV2 as TCentralAuthorityUserCryptoCredentials,
            cryptoCredentialsV2 as TCentralAuthorityUserCryptoCredentials
          )
        ).to.eventually.be.equal(true);
        await expect(
          compareCryptoCredentials(
            cryptoCredentialsV1 as TCentralAuthorityUserCryptoCredentials,
            cryptoCredentialsV2 as TCentralAuthorityUserCryptoCredentials
          )
        ).to.eventually.be.an('Error');

        const exportedCryptoCredentialsV1 = await exportCryptoCredentialsToString(
          cryptoCredentialsV1 as TCentralAuthorityUserCryptoCredentials
        );

        expect(exportedCryptoCredentialsV1).not.to.be.an('Error');
        expect(exportedCryptoCredentialsV1).to.be.an('string');

        const importedCryptoCredentialsV1 = await importCryptoCredentialsFromAString(
          exportedCryptoCredentialsV1 as string
        );

        expect(importedCryptoCredentialsV1).not.to.be.an('Error');
        expect(importedCryptoCredentialsV1).to.haveOwnProperty(
          CA_AUTH_CREDENTIALS_USER_IDENTITY_PROP_NAME
        );
        expect(importedCryptoCredentialsV1).to.haveOwnProperty(
          CA_CREDENTIALS_CRYPTO_KEYS_KEY_NAME
        );
        await expect(
          compareCryptoCredentials(
            cryptoCredentialsV1 as TCentralAuthorityUserCryptoCredentials,
            importedCryptoCredentialsV1 as TCentralAuthorityUserCryptoCredentials
          )
        ).to.eventually.be.equal(true);

        const exportedCryptoCredentialsV2 = await exportCryptoCredentialsToString(
          cryptoCredentialsV2 as TCentralAuthorityUserCryptoCredentials
        );

        expect(exportedCryptoCredentialsV2).not.to.be.an('Error');
        expect(exportedCryptoCredentialsV2).to.be.an('string');

        const importedCryptoCredentialsV2 = await importCryptoCredentialsFromAString(
          exportedCryptoCredentialsV2 as string
        );

        expect(importedCryptoCredentialsV2).not.to.be.an('Error');
        expect(importedCryptoCredentialsV2).to.haveOwnProperty(
          CA_AUTH_CREDENTIALS_USER_IDENTITY_PROP_NAME
        );
        expect(importedCryptoCredentialsV2).to.haveOwnProperty(
          CA_CREDENTIALS_CRYPTO_KEYS_KEY_NAME
        );

        await expect(
          compareCryptoCredentials(
            cryptoCredentialsV2 as TCentralAuthorityUserCryptoCredentials,
            importedCryptoCredentialsV2 as TCentralAuthorityUserCryptoCredentials
          )
        ).to.eventually.be.equal(true);
      }).timeout(20000);
    });
  });
};
