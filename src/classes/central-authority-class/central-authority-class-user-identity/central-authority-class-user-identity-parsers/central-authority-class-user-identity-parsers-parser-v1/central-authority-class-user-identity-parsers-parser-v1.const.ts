import {
  CA_USER_IDENTITY_UNIQUE_IDENTIFIER_MAX_LENGTH,
  CA_USER_IDENTITY_AUTHORITY_IDENTIFIER_MIN_LENGTH,
} from 'classes/central-authority-class/central-authority-class-const/central-authority-class-const';

export const CA_USER_IDENTITY_PARSER_IDENTITY_MIN_CHARACTERS_COUNT =
  CA_USER_IDENTITY_UNIQUE_IDENTIFIER_MAX_LENGTH +
  CA_USER_IDENTITY_AUTHORITY_IDENTIFIER_MIN_LENGTH;
