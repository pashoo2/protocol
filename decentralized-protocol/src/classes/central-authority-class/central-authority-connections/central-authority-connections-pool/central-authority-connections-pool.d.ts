import { ICAConnectionsPoolOptions, ICAConnectionsPoolConnections, IAuthProviderConnectionConfiguration, ICAConnectionsPoolCurrentConnections, ICAConnectionPool } from './central-authority-connections-pool.types';
import { ICAConnection, TCAAuthProviderIdentity, ICAConnectionSignUpCredentials } from '../central-authority-connections.types';
import { ICentralAuthorityUserProfile } from 'classes/central-authority-class/central-authority-class-types/central-authority-class-types';
import { ICAConnectionUserAuthorizedResult } from '../central-authority-connections.types';
import { TCAuthProviderIdentifier } from '../../central-authority-class-user-identity/central-authority-class-user-identity.types';
import { ICAConnectionPoolAuthResult } from './central-authority-connections-pool.types';
export declare class CAConnectionsPool implements ICAConnectionPool {
    userAuthResult?: ICAConnectionPoolAuthResult;
    protected providersConnectionState: ICAConnectionsPoolConnections;
    protected get authConnection(): {
        connection: ICAConnection;
        authProviderId: TCAuthProviderIdentifier;
    } | void;
    constructor(options: ICAConnectionsPoolOptions);
    getConnection(authProvider: TCAAuthProviderIdentity): Promise<Error | ICAConnection>;
    connect(authProviderUrl: TCAAuthProviderIdentity, isAuthentificateAnonymousely?: boolean): Promise<ICAConnection | Error>;
    authorize(authProviderUrl: TCAAuthProviderIdentity, signUpCredentials: ICAConnectionSignUpCredentials, profile?: Partial<ICentralAuthorityUserProfile>): Promise<Error | ICAConnection>;
    disconnect(authProviderUrl: TCAuthProviderIdentifier): Promise<void | Error>;
    close(): Promise<Error | void>;
    signOut(): Promise<Error | void>;
    getCAUserProfile: () => Promise<Error | Partial<ICentralAuthorityUserProfile>>;
    protected setAuthResult(authProviderId: TCAAuthProviderIdentity, authResult: ICAConnectionUserAuthorizedResult): Error | void;
    protected unsetAuthResult(): void;
    protected getAuthProviderStateDesc(authProviderUrl: TCAAuthProviderIdentity): ICAConnectionsPoolCurrentConnections | undefined | Error;
    protected addConectionWithProvider(authProviderUrl: string, connectionWithAuthProvider: ICAConnection): Promise<ICAConnection | Error>;
    protected getActiveConnectionWithAuthProvider(authProviderUrl: TCAAuthProviderIdentity): ICAConnection | void | Error;
    protected getConnectionWithAuthProvider(authProviderUrl: TCAAuthProviderIdentity): ICAConnection | void | Error;
    protected updateStateAuthProvider(authProviderConnectionState: Partial<ICAConnectionsPoolCurrentConnections> & {
        caProviderUrl: ICAConnectionsPoolCurrentConnections['caProviderUrl'];
    }): Error;
    protected setConnectionWithAuthProvider(authProviderUrl: TCAAuthProviderIdentity, connection: ICAConnection): Error;
    protected unsetConnectionWithAuthProvider(authProviderUrl: TCAAuthProviderIdentity): Error | void;
    protected connectWithAuthProvider(authProviderUrl: TCAAuthProviderIdentity): Promise<Error | ICAConnection>;
    protected addAuthProvider: (authProviderConnectionConfiguration: IAuthProviderConnectionConfiguration) => void;
    protected setOptionsOfAuthProviders(providers: IAuthProviderConnectionConfiguration[]): void;
    protected setOptions(options: ICAConnectionsPoolOptions): void;
}
//# sourceMappingURL=central-authority-connections-pool.d.ts.map