import { CentralAuthorityIdentity } from 'classes/central-authority-class/central-authority-class-user-identity/central-authority-class-user-identity';
import {
  CA_USER_IDENTITY_AUTH_PROVIDER_IDENTIFIER_PROP_NAME,
  CA_USER_IDENTITY_USER_UNIQUE_IDENTFIER_PROP_NAME,
  CA_USER_IDENTITY_VERSION_PROP_NAME,
  CA_USER_IDENTITY_VERSIONS,
} from 'classes/central-authority-class/central-authority-class-user-identity/central-authority-class-user-identity.const';
import { generateUUID } from 'utils/identity-utils/identity-utils';
import { validateUserIdentityInstance } from './central-authority-identity.utils';
import { CA_USER_IDENTITY_V2_AUTH_PROVIDER_URL_DELIMETER } from 'classes/central-authority-class/central-authority-class-user-identity/central-authority-class-user-identity-parsers/central-authority-class-user-identity-parsers-parser-v2/central-authority-class-user-identity-parsers-parser-v2.const';

export const testIdentity = (userIdOnAuthProvider: string): void | boolean => {
  const testIdentityDescription = {
    [CA_USER_IDENTITY_AUTH_PROVIDER_IDENTIFIER_PROP_NAME]: 'https://google.com',
    [CA_USER_IDENTITY_USER_UNIQUE_IDENTFIER_PROP_NAME]: userIdOnAuthProvider,
    [CA_USER_IDENTITY_VERSION_PROP_NAME]: CA_USER_IDENTITY_VERSIONS['02'],
  };
  const identityValue = new CentralAuthorityIdentity(testIdentityDescription);

  if (!validateUserIdentityInstance(identityValue, testIdentityDescription)) {
    console.error('Failed to create an instance of CAIdentity');
    return;
  }

  const { identityDescritptionSerialized } = identityValue;
  const identityFromIdentityString = new CentralAuthorityIdentity(
    identityDescritptionSerialized as string
  );

  if (
    !validateUserIdentityInstance(
      identityFromIdentityString,
      testIdentityDescription
    )
  ) {
    console.error(
      'Failed to create an instance of CAIdentity from identityDescritptionSerialized of the test Identity description'
    );
    return;
  }

  const { id: userIdentifier } = identityFromIdentityString;

  if (userIdentifier instanceof Error || typeof userIdentifier !== 'string') {
    console.error(
      'The user identifier (id) prop must not be an error for a valid identity'
    );
    return;
  }
  return true;
};

export const runTestCAIdentityV2 = async () => {
  if (!testIdentity(generateUUID())) {
    console.error('UUIDv4 must be valid as user login on the auth server');
    return;
  }
  if (!testIdentity('nnn@gmail.com')) {
    console.error('email must be valid as user login on the auth server');
    return;
  }
  if (!testIdentity('#$%^&_()[]___@_.33.333..__3')) {
    console.error(
      'the login format must be valid as user login on the auth server'
    );
    return;
  }

  const testIdentityDescriptionWithWrongLogin = {
    [CA_USER_IDENTITY_AUTH_PROVIDER_IDENTIFIER_PROP_NAME]: 'https://google.com',
    [CA_USER_IDENTITY_USER_UNIQUE_IDENTFIER_PROP_NAME]: '.11',
    [CA_USER_IDENTITY_VERSION_PROP_NAME]: CA_USER_IDENTITY_VERSIONS['02'],
  };
  const identityValueFromWrongLogin = new CentralAuthorityIdentity(
    testIdentityDescriptionWithWrongLogin
  );

  if (
    validateUserIdentityInstance(
      identityValueFromWrongLogin,
      testIdentityDescriptionWithWrongLogin
    )
  ) {
    console.error(
      'Wrong guid value does not recognized in the identifier description'
    );
    return;
  }

  const testIdentityDescriptionWithWrongURL = {
    [CA_USER_IDENTITY_AUTH_PROVIDER_IDENTIFIER_PROP_NAME]: 'googlecom',
    [CA_USER_IDENTITY_USER_UNIQUE_IDENTFIER_PROP_NAME]:
      '76d55caf-fc4a-41a9-8844-19877dcb19ad',
    [CA_USER_IDENTITY_VERSION_PROP_NAME]: CA_USER_IDENTITY_VERSIONS['02'],
  };
  const identityValueFromWrongURL = new CentralAuthorityIdentity(
    testIdentityDescriptionWithWrongURL
  );

  if (
    validateUserIdentityInstance(
      identityValueFromWrongURL,
      testIdentityDescriptionWithWrongURL
    )
  ) {
    console.error(
      'Wrong url value does not recognized in the identifier description'
    );
    return;
  }

  const testIdentityStringnWithWrongURL = `02htt://googlecom${CA_USER_IDENTITY_V2_AUTH_PROVIDER_URL_DELIMETER}76d55caf-fc4a-41a9-8844-19877dcb19ad`;
  const identityValueFromStringWrongURL = new CentralAuthorityIdentity(
    testIdentityStringnWithWrongURL
  );

  if (
    validateUserIdentityInstance(identityValueFromStringWrongURL, {
      [CA_USER_IDENTITY_AUTH_PROVIDER_IDENTIFIER_PROP_NAME]: 'htt://googlecom',
      [CA_USER_IDENTITY_USER_UNIQUE_IDENTFIER_PROP_NAME]:
        '76d55caf-fc4a-41a9-8844-19877dcb19ad',
      [CA_USER_IDENTITY_VERSION_PROP_NAME]: CA_USER_IDENTITY_VERSIONS['02'],
    })
  ) {
    console.error(
      'Wrong url value does not recognized in the identifier string'
    );
    return;
  }
  if (
    !(
      (identityValueFromStringWrongURL as CentralAuthorityIdentity)
        .id instanceof Error
    )
  ) {
    console.error(
      'The user identifier (id) prop must be an error for a wrong authority url'
    );
    return;
  }

  const testIdentityStringnWithWrongLogin = `02https://google.com${CA_USER_IDENTITY_V2_AUTH_PROVIDER_URL_DELIMETER}.44`;
  const identityValueFromStringWrongLogin = new CentralAuthorityIdentity(
    testIdentityStringnWithWrongLogin
  );

  if (
    validateUserIdentityInstance(identityValueFromStringWrongLogin, {
      [CA_USER_IDENTITY_AUTH_PROVIDER_IDENTIFIER_PROP_NAME]:
        'https://google.com',
      [CA_USER_IDENTITY_USER_UNIQUE_IDENTFIER_PROP_NAME]: '.44',
      [CA_USER_IDENTITY_VERSION_PROP_NAME]: CA_USER_IDENTITY_VERSIONS['02'],
    })
  ) {
    console.error(
      'Wrong UUID value does not recognized in the identifier string'
    );
    return;
  }
  if (
    !(
      (identityValueFromStringWrongLogin as CentralAuthorityIdentity)
        .id instanceof Error
    )
  ) {
    console.error('The userIdentifier prop must be an error for a wrong uuid');
    return;
  }
  const testIdentityStringnWithWrongVersionUnsupported = `99https://google.com${CA_USER_IDENTITY_V2_AUTH_PROVIDER_URL_DELIMETER}121`;
  const identityValueFromStringWrongVersionUnsupported = new CentralAuthorityIdentity(
    testIdentityStringnWithWrongVersionUnsupported
  );
  const testIdentityDescriptionWithVersionUnsupported = {
    [CA_USER_IDENTITY_AUTH_PROVIDER_IDENTIFIER_PROP_NAME]: 'https://google.com',
    [CA_USER_IDENTITY_USER_UNIQUE_IDENTFIER_PROP_NAME]: '121',
    [CA_USER_IDENTITY_VERSION_PROP_NAME]: '99',
  };
  if (
    validateUserIdentityInstance(
      identityValueFromStringWrongVersionUnsupported,
      testIdentityDescriptionWithVersionUnsupported
    )
  ) {
    console.error(
      `The version unsupported 99 does not recognized in the identifier string`
    );
    return;
  }
  const identityValueFromIdentityDescriptionWrongVersionUnsupported = new CentralAuthorityIdentity(
    testIdentityDescriptionWithVersionUnsupported
  );

  if (
    validateUserIdentityInstance(
      identityValueFromIdentityDescriptionWrongVersionUnsupported,
      testIdentityDescriptionWithVersionUnsupported
    )
  ) {
    console.error(
      `The version unsupported 99 does not recognized in the identifier string`
    );
    return;
  }
  if (
    !(
      (identityValueFromIdentityDescriptionWrongVersionUnsupported as CentralAuthorityIdentity)
        .id instanceof Error
    )
  ) {
    console.error(
      'The user identifier (id) prop must be an error for unsupported identity version'
    );
    return;
  }
  console.warn('The user identity description test is succesfull');
};
