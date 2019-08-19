import { CentralAuthorityIdentity } from 'classes/central-authority-class/central-authority-class-user-identity/central-authority-class-user-identity';
import {
  CA_USER_IDENTITY_AUTH_PROVIDER_IDENTIFIER_PROP_NAME,
  CA_USER_IDENTITY_USER_UNIQUE_IDENTFIER_PROP_NAME,
  CA_USER_IDENTITY_VERSION_PROP_NAME,
} from 'classes/central-authority-class/central-authority-class-user-identity/central-authority-class-user-identity.const';
import { generateUUID } from 'utils/identity-utils/identity-utils';
import { validateIdentityDescriptionVersion } from 'classes/central-authority-class/central-authority-class-user-identity/central-authority-class-user-identity-validators/central-authority-class-user-identity-validators';

export const runTestCAIdentity = async () => {
  const testIdentityDescription = {
    [CA_USER_IDENTITY_AUTH_PROVIDER_IDENTIFIER_PROP_NAME]: 'https://google.com',
    [CA_USER_IDENTITY_USER_UNIQUE_IDENTFIER_PROP_NAME]: generateUUID(),
  };
  const identityValue = new CentralAuthorityIdentity(testIdentityDescription);
  const { identityDescritptionSerialized, identityDescription } = identityValue;
  debugger;
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
    return;
  } else {
    console.error('The identityDescription property must no be empty');
    return;
  }
};
