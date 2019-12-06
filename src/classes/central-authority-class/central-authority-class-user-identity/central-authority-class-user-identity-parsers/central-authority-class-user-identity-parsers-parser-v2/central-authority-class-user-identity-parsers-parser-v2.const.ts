import {
  CA_USER_IDENTITY_UNIQUE_IDENTIFIER_MIN_LENGTH,
  CA_USER_IDENTITY_AUTHORITY_IDENTIFIER_MIN_LENGTH,
  CA_USER_IDENTITY_UNIQUE_IDENTIFIER_MAX_LENGTH,
  CA_USER_IDENTITY_AUTHORITY_IDENTIFIER_MAX_LENGTH,
} from 'classes/central-authority-class/central-authority-class-const/central-authority-class-const';
import { CA_USER_IDENTITY_AUTH_PROVIDER_URL_DELIMETER } from '../../central-authority-class-user-identity.const';

export const CA_USER_IDENTITY_PARSER_IDENTITY_MIN_CHARACTERS_COUNT =
  CA_USER_IDENTITY_UNIQUE_IDENTIFIER_MIN_LENGTH +
  CA_USER_IDENTITY_AUTHORITY_IDENTIFIER_MIN_LENGTH;

/*
  the delimiter character between the user login 
  on auth provider service and the url of the auth
  provider increases the max length on a one character
*/
export const CA_USER_IDENTITY_PARSER_IDENTITY_MAX_CHARACTERS_COUNT =
  CA_USER_IDENTITY_UNIQUE_IDENTIFIER_MAX_LENGTH +
  CA_USER_IDENTITY_AUTHORITY_IDENTIFIER_MAX_LENGTH +
  1;

// this is the delimeter symbol
export const CA_USER_IDENTITY_V2_AUTH_PROVIDER_URL_DELIMETER = CA_USER_IDENTITY_AUTH_PROVIDER_URL_DELIMETER;
