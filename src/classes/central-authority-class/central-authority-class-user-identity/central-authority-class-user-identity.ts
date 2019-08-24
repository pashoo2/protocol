import {
  ICAUserUniqueIdentifierDescription,
  ICAIdentityCommon,
  ICAUserUniqueIdentifierDescriptionWithOptionalVersion,
} from './central-authority-class-user-identity.types';
import { TCentralAuthorityUserIdentity } from '../central-authority-class-types/central-authority-class-types';
import { validateUserIdentitySilent } from '../central-authority-validators/central-authority-validators-auth-credentials/central-authority-validators-auth-credentials';
import { parseIdentity } from './central-authority-class-user-identity-parsers/central-authority-class-user-identity-parsers';
import { serializeIdentity } from './central-authority-class-user-identity-formatters/central-authority-class-user-identity-formatters';
import {
  CA_USER_IDENTITY_VERSION_PROP_NAME,
  CA_USER_IDENTITY_VERSION_CURRENT,
} from './central-authority-class-user-identity.const';
import { compressString } from 'utils/data-compression-utils/data-compression-utils';

export class CentralAuthorityIdentity implements ICAIdentityCommon {
  protected _userIdentitySerialized?: Error | TCentralAuthorityUserIdentity;

  protected _userIdentityParsed?: Error | ICAUserUniqueIdentifierDescription;

  public isValid?: boolean;

  constructor(
    protected _userIdentity:
      | TCentralAuthorityUserIdentity
      | ICAUserUniqueIdentifierDescriptionWithOptionalVersion
  ) {
    if (validateUserIdentitySilent(_userIdentity)) {
      this.parseUserIdentity(_userIdentity);
    } else {
      const userIdentityDescription = this.extendDescriptionWithVersion(
        _userIdentity
      );

      this.serializeUserIdentityDescription(userIdentityDescription);
    }
  }

  protected extendDescriptionWithVersion(
    _userIdentityDescription: ICAUserUniqueIdentifierDescriptionWithOptionalVersion
  ): ICAUserUniqueIdentifierDescription {
    const {
      [CA_USER_IDENTITY_VERSION_PROP_NAME]: version,
    } = _userIdentityDescription;

    if (!version) {
      // extend the description with the
      // current version
      const result = {
        ..._userIdentityDescription,
        [CA_USER_IDENTITY_VERSION_PROP_NAME]: CA_USER_IDENTITY_VERSION_CURRENT,
      };

      this._userIdentity = result;
      return result as ICAUserUniqueIdentifierDescription;
    }
    return _userIdentityDescription as ICAUserUniqueIdentifierDescription;
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

  /**
   * uniquely identifies the user
   */
  public get id(): string | Error {
    const { identityDescription } = this;

    if (identityDescription instanceof Error) {
      return identityDescription;
    }

    const { authorityProviderURI, userUniqueIdentifier } = identityDescription;

    return `${authorityProviderURI}${userUniqueIdentifier}`;
  }

  public toString(): TCentralAuthorityUserIdentity {
    const { identityDescritptionSerialized } = this;

    if (identityDescritptionSerialized instanceof Error) {
      return '';
    }
    return identityDescritptionSerialized;
  }

  protected setIdentityIsValid() {
    if (this.isValid !== false) {
      this.isValid = true;
    }
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
        this.setIdentityIsValid();
        return;
      }
    } else {
      const err = new Error('The user identity serialized is not defined');

      this._userIdentityParsed = err;
      this._userIdentitySerialized = err;
    }
    this.isValid = false;
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
        this.setIdentityIsValid();
        return;
      }
    } else {
      const err = new Error('The user identifier description is not defined');

      this._userIdentitySerialized = err;
      this._userIdentityParsed = err;
    }
    this.isValid = false;
  }
}

export default CentralAuthorityIdentity;
