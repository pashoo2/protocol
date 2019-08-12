import { TCentralAuthorityUserIdentity } from 'classes/central-authority-class/central-authority-class-types/central-authority-class-types';
import { validateUserIdentity } from 'classes/central-authority-class/central-authority-validators/central-authority-validators-auth-credentials/central-authority-validators-auth-credentials';
import {
  CA_USER_IDENTITY_PARSER_VERSION_CHARACTERS_COUNT,
  CA_USER_IDENTITY_PARSER_TO_VERSION,
} from './central-authority-class-user-identity-parsers.const';
import { IParser } from './central-authority-class-user-identity-parsers.types';
import {
  ICAUserIdentityDescription,
  TCAuthProviderIdentifier,
  TCAuthProviderUserIdentifier,
  ICAUserUniqueIdentifierDescription,
} from '../central-authority-class-user-identity.types';
import {
  CA_USER_IDENTITY_AUTH_PROVIDER_IDENTIFIER_PROP_NAME,
  CA_USER_IDENTITY_USER_UNIQUE_IDENTFIER_PROP_NAME,
  CA_USER_IDENTIT_VERSION_PROP_NAME,
} from '../central-authority-class-user-identity.const';
import {
  validateUserIdentityDescriptionVersion,
  validateIdentityDescriptionVersion,
} from '../central-authority-class-user-identity-validators/central-authority-class-user-identity-validators.utils';

export function getIdentifierVersionByIdentityString(
  identityString: TCentralAuthorityUserIdentity
): Error | string {
  if (validateUserIdentity(identityString)) {
    return identityString.slice(
      0,
      CA_USER_IDENTITY_PARSER_VERSION_CHARACTERS_COUNT
    );
  }
  return new Error('The user identity is not valid');
}

export const getParserFunctionByVersion = (
  version: string
): IParser | Error => {
  if (validateIdentityDescriptionVersion(version)) {
    const parser = CA_USER_IDENTITY_PARSER_TO_VERSION[version];

    if (parser) {
      return parser;
    }
    return new Error(`There is no parser defined for the version ${version}`);
  }
  return new Error('The version has a wrong type or format');
};

export const getUserIdentityDescription = (
  userIdentity: TCAuthProviderUserIdentifier,
  authProviderIdentity: TCAuthProviderIdentifier
): ICAUserIdentityDescription | Error => {
  const description = {
    [CA_USER_IDENTITY_AUTH_PROVIDER_IDENTIFIER_PROP_NAME]: authProviderIdentity,
    [CA_USER_IDENTITY_USER_UNIQUE_IDENTFIER_PROP_NAME]: userIdentity,
  };

  // TODO -check the user identity description
  return description;
};

export const parseIdentity = (
  identityString: TCentralAuthorityUserIdentity
): ICAUserUniqueIdentifierDescription | Error => {
  const version = getIdentifierVersionByIdentityString(identityString);

  if (version instanceof Error) {
    console.error(version);
    return new Error("Can't define a version by the identity string");
  }

  const parser = getParserFunctionByVersion(version);

  if (parser instanceof Error) {
    return new Error("Can't define a parser function by identity string");
  }

  const versionStringLength = version.length;
  const identityStringWithoutVersion = identityString.slice(
    0,
    versionStringLength
  );
  const parsedIdentity = parser(identityStringWithoutVersion);

  if (parsedIdentity instanceof Error) {
    console.error(parsedIdentity);
    return new Error("Can't parse the identity string");
  }

  const resultedUserIdentityDescription: ICAUserUniqueIdentifierDescription = {
    ...parsedIdentity,
    [CA_USER_IDENTIT_VERSION_PROP_NAME]: version,
  };
  const validationResult = validateUserIdentityDescriptionVersion(
    version,
    resultedUserIdentityDescription
  );

  if (validationResult instanceof Error) {
    return validationResult;
  }
  return resultedUserIdentityDescription;
};
