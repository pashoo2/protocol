import { CA_USER_IDENTITY_AUTHORITY_IDENTIFIER_MIN_LENGTH, CA_USER_IDENTITY_AUTHORITY_IDENTIFIER_MAX_LENGTH, } from "../../../central-authority-class-const/central-authority-class-const";
import { CONST_VALUES_RESTRICTIONS_COMMON_UUID_V4_MAX_LENGTH } from "../../../../../const/const-values-restrictions-common";
export const CA_USER_IDENTITY_AUTHORITY_IDENTIFIER_LENGTH = CONST_VALUES_RESTRICTIONS_COMMON_UUID_V4_MAX_LENGTH;
export const CA_USER_IDENTITY_PARSER_IDENTITY_MIN_CHARACTERS_COUNT = CA_USER_IDENTITY_AUTHORITY_IDENTIFIER_MIN_LENGTH + CA_USER_IDENTITY_AUTHORITY_IDENTIFIER_LENGTH;
export const CA_USER_IDENTITY_PARSER_IDENTITY_MAX_CHARACTERS_COUNT = CA_USER_IDENTITY_AUTHORITY_IDENTIFIER_MAX_LENGTH + CA_USER_IDENTITY_AUTHORITY_IDENTIFIER_LENGTH;
//# sourceMappingURL=central-authority-class-user-identity-parsers-parser-v1.const.js.map