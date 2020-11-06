import {
  ICAUserUniqueIdentifierDescription,
  ICAUserUniqueIdentifierDescriptionWithOptionalVersion,
  ICAIdentityCommonInstance,
  TUserIdentityVersion,
  TCAUserIdentityRawTypes,
} from './central-authority-class-user-identity.types';
import { TCentralAuthorityUserIdentity } from '../central-authority-class-types/central-authority-class-types';
import { validateUserIdentitySilent } from '../central-authority-validators/central-authority-validators-auth-credentials/central-authority-validators-auth-credentials';
import { parseIdentity } from './central-authority-class-user-identity-parsers/central-authority-class-user-identity-parsers';
import { serializeIdentity } from './central-authority-class-user-identity-formatters/central-authority-class-user-identity-formatters';
import {
  CA_USER_IDENTITY_VERSION_PROP_NAME,
  CA_USER_IDENTITY_VERSION_CURRENT,
  CA_USER_IDENTITY_AUTH_PROVIDER_URL_DELIMETER,
} from './central-authority-class-user-identity.const';
import { CA_AUTH_CREDENTIALS_USER_IDENTITY_PROP_NAME } from '../central-authority-class-const/central-authority-class-const';

export class CentralAuthorityIdentity implements ICAIdentityCommonInstance {
  protected _userIdentitySerialized?: Error | TCentralAuthorityUserIdentity;

  protected _userIdentityParsed?: Error | ICAUserUniqueIdentifierDescription;

  public isValid?: boolean;

  constructor(protected _userIdentity: TCAUserIdentityRawTypes) {
    if (_userIdentity instanceof CentralAuthorityIdentity) {
      return _userIdentity;
    }
    if (!_userIdentity) {
      return;
    }

    let identity = _userIdentity;

    if (typeof _userIdentity === 'object') {
      //check may be it is a crypto credentials object
      const identityVal = ((_userIdentity as unknown) as any)[CA_AUTH_CREDENTIALS_USER_IDENTITY_PROP_NAME];

      if (typeof identityVal === 'string') {
        identity = identityVal;
      }
    }
    if (validateUserIdentitySilent(identity)) {
      this.parseUserIdentity(identity);
    } else {
      const userIdentityDescription = this.extendDescriptionWithVersion(identity as ICAUserUniqueIdentifierDescriptionWithOptionalVersion);

      this.serializeUserIdentityDescription(userIdentityDescription);
    }
  }

  protected extendDescriptionWithVersion(
    _userIdentityDescription: ICAUserUniqueIdentifierDescriptionWithOptionalVersion
  ): ICAUserUniqueIdentifierDescription {
    const { [CA_USER_IDENTITY_VERSION_PROP_NAME]: version } = _userIdentityDescription;

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
    const res = this.checkUserIdentityDescriptionIsValid();

    if (res instanceof Error) {
      return res;
    }

    const { _userIdentityParsed } = this;

    if (!_userIdentityParsed) {
      return new Error('Failed to parse the user identity');
    }
    return _userIdentityParsed;
  }

  public get identityDescritptionSerialized(): TCentralAuthorityUserIdentity | Error {
    const res = this.checkUserIdentityDescriptionIsValid();

    if (res instanceof Error) {
      return res;
    }

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
    const res = this.checkUserIdentityDescriptionIsValid();

    if (res instanceof Error) {
      return res;
    }

    const { authorityProviderURI, userUniqueIdentifier } = this.identityDescription as ICAUserUniqueIdentifierDescription;

    return `${authorityProviderURI}${CA_USER_IDENTITY_AUTH_PROVIDER_URL_DELIMETER}${userUniqueIdentifier}`;
  }

  public get version(): TUserIdentityVersion | Error {
    const res = this.checkUserIdentityDescriptionIsValid();

    if (res instanceof Error) {
      return res;
    }

    return (((this.identityDescription as ICAUserUniqueIdentifierDescription).version ||
      CA_USER_IDENTITY_VERSION_CURRENT) as unknown) as TUserIdentityVersion;
  }

  public toString(): TCentralAuthorityUserIdentity {
    const res = this.checkUserIdentityDescriptionIsValid();

    if (res instanceof Error) {
      return '';
    }
    return this.identityDescritptionSerialized as string;
  }

  protected checkUserIdentityDescriptionIsValid = (): Error | void => {
    const { _userIdentitySerialized, isValid, _userIdentityParsed } = this;
    let err: Error | void;

    if (!isValid) {
      err = new Error('The identity is not valid');
    }
    if (!_userIdentityParsed) {
      err = new Error('There is no user identity parsed');
    }
    if (_userIdentityParsed instanceof Error) {
      err = _userIdentityParsed;
    }
    if (!_userIdentitySerialized) {
      err = new Error('The identity description serialized is not defined');
    }
    if (_userIdentitySerialized instanceof Error) {
      err = _userIdentitySerialized;
    }
    if (err instanceof Error) {
      console.error(err);
      return err;
    }
  };

  protected setIdentityIsValid(): void {
    if (this.isValid !== false) {
      this.isValid = true;
    }
  }

  protected parseUserIdentity(userIdentity: TCentralAuthorityUserIdentity): void {
    if (userIdentity) {
      const parsedUserIdentity = parseIdentity(userIdentity);
      if (parsedUserIdentity instanceof Error) {
        console.error(parsedUserIdentity);
        this._userIdentityParsed = parsedUserIdentity;
        this._userIdentitySerialized = new Error('Failed to parse the user identity');
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

  protected serializeUserIdentityDescription(userIdentityDescription: ICAUserUniqueIdentifierDescription) {
    if (userIdentityDescription) {
      const serializedDescription = serializeIdentity(userIdentityDescription);

      if (serializedDescription instanceof Error) {
        this._userIdentityParsed = new Error('Failed to serialize the user identity description');
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
