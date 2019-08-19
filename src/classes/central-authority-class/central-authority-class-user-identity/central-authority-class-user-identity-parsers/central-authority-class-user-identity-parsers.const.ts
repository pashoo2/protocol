import { CAUserIdentityParserV1 } from './central-authority-class-user-identity-parsers-parser-v1';
import { IParser } from './central-authority-class-user-identity-parsers.types';
import { ownValueOf } from 'types/helper.types';
import { CA_USER_IDENTITY_PARSER_VERSIONS } from '../central-authority-class-user-identity.const';

export const CA_USER_IDENTITY_PARSER_TO_VERSION: {
  [key in ownValueOf<typeof CA_USER_IDENTITY_PARSER_VERSIONS>]: IParser
} = {
  '01': CAUserIdentityParserV1,
};
