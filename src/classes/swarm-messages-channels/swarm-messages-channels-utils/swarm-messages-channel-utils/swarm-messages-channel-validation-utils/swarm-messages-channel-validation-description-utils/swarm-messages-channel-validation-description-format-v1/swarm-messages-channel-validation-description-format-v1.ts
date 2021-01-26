import assert from 'assert';
import { ESwarmStoreConnector } from '../../../../../../swarm-store-class/swarm-store-class.const';
import { TSwarmMessageSerialized } from '../../../../../../swarm-message/swarm-message-constructor.types';
import { TSwarmStoreDatabaseOptions } from '../../../../../../swarm-store-class/swarm-store-class.types';
import { ISwarmMessageChannelDescriptionRaw } from '../../../../../types/swarm-messages-channel.types';
import { isArrowFunction, isNativeFunction } from '../../../../../../../utils/common-utils/common-utils.functions';

/**
 * Used for validation the swarm channel description format
 *
 * @param this
 * @param swarmMessagesChannelDescriptionRawV1Format
 * @param additionalParams - with json schema to validate the format of a swarm channel description
 */
export function swarmMessagesChannelValidationDescriptionFormatV1<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DBO extends TSwarmStoreDatabaseOptions<P, T, any>
>(swarmMessagesChannelDescriptionRawV1Format: ISwarmMessageChannelDescriptionRaw<P, T, any, DBO>): void {
  const { admins, dbOptions } = swarmMessagesChannelDescriptionRawV1Format;
  debugger;
  assert(dbOptions, 'Database options for the swarm channel should be defined');
  assert(typeof dbOptions === 'object', 'Database options should be an object');

  assert(Array.isArray(admins), 'List with admins userd identities must be an array');
  assert(admins.length, 'List with admins must must contain at least one user identity');

  const { write: usersIdsWithWriteAccess, grantAccess, isPublic } = dbOptions;
  debugger;
  if (isPublic) {
    assert(Boolean(usersIdsWithWriteAccess), 'Public channels should not have the "write" property in database options');
  }
  if (grantAccess) {
    assert(typeof grantAccess === 'function', 'Grant access function must be a function');
    // TODO may be call the function to validate the behaviour
    assert(grantAccess.length === 4, 'The grant access callback function must handle 4 arguments');
    assert(grantAccess.name, 'The grant access callback must be a named function');
    assert(!isNativeFunction(grantAccess as () => unknown), 'The grant access callback must not be a native function');
    assert(!isArrowFunction(grantAccess as () => unknown), 'The grant access callback must not be an arrow function');
  }

  if (usersIdsWithWriteAccess) {
    assert(
      admins.every((adminUserId) => usersIdsWithWriteAccess.includes(adminUserId)),
      'Each admin user should has the write access to the channel'
    );
    assert(Array.isArray(usersIdsWithWriteAccess), 'A list with users which have a write access to the channel must be an array');
  }
}
