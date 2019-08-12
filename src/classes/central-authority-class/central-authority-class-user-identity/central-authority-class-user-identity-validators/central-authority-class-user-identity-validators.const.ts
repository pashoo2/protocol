import { CA_USER_IDENTITY_PARSER_VERSIONS } from '../central-authority-class-user-identity-parsers/central-authority-class-user-identity-parsers.const';
import { ownValueOf } from 'types/helper.types';
import { IUserIdentityDescriptionValidator } from './central-authority-class-user-identity-validators.types';
import validatorV1 from './central-authority-class-user-identity-validator-v1';

export const CA_USER_IDENTITY_VALIDATORS_BY_VERSION: {
  [key in ownValueOf<
    typeof CA_USER_IDENTITY_PARSER_VERSIONS
  >]: IUserIdentityDescriptionValidator
} = {
  [CA_USER_IDENTITY_PARSER_VERSIONS['01']]: validatorV1,
};
