import { TCentralAuthorityUserIdentity } from 'classes/central-authority-class/central-authority-class-types/central-authority-class-types';
import { IParser } from './central-authority-class-user-identity-parsers.types';
import { ICAUserIdentityDescription, TCAuthProviderIdentifier, TCAuthProviderUserIdentifier, ICAUserUniqueIdentifierDescription } from '../central-authority-class-user-identity.types';
export declare function getIdentifierVersionByIdentityString(identityString: TCentralAuthorityUserIdentity): Error | string;
export declare const getParserFunctionByVersion: (version: string) => IParser | Error;
export declare const getUserIdentityDescription: (userIdentity: TCAuthProviderUserIdentifier, authProviderIdentity: TCAuthProviderIdentifier) => ICAUserIdentityDescription | Error;
export declare const parseIdentity: (identityString: TCentralAuthorityUserIdentity) => ICAUserUniqueIdentifierDescription | Error;
//# sourceMappingURL=central-authority-class-user-identity-parsers.utils.d.ts.map