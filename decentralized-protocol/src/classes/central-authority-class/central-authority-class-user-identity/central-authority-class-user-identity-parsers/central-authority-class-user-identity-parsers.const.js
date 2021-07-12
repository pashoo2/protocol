import { CAUserIdentityParserV1 } from './central-authority-class-user-identity-parsers-parser-v1';
import { CAUserIdentityParserV2 } from './central-authority-class-user-identity-parsers-parser-v2';
import { ownValueOf } from "../../../../types/helper.types";
import { CA_USER_IDENTITY_VERSIONS } from '../central-authority-class-user-identity.const';
export const CA_USER_IDENTITY_PARSER_TO_VERSION = {
    [CA_USER_IDENTITY_VERSIONS['01']]: CAUserIdentityParserV1,
    [CA_USER_IDENTITY_VERSIONS['02']]: CAUserIdentityParserV2,
};
//# sourceMappingURL=central-authority-class-user-identity-parsers.const.js.map