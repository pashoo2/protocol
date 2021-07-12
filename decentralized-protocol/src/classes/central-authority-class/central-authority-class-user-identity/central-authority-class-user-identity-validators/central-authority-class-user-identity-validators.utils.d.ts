import { IUserIdentityDescriptionValidator } from './central-authority-class-user-identity-validators.types';
import { ICAUserUniqueIdentifierMetadata } from '../central-authority-class-user-identity.types';
export declare const validateIdentityDescriptionVersion: (version: any) => version is string;
export declare const getValidatorByIdentityVersion: (identityVersion: string) => IUserIdentityDescriptionValidator | Error;
export declare const validateUserIdentityDescriptionVersion: (identityVersion: string, userIdentityDescription: any) => boolean | Error;
export declare const validateUserIdentityDescription: (userIdetnityDescription: any) => boolean | Error;
export declare const checkIsValidUserIdentityMetadata: (identityMetadata: ICAUserUniqueIdentifierMetadata) => boolean | Error;
//# sourceMappingURL=central-authority-class-user-identity-validators.utils.d.ts.map