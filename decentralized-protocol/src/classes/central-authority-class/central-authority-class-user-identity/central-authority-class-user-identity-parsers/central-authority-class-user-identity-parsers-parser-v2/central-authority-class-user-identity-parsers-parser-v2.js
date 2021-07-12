import { normalizeUrl } from "../../../../../utils";
import { CA_USER_IDENTITY_PARSER_IDENTITY_MIN_CHARACTERS_COUNT, CA_USER_IDENTITY_V2_AUTH_PROVIDER_URL_DELIMETER, } from './central-authority-class-user-identity-parsers-parser-v2.const';
import { getUserIdentityDescription } from '../central-authority-class-user-identity-parsers.utils';
export const CAUserIdentityParserV2 = (userIdentityWithoutVersion) => {
    if (typeof userIdentityWithoutVersion === 'string') {
        if (userIdentityWithoutVersion.length < CA_USER_IDENTITY_PARSER_IDENTITY_MIN_CHARACTERS_COUNT) {
            return new Error('The given user identity have a too small length');
        }
        const delimeterPosition = userIdentityWithoutVersion.lastIndexOf(CA_USER_IDENTITY_V2_AUTH_PROVIDER_URL_DELIMETER);
        if (delimeterPosition === -1) {
            return new Error('The delimeter character was not found in the string');
        }
        const userIdentity = userIdentityWithoutVersion.slice(delimeterPosition + 1);
        const authProviderIdentity = normalizeUrl(userIdentityWithoutVersion.slice(0, delimeterPosition));
        if (authProviderIdentity instanceof Error) {
            return authProviderIdentity;
        }
        return getUserIdentityDescription(userIdentity, authProviderIdentity);
    }
    return new Error('The given user identity have a wrong type');
};
//# sourceMappingURL=central-authority-class-user-identity-parsers-parser-v2.js.map