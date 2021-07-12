import { CONST_VALUES_RESTRICTIONS_COMMON_STRING_VALUE_MAX_LENGHT } from "../../../../const/const-values-restrictions-common";
import { CONST_VALIDATION_SCHEMES_URL, CONST_VALIDATION_SCHEMES_EMAIL, CONST_VALIDATION_SCHEMES_INTERNATIONAL_PHONE_NUMBER, } from "../../../../const/const-validation-schemes/const-validation-schemes-common";
const CA_VALIDATORS_USER_PROFILE_SCHEME_STRING_VALUE_COMMON = {
    type: 'string',
    maxLength: CONST_VALUES_RESTRICTIONS_COMMON_STRING_VALUE_MAX_LENGHT,
};
const CA_VALIDATORS_USER_PROFILE_SCHEME_NULL_VALUE_COMMON = {
    type: 'null',
};
const CA_VALIDATORS_USER_PROFILE_SCHEME_VALUE_COMMON = {
    oneOf: [CA_VALIDATORS_USER_PROFILE_SCHEME_STRING_VALUE_COMMON, CA_VALIDATORS_USER_PROFILE_SCHEME_NULL_VALUE_COMMON],
};
export const CA_VALIDATORS_USER_PROFILE_SCHEME = {
    $id: 'https://protocol.com/ca/user/profile/01/data.json#',
    type: 'object',
    additionalProperties: false,
    required: [],
    properties: {
        name: Object.assign({}, CA_VALIDATORS_USER_PROFILE_SCHEME_VALUE_COMMON),
        email: {
            oneOf: [
                Object.assign(Object.assign({}, CONST_VALIDATION_SCHEMES_EMAIL), CA_VALIDATORS_USER_PROFILE_SCHEME_STRING_VALUE_COMMON),
                CA_VALIDATORS_USER_PROFILE_SCHEME_NULL_VALUE_COMMON,
            ],
        },
        phone: Object.assign({}, CONST_VALIDATION_SCHEMES_INTERNATIONAL_PHONE_NUMBER),
        photoURL: {
            oneOf: [
                Object.assign(Object.assign({}, CONST_VALIDATION_SCHEMES_URL), CA_VALIDATORS_USER_PROFILE_SCHEME_STRING_VALUE_COMMON),
                CA_VALIDATORS_USER_PROFILE_SCHEME_NULL_VALUE_COMMON,
            ],
        },
    },
};
//# sourceMappingURL=central-authority-validators-user.schemes.js.map