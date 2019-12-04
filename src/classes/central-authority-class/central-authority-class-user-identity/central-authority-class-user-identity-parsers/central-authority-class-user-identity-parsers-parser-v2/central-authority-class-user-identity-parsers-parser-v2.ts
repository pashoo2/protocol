import { IParser } from '../central-authority-class-user-identity-parsers.types';
import { ICAUserIdentityDescription } from '../../central-authority-class-user-identity.types';
import {
  CA_USER_IDENTITY_PARSER_IDENTITY_MIN_CHARACTERS_COUNT,
  CA_USER_IDENTITY_V2_AUTH_PROVIDER_URL_DELIMETER,
} from './central-authority-class-user-identity-parsers-parser-v2.const';
import { getUserIdentityDescription } from '../central-authority-class-user-identity-parsers.utils';
import { CA_USER_IDENTITY_UNIQUE_IDENTIFIER_MAX_LENGTH } from 'classes/central-authority-class/central-authority-class-const/central-authority-class-const';

/**
 * this will deserizlize the unique identifier
 * from a stirng to an object. The user's login
 * is used as the unique identifier of the user
 * on the auht provider service.
 *
 * @param {string} userIdentityWithoutVersion - the user's
 * serialized unique identifier in the swarm
 */
export const CAUserIdentityParserV2: IParser = (
  userIdentityWithoutVersion: string
): ICAUserIdentityDescription | Error => {
  if (typeof userIdentityWithoutVersion === 'string') {
    if (
      userIdentityWithoutVersion.length <
      CA_USER_IDENTITY_PARSER_IDENTITY_MIN_CHARACTERS_COUNT
    ) {
      return new Error('The given user identity have a too small length');
    }

    const delimeterPosition = userIdentityWithoutVersion.lastIndexOf(
      CA_USER_IDENTITY_V2_AUTH_PROVIDER_URL_DELIMETER
    );

    // TODO - rewrite tests for the identity
    if (delimeterPosition === -1) {
      return new Error('The delimeter character was not found in the string');
    }

    const userIdentity = userIdentityWithoutVersion.slice(-delimeterPosition);
    const authProviderIdentity = userIdentityWithoutVersion.slice(
      0,
      userIdentityWithoutVersion.length -
        CA_USER_IDENTITY_UNIQUE_IDENTIFIER_MAX_LENGTH
    );

    return getUserIdentityDescription(userIdentity, authProviderIdentity);
  }
  return new Error('The given user identity have a wrong type');
};
