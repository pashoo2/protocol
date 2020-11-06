import { ownValueOf } from 'types/helper.types';
import { IUserIdentityDescriptionValidator } from './central-authority-class-user-identity-validators.types';
import { CA_USER_IDENTITY_VERSIONS } from '../central-authority-class-user-identity.const';
import { validatorV1 } from './central-authority-class-user-identity-validator-v1';
import { validatorV2 } from './central-authority-class-user-identity-validator-v2';

export const CA_USER_IDENTITY_VALIDATORS_BY_VERSION: {
  [key in ownValueOf<typeof CA_USER_IDENTITY_VERSIONS>]: IUserIdentityDescriptionValidator;
} = {
  [CA_USER_IDENTITY_VERSIONS['01']]: validatorV1,
  [CA_USER_IDENTITY_VERSIONS['02']]: validatorV2,
};
