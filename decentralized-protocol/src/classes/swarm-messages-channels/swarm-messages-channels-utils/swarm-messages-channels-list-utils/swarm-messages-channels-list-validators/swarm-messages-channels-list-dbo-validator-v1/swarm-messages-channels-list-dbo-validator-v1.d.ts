import { IValidatorSwarmMessagesStoreGrantAccessCallback } from '../../../../../swarm-message-store/types/swarm-message-store-validation.types';
import { TSwrmMessagesChannelsListDBOWithGrantAccess } from '../../../../types/swarm-messages-channels-list-instance.types';
export declare function validateSwamChannelsListDatabaseOptions(dbOptions: unknown): dbOptions is TSwrmMessagesChannelsListDBOWithGrantAccess<any, any, any, any>;
export declare function getValidatorSwarmChannelsListDatabaseOptions(grantAccessCallbackValidator: IValidatorSwarmMessagesStoreGrantAccessCallback): (dbOptions: unknown) => dbOptions is TSwrmMessagesChannelsListDBOWithGrantAccess<any, any, any, any>;
//# sourceMappingURL=swarm-messages-channels-list-dbo-validator-v1.d.ts.map