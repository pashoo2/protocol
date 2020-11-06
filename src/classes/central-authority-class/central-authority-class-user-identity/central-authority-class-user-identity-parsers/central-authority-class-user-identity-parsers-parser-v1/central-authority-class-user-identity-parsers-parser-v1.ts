import { IParser } from '../central-authority-class-user-identity-parsers.types';
import { ICAUserIdentityDescription } from '../../central-authority-class-user-identity.types';
import {
  CA_USER_IDENTITY_PARSER_IDENTITY_MIN_CHARACTERS_COUNT,
  CA_USER_IDENTITY_AUTHORITY_IDENTIFIER_LENGTH,
  CA_USER_IDENTITY_PARSER_IDENTITY_MAX_CHARACTERS_COUNT,
} from './central-authority-class-user-identity-parsers-parser-v1.const';
import { getUserIdentityDescription } from '../central-authority-class-user-identity-parsers.utils';
import { normalizeUrl } from 'utils/common-utils/common-utils-url';

/**
 * this is unique identifier of the user
 * in the swarm. A guid value will be
 * used to identify the user on the auth
 * provider service.
 *
 * @param userIdentityWithoutVersion
 */
export const CAUserIdentityParserV1: IParser = (userIdentityWithoutVersion: string): ICAUserIdentityDescription | Error => {
  if (typeof userIdentityWithoutVersion === 'string') {
    if (userIdentityWithoutVersion.length < CA_USER_IDENTITY_PARSER_IDENTITY_MIN_CHARACTERS_COUNT) {
      return new Error('The given user identity have a too small length');
    }
    if (userIdentityWithoutVersion.length > CA_USER_IDENTITY_PARSER_IDENTITY_MAX_CHARACTERS_COUNT) {
      return new Error('The given user identity have a too big length');
    }

    const userIdentity = userIdentityWithoutVersion.slice(-CA_USER_IDENTITY_AUTHORITY_IDENTIFIER_LENGTH);
    const authProviderIdentity = normalizeUrl(
      userIdentityWithoutVersion.slice(0, userIdentityWithoutVersion.length - CA_USER_IDENTITY_AUTHORITY_IDENTIFIER_LENGTH)
    );

    if (authProviderIdentity instanceof Error) {
      return authProviderIdentity;
    }
    return getUserIdentityDescription(userIdentity, authProviderIdentity);
  }
  return new Error('The given user identity have a wrong type');
};
