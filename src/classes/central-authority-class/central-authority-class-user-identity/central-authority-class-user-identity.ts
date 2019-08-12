import {
  ICAUserUniqueIdentifierDescription,
  ICAIdentity,
} from './central-authority-class-user-identity.types';
import { TCentralAuthorityUserIdentity } from '../central-authority-class-types/central-authority-class-types';
import { validateUserIdentity } from '../central-authority-validators/central-authority-validators-auth-credentials/central-authority-validators-auth-credentials';
import { parseIdentity } from './central-authority-class-user-identity-parsers/central-authority-class-user-identity-parsers';
import { serializeIdentity } from './central-authority-class-user-identity-formatters/central-authority-class-user-identity-formatters';

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

  public get identityDescription(): ICAUserUniqueIdentifierDescription | Error {
    const { _userIdentityParsed } = this;

    if (!_userIdentityParsed) {
      return new Error('Failed to parse the user identity');
    }
    return _userIdentityParsed;
  }

  public get identityDescritptionSerialized():
    | TCentralAuthorityUserIdentity
    | Error {
    const { _userIdentitySerialized } = this;

    if (!_userIdentitySerialized) {
      return new Error('Failed to serialize the user identity');
    }
    return _userIdentitySerialized;
  }

  public toString(): TCentralAuthorityUserIdentity | Error {
    const { identityDescritptionSerialized } = this;

    return identityDescritptionSerialized;
  }

  protected parseUserIdentity(userIdentity: TCentralAuthorityUserIdentity) {
    if (userIdentity) {
      const parsedUserIdentity = parseIdentity(userIdentity);

      if (parsedUserIdentity instanceof Error) {
        console.error(parsedUserIdentity);
        this._userIdentityParsed = parsedUserIdentity;
        this._userIdentitySerialized = new Error(
          'Failed to parse the user identity'
        );
      } else {
        this._userIdentityParsed = parsedUserIdentity;
        this._userIdentitySerialized = userIdentity;
      }
    } else {
      const err = new Error('The user identity serialized is not defined');

      this._userIdentityParsed = err;
      this._userIdentitySerialized = err;
    }
  }

  protected serializeUserIdentityDescription(
    userIdentityDescription: ICAUserUniqueIdentifierDescription
  ) {
    if (userIdentityDescription) {
      const serializedDescription = serializeIdentity(userIdentityDescription);

      if (serializedDescription instanceof Error) {
        this._userIdentityParsed = new Error(
          'Failed to serialize the user identity description'
        );
        this._userIdentitySerialized = serializedDescription;
      } else {
        this._userIdentityParsed = userIdentityDescription;
        this._userIdentitySerialized = serializedDescription;
      }
    } else {
      const err = new Error('The user identifier description is not defined');

      this._userIdentitySerialized = err;
      this._userIdentityParsed = err;
    }
  }
}

export default CentralAuthorityIdentity;
