import assert from 'assert';
import { isNativeFunction, isArrowFunction } from '../../../../utils/common-utils/common-utils.functions';
import { TSwarmMessagesStoreGrantAccessCallback } from '../../types/swarm-message-store.types';

/**
 * Validate grant access callback function
 *
 * @export
 * @param {unknown} grantAccess
 * @returns {grantAccess is TSwarmMessagesStoreGrantAccessCallback<any, any>}
 * @throws
 */
export function validateGrantAccessCallback(
  grantAccess: unknown
): grantAccess is TSwarmMessagesStoreGrantAccessCallback<any, any> {
  assert(grantAccess, 'Grant access callback must be provided in the databse options');
  if (typeof grantAccess !== 'function') {
    throw new Error('Grant access callback should be a function');
  }
  assert(grantAccess.length <= 5, 'Grant access callback should handle maximum 5 arguments');
  if (!grantAccess.length) {
    // TODO length for a function with rest spread arguments is 0
    console.warn('Grant access callback should handle minimum 1 argument');
  }
  assert(!isNativeFunction(grantAccess), 'Grant access callback should not be a native function');
  return true;
}

/**
 * Validate grant access callback function
 * which is ready to accept a context.
 *
 * @export
 * @param {unknown} grantAccess
 * @returns {grantAccess is TSwarmMessagesStoreGrantAccessCallback<any, any>}
 */
export function validateGrantAccessCallbackWithContext(
  grantAccess: unknown
): grantAccess is TSwarmMessagesStoreGrantAccessCallback<any, any> {
  if (!validateGrantAccessCallback(grantAccess)) {
    throw new Error('The function is not a valid grand access callback');
  }
  assert(Boolean(grantAccess.name), 'Grant access callback function should have a name');
  assert(!isArrowFunction(grantAccess), 'Grant access callback should not be an arrow function function');
  return true;
}
