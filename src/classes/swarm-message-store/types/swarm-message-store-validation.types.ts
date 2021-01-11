import { TSwarmMessagesStoreGrantAccessCallback } from './swarm-message-store.types';

/**
 * Validates grant access callback function.
 *
 * @export
 * @interface IValidatorGrantAccessCallback
 */
export interface IValidatorSwarmMessagesStoreGrantAccessCallback {
  (grantAccess: unknown): grantAccess is TSwarmMessagesStoreGrantAccessCallback<any, any>;
}
