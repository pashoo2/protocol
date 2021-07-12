import { IParser } from './central-authority-class-user-identity-parsers.types';
import { ownValueOf } from 'types/helper.types';
import { CA_USER_IDENTITY_VERSIONS } from '../central-authority-class-user-identity.const';
export declare const CA_USER_IDENTITY_PARSER_TO_VERSION: {
    [key in ownValueOf<typeof CA_USER_IDENTITY_VERSIONS>]: IParser;
};
//# sourceMappingURL=central-authority-class-user-identity-parsers.const.d.ts.map