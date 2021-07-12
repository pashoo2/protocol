import { CA_USER_IDENTITY_PARSER_IDENTITY_MIN_CHARACTERS_COUNT, CA_USER_IDENTITY_AUTHORITY_IDENTIFIER_LENGTH, CA_USER_IDENTITY_PARSER_IDENTITY_MAX_CHARACTERS_COUNT, } from './central-authority-class-user-identity-parsers-parser-v1.const';
import { getUserIdentityDescription } from '../central-authority-class-user-identity-parsers.utils';
import { normalizeUrl } from "../../../../../utils";
export const CAUserIdentityParserV1 = (userIdentityWithoutVersion) => {
    if (typeof userIdentityWithoutVersion === 'string') {
        if (userIdentityWithoutVersion.length < CA_USER_IDENTITY_PARSER_IDENTITY_MIN_CHARACTERS_COUNT) {
            return new Error('The given user identity have a too small length');
        }
        if (userIdentityWithoutVersion.length > CA_USER_IDENTITY_PARSER_IDENTITY_MAX_CHARACTERS_COUNT) {
            return new Error('The given user identity have a too big length');
        }
        const userIdentity = userIdentityWithoutVersion.slice(-CA_USER_IDENTITY_AUTHORITY_IDENTIFIER_LENGTH);
        const authProviderIdentity = normalizeUrl(userIdentityWithoutVersion.slice(0, userIdentityWithoutVersion.length - CA_USER_IDENTITY_AUTHORITY_IDENTIFIER_LENGTH));
        if (authProviderIdentity instanceof Error) {
            return authProviderIdentity;
        }
        return getUserIdentityDescription(userIdentity, authProviderIdentity);
    }
    return new Error('The given user identity have a wrong type');
};
//# sourceMappingURL=central-authority-class-user-identity-parsers-parser-v1.js.map