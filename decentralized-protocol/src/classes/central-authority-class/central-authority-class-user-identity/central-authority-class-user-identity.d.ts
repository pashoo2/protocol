import { ICAUserUniqueIdentifierDescription, ICAUserUniqueIdentifierDescriptionWithOptionalVersion, ICAIdentityCommonInstance, TUserIdentityVersion, TCAUserIdentityRawTypes } from './central-authority-class-user-identity.types';
import { TCentralAuthorityUserIdentity } from '../central-authority-class-types/central-authority-class-types';
export declare class CentralAuthorityIdentity implements ICAIdentityCommonInstance {
    protected _userIdentity: TCAUserIdentityRawTypes;
    protected _userIdentitySerialized?: Error | TCentralAuthorityUserIdentity;
    protected _userIdentityParsed?: Error | ICAUserUniqueIdentifierDescription;
    isValid?: boolean;
    constructor(_userIdentity: TCAUserIdentityRawTypes);
    protected extendDescriptionWithVersion(_userIdentityDescription: ICAUserUniqueIdentifierDescriptionWithOptionalVersion): ICAUserUniqueIdentifierDescription;
    get identityDescription(): ICAUserUniqueIdentifierDescription | Error;
    get identityDescritptionSerialized(): TCentralAuthorityUserIdentity | Error;
    get id(): string | Error;
    get version(): TUserIdentityVersion | Error;
    toString(): TCentralAuthorityUserIdentity;
    protected checkUserIdentityDescriptionIsValid: () => Error | void;
    protected setIdentityIsValid(): void;
    protected parseUserIdentity(userIdentity: TCentralAuthorityUserIdentity): void;
    protected serializeUserIdentityDescription(userIdentityDescription: ICAUserUniqueIdentifierDescription): void;
}
export default CentralAuthorityIdentity;
//# sourceMappingURL=central-authority-class-user-identity.d.ts.map