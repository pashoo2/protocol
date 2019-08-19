import { CentralAuthorityIdentity } from 'classes/central-authority-class/central-authority-class-user-identity/central-authority-class-user-identity';
import {
  CA_USER_IDENTITY_AUTH_PROVIDER_IDENTIFIER_PROP_NAME,
  CA_USER_IDENTITY_USER_UNIQUE_IDENTFIER_PROP_NAME,
  CA_USER_IDENTITY_VERSION_PROP_NAME,
} from 'classes/central-authority-class/central-authority-class-user-identity/central-authority-class-user-identity.const';
import { generateUUID } from 'utils/identity-utils/identity-utils';
import { validateIdentityDescriptionVersion } from 'classes/central-authority-class/central-authority-class-user-identity/central-authority-class-user-identity-validators/central-authority-class-user-identity-validators';
import { validateUserIdentity } from 'classes/central-authority-class/central-authority-validators/central-authority-validators-auth-credentials/central-authority-validators-auth-credentials';
import {
  ICAUserUniqueIdentifierDescription,
  ICAUserUniqueIdentifierDescriptionWithOptionalVersion,
} from 'classes/central-authority-class/central-authority-class-user-identity/central-authority-class-user-identity.types';

const validateIdentityDescription = (
  identityDescription: ICAUserUniqueIdentifierDescription | Error,
  testIdentityDescription: ICAUserUniqueIdentifierDescriptionWithOptionalVersion
): undefined | boolean => {
  if (identityDescription instanceof Error) {
    console.error(identityDescription);
    console.error('Failed to serialize the test description');
    return;
  }
  if (identityDescription) {
    const {
      [CA_USER_IDENTITY_AUTH_PROVIDER_IDENTIFIER_PROP_NAME]: identityDescriptionAuthProvider,
      [CA_USER_IDENTITY_USER_UNIQUE_IDENTFIER_PROP_NAME]: identityDescriptionUUID,
      [CA_USER_IDENTITY_VERSION_PROP_NAME]: identityDescriptionVersion,
    } = identityDescription;
    const {
      [CA_USER_IDENTITY_AUTH_PROVIDER_IDENTIFIER_PROP_NAME]: testIdentityDescriptionAuthProvider,
      [CA_USER_IDENTITY_USER_UNIQUE_IDENTFIER_PROP_NAME]: testIdentityDescriptionUUID,
    } = testIdentityDescription;

    if (!identityDescriptionVersion) {
      console.error('a version must be defined in identity description');
      return;
    }
    if (!validateIdentityDescriptionVersion(identityDescriptionVersion)) {
      console.error('the version of the identity description is not valid');
      return;
    }
    if (identityDescriptionUUID !== testIdentityDescriptionUUID) {
      console.error('uuid is not the same with the test value');
      return;
    }
    if (
      identityDescriptionAuthProvider !== testIdentityDescriptionAuthProvider
    ) {
      console.error('auth provider is not the same as in the test value');
      return;
    }
    return true;
  }
  console.error('The user identity description is empty');
  return;
};

const validateUserIdentityInstance = (
  identityValue: CentralAuthorityIdentity,
  testIdentityDescription: ICAUserUniqueIdentifierDescriptionWithOptionalVersion
): identityValue is CentralAuthorityIdentity => {
  const { identityDescritptionSerialized, identityDescription } = identityValue;

  if (identityDescription instanceof Error) {
    console.error(identityDescription);
    console.error('Failed to serialize the test description');
    return false;
  }
  if (identityDescritptionSerialized instanceof Error) {
    console.error(identityDescritptionSerialized);
    console.error('Failed to serialize the test user identity description');
    return false;
  }
  if (!validateUserIdentity(identityDescritptionSerialized)) {
    console.error('The user identity serialized has a wrong format');
    return false;
  }
  if (
    !validateIdentityDescription(identityDescription, testIdentityDescription)
  ) {
    console.error('The identity description have a wrong format');
    return false;
  }
  return true;
};

export const runTestCAIdentity = async () => {
  const testIdentityDescription = {
    [CA_USER_IDENTITY_AUTH_PROVIDER_IDENTIFIER_PROP_NAME]: 'https://google.com',
    [CA_USER_IDENTITY_USER_UNIQUE_IDENTFIER_PROP_NAME]: generateUUID(),
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

  const testIdentityDescriptionWithWrongGUID = {
    [CA_USER_IDENTITY_AUTH_PROVIDER_IDENTIFIER_PROP_NAME]: 'https://google.com',
    [CA_USER_IDENTITY_USER_UNIQUE_IDENTFIER_PROP_NAME]:
      '76d55caf-fc4a-41a9-8844-19877dcb19a#',
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
    console.error('Wrong guid value does not recognized');
    return;
  }
  debugger;
  console.warn('The user identity description test is succesfull');
};
