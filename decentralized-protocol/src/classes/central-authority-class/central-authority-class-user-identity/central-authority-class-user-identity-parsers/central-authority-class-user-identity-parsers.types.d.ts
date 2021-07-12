import { ICAUserIdentityDescription } from '../central-authority-class-user-identity.types';
export interface IParser {
    (userIdentityWithoutVersion: string): ICAUserIdentityDescription | Error;
}
//# sourceMappingURL=central-authority-class-user-identity-parsers.types.d.ts.map