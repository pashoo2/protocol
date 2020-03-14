import CentralAuthorityIdentity from 'classes/central-authority-class/central-authority-class-user-identity/central-authority-class-user-identity';
import assert from 'assert';
import { TSwarmMessageUserIdentifierSerialized } from './swarm-message-subclass-validator-fields-validator-validator-user-identifier.types';
import { SWARM_MESSAGE_SUBCLASS_VALIDATOR_USER_IDENTITY_SERIALIZED_MAX_LENGTH } from './swarm-message-subclass-validator-fields-validator-validator-user-identifier.const';
import { TSwarmMessageUserIdentifierVersion } from '../../../swarm-message-subclass-validator.types';
import { ICAUserUniqueIdentifierDescription } from '../../../../../../central-authority-class/central-authority-class-user-identity/central-authority-class-user-identity.types';
import { CA_USER_IDENTITY_VERSION_PROP_NAME } from '../../../../../../central-authority-class/central-authority-class-user-identity/central-authority-class-user-identity.const';

/**
 * validates if the user identity is a valid
 * central authority identity
 *
 * @param {string} userId
 * @throws
 */
export function validateUserIdentifier(
  userId: TSwarmMessageUserIdentifierSerialized,
  validVersions?: TSwarmMessageUserIdentifierVersion[]
): void {
  assert(userId != null, 'User id must be specified');
  assert(typeof userId === 'string', 'User id must be a string');
  assert(
    userId.length <
      SWARM_MESSAGE_SUBCLASS_VALIDATOR_USER_IDENTITY_SERIALIZED_MAX_LENGTH,
    'User ientity if too large'
  );

  const uid = new CentralAuthorityIdentity(userId);

  assert(uid.isValid, 'The user identity is not valid');
  if (validVersions) {
    assert(
      validVersions.includes(
        (uid.identityDescription as ICAUserUniqueIdentifierDescription)[
          CA_USER_IDENTITY_VERSION_PROP_NAME
        ]
      ),
      'The version of the user identity is not supported'
    );
  }
}

export default validateUserIdentifier;
