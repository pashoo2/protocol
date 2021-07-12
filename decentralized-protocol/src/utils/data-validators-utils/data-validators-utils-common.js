import { CONST_VALIDATION_SCHEMES_URI, CONST_VALIDATION_SCHEMES_URL, CONST_VALIDATION_SCHEMES_UUID_V4, CONST_VALIDATION_SCHEMES_EMAIL, CONST_VALIDATION_SCHEMES_LOGIN, } from "../../const/const-validation-schemes/const-validation-schemes-common";
import { validateBySchema } from "../validation-utils/validation-utils";
export const dataValidatorUtilURI = (v) => {
    return validateBySchema(CONST_VALIDATION_SCHEMES_URI, v);
};
export const dataValidatorUtilURL = (v) => {
    const result = validateBySchema(CONST_VALIDATION_SCHEMES_URL, v);
    return result;
};
export const dataValidatorUtilUUIDV4 = (v) => {
    return validateBySchema(CONST_VALIDATION_SCHEMES_UUID_V4, v);
};
export const dataValidatorUtilEmail = (v) => {
    return validateBySchema(CONST_VALIDATION_SCHEMES_EMAIL, v);
};
export const dataValidatorUtilSafeLogin = (v) => {
    return validateBySchema(CONST_VALIDATION_SCHEMES_LOGIN, v);
};
//# sourceMappingURL=data-validators-utils-common.js.map