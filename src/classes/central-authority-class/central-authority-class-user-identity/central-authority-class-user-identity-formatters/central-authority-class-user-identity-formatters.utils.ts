import { IUserIdentityFormatter } from './central-authority-class-user-identity-formatters.types';
import {
  validateUserIdentityDescriptionVersion,
  validateUserIdentityDescription,
} from '../central-authority-class-user-identity-validators/central-authority-class-user-identity-validators';
import { CA_USER_IDENTITY_VERSION_PROP_NAME, CA_USER_IDENTITY_PARSER_VERSIONS_SUPPORTED } from '../central-authority-class-user-identity.const';
import { CA_USER_IDENTITY_FORMATTERS_BY_VERSION } from './central-authority-class-user-identity-formatters.const';
import { ICAUserUniqueIdentifierDescription } from '../central-authority-class-user-identity.types';
import { TCentralAuthorityUserIdentity } from 'classes/central-authority-class/central-authority-class-types/central-authority-class-types';
import { validateUserIdentity } from 'classes/central-authority-class/central-authority-validators/central-authority-validators-auth-credentials/central-authority-validators-auth-credentials';

export const getSerializerForIdentityVersion = (userIdentityVersion: string): Error | IUserIdentityFormatter => {
  const serializerFunction = CA_USER_IDENTITY_FORMATTERS_BY_VERSION[userIdentityVersion];

  if (typeof serializerFunction === 'function') {
    return serializerFunction;
  }
  return new Error(`There is no serializer was found for the identity version ${userIdentityVersion}`);
};

export const serializeIdentity = (identity: ICAUserUniqueIdentifierDescription): TCentralAuthorityUserIdentity | Error => {
  const validationResult = validateUserIdentityDescription(identity);

  if (validationResult instanceof Error) {
    return new Error('The user identity description have a wrong format');
  }

  const { [CA_USER_IDENTITY_VERSION_PROP_NAME]: version } = identity;

  if (!CA_USER_IDENTITY_PARSER_VERSIONS_SUPPORTED.includes(version)) {
    return new Error(`The version of the user identity given is not supported`);
  }

  const serializerFunction = getSerializerForIdentityVersion(version);

  if (serializerFunction instanceof Error) {
    console.error(serializerFunction);
    return new Error(`There is no serializer function for the user identity description version ${version}`);
  }

  const serializeResult = serializerFunction(identity);

  if (serializeResult instanceof Error) {
    return new Error(`Failed serialization for the user identity description version ${version}`);
  }
  if (!validateUserIdentity(serializeResult)) {
    return new Error(`Failed serialization to the right format for the user identity description version ${version}`);
  }
  return serializeResult;
};
