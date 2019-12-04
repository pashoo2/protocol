import { CentralAuthorityIdentity } from 'classes/central-authority-class/central-authority-class-user-identity/central-authority-class-user-identity';
import {
  CA_USER_IDENTITY_AUTH_PROVIDER_IDENTIFIER_PROP_NAME,
  CA_USER_IDENTITY_USER_UNIQUE_IDENTFIER_PROP_NAME,
  CA_USER_IDENTITY_VERSION_PROP_NAME,
  CA_USER_IDENTITY_VERSIONS,
} from 'classes/central-authority-class/central-authority-class-user-identity/central-authority-class-user-identity.const';
import { generateUUID } from 'utils/identity-utils/identity-utils';
import { generateCryptoCredentialsWithUserIdentityV1 } from 'classes/central-authority-class/central-authority-utils-common/central-authority-util-crypto-keys/central-authority-util-crypto-keys';
import { CA_CONNECTION_FIREBASE_CONFIG } from '../central-authority.test/central-authority-connection.test/central-authority-connection.test.firebase/central-authority-connection.test.firebase.const';
import { checkIsValidCryptoCredentials } from 'classes/central-authority-class/central-authority-validators/central-authority-validators-crypto-keys/central-authority-validators-crypto-keys';
import { getUserIdentityByCryptoCredentials } from 'classes/central-authority-class/central-authority-utils-common/central-authority-utils-crypto-credentials/central-authority-utils-crypto-credentials';
import { validateUserIdentityInstance } from './central-authority-identity.utils';

export const runTestCAIdentityV1 = async () => {
  const testIdentityDescription = {
    [CA_USER_IDENTITY_AUTH_PROVIDER_IDENTIFIER_PROP_NAME]: 'https://google.com',
    [CA_USER_IDENTITY_USER_UNIQUE_IDENTFIER_PROP_NAME]: generateUUID(),
    [CA_USER_IDENTITY_VERSION_PROP_NAME]: CA_USER_IDENTITY_VERSIONS['01'],
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

  const {
    id: userIdentifier,
  } = identityFromIdentityString as CentralAuthorityIdentity;

  if (userIdentifier instanceof Error || typeof userIdentifier !== 'string') {
    console.error(
      'The user identifier (id) prop must not be an error for a valid identity'
    );
    return;
  }

  const testIdentityDescriptionWithWrongGUID = {
    [CA_USER_IDENTITY_AUTH_PROVIDER_IDENTIFIER_PROP_NAME]: 'https://google.com',
    [CA_USER_IDENTITY_USER_UNIQUE_IDENTFIER_PROP_NAME]:
      '76d55caf-fc4a-41a9-8844-19877dcb19a#',
    [CA_USER_IDENTITY_VERSION_PROP_NAME]: CA_USER_IDENTITY_VERSIONS['01'],
  };
  const identityValueFromWrongGUID = new CentralAuthorityIdentity(
    testIdentityDescriptionWithWrongGUID
  );

  if (
    validateUserIdentityInstance(
      identityValueFromWrongGUID,
      testIdentityDescriptionWithWrongGUID
    )
  ) {
    console.error(
      'Wrong guid value does not recognized in the identifier description'
    );
    return;
  }

  const testIdentityDescriptionWithWrongURL = {
    [CA_USER_IDENTITY_AUTH_PROVIDER_IDENTIFIER_PROP_NAME]: 'google.com',
    [CA_USER_IDENTITY_USER_UNIQUE_IDENTFIER_PROP_NAME]:
      '76d55caf-fc4a-41a9-8844-19877dcb19ad',
    [CA_USER_IDENTITY_VERSION_PROP_NAME]: CA_USER_IDENTITY_VERSIONS['01'],
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

  const testIdentityStringnWithWrongURL =
    '01htt://googlecom76d55caf-fc4a-41a9-8844-19877dcb19ad';
  const identityValueFromStringWrongURL = new CentralAuthorityIdentity(
    testIdentityStringnWithWrongURL
  );

  if (
    validateUserIdentityInstance(identityValueFromStringWrongURL, {
      [CA_USER_IDENTITY_AUTH_PROVIDER_IDENTIFIER_PROP_NAME]: 'htt://googlecom',
      [CA_USER_IDENTITY_USER_UNIQUE_IDENTFIER_PROP_NAME]:
        '76d55caf-fc4a-41a9-8844-19877dcb19ad',
      [CA_USER_IDENTITY_VERSION_PROP_NAME]: CA_USER_IDENTITY_VERSIONS['01'],
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
  const testIdentityStringnWithWrongUUID =
    '01https://google.com76d55caf-fc4a-41a9-8*44-19877dcb19ad';
  const identityValueFromStringWrongUUID = new CentralAuthorityIdentity(
    testIdentityStringnWithWrongUUID
  );

  if (
    validateUserIdentityInstance(identityValueFromStringWrongUUID, {
      [CA_USER_IDENTITY_AUTH_PROVIDER_IDENTIFIER_PROP_NAME]:
        'https://google.com',
      [CA_USER_IDENTITY_USER_UNIQUE_IDENTFIER_PROP_NAME]:
        '76d55caf-fc4a-41a9-8*44-19877dcb19ad',
      [CA_USER_IDENTITY_VERSION_PROP_NAME]: CA_USER_IDENTITY_VERSIONS['01'],
    })
  ) {
    console.error(
      'Wrong UUID value does not recognized in the identifier string'
    );
    return;
  }
  if (
    !(
      (identityValueFromStringWrongUUID as CentralAuthorityIdentity)
        .id instanceof Error
    )
  ) {
    console.error('The userIdentifier prop must be an error for a wrong uuid');
    return;
  }
  const testIdentityStringnWithWrongVersionUnsupported =
    '11https://google.com76d55caf-fc4a-41a9-8144-19877dcb19ad';
  const identityValueFromStringWrongVersionUnsupported = new CentralAuthorityIdentity(
    testIdentityStringnWithWrongVersionUnsupported
  );
  const testIdentityDescriptionWithVersionUnsupported = {
    [CA_USER_IDENTITY_AUTH_PROVIDER_IDENTIFIER_PROP_NAME]: 'https://google.com',
    [CA_USER_IDENTITY_USER_UNIQUE_IDENTFIER_PROP_NAME]:
      '76d55caf-fc4a-41a9-8144-19877dcb19ad',
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

export const runTestCAIdentityWithAuthorityProviderGeneratorV1 = async () => {
  console.warn('runTestCAIdentityWithAuthorityProviderGenerator:started');

  const cryptoCredentials = await generateCryptoCredentialsWithUserIdentityV1({
    [CA_USER_IDENTITY_AUTH_PROVIDER_IDENTIFIER_PROP_NAME]:
      CA_CONNECTION_FIREBASE_CONFIG.databaseURL,
    [CA_USER_IDENTITY_VERSION_PROP_NAME]: CA_USER_IDENTITY_VERSIONS['01'],
  });

  if (!checkIsValidCryptoCredentials(cryptoCredentials)) {
    console.error('The crypto credentials generated is not valid');
    return;
  }

  const userIdentityByCryptoCredentials = getUserIdentityByCryptoCredentials(
    cryptoCredentials
  );
  const caUserIdentity = new CentralAuthorityIdentity(cryptoCredentials);

  if (!caUserIdentity.isValid) {
    console.error('User identity generated is not valid');
    return;
  }
  const stringifiedIdentity = caUserIdentity.toString();

  if (stringifiedIdentity === '') {
    console.error(stringifiedIdentity);
    console.error('Failed to parse the identity');
    return;
  }
  if (stringifiedIdentity !== userIdentityByCryptoCredentials) {
    console.error('Parsed identity is not valid');
    return;
  }
  const identityDescriptionParsed = caUserIdentity.identityDescription;

  if (identityDescriptionParsed instanceof Error) {
    console.error(identityDescriptionParsed);
    console.error('Failed to get description by identity string');
    return;
  }
  if (
    identityDescriptionParsed[
      CA_USER_IDENTITY_AUTH_PROVIDER_IDENTIFIER_PROP_NAME
    ] !== CA_CONNECTION_FIREBASE_CONFIG.databaseURL
  ) {
    console.error('Wrong authority provider url got from the identity string');
    return;
  }
  console.warn('runTestCAIdentityWithAuthorityProviderGenerator:success');
};
