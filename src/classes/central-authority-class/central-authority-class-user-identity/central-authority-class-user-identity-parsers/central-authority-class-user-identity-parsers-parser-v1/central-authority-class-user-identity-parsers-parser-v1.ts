import { IParser } from '../central-authority-class-user-identity-parsers.types';
import { ICAUserIdentityDescription } from '../../central-authority-class-user-identity.types';
import { CA_USER_IDENTITY_PARSER_IDENTITY_MIN_CHARACTERS_COUNT } from './central-authority-class-user-identity-parsers-parser-v1.const';

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
  }
  return new Error('The given user identity have a wrong type');
};
