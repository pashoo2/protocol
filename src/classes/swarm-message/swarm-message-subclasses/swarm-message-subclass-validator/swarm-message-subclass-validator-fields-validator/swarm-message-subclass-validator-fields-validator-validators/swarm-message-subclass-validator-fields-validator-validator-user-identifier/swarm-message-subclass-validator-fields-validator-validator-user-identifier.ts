import CentralAuthorityIdentity from 'classes/central-authority-class/central-authority-class-user-identity/central-authority-class-user-identity';
import assert from 'assert';
import { TSwarmMessageUserIdentifierSerialized } from './swarm-message-subclass-validator-fields-validator-validator-user-identifier.types';

/**
 * validates if the user identity is a valid
 * central authority identity
 *
 * @param {string} userId
 * @throws
 */
function validateUserIdentifier(
  userId: TSwarmMessageUserIdentifierSerialized
): void {
  assert(userId != null, 'User id must be specified');
  assert(
    userId === 'string',
    'User id must be a string or an instance of the CentralAuthorityIdentity'
  );

  const uid = new CentralAuthorityIdentity(userId);

  assert(uid.isValid, 'The user identity is not valid');
}

export default validateUserIdentifier;
