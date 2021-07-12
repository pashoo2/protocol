import { CA_USER_IDENTITY_UNIQUE_IDENTIFIER_MIN_LENGTH, CA_USER_IDENTITY_AUTHORITY_IDENTIFIER_MIN_LENGTH, CA_USER_IDENTITY_UNIQUE_IDENTIFIER_MAX_LENGTH, CA_USER_IDENTITY_AUTHORITY_IDENTIFIER_MAX_LENGTH, } from "../../../central-authority-class-const/central-authority-class-const";
import { CA_USER_IDENTITY_AUTH_PROVIDER_URL_DELIMETER } from '../../central-authority-class-user-identity.const';
export const CA_USER_IDENTITY_PARSER_IDENTITY_MIN_CHARACTERS_COUNT = CA_USER_IDENTITY_UNIQUE_IDENTIFIER_MIN_LENGTH + CA_USER_IDENTITY_AUTHORITY_IDENTIFIER_MIN_LENGTH;
export const CA_USER_IDENTITY_PARSER_IDENTITY_MAX_CHARACTERS_COUNT = CA_USER_IDENTITY_UNIQUE_IDENTIFIER_MAX_LENGTH + CA_USER_IDENTITY_AUTHORITY_IDENTIFIER_MAX_LENGTH + 1;
export const CA_USER_IDENTITY_V2_AUTH_PROVIDER_URL_DELIMETER = CA_USER_IDENTITY_AUTH_PROVIDER_URL_DELIMETER;
//# sourceMappingURL=central-authority-class-user-identity-parsers-parser-v2.const.js.map