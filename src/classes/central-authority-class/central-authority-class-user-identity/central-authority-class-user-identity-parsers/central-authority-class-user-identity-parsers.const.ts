import { CAUserIdentityParserV1 } from './central-authority-class-user-identity-parsers-parser-v1';
import { IParser } from './central-authority-class-user-identity-parsers.types';
import { ownValueOf } from 'types/helper.types';
import {
  CA_USER_IDENTITY_UNIQUE_IDENTIFIER_MAX_LENGTH,
  CA_USER_IDENTITY_AUTHORITY_IDENTIFIER_MIN_LENGTH,
} from 'classes/central-authority-class/central-authority-class-const/central-authority-class-const';
import { CA_USER_IDENTITY_VERSION_CHARACTERS_COUNT } from '../central-authority-class-user-identity.const';

export const CA_USER_IDENTITY_PARSER_VERSION_CHARACTERS_COUNT = CA_USER_IDENTITY_VERSION_CHARACTERS_COUNT;

export const CA_USER_IDENTITY_PARSER_USER_UNIQUE_IDENTIFIER_CHARACTERS_COUNT = CA_USER_IDENTITY_UNIQUE_IDENTIFIER_MAX_LENGTH;

export const CA_USER_IDENTITY_PARSER_USER_AUTH_PROVIDER_IDENTIFIER_CHARACTERS_MIN_COUNT = CA_USER_IDENTITY_AUTHORITY_IDENTIFIER_MIN_LENGTH;

export const CA_USER_IDENTITY_PARSER_VERSIONS = {
  '01': '01',
};

export const CA_USER_IDENTITY_PARSER_TO_VERSION: {
  [key in ownValueOf<typeof CA_USER_IDENTITY_PARSER_VERSIONS>]: IParser
} = {
  '01': CAUserIdentityParserV1,
};
