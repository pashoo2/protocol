import { IParser } from '../central-authority-class-user-identity-parsers.types';
import { ICAUserIdentityDescription } from '../../central-authority-class-user-identity.types';
import { CA_USER_IDENTITY_PARSER_IDENTITY_MIN_CHARACTERS_COUNT } from './central-authority-class-user-identity-parsers-parser-v1.const';
import { getUserIdentityDescription } from '../central-authority-class-user-identity-parsers.utils';
import { CA_USER_IDENTITY_UNIQUE_IDENTIFIER_MAX_LENGTH } from 'classes/central-authority-class/central-authority-class-const/central-authority-class-const';

export const CAUserIdentityParserV1: IParser = (
  userIdentityWithoutVersion: string
): ICAUserIdentityDescription | Error => {
  if (typeof userIdentityWithoutVersion === 'string') {
    if (
      userIdentityWithoutVersion.length <
      CA_USER_IDENTITY_PARSER_IDENTITY_MIN_CHARACTERS_COUNT
    ) {
      return new Error('The given user identity have a too small length');
    }

    const userIdentity = userIdentityWithoutVersion.slice(
      -CA_USER_IDENTITY_UNIQUE_IDENTIFIER_MAX_LENGTH
    );
    const authProviderIdentity = userIdentityWithoutVersion.slice(
      0,
      userIdentityWithoutVersion.length -
        CA_USER_IDENTITY_UNIQUE_IDENTIFIER_MAX_LENGTH
    );

    return getUserIdentityDescription(userIdentity, authProviderIdentity);
  }
  return new Error('The given user identity have a wrong type');
};
