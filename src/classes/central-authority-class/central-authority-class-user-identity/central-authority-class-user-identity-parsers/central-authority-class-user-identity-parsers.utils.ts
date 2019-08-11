import { validateUserIdentity } from 'classes/central-authority-class/central-authority-validators/central-authority-validators-auth-credentials/central-authority-validators-auth-credentials';
import { TCentralAuthorityUserIdentity } from 'classes/central-authority-class/central-authority-class-types/central-authority-class-types';
import {
  CA_USER_IDENTITY_PARSER_VERSION_CHARACTERS_COUNT,
  CA_USER_IDENTITY_PARSER_TO_VERSION,
} from './central-authority-class-user-identity-parsers.const';
import { IParser } from './central-authority-class-user-identity-parsers.types';
import {
  ICAUserIdentityDescription,
  TCAuthProviderIdentifier,
  TCAuthProviderUserIdentifier,
} from '../central-authority-class-user-identity.types';
import {
  CA_USER_IDENTITY_AUTH_PROVIDER_IDENTIFIER_PROP_NAME,
  CA_USER_IDENTITY_USER_UNIQUE_IDENTFIER_PROP_NAME,
} from '../central-authority-class-user-identity.const';

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
  if (
    typeof version === 'string' &&
    version.length === CA_USER_IDENTITY_PARSER_VERSION_CHARACTERS_COUNT
  ) {
    const parser = CA_USER_IDENTITY_PARSER_TO_VERSION[version];

    if (parser) {
      return parser;
    }
    return new Error(`There is no parser defined for the version ${version}`);
  }
  return new Error('The version has a wrong type or format');
};

export const runParserForIdentity(): ICAUserIdentityDescription | Error => {
    // TODO
}

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
