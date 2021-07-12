import { ownValueOf } from 'types/helper.types';
import { IUserIdentityDescriptionValidator } from './central-authority-class-user-identity-validators.types';
import { CA_USER_IDENTITY_VERSIONS } from '../central-authority-class-user-identity.const';
export declare const CA_USER_IDENTITY_VALIDATORS_BY_VERSION: {
    [key in ownValueOf<typeof CA_USER_IDENTITY_VERSIONS>]: IUserIdentityDescriptionValidator;
};
//# sourceMappingURL=central-authority-class-user-identity-validators.const.d.ts.map