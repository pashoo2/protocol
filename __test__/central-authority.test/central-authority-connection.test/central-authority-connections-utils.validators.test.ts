import { expect } from 'chai';
import {
  validateCAConnectionAuthProviderType,
  validateCAConnectionAuthProviderUrl,
  validateCAConnectionAuthProviderConnectionConfiguration,
} from 'classes/central-authority-class/central-authority-connections/central-authority-connections-utils/central-authority-connections-utils';
import { CA_CONNECTION_AUTH_PROVIDERS } from 'classes/central-authority-class/central-authority-connections/central-authority-connections.const';

export const runTestCAConnectionsUtilsValidators = () => {
  describe('Test of the central-authority-connections-utils.validators', () => {
    describe('Test of the validateCAConnectionAuthProviderType', () => {
      it('validateCAConnectionAuthProviderType not throw', () => {
        expect(() => {
          validateCAConnectionAuthProviderType('fff');
        }).not.to.throw();
        expect(() => {
          validateCAConnectionAuthProviderType(null);
        }).not.to.throw();
        expect(() => {
          validateCAConnectionAuthProviderType({});
        }).not.to.throw();
      });

      it('validateCAConnectionAuthProviderType return true for valid providers', () => {
        expect(
          validateCAConnectionAuthProviderType(
            CA_CONNECTION_AUTH_PROVIDERS.FIREBASE
          )
        ).to.be.equal(true);
      });

      it('validateCAConnectionAuthProviderType return for unvalid providers', () => {
        expect(validateCAConnectionAuthProviderType(1000)).to.be.equal(false);
        expect(validateCAConnectionAuthProviderType('')).to.be.equal(false);
      });
    });

    describe('Test of the validateCAConnectionAuthProviderUrl', () => {
      it('validateCAConnectionAuthProviderUrl should not throw', () => {
        expect(() =>
          validateCAConnectionAuthProviderUrl(undefined as any)
        ).to.not.throw();
        expect(() =>
          validateCAConnectionAuthProviderUrl({} as any)
        ).to.not.throw();
        expect(() =>
          validateCAConnectionAuthProviderUrl(0 as any)
        ).to.not.throw();
      });
      it('validateCAConnectionAuthProviderUrl should return true for a valid urls', () => {
        expect(
          validateCAConnectionAuthProviderUrl(
            'https://watcha3-191815.firebaseio.com'
          )
        ).to.be.equal(true);
        expect(
          validateCAConnectionAuthProviderUrl(
            'https://protocol-f251b.firebaseio.com'
          )
        ).to.be.equal(true);
      });
      it('validateCAConnectionAuthProviderUrl should return false for invalid urls', () => {
        expect(
          validateCAConnectionAuthProviderUrl('fds://watcha3-191815.firebaseio')
        ).to.be.equal(false);
        expect(validateCAConnectionAuthProviderUrl('https://com')).to.be.equal(
          false
        );
      });
    });

    describe('Test of the validateCAConnectionAuthProviderConnectionConfiguration', () => {
      it('validateCAConnectionAuthProviderConnectionConfiguration should not throw', () => {
        expect(() =>
          validateCAConnectionAuthProviderConnectionConfiguration(
            undefined as any,
            undefined as any
          )
        ).to.not.throw();
        expect(() =>
          validateCAConnectionAuthProviderConnectionConfiguration(
            {} as any,
            {} as any
          )
        ).to.not.throw();
        expect(() =>
          validateCAConnectionAuthProviderConnectionConfiguration(
            0 as any,
            0 as any
          )
        ).to.not.throw();
        expect(() =>
          validateCAConnectionAuthProviderConnectionConfiguration(
            '' as any,
            '' as any
          )
        ).to.not.throw();
      });
      it('validateCAConnectionAuthProviderConnectionConfiguration should return true for a valid configuration', () => {
        const validConfigurationOne = {
          apiKey: 'AIzaSyCwmUlVklNmGZ0SD11NKT8gpvmZXbgbBRk',
          authDomain: 'protocol-f251b.firebaseapp.com',
          databaseURL: 'https://protocol-f251b.firebaseio.com',
          projectId: 'protocol-f251b',
          storageBucket: '',
          messagingSenderId: '275196342406',
          appId: '1:275196342406:web:40b79d671c50af57',
        };
        const validConfigurationTwo = {
          apiKey: 'AIzaSyCmjgbWZjUcDYxV2d0DxbiuroFrftW7qrQ',
          authDomain: 'watcha3-191815.firebaseapp.com',
          databaseURL: 'https://watcha3-191815.firebaseio.com',
          projectId: 'watcha3-191815',
          storageBucket: 'watcha3-191815.appspot.com',
          messagingSenderId: '271822572791',
          appId: '1:271822572791:web:2e31bfd34ccabe551597f2',
        };

        expect(
          validateCAConnectionAuthProviderConnectionConfiguration(
            CA_CONNECTION_AUTH_PROVIDERS.FIREBASE,
            validConfigurationOne
          )
        ).to.be.equal(true);
        expect(
          validateCAConnectionAuthProviderConnectionConfiguration(
            CA_CONNECTION_AUTH_PROVIDERS.FIREBASE,
            validConfigurationTwo
          )
        ).to.be.equal(true);
      });
      it('validateCAConnectionAuthProviderConnectionConfiguration should return false for invalid configuration', () => {
        const inValidConfigurationNoAPIKey = {
          authDomain: 'protocol-f251b.firebaseapp.com',
          databaseURL: 'https://protocol-f251b.firebaseio.com',
          projectId: 'protocol-f251b',
          storageBucket: '',
          messagingSenderId: '275196342406',
          appId: '1:275196342406:web:40b79d671c50af57',
        };
        const inVvalidConfigurationIvalidDatabaseURL = {
          apiKey: 'AIzaSyCmjgbWZjUcDYxV2d0DxbiuroFrftW7qrQ',
          authDomain: 'watcha3-191815.firebaseapp.com',
          databaseURL: 'https://com',
          projectId: 'watcha3-191815',
          storageBucket: 'watcha3-191815.appspot.com',
          messagingSenderId: '271822572791',
          appId: '1:271822572791:web:2e31bfd34ccabe551597f2',
        };
        const inVvalidConfigurationAppIDIsNumber = {
          apiKey: 'AIzaSyCmjgbWZjUcDYxV2d0DxbiuroFrftW7qrQ',
          authDomain: 'watcha3-191815.firebaseapp.com',
          databaseURL: 'https://watcha3-191815.firebaseio.com',
          storageBucket: 'watcha3-191815.appspot.com',
          messagingSenderId: '271822572791',
          appId: 0,
        };
        const inVvalidConfigurationInvalidDatabaseURLTwo = {
          apiKey: 'AIzaSyCmjgbWZjUcDYxV2d0DxbiuroFrftW7qrQ',
          authDomain: 'watcha3-191815.firebaseapp.com',
          projectId: 'watcha3-191815',
          databaseURL: 'firebaseio. ',
          storageBucket: 'watcha3-191815.appspot.com',
          messagingSenderId: '271822572791',
          appId: '1:271822572791:web:2e31bfd34ccabe551597f2',
        };

        expect(
          validateCAConnectionAuthProviderConnectionConfiguration(
            CA_CONNECTION_AUTH_PROVIDERS.FIREBASE,
            inValidConfigurationNoAPIKey
          )
        ).to.be.equal(false);
        expect(
          validateCAConnectionAuthProviderConnectionConfiguration(
            CA_CONNECTION_AUTH_PROVIDERS.FIREBASE,
            inVvalidConfigurationIvalidDatabaseURL
          )
        ).to.be.equal(false);
        expect(
          validateCAConnectionAuthProviderConnectionConfiguration(
            CA_CONNECTION_AUTH_PROVIDERS.FIREBASE,
            inVvalidConfigurationAppIDIsNumber
          )
        ).to.be.equal(false);
        expect(
          validateCAConnectionAuthProviderConnectionConfiguration(
            CA_CONNECTION_AUTH_PROVIDERS.FIREBASE,
            inVvalidConfigurationInvalidDatabaseURLTwo
          )
        ).to.be.equal(false);
      });
      it('validateCAConnectionAuthProviderConnectionConfiguration should return false for invalid auth provider type', () => {
        const validConfigurationOne = {
          apiKey: 'AIzaSyCwmUlVklNmGZ0SD11NKT8gpvmZXbgbBRk',
          authDomain: 'protocol-f251b.firebaseapp.com',
          databaseURL: 'https://protocol-f251b.firebaseio.com',
          projectId: 'protocol-f251b',
          storageBucket: '',
          messagingSenderId: '275196342406',
          appId: '1:275196342406:web:40b79d671c50af57',
        };

        expect(
          validateCAConnectionAuthProviderConnectionConfiguration(
            10000,
            validConfigurationOne
          )
        ).to.be.equal(false);
        expect(
          validateCAConnectionAuthProviderConnectionConfiguration(
            {} as any,
            validConfigurationOne
          )
        ).to.be.equal(false);
        expect(
          validateCAConnectionAuthProviderConnectionConfiguration(
            '' as any,
            validConfigurationOne
          )
        ).to.be.equal(false);
        expect(
          validateCAConnectionAuthProviderConnectionConfiguration(
            undefined as any,
            validConfigurationOne
          )
        ).to.be.equal(false);
      });
    });
  });
};
