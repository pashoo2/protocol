import { TCentralAuthorityUserIdentity } from "../../central-authority-class-types/central-authority-class-types";
import { validateUserIdentity } from "../../central-authority-validators/central-authority-validators-auth-credentials/central-authority-validators-auth-credentials";
import { CA_USER_IDENTITY_PARSER_TO_VERSION } from './central-authority-class-user-identity-parsers.const';
import { CA_USER_IDENTITY_AUTH_PROVIDER_IDENTIFIER_PROP_NAME, CA_USER_IDENTITY_USER_UNIQUE_IDENTFIER_PROP_NAME, CA_USER_IDENTITY_VERSION_PROP_NAME, CA_USER_IDENTITY_VERSION_CHARACTERS_COUNT, CA_USER_IDENTITY_PARSER_VERSIONS_SUPPORTED, } from '../central-authority-class-user-identity.const';
import { validateUserIdentityDescriptionVersion, validateIdentityDescriptionVersion, } from '../central-authority-class-user-identity-validators/central-authority-class-user-identity-validators.utils';
export function getIdentifierVersionByIdentityString(identityString) {
    if (validateUserIdentity(identityString)) {
        return identityString.slice(0, CA_USER_IDENTITY_VERSION_CHARACTERS_COUNT);
    }
    return new Error('The user identity is not valid');
}
export const getParserFunctionByVersion = (version) => {
    if (validateIdentityDescriptionVersion(version)) {
        if (!CA_USER_IDENTITY_PARSER_VERSIONS_SUPPORTED.includes(version)) {
            return new Error(`The version ${version} is not supported`);
        }
        const parser = CA_USER_IDENTITY_PARSER_TO_VERSION[version];
        if (parser) {
            return parser;
        }
        return new Error(`There is no parser defined for the version ${version}`);
    }
    return new Error('The version has a wrong type or format');
};
export const getUserIdentityDescription = (userIdentity, authProviderIdentity) => {
    const description = {
        [CA_USER_IDENTITY_AUTH_PROVIDER_IDENTIFIER_PROP_NAME]: authProviderIdentity,
        [CA_USER_IDENTITY_USER_UNIQUE_IDENTFIER_PROP_NAME]: userIdentity,
    };
    return description;
};
export const parseIdentity = (identityString) => {
    const version = getIdentifierVersionByIdentityString(identityString);
    if (version instanceof Error) {
        console.error(version);
        return new Error("Can't define a version by the identity string");
    }
    const parser = getParserFunctionByVersion(version);
    if (parser instanceof Error) {
        console.error(parser);
        return new Error("Can't define a parser function by identity string");
    }
    const versionStringLength = version.length;
    const identityStringWithoutVersion = identityString.slice(versionStringLength);
    const parsedIdentity = parser(identityStringWithoutVersion);
    if (parsedIdentity instanceof Error) {
        console.error(parsedIdentity);
        return new Error("Can't parse the identity string");
    }
    const resultedUserIdentityDescription = Object.assign(Object.assign({}, parsedIdentity), { [CA_USER_IDENTITY_VERSION_PROP_NAME]: version });
    const validationResult = validateUserIdentityDescriptionVersion(version, resultedUserIdentityDescription);
    if (validationResult instanceof Error) {
        return validationResult;
    }
    return resultedUserIdentityDescription;
};
//# sourceMappingURL=central-authority-class-user-identity-parsers.utils.js.map