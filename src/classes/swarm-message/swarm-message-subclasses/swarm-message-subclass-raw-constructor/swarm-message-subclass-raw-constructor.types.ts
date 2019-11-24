import CentralAuthorityIdentity from 'classes/central-authority-class/central-authority-class-user-identity/central-authority-class-user-identity';
import {
  TCentralAuthorityUserCryptoCredentials,
  TCentralAuthorityUserIdentity,
} from 'classes/central-authority-class/central-authority-class-types/central-authority-class-types';
import { ICAUserUniqueIdentifierDescriptionWithOptionalVersion } from 'classes/central-authority-class/central-authority-class-user-identity/central-authority-class-user-identity.types';

/**
 * @property { string | number } typ - type of the message
 * @property { string | Buffer } pld - payload of the message
 * @property { string | CentralAuthorityIdentity } uid - the user identifier
 * @property { string } iss - the issuer service
 * @property { CryptoKey } k - the crypto key used to sign the data
 *
 * @export
 * @interface ISwarmMessageSubclassRawConstructorOptions
 */
export interface ISwarmMessageSubclassRawConstructorOptions {
  typ: string | number;
  pld: string | Buffer;
  uid:
    | TCentralAuthorityUserCryptoCredentials
    | TCentralAuthorityUserIdentity
    | ICAUserUniqueIdentifierDescriptionWithOptionalVersion;
  iss: string;
  k: CryptoKey;
}
