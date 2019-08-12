import { CA_USER_IDENTITY_PARSER_VERSIONS } from '../central-authority-class-user-identity-parsers/central-authority-class-user-identity-parsers.const';
import { ownValueOf } from 'types/helper.types';
import { IUserIdentityFormatter } from './central-authority-class-user-identity-formatters.types';
import formatterV1 from './central-authority-class-user-identity-formatters-formatter-v1';

export const CA_USER_IDENTITY_FORMATTERS_BY_VERSION: {
  [key in ownValueOf<
    typeof CA_USER_IDENTITY_PARSER_VERSIONS
  >]: IUserIdentityFormatter
} = {
  [CA_USER_IDENTITY_PARSER_VERSIONS['01']]: formatterV1,
};
