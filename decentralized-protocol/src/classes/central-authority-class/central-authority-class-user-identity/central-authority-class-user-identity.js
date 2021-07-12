import { validateUserIdentitySilent } from '../central-authority-validators/central-authority-validators-auth-credentials/central-authority-validators-auth-credentials';
import { parseIdentity } from './central-authority-class-user-identity-parsers/central-authority-class-user-identity-parsers';
import { serializeIdentity } from './central-authority-class-user-identity-formatters/central-authority-class-user-identity-formatters';
import { CA_USER_IDENTITY_VERSION_PROP_NAME, CA_USER_IDENTITY_VERSION_CURRENT, CA_USER_IDENTITY_AUTH_PROVIDER_URL_DELIMETER, } from './central-authority-class-user-identity.const';
import { CA_AUTH_CREDENTIALS_USER_IDENTITY_PROP_NAME } from '../central-authority-class-const/central-authority-class-const';
export class CentralAuthorityIdentity {
    constructor(_userIdentity) {
        this._userIdentity = _userIdentity;
        this.checkUserIdentityDescriptionIsValid = () => {
            const { _userIdentitySerialized, isValid, _userIdentityParsed } = this;
            let err;
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
        if (_userIdentity instanceof CentralAuthorityIdentity) {
            return _userIdentity;
        }
        if (!_userIdentity) {
            return;
        }
        let identity = _userIdentity;
        if (typeof _userIdentity === 'object') {
            const identityVal = _userIdentity[CA_AUTH_CREDENTIALS_USER_IDENTITY_PROP_NAME];
            if (typeof identityVal === 'string') {
                identity = identityVal;
            }
        }
        if (validateUserIdentitySilent(identity)) {
            this.parseUserIdentity(identity);
        }
        else {
            const userIdentityDescription = this.extendDescriptionWithVersion(identity);
            this.serializeUserIdentityDescription(userIdentityDescription);
        }
    }
    extendDescriptionWithVersion(_userIdentityDescription) {
        const { [CA_USER_IDENTITY_VERSION_PROP_NAME]: version } = _userIdentityDescription;
        if (!version) {
            const result = Object.assign(Object.assign({}, _userIdentityDescription), { [CA_USER_IDENTITY_VERSION_PROP_NAME]: CA_USER_IDENTITY_VERSION_CURRENT });
            this._userIdentity = result;
            return result;
        }
        return _userIdentityDescription;
    }
    get identityDescription() {
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
    get identityDescritptionSerialized() {
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
    get id() {
        const res = this.checkUserIdentityDescriptionIsValid();
        if (res instanceof Error) {
            return res;
        }
        const { authorityProviderURI, userUniqueIdentifier } = this.identityDescription;
        return `${authorityProviderURI}${CA_USER_IDENTITY_AUTH_PROVIDER_URL_DELIMETER}${userUniqueIdentifier}`;
    }
    get version() {
        const res = this.checkUserIdentityDescriptionIsValid();
        if (res instanceof Error) {
            return res;
        }
        return (this.identityDescription.version ||
            CA_USER_IDENTITY_VERSION_CURRENT);
    }
    toString() {
        const res = this.checkUserIdentityDescriptionIsValid();
        if (res instanceof Error) {
            return '';
        }
        return this.identityDescritptionSerialized;
    }
    setIdentityIsValid() {
        if (this.isValid !== false) {
            this.isValid = true;
        }
    }
    parseUserIdentity(userIdentity) {
        if (userIdentity) {
            const parsedUserIdentity = parseIdentity(userIdentity);
            if (parsedUserIdentity instanceof Error) {
                console.error(parsedUserIdentity);
                this._userIdentityParsed = parsedUserIdentity;
                this._userIdentitySerialized = new Error('Failed to parse the user identity');
            }
            else {
                this._userIdentityParsed = parsedUserIdentity;
                this._userIdentitySerialized = userIdentity;
                this.setIdentityIsValid();
                return;
            }
        }
        else {
            const err = new Error('The user identity serialized is not defined');
            this._userIdentityParsed = err;
            this._userIdentitySerialized = err;
        }
        this.isValid = false;
    }
    serializeUserIdentityDescription(userIdentityDescription) {
        if (userIdentityDescription) {
            const serializedDescription = serializeIdentity(userIdentityDescription);
            if (serializedDescription instanceof Error) {
                this._userIdentityParsed = new Error('Failed to serialize the user identity description');
                this._userIdentitySerialized = serializedDescription;
            }
            else {
                this._userIdentityParsed = userIdentityDescription;
                this._userIdentitySerialized = serializedDescription;
                this.setIdentityIsValid();
                return;
            }
        }
        else {
            const err = new Error('The user identifier description is not defined');
            this._userIdentitySerialized = err;
            this._userIdentityParsed = err;
        }
        this.isValid = false;
    }
}
export default CentralAuthorityIdentity;
//# sourceMappingURL=central-authority-class-user-identity.js.map