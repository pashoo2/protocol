import { TSwarmMessagesStoreGrantAccessCallback } from '../../types/swarm-message-store.types';
import { ISwarmStoreConnectorAccessConrotllerGrantAccessCallbackSerializable } from '../../../swarm-store-class/swarm-store-class.types';
export declare function validateGrantAccessCallback(grantAccess: unknown): grantAccess is TSwarmMessagesStoreGrantAccessCallback<any, any>;
export declare function validateGrantAccessCallbackWithContext(grantAccess: unknown): grantAccess is TSwarmMessagesStoreGrantAccessCallback<any, any>;
export declare function validateGrantAccessCallbackWithContextSerializable(grantAccess: unknown): grantAccess is ISwarmStoreConnectorAccessConrotllerGrantAccessCallbackSerializable<any, any>;
//# sourceMappingURL=swarm-message-store-validator-grant-access-callback.d.ts.map