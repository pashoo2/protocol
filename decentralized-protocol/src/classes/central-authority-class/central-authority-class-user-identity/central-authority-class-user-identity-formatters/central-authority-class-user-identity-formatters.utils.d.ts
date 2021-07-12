import { IUserIdentityFormatter } from './central-authority-class-user-identity-formatters.types';
import { ICAUserUniqueIdentifierDescription } from '../central-authority-class-user-identity.types';
import { TCentralAuthorityUserIdentity } from 'classes/central-authority-class/central-authority-class-types/central-authority-class-types';
export declare const getSerializerForIdentityVersion: (userIdentityVersion: string) => Error | IUserIdentityFormatter;
export declare const serializeIdentity: (identity: ICAUserUniqueIdentifierDescription) => TCentralAuthorityUserIdentity | Error;
//# sourceMappingURL=central-authority-class-user-identity-formatters.utils.d.ts.map