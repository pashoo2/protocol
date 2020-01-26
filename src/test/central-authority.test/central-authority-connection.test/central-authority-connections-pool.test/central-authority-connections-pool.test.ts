/* eslint-disable @typescript-eslint/no-explicit-any */
import { expect, assert } from 'chai';
import { CAConnectionsPool } from 'classes/central-authority-class/central-authority-connections/central-authority-connections-pool/central-authority-connections-pool';
import {
  CA_CONNECTOINS_CONNECTIONS_POOL_TEST_FIREBASE_DB_WATCHA_AUTH_PROVIDER_CONF,
  CA_CONNECTOINS_CONNECTIONS_POOL_TEST_FIREBASE_DB_PROTOCOL_AUTH_PROVIDER_CONF,
  CA_CONNECTOINS_CONNECTIONS_POOL_TEST_FIREBASE_DB_WATCHA_AUTH_PROVIDER_CONF_INVALID,
  CA_CONNECTOINS_CONNECTIONS_POOL_TEST_FIREBASE_DB_PROTOCOL_AUTH_PROVIDER_CONF_INVALID,
} from './central-authority-connections-pool.test.const';
import CAConnectionWithFirebase from 'classes/central-authority-class/central-authority-connections/central-authority-connection-firebase/central-authority-connection-firebase';
import { CA_CONNECTIONS_POOL_AUTH_PROVIDERS_CONNECTION_CONSTRUCTORS } from 'classes/central-authority-class/central-authority-connections/central-authority-connections.const';
import { IAuthProviderConnectionConfiguration } from 'classes/central-authority-class/central-authority-connections/central-authority-connections-pool/central-authority-connections-pool.types';
import { delay } from 'utils/common-utils/common-utils-timer';
import { createCAConnectionsPoolWithTwoProviders } from './central-authority-connections-pool.test.shared';
import { CA_CONNECTOINS_CONNECTIONS_POOL_TEST_FIREBASE_DB_WATCHA_AUTH_PROVIDER_CREDENTIALS } from './central-authority-connections-pool.test.const';

export const runTestCAConnectionsPoolTest = () => {
  describe('central-authority-connections-pool module test', () => {
    describe('test constructor for the class', () => {
      it('valid configurations for the auth providers - should not throw', () => {
        expect(() => {
          new CAConnectionsPool({
            providers: [
              CA_CONNECTOINS_CONNECTIONS_POOL_TEST_FIREBASE_DB_WATCHA_AUTH_PROVIDER_CONF,
            ],
          });
        }).not.to.throw();
        expect(() => {
          new CAConnectionsPool({
            providers: [
              CA_CONNECTOINS_CONNECTIONS_POOL_TEST_FIREBASE_DB_PROTOCOL_AUTH_PROVIDER_CONF,
            ],
          });
        }).not.to.throw();
        expect(createCAConnectionsPoolWithTwoProviders).not.to.throw();
      });
      it('invalid configurations for the auth providers - should throw', () => {
        expect(() => {
          new CAConnectionsPool({
            providers: [],
          });
        }).to.throw();
        expect(() => {
          new CAConnectionsPool({} as any);
        }).to.throw();
        expect(() => {
          new CAConnectionsPool({
            providers: [
              CA_CONNECTOINS_CONNECTIONS_POOL_TEST_FIREBASE_DB_WATCHA_AUTH_PROVIDER_CONF_INVALID,
              CA_CONNECTOINS_CONNECTIONS_POOL_TEST_FIREBASE_DB_PROTOCOL_AUTH_PROVIDER_CONF_INVALID,
            ],
          });
        }).to.throw();
        expect(() => {
          new CAConnectionsPool({
            providers: [
              {
                ...CA_CONNECTOINS_CONNECTIONS_POOL_TEST_FIREBASE_DB_PROTOCOL_AUTH_PROVIDER_CONF,
                caProviderUrl: '',
              },
            ],
          });
        }).to.throw();
        expect(() => {
          new CAConnectionsPool({
            providers: [
              {
                ...CA_CONNECTOINS_CONNECTIONS_POOL_TEST_FIREBASE_DB_PROTOCOL_AUTH_PROVIDER_CONF,
                caProvider: 1000 as any,
              },
            ],
          });
        }).to.throw();
      });
      it('valid configurations for the same auth providers - should throw', () => {
        expect(() => {
          new CAConnectionsPool({
            providers: [
              CA_CONNECTOINS_CONNECTIONS_POOL_TEST_FIREBASE_DB_WATCHA_AUTH_PROVIDER_CONF,
              CA_CONNECTOINS_CONNECTIONS_POOL_TEST_FIREBASE_DB_PROTOCOL_AUTH_PROVIDER_CONF,
              CA_CONNECTOINS_CONNECTIONS_POOL_TEST_FIREBASE_DB_WATCHA_AUTH_PROVIDER_CONF,
            ],
          });
        }).to.throw();
      });
    });
    describe('test connect and disconnect methods method', async () => {
      let connectionPool: CAConnectionsPool;

      beforeEach(() => {
        connectionPool = new CAConnectionsPool({
          providers: [
            CA_CONNECTOINS_CONNECTIONS_POOL_TEST_FIREBASE_DB_WATCHA_AUTH_PROVIDER_CONF,
            CA_CONNECTOINS_CONNECTIONS_POOL_TEST_FIREBASE_DB_PROTOCOL_AUTH_PROVIDER_CONF,
          ],
        });
      });

      // afterEach(async () => {
      //   if (connectionPool) {
      //     await connectionPool.close();
      //   }
      // });

      // it('connect to a valid auth provider url and close the connection pool to disconnect from all connected providers', async () => {
      //   await expect(
      //     connectionPool.connect(
      //       CA_CONNECTOINS_CONNECTIONS_POOL_TEST_FIREBASE_DB_WATCHA_AUTH_PROVIDER_CONF.caProviderUrl
      //     )
      //   ).to.eventually.not.be.an('error');
      //   await expect(connectionPool.close()).to.eventually.not.be.an('error');
      // });
      // it('connect method to invalid auth provider url - should return error', async () => {
      //   await expect(async () =>
      //     connectionPool.connect(null as any)
      //   ).to.not.throw();
      //   await expect(async () => connectionPool.connect('')).to.not.throw();
      //   await expect(async () =>
      //     connectionPool.connect(0 as any)
      //   ).to.not.throw();
      //   await expect(connectionPool.connect(0 as any)).to.eventually.be.an(
      //     'error'
      //   );
      //   await expect(connectionPool.connect({} as any)).to.eventually.be.an(
      //     'error'
      //   );
      //   await expect(connectionPool.connect('' as any)).to.eventually.be.an(
      //     'error'
      //   );
      // });

      async function runTestForConnectionConfiguration(
        conf: IAuthProviderConnectionConfiguration
      ) {
        const connectionFirebaseWatcha = await connectionPool.connect(
          conf.caProviderUrl
        );

        expect(connectionFirebaseWatcha).to.be.an.instanceOf(
          CA_CONNECTIONS_POOL_AUTH_PROVIDERS_CONNECTION_CONSTRUCTORS[
            conf.caProvider
          ]
        );

        const connectionFirebaseWatchaSame = await connectionPool.connect(
          conf.caProviderUrl
        );

        assert(
          connectionFirebaseWatcha === connectionFirebaseWatchaSame,
          'Connection to the same url must rerurn the same connection if not disconnected before'
        );

        await expect(
          connectionPool.disconnect(conf.caProviderUrl)
        ).to.eventually.not.be.an('error');

        const connectionFirebaseWatchaNext = await connectionPool.connect(
          conf.caProviderUrl
        );

        expect(connectionFirebaseWatchaNext).to.be.an.instanceof(
          CAConnectionWithFirebase
        );
        assert(
          connectionFirebaseWatchaNext !== connectionFirebaseWatchaSame,
          'Connection to the same url must not return the same connection if disconnected before'
        );
      }

      // it('connect method to a valid auth provider url - should connect and disconnect', async () => {
      //   await runTestForConnectionConfiguration(
      //     CA_CONNECTOINS_CONNECTIONS_POOL_TEST_FIREBASE_DB_WATCHA_AUTH_PROVIDER_CONF
      //   );
      //   await runTestForConnectionConfiguration(
      //     CA_CONNECTOINS_CONNECTIONS_POOL_TEST_FIREBASE_DB_PROTOCOL_AUTH_PROVIDER_CONF
      //   );
      // }).timeout(10000);

      it('authorize method to a valid auth provider url - should authorize and disconnect', async () => {
        const credentials = CA_CONNECTOINS_CONNECTIONS_POOL_TEST_FIREBASE_DB_WATCHA_AUTH_PROVIDER_CREDENTIALS;
        const connectionWithAuthProvider = await connectionPool.authorize(
          CA_CONNECTOINS_CONNECTIONS_POOL_TEST_FIREBASE_DB_WATCHA_AUTH_PROVIDER_CONF.caProviderUrl,
          credentials
        );

        expect(connectionWithAuthProvider).to.be.an.instanceOf(
          CA_CONNECTIONS_POOL_AUTH_PROVIDERS_CONNECTION_CONSTRUCTORS[
            CA_CONNECTOINS_CONNECTIONS_POOL_TEST_FIREBASE_DB_WATCHA_AUTH_PROVIDER_CONF
              .caProvider
          ]
        );

        const connectionWithAuthProviderSecond = await connectionPool.authorize(
          CA_CONNECTOINS_CONNECTIONS_POOL_TEST_FIREBASE_DB_WATCHA_AUTH_PROVIDER_CONF.caProviderUrl,
          credentials
        );

        assert(
          connectionWithAuthProviderSecond === connectionWithAuthProvider,
          'The same connection must be returned if authorized to the same auth provider'
        );
        await expect(connectionPool.signOut()).to.eventually.not.be.an('error');

        const connectionWithAuthProviderThird = await connectionPool.authorize(
          CA_CONNECTOINS_CONNECTIONS_POOL_TEST_FIREBASE_DB_WATCHA_AUTH_PROVIDER_CONF.caProviderUrl,
          credentials
        );

        expect(connectionWithAuthProviderThird).to.be.an.instanceof(
          CA_CONNECTIONS_POOL_AUTH_PROVIDERS_CONNECTION_CONSTRUCTORS[
            CA_CONNECTOINS_CONNECTIONS_POOL_TEST_FIREBASE_DB_WATCHA_AUTH_PROVIDER_CONF
              .caProvider
          ]
        );
        assert(
          connectionWithAuthProvider !== connectionWithAuthProviderThird,
          'After the sign out from the connection pool another connection shoul be returned after another authorization'
        );

        const connectionWithAuthProviderFourth = await connectionPool.connect(
          CA_CONNECTOINS_CONNECTIONS_POOL_TEST_FIREBASE_DB_WATCHA_AUTH_PROVIDER_CONF.caProviderUrl
        );

        assert(
          connectionWithAuthProviderThird === connectionWithAuthProviderFourth,
          'Connection to the same provider must be the same as connection after the authorization'
        );

        await expect(
          connectionPool.authorize(
            CA_CONNECTOINS_CONNECTIONS_POOL_TEST_FIREBASE_DB_PROTOCOL_AUTH_PROVIDER_CONF.caProviderUrl,
            credentials
          )
        ).to.eventually.be.an('error');

        const connectionToAnotherProvider = await connectionPool.connect(
          CA_CONNECTOINS_CONNECTIONS_POOL_TEST_FIREBASE_DB_PROTOCOL_AUTH_PROVIDER_CONF.caProviderUrl
        );

        expect(connectionToAnotherProvider).to.be.an.instanceof(
          CA_CONNECTIONS_POOL_AUTH_PROVIDERS_CONNECTION_CONSTRUCTORS[
            CA_CONNECTOINS_CONNECTIONS_POOL_TEST_FIREBASE_DB_PROTOCOL_AUTH_PROVIDER_CONF
              .caProvider
          ]
        );
        await expect(
          connectionPool.disconnect(
            CA_CONNECTOINS_CONNECTIONS_POOL_TEST_FIREBASE_DB_WATCHA_AUTH_PROVIDER_CONF.caProviderUrl
          )
        ).to.eventually.not.be.an('error');
        await delay(1000);
        const credentialsAnotherProvider = {
          login: 'cemilic688@themail3.net',
          password: '123456',
        };
        const authConnectionToAnotherProvider = await connectionPool.authorize(
          CA_CONNECTOINS_CONNECTIONS_POOL_TEST_FIREBASE_DB_PROTOCOL_AUTH_PROVIDER_CONF.caProviderUrl,
          credentialsAnotherProvider
        );

        expect(authConnectionToAnotherProvider).to.be.an.instanceOf(
          CA_CONNECTIONS_POOL_AUTH_PROVIDERS_CONNECTION_CONSTRUCTORS[
            CA_CONNECTOINS_CONNECTIONS_POOL_TEST_FIREBASE_DB_PROTOCOL_AUTH_PROVIDER_CONF
              .caProvider
          ]
        );
        assert(
          authConnectionToAnotherProvider === connectionToAnotherProvider,
          'After authorization connection to the auth provider must not be created again and must be reused connection opened before'
        );
        await expect(connectionPool.signOut()).to.eventually.not.be.an('error');
      }).timeout(120000);
    });
  });
};
