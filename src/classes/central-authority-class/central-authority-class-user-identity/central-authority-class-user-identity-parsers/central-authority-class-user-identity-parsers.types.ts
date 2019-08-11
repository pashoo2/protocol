import { TCentralAuthorityUserIdentity } from 'classes/central-authority-class/central-authority-class-types/central-authority-class-types';
import { ICAUserIdentityDescription } from '../central-authority-class-user-identity.types';

export interface IParser {
  (userIdentityWithoutVersion: string): ICAUserIdentityDescription | Error;
}
