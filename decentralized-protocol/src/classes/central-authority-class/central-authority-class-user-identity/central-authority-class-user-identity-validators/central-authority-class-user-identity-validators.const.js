import { ownValueOf } from "../../../../types/helper.types";
import { CA_USER_IDENTITY_VERSIONS } from '../central-authority-class-user-identity.const';
import { validatorV1 } from './central-authority-class-user-identity-validator-v1';
import { validatorV2 } from './central-authority-class-user-identity-validator-v2';
export const CA_USER_IDENTITY_VALIDATORS_BY_VERSION = {
    [CA_USER_IDENTITY_VERSIONS['01']]: validatorV1,
    [CA_USER_IDENTITY_VERSIONS['02']]: validatorV2,
};
//# sourceMappingURL=central-authority-class-user-identity-validators.const.js.map