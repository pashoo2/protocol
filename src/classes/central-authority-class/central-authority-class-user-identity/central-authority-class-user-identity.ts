import {
  ICAUserUniqueIdentifierDescription,
  ICAIdentity,
} from './central-authority-class-user-identity.types';
import { TCentralAuthorityUserIdentity } from '../central-authority-class-types/central-authority-class-types';

export class CentralAuthorityIdentity implements ICAIdentity {
  constructor(
    protected _userIdentity:
      | TCentralAuthorityUserIdentity
      | ICAUserUniqueIdentifierDescription
  ) {}

  public get userIdentity(): ICAUserUniqueIdentifierDescription {}

  public toString(): TCentralAuthorityUserIdentity | Error {}

  protected parseIdentityString() {}
}

export default CentralAuthorityIdentity;
