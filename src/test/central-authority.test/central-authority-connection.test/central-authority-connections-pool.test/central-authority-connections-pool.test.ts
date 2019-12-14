import { expect } from 'chai';
import { CAConnectionsPool } from 'classes/central-authority-class/central-authority-connections/central-authority-connections-pool/central-authority-connections-pool';
import {
  CA_CONNECTOINS_CONNECTIONS_POOL_TEST_FIREBASE_DB_WATCHA_AUTH_PROVIDER_CONF,
  CA_CONNECTOINS_CONNECTIONS_POOL_TEST_FIREBASE_DB_PROTOCOL_AUTH_PROVIDER_CONF,
  CA_CONNECTOINS_CONNECTIONS_POOL_TEST_FIREBASE_DB_WATCHA_AUTH_PROVIDER_CONF_INVALID,
  CA_CONNECTOINS_CONNECTIONS_POOL_TEST_FIREBASE_DB_PROTOCOL_AUTH_PROVIDER_CONF_INVALID,
} from './central-authority-connections-pool.test.const';

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
        expect(() => {
          new CAConnectionsPool({
            providers: [
              CA_CONNECTOINS_CONNECTIONS_POOL_TEST_FIREBASE_DB_WATCHA_AUTH_PROVIDER_CONF,
              CA_CONNECTOINS_CONNECTIONS_POOL_TEST_FIREBASE_DB_PROTOCOL_AUTH_PROVIDER_CONF,
            ],
          });
        }).not.to.throw();
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
  });
};
