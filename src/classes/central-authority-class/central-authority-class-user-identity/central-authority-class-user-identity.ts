import {
  ICAUserUniqueIdentifierDescription,
  ICAIdentity,
} from './central-authority-class-user-identity.types';
import { TCentralAuthorityUserIdentity } from '../central-authority-class-types/central-authority-class-types';
import { validateUserIdentity } from '../central-authority-validators/central-authority-validators-auth-credentials/central-authority-validators-auth-credentials';

export class CentralAuthorityIdentity implements ICAIdentity {
  protected _userIdentitySerialized?: Error | TCentralAuthorityUserIdentity;

  protected _userIdentityParsed?: Error | ICAUserUniqueIdentifierDescription;

  constructor(
    protected _userIdentity:
      | TCentralAuthorityUserIdentity
      | ICAUserUniqueIdentifierDescription
  ) {
    if (validateUserIdentity(_userIdentity)) {
      this.parseUserIdentity(_userIdentity);
    } else {
      this.serializeUserIdentityDescription(_userIdentity);
    }
  }

  public get userIdentity(): ICAUserUniqueIdentifierDescription | Error {
    const { _userIdentityParsed } = this;

    if (!_userIdentityParsed) {
      return new Error('Failed to parse the user identity');
    }
    return _userIdentityParsed;
  }

  public toString(): TCentralAuthorityUserIdentity | Error {
    const { _userIdentitySerialized } = this;

    if (!_userIdentitySerialized) {
      return new Error('Failed to serialize the user identity');
    }
    return _userIdentitySerialized;
  }

  protected parseUserIdentity(userIdentity: TCentralAuthorityUserIdentity) {}

  protected serializeUserIdentityDescription(
    userIdentityDescription: ICAUserUniqueIdentifierDescription
  ) {}
}

export default CentralAuthorityIdentity;
