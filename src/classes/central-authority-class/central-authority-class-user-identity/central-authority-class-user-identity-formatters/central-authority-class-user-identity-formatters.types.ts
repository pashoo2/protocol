import { TCentralAuthorityUserIdentity } from 'classes/central-authority-class/central-authority-class-types/central-authority-class-types';
import { ICAUserUniqueIdentifierDescription } from '../central-authority-class-user-identity.types';

export interface IUserIdentityFormatter {
  (v: ICAUserUniqueIdentifierDescription): TCentralAuthorityUserIdentity | Error;
}
