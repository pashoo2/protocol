import 'mocha';
import { compareCryptoCredentials } from 'classes/central-authority-class/central-authority-utils-common/central-authority-utils-crypto-credentials/central-authority-utils-crypto-credentials';
import { TCentralAuthorityUserCryptoCredentials } from 'classes/central-authority-class/central-authority-class-types/central-authority-class-types';
import { checkIsValidCryptoCredentials } from 'classes/central-authority-class/central-authority-validators/central-authority-validators-crypto-keys/central-authority-validators-crypto-keys';
import { decodeFromFirebaseKey } from './../../../utils/firebase-utils/firebase-utils';
import { ICAConnection } from './../../../classes/central-authority-class/central-authority-connections/central-authority-connections.types';
import { CA_USER_IDENTITY_AUTH_PROVIDER_IDENTIFIER_PROP_NAME } from 'classes/central-authority-class/central-authority-class-user-identity/central-authority-class-user-identity.const';
import {
  TCAuthProviderIdentifier,
  TCAUserIdentityRawTypes,
} from './../../../classes/central-authority-class/central-authority-class-user-identity/central-authority-class-user-identity.types';
import { CentralAuthorityIdentity } from 'classes/central-authority-class/central-authority-class-user-identity/central-authority-class-user-identity';
import { CAConnectionsPool } from 'classes/central-authority-class/central-authority-connections/central-authority-connections-pool/central-authority-connections-pool';
import { ICASwarmCredentialsProviderOptions } from './../../../classes/central-authority-class/central-authority-swarm-credentials-provider/central-authority-swarm-credentials-provider.types';
import {
  CA_SWARM_CREDENTIALS_PROVIDER_TEST_OPTIONS,
  CA_SWARM_CREDENTIALS_PROVIDER_TEST_USERIDENTITY,
  CA_SWARM_CREDENTIALS_PROVIDER_TEST_USERIDENTITY_SECOND,
} from './central-authority-swarm-credentials-provider.const';
import { CASwarmCredentialsProvider } from './../../../classes/central-authority-class/central-authority-swarm-credentials-provider/central-authority-swarm-credentials-provider';
import { expect } from 'chai';
import { createCAConnectionsPoolWithTwoProviders } from './../central-authority-connection.test/central-authority-connections-pool.test/central-authority-connections-pool.test.shared';
import mocha from 'mocha';

const it = mocha.it;

const getAuthProviderIdByUserIdentity = (
  userIdentity: CentralAuthorityIdentity
): TCAuthProviderIdentifier | Error => {
  const { identityDescription } = userIdentity;

  if (identityDescription instanceof Error) {
    return new Error('The identity is not valid');
  }
  return identityDescription[
    CA_USER_IDENTITY_AUTH_PROVIDER_IDENTIFIER_PROP_NAME
  ];
};

export const runTestCASwarmCredentilsProvider = () => {
  describe('CASwarmCredentialsProvider tests', async () => {
    let swarmConnectionsPool: CAConnectionsPool;
    let swarmCredentialsProviderOptions: ICASwarmCredentialsProviderOptions;

    before(async () => {
      expect(() => {
        swarmConnectionsPool = createCAConnectionsPoolWithTwoProviders();
      }).not.to.throw();
      swarmCredentialsProviderOptions = {
        ...CA_SWARM_CREDENTIALS_PROVIDER_TEST_OPTIONS,
        connections: {
          ...CA_SWARM_CREDENTIALS_PROVIDER_TEST_OPTIONS.connections,
          swarmConnectionPool: swarmConnectionsPool,
        },
      };
    });

    it('test constructor not failed', () => {
      expect(() => {
        new CASwarmCredentialsProvider();
      }).not.to.throw();
    });

    it('test connect and disconnect methods are not failed', async () => {
      const caSwarmCredentialsProvider = new CASwarmCredentialsProvider();

      expect(
        caSwarmCredentialsProvider.connect(swarmCredentialsProviderOptions)
      ).not.to.eventually.be.an('Error');
      await expect(
        caSwarmCredentialsProvider.disconnect()
      ).not.eventually.to.be.an('Error');
    }).timeout(5000);

    it('test connect and disconnect twice are not failed', async () => {
      const caSwarmCredentialsConnection = new CASwarmCredentialsProvider();

      await expect(
        caSwarmCredentialsConnection.connect(swarmCredentialsProviderOptions)
      ).not.to.eventually.be.an('Error');
      await expect(
        caSwarmCredentialsConnection.connect(swarmCredentialsProviderOptions)
      ).not.to.eventually.be.an('Error');
      await expect(
        caSwarmCredentialsConnection.disconnect()
      ).not.to.eventually.be.an('Error');
      await expect(
        caSwarmCredentialsConnection.disconnect()
      ).not.to.eventually.be.an('Error');
    }).timeout(10000);

    describe('test get credetnials', async () => {
      let caSwarmCredentialsProvider: CASwarmCredentialsProvider;

      before(async () => {
        expect(
          decodeFromFirebaseKey(
            `02https:*_S%ë5nN*_S%ë5nNwatcha3-191815_P%ë5nN*firebaseio_P%ë5nN*com|0skX1iXT0rQCl5FxGzISu9dUPg23`
          )
        ).to.be.equal(
          `02https://watcha3-191815.firebaseio.com|0skX1iXT0rQCl5FxGzISu9dUPg23`
        );
        caSwarmCredentialsProvider = new CASwarmCredentialsProvider();

        const connectionResult = await caSwarmCredentialsProvider.connect(
          swarmCredentialsProviderOptions
        );

        expect(connectionResult).not.to.be.an('Error');
      });

      const runTestForUserIdentity = (
        userIdentity: TCAUserIdentityRawTypes
      ) => {
        const context = {};
        const userIdentityEncoded =
          typeof userIdentity === 'string'
            ? decodeFromFirebaseKey(userIdentity)
            : userIdentity;
        it(`check that credntials are exists ${userIdentityEncoded} and may be got by a connection with auth provider`, async () => {
          const connectionSwarm = swarmConnectionsPool;

          if (!connectionSwarm) {
            return new Error('There is no connection to the swarm');
          }

          const identity = new CentralAuthorityIdentity(userIdentityEncoded);

          expect(identity.isValid).to.be.equal(true);

          const authProviderId = getAuthProviderIdByUserIdentity(identity);

          expect(authProviderId).not.to.be.an('Error');
          expect(authProviderId).to.be.a('string');

          const connection = await connectionSwarm.connect(
            authProviderId as string
          );

          expect(connection).not.to.be.an('Error');
          expect(connection).to.has.property('getUserCredentials');

          const cryptoCredentials = await (connection as ICAConnection).getUserCredentials(
            String(identity)
          );

          expect(cryptoCredentials).not.to.be.an('Error');
          expect(cryptoCredentials).not.equal(null);
          expect(checkIsValidCryptoCredentials(cryptoCredentials)).to.be.equal(
            true
          );
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (context as any).cryptoCredentials = cryptoCredentials;
        }).timeout(10000);
        it(`check that credntials ${userIdentity} got by auth provider the same as returned from the credentials storage`, async () => {
          expect(caSwarmCredentialsProvider).to.be.an.instanceof(
            CASwarmCredentialsProvider
          );

          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const cryptoCredentials = (context as any)
            .cryptoCredentials as TCentralAuthorityUserCryptoCredentials;

          expect(checkIsValidCryptoCredentials(cryptoCredentials));

          const credentials = await caSwarmCredentialsProvider.get(
            userIdentityEncoded
          );

          expect(credentials).to.not.be.an('Error');
          expect(credentials).to.not.equal(null);
          expect(checkIsValidCryptoCredentials(credentials)).to.be.equal(true);
          await expect(
            compareCryptoCredentials(
              cryptoCredentials,
              credentials as TCentralAuthorityUserCryptoCredentials
            )
          ).to.eventually.be.equal(true);

          const credentialsFromStorage = await caSwarmCredentialsProvider.get(
            userIdentityEncoded
          );

          expect(credentialsFromStorage).to.not.be.an('Error');
          expect(credentialsFromStorage).to.not.equal(null);
          expect(checkIsValidCryptoCredentials(credentials)).to.be.equal(true);
          await expect(
            compareCryptoCredentials(
              credentialsFromStorage as TCentralAuthorityUserCryptoCredentials,
              credentials as TCentralAuthorityUserCryptoCredentials
            )
          ).to.eventually.be.equal(true);
        }).timeout(15000);
      };

      runTestForUserIdentity(CA_SWARM_CREDENTIALS_PROVIDER_TEST_USERIDENTITY);
      runTestForUserIdentity(
        CA_SWARM_CREDENTIALS_PROVIDER_TEST_USERIDENTITY_SECOND
      );
    });
  });
};
