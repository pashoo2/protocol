//import '@type/jest';
import validateUserIdentifier from '../../../classes/swarm-message/swarm-message-subclasses/swarm-message-subclass-validators/swarm-message-subclass-validator-fields-validator/swarm-message-subclass-validator-fields-validator-validators/central-authority-common-validator-user-identifier/central-authority-common-validator-user-identifier';
import CentralAuthorityIdentity from '../../../classes/central-authority-class/central-authority-class-user-identity/central-authority-class-user-identity';
import {
  CA_USER_IDENTITY_AUTH_PROVIDER_IDENTIFIER_PROP_NAME,
  CA_USER_IDENTITY_USER_UNIQUE_IDENTFIER_PROP_NAME,
  CA_USER_IDENTITY_VERSION_PROP_NAME,
  CA_USER_IDENTITY_VERSIONS,
} from '../../../classes/central-authority-class/central-authority-class-user-identity/central-authority-class-user-identity.const';
import { generateUUID } from '../../../utils/identity-utils/identity-utils';

describe('validateUserIdentifier tests', () => {
  const userUUIDV1 = generateUUID();
  const userIdentityProviderURLV1 = 'https://identity.provider.com';
  const userUUIDV2 = 'this_is_test_login';
  const userIdentityProviderURLV2 = 'https://identity.provider-v2.com';

  it('validateUserIdentifier should not fail with a valid identifier string v1', () => {
    const userIdentityMeta = {
      [CA_USER_IDENTITY_AUTH_PROVIDER_IDENTIFIER_PROP_NAME]: 'https://google.com',
      [CA_USER_IDENTITY_USER_UNIQUE_IDENTFIER_PROP_NAME]: userUUIDV1,
      [CA_USER_IDENTITY_VERSION_PROP_NAME]: CA_USER_IDENTITY_VERSIONS['01'],
    };
    const userIdentity = new CentralAuthorityIdentity(userIdentityMeta);

    expect(validateUserIdentifier(String(userIdentity))).toBeUndefined();
  });
  it('validateUserIdentifier should fail with invalid identifier string v1', () => {
    expect(() => validateUserIdentifier(`01${userUUIDV2}https://google.com`)).toThrow();
  });
  it('validateUserIdentifier should not fail with a valid identifier string v2', () => {
    const userIdentityMeta = {
      [CA_USER_IDENTITY_AUTH_PROVIDER_IDENTIFIER_PROP_NAME]: 'https://google.com',
      [CA_USER_IDENTITY_USER_UNIQUE_IDENTFIER_PROP_NAME]: userUUIDV2,
      [CA_USER_IDENTITY_VERSION_PROP_NAME]: CA_USER_IDENTITY_VERSIONS['02'],
    };
    const userIdentity = new CentralAuthorityIdentity(userIdentityMeta);

    expect(validateUserIdentifier(String(userIdentity))).toBeUndefined();
  });
  it('validateUserIdentifier should fail with invalid identifier string v2', () => {
    expect(() => validateUserIdentifier(`02https://googlecom|${userUUIDV1}`)).toThrow();
  });
  it('validateUserIdentifier should fail with valid identifier string v1 but supproted version is v2', () => {
    const userIdentityMeta = {
      [CA_USER_IDENTITY_AUTH_PROVIDER_IDENTIFIER_PROP_NAME]: 'https://google.com',
      [CA_USER_IDENTITY_USER_UNIQUE_IDENTFIER_PROP_NAME]: userUUIDV1,
      [CA_USER_IDENTITY_VERSION_PROP_NAME]: CA_USER_IDENTITY_VERSIONS['01'],
    };
    const userIdentity = new CentralAuthorityIdentity(userIdentityMeta);

    expect(() => validateUserIdentifier(String(userIdentity), ['02'])).toThrow();
  });
  it('validateUserIdentifier should not fail with valid identifier string v1 and supproted version is v1', () => {
    const userIdentityMeta = {
      [CA_USER_IDENTITY_AUTH_PROVIDER_IDENTIFIER_PROP_NAME]: 'https://google.com',
      [CA_USER_IDENTITY_USER_UNIQUE_IDENTFIER_PROP_NAME]: userUUIDV1,
      [CA_USER_IDENTITY_VERSION_PROP_NAME]: CA_USER_IDENTITY_VERSIONS['01'],
    };
    const userIdentity = new CentralAuthorityIdentity(userIdentityMeta);

    expect(() => validateUserIdentifier(String(userIdentity), ['01'])).not.toThrow();
  });
  it('validateUserIdentifier should not fail with valid identifier string v2 and supproted version is v2', () => {
    const userIdentityMeta = {
      [CA_USER_IDENTITY_AUTH_PROVIDER_IDENTIFIER_PROP_NAME]: 'https://google.com',
      [CA_USER_IDENTITY_USER_UNIQUE_IDENTFIER_PROP_NAME]: userUUIDV2,
      [CA_USER_IDENTITY_VERSION_PROP_NAME]: CA_USER_IDENTITY_VERSIONS['02'],
    };
    const userIdentity = new CentralAuthorityIdentity(userIdentityMeta);

    expect(validateUserIdentifier(String(userIdentity), ['02'])).not.toThrow();
  });
  it('validateUserIdentifier should fail with valid identifier string v2 but supproted version is v1', () => {
    const userIdentityMeta = {
      [CA_USER_IDENTITY_AUTH_PROVIDER_IDENTIFIER_PROP_NAME]: 'https://google.com',
      [CA_USER_IDENTITY_USER_UNIQUE_IDENTFIER_PROP_NAME]: userUUIDV2,
      [CA_USER_IDENTITY_VERSION_PROP_NAME]: CA_USER_IDENTITY_VERSIONS['02'],
    };
    const userIdentity = new CentralAuthorityIdentity(userIdentityMeta);

    expect(() => validateUserIdentifier(String(userIdentity), ['01'])).toThrow();
  });
});
