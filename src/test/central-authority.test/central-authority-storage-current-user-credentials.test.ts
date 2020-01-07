import { compareCryptoCredentials } from 'classes/central-authority-class/central-authority-utils-common/central-authority-utils-crypto-credentials/central-authority-utils-crypto-credentials';
import { generateCryptoCredentialsWithUserIdentityV2 } from '../../classes/central-authority-class/central-authority-utils-common/central-authority-util-crypto-keys/central-authority-util-crypto-keys-generate';
import { TCentralAuthorityUserCryptoCredentials } from 'classes/central-authority-class/central-authority-class-types/central-authority-class-types';
import { generateUUID } from '../../utils/identity-utils/identity-utils';
import { checkIsValidCryptoCredentials } from '../../classes/central-authority-class/central-authority-validators/central-authority-validators-crypto-keys/central-authority-validators-crypto-keys';
import { CA_USER_IDENTITY_VERSIONS } from '../../classes/central-authority-class/central-authority-class-user-identity/central-authority-class-user-identity.const';
import {
  CA_USER_IDENTITY_VERSION_PROP_NAME,
  CA_USER_IDENTITY_USER_UNIQUE_IDENTFIER_PROP_NAME,
  CA_USER_IDENTITY_AUTH_PROVIDER_IDENTIFIER_PROP_NAME,
} from '../../classes/central-authority-class/central-authority-class-user-identity/central-authority-class-user-identity.const';
import { generateCryptoCredentialsWithUserIdentityV1 } from 'classes/central-authority-class/central-authority-utils-common/central-authority-util-crypto-keys/central-authority-util-crypto-keys';
import { expect } from 'chai';
import { CentralAuthorityStorageCurrentUserCredentials } from '../../classes/central-authority-class/central-authority-storage-local/central-authority-storage-current-user-auth/central-authority-storage-current-user-credentials/central-authority-storage-current-user-credentials';

const credentials1 = {
  login: 'test1',
  password: '123456',
};
const credentials2 = {
  login: 'test2',
  password: 'abcdefg',
};
const userUUIDV1 = generateUUID();
const userIdentityProviderURLV1 = 'https://identity.provider.com';
const userUUIDV2 = 'this_is_test_login';
const userIdentityProviderURLV2 = 'https://identity.provider-v2.com';

export const runTestAuthorityStorageCurrentUser = () => {
  describe('Test of the class CentralAuthorityStorageCurrentUserCredentials', () => {
    it('Check constructor', async () => {
      let connection;

      expect(
        () => (connection = new CentralAuthorityStorageCurrentUserCredentials())
      ).not.to.throw();
      expect(connection).to.be.an.instanceof(
        CentralAuthorityStorageCurrentUserCredentials
      );
    });
    it('Check connect not to throw', async () => {
      const caStorage = new CentralAuthorityStorageCurrentUserCredentials();

      await expect(
        caStorage.connect({
          credentials: credentials1,
        })
      ).eventually.not.to.be.an('Error');
    });
    describe('Check all public methods ', async () => {
      let connection: CentralAuthorityStorageCurrentUserCredentials;
      const Context: any = {};

      beforeEach(async () => {
        connection = new CentralAuthorityStorageCurrentUserCredentials();
        await expect(
          connection.connect({
            credentials: credentials1,
          })
        ).not.eventually.to.be.an('Error');
        expect(connection).to.be.an.instanceof(
          CentralAuthorityStorageCurrentUserCredentials
        );
      });

      it('Check set credentials with V1 and V2 user identities in the storage', async () => {
        const cryptoCredentialsV1 = await generateCryptoCredentialsWithUserIdentityV1(
          {
            [CA_USER_IDENTITY_VERSION_PROP_NAME]:
              CA_USER_IDENTITY_VERSIONS['01'],
            [CA_USER_IDENTITY_USER_UNIQUE_IDENTFIER_PROP_NAME]: userUUIDV1,
            [CA_USER_IDENTITY_AUTH_PROVIDER_IDENTIFIER_PROP_NAME]: userIdentityProviderURLV1,
          }
        );

        expect(cryptoCredentialsV1).not.to.be.an('Error');
        expect(checkIsValidCryptoCredentials(cryptoCredentialsV1)).to.equal(
          true
        );
        await expect(
          connection.set(
            cryptoCredentialsV1 as TCentralAuthorityUserCryptoCredentials
          )
        ).to.eventually.not.be.an('Error');
        // do not return an error even if a value is already stored
        // for the same crypto credentials
        await expect(
          connection.set(
            cryptoCredentialsV1 as TCentralAuthorityUserCryptoCredentials
          )
        ).to.eventually.not.be.an('Error');

        const cryptoCredentialsV2 = await generateCryptoCredentialsWithUserIdentityV2(
          {
            [CA_USER_IDENTITY_USER_UNIQUE_IDENTFIER_PROP_NAME]: userUUIDV2,
            [CA_USER_IDENTITY_AUTH_PROVIDER_IDENTIFIER_PROP_NAME]: userIdentityProviderURLV2,
          }
        );

        expect(cryptoCredentialsV2).not.to.be.an('Error');
        expect(checkIsValidCryptoCredentials(cryptoCredentialsV2)).to.equal(
          true
        );
        await expect(
          connection.set(
            cryptoCredentialsV2 as TCentralAuthorityUserCryptoCredentials
          )
        ).to.eventually.not.be.an('Error');
        Context._userIdentityV1 = (cryptoCredentialsV1 as TCentralAuthorityUserCryptoCredentials).userIdentity;
        Context._cryptoCredentialsV1 = cryptoCredentialsV1;
        Context._userIdentityV2 = (cryptoCredentialsV2 as TCentralAuthorityUserCryptoCredentials).userIdentity;
        Context._cryptoCredentialsV2 = cryptoCredentialsV2;
      }).timeout(20000);
      it('Read credentials from the storage by the user identity, it must be same as a credentials set in the previous test', async () => {
        expect(Context._userIdentityV1).to.be.a('string');
        expect(Context._userIdentityV2).to.be.a('string');
        expect(
          checkIsValidCryptoCredentials(Context._cryptoCredentialsV1)
        ).to.be.equal(true);
        expect(
          checkIsValidCryptoCredentials(Context._cryptoCredentialsV2)
        ).to.be.equal(true);

        const credentialsV1 = await connection.get(Context._userIdentityV1);

        expect(credentialsV1).to.not.be.an('Error');
        expect(credentialsV1).to.be.an('object');
        expect(checkIsValidCryptoCredentials(credentialsV1)).to.be.equal(true);
        await expect(
          compareCryptoCredentials(
            credentialsV1 as TCentralAuthorityUserCryptoCredentials,
            Context._cryptoCredentialsV1
          )
        ).to.eventually.be.equal(true);

        const credentialsV2 = await connection.get(Context._userIdentityV2);

        expect(credentialsV2).to.not.be.an('Error');
        expect(credentialsV2).to.be.an('object');
        expect(checkIsValidCryptoCredentials(credentialsV2)).to.be.equal(true);

        await expect(
          compareCryptoCredentials(
            credentialsV2 as TCentralAuthorityUserCryptoCredentials,
            Context._cryptoCredentialsV2
          )
        ).to.eventually.be.equal(true);
      }).timeout(20000);
      it('Read credentials from the storage by the auth provider, it must be same as a credentials set in the previous test', async () => {
        expect(
          checkIsValidCryptoCredentials(Context._cryptoCredentialsV1)
        ).to.be.equal(true);
        expect(
          checkIsValidCryptoCredentials(Context._cryptoCredentialsV2)
        ).to.be.equal(true);

        const credentialsV1 = await connection.getByAuthProvider(
          userIdentityProviderURLV1
        );

        expect(credentialsV1).to.not.be.an('Error');
        expect(credentialsV1).to.be.an('object');
        expect(checkIsValidCryptoCredentials(credentialsV1)).to.be.equal(true);
        await expect(
          compareCryptoCredentials(
            credentialsV1 as TCentralAuthorityUserCryptoCredentials,
            Context._cryptoCredentialsV1
          )
        ).to.eventually.be.equal(true);

        const credentialsV2 = await connection.getByAuthProvider(
          userIdentityProviderURLV2
        );

        expect(credentialsV2).to.not.be.an('Error');
        expect(credentialsV2).to.be.an('object');
        expect(checkIsValidCryptoCredentials(credentialsV2)).to.be.equal(true);

        await expect(
          compareCryptoCredentials(
            credentialsV2 as TCentralAuthorityUserCryptoCredentials,
            Context._cryptoCredentialsV2
          )
        ).to.eventually.be.equal(true);
      }).timeout(20000);
      it('Check get credentials from storage by another account', async () => {
        expect(Context._userIdentityV1).to.be.a('string');
        expect(Context._userIdentityV2).to.be.a('string');

        const connectionAnother = new CentralAuthorityStorageCurrentUserCredentials();

        await expect(
          connectionAnother.connect({
            credentials: credentials2,
          })
        ).not.eventually.to.be.an('Error');
        expect(connectionAnother).to.be.an.instanceof(
          CentralAuthorityStorageCurrentUserCredentials
        );

        const credentialsV1 = await connectionAnother.getByAuthProvider(
          userIdentityProviderURLV1
        );

        expect(credentialsV1).to.not.be.an('Error');
        expect(credentialsV1).to.equal(undefined);

        const credentialsV1ByUserID = await connectionAnother.get(
          Context._userIdentityV1
        );

        expect(credentialsV1ByUserID).to.not.be.an('Error');
        expect(credentialsV1ByUserID).to.equal(undefined);

        const credentialsV2 = await connectionAnother.getByAuthProvider(
          userIdentityProviderURLV2
        );

        expect(credentialsV2).to.not.be.an('Error');
        expect(credentialsV2).to.equal(undefined);

        const credentialsV2ByUserID = await connectionAnother.get(
          Context._userIdentityV2
        );

        expect(credentialsV2ByUserID).to.not.be.an('Error');
        expect(credentialsV2ByUserID).to.equal(undefined);
        await expect(connectionAnother.disconnect()).to.eventually.be.equal(
          undefined
        );
      }).timeout(20000);
      it('Check unset credentials in storage', async () => {
        expect(Context._userIdentityV1).to.be.a('string');
        expect(Context._userIdentityV2).to.be.a('string');

        await expect(
          connection.unset(Context._userIdentityV1 as string)
        ).to.eventually.not.be.an('Error');
        await expect(
          connection.unset(Context._userIdentityV2 as string)
        ).to.eventually.not.be.an('Error');

        const credentialsV1ByUserID = await connection.get(
          Context._userIdentityV1
        );

        expect(credentialsV1ByUserID).to.not.be.an('Error');
        expect(credentialsV1ByUserID).to.equal(undefined);

        const credentialsV1 = await connection.getByAuthProvider(
          userIdentityProviderURLV1
        );

        expect(credentialsV1).to.not.be.an('Error');
        expect(credentialsV1).to.equal(undefined);

        const credentialsV2 = await connection.getByAuthProvider(
          userIdentityProviderURLV2
        );

        expect(credentialsV2).to.not.be.an('Error');
        expect(credentialsV2).to.equal(undefined);

        const credentialsV2ByUserID = await connection.get(
          Context._userIdentityV2
        );

        expect(credentialsV2ByUserID).to.not.be.an('Error');
        expect(credentialsV2ByUserID).to.equal(undefined);
      }).timeout(20000);
    });
  });
};
