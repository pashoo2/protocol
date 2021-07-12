import { ownValueOf } from 'types/helper.types';
import { IUserIdentityFormatter } from './central-authority-class-user-identity-formatters.types';
import { CA_USER_IDENTITY_VERSIONS } from '../central-authority-class-user-identity.const';
export declare const CA_USER_IDENTITY_FORMATTERS_BY_VERSION: {
    [key in ownValueOf<typeof CA_USER_IDENTITY_VERSIONS>]: IUserIdentityFormatter;
};
//# sourceMappingURL=central-authority-class-user-identity-formatters.const.d.ts.map