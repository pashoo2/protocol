import { ownValueOf } from 'types/helper.types';
import { IUserIdentityFormatter } from './central-authority-class-user-identity-formatters.types';
import { formatterV1 } from './central-authority-class-user-identity-formatters-formatter-v1';
import { formatterV2 } from './central-authority-class-user-identity-formatters-formatter-v2/central-authority-class-user-identity-formatters-formatter-v2';
import { CA_USER_IDENTITY_VERSIONS } from '../central-authority-class-user-identity.const';

export const CA_USER_IDENTITY_FORMATTERS_BY_VERSION: {
  [key in ownValueOf<typeof CA_USER_IDENTITY_VERSIONS>]: IUserIdentityFormatter;
} = {
  [CA_USER_IDENTITY_VERSIONS['01']]: formatterV1,
  [CA_USER_IDENTITY_VERSIONS['02']]: formatterV2,
};
