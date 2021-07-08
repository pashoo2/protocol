import assert from 'assert';
import { ESwarmStoreConnector } from '../../../../../../swarm-store-class/swarm-store-class.const';
import { TSwarmMessageSerialized } from '../../../../../../swarm-message/swarm-message-constructor.types';
import { TSwarmStoreDatabaseOptions } from '../../../../../../swarm-store-class/swarm-store-class.types';
import { ISwarmMessageChannelDescriptionRaw } from '../../../../../types/swarm-messages-channel-instance.types';
import { SWARM_MESSAGES_CHANNEL_ENCRYPTION } from '../../../../../const/swarm-messages-channels-main.const';
import { validateGrantAccessCallbackWithContextSerializable } from '../../../../../../swarm-message-store/swarm-message-store-utils/swarm-message-store-validators/swarm-message-store-validator-grant-access-callback';

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
  assert(swarmMessagesChannelDescriptionRawV1Format, 'Channel description should be defined');

  const { admins, dbOptions, messageEncryption } = swarmMessagesChannelDescriptionRawV1Format;

  assert(dbOptions, 'Database options for the swarm channel should be defined');
  assert(typeof dbOptions === 'object', 'Database options should be an object');

  if (dbOptions.isPublic) {
    assert(
      messageEncryption === SWARM_MESSAGES_CHANNEL_ENCRYPTION.PUBLIC,
      'For a public database there should no be any message encryption specified'
    );
  }
  if (messageEncryption === SWARM_MESSAGES_CHANNEL_ENCRYPTION.PRIVATE) {
    assert(dbOptions.write?.length === 2, 'For a private message channel only two users should be specified');
  }
  if (messageEncryption === SWARM_MESSAGES_CHANNEL_ENCRYPTION.PASSWORD) {
    assert(
      Number(dbOptions.write?.length) > 1,
      'For a password encrypted channels at least a 2 users should be specified as users who have a the write access'
    );
  }

  assert(Array.isArray(admins), 'List with admins userd identities must be an array');
  assert(admins.length, 'List with admins must must contain at least one user identity');

  const { write: usersIdsWithWriteAccess, grantAccess, isPublic } = dbOptions;

  if (isPublic) {
    assert(Boolean(usersIdsWithWriteAccess), 'Public channels should not have the "write" property in database options');
  }
  assert(validateGrantAccessCallbackWithContextSerializable(grantAccess), 'Grant access callback is not valid');
  if (usersIdsWithWriteAccess) {
    assert(Array.isArray(usersIdsWithWriteAccess), 'A list with users which have a write access to the channel must be an array');
    assert(
      admins.every((adminUserId) => usersIdsWithWriteAccess.includes(adminUserId)),
      'Each admin user should has the write access to the channel'
    );
  }
}
