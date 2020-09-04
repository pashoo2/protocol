import {
  TSwarmChannelId,
  ISwarmChannelSharedMeta,
  ISwarmChannelLocalMeta,
  TSwarmChannelPassworCryptodKeyExported,
  TSwarmChannelPasswordHash,
  ISwarmChannelDescriptionFieldsBase,
} from '../../../../swarm-channel.types';
import assert from 'assert';
import { TUesrIdentity } from 'types/users.types';
import { validateUserIdentity } from 'classes/central-authority-class/central-authority-validators/central-authority-validators-auth-credentials/central-authority-validators-auth-credentials';

import {
  SwarmChannelType,
  SWARM_CHANNEL_TYPES,
} from '../../../../swarm-channel.const';
import { ISwarmChannelDescriptionFieldsBasePartial } from './swarm-channel-base-validator.types';
import {
  SWARM_CHANNEL_BASE_VALIDATOR_CHANNEL_PASSWORD_MIN_LENGTH,
  SWARM_CHANNEL_BASE_VALIDATOR_CHANNEL_PASSWORD_MAX_LENGTH,
  SWARM_CHANNEL_BASE_VALIDATOR_CHANNEL_PASSWORD_HASH_MIN_LENGTH,
} from './swarm-channel-base-validator.const';
import { isJWK } from '../../../../../../utils/encryption-keys-utils/encryption-keys-utils';
import { PASSWORD_ENRYPTION_UTILS_KEY_DERIVED_TARGET_KEY_EXPORT_FORMAT } from '../../../../../../utils/password-utils/password-utils.const';
import {
  SWARM_CHANNEL_BASE_VALIDATOR_CHANNEL_NAME_MAX_LENGTH,
  SWARM_CHANNEL_BASE_VALIDATOR_CHANNEL_DESCRIPTION_MAX_LENGTH,
  SWARM_CHANNEL_BASE_PARTICIPANTS_MAX_USERS,
  SWARM_CHANNEL_BASE_BLACK_LIST_MAX_MEMBERS,
  SWARM_CHANNEL_BASE_VALIDATOR_CHANNEL_ID_MAX_LENGTH,
  SWARM_CHANNEL_BASE_VALIDATOR_CHANNEL_PASSWORD_HASH_MAX_LENGTH,
} from './swarm-channel-base-validator.const';

export class SwarmChannelBaseOptionsValidator {
  checkId(channelId: any): channelId is TSwarmChannelId {
    assert(!!channelId, 'Channel id must not be empty');
    assert(typeof channelId === 'string', 'Channel id must be a string');
    assert(
      channelId.length <= SWARM_CHANNEL_BASE_VALIDATOR_CHANNEL_ID_MAX_LENGTH,
      `The maximum length of the channel identity is ${SWARM_CHANNEL_BASE_VALIDATOR_CHANNEL_ID_MAX_LENGTH}`
    );
    return true;
  }

  checkType(channelType: any): channelType is SwarmChannelType {
    assert(!!channelType, 'Channel type must not be empty');
    assert(typeof channelType === 'string', 'Channel type must be a string');
    assert(SWARM_CHANNEL_TYPES.has(channelType), 'Unknown channel type');
    return true;
  }

  checkPassword(channelPassword: any): channelPassword is string {
    assert(!!channelPassword, 'Channel password is not defined');
    assert(
      typeof channelPassword === 'string',
      'Channel password must be a string'
    );
    assert(
      channelPassword.length >=
        SWARM_CHANNEL_BASE_VALIDATOR_CHANNEL_PASSWORD_MIN_LENGTH,
      `The minimal length for a channel password is ${SWARM_CHANNEL_BASE_VALIDATOR_CHANNEL_PASSWORD_MIN_LENGTH}`
    );
    assert(
      channelPassword.length <=
        SWARM_CHANNEL_BASE_VALIDATOR_CHANNEL_PASSWORD_MAX_LENGTH,
      `The maximum length for a channel password is ${SWARM_CHANNEL_BASE_VALIDATOR_CHANNEL_PASSWORD_MAX_LENGTH}`
    );
    return true;
  }

  checkName(name: any): name is string {
    assert(!!name, 'Channel name must be provided');
    assert(typeof name === 'string', 'Channel name must be a string');
    assert(
      name.length <= SWARM_CHANNEL_BASE_VALIDATOR_CHANNEL_NAME_MAX_LENGTH,
      `The maximum length of a channel is ${SWARM_CHANNEL_BASE_VALIDATOR_CHANNEL_NAME_MAX_LENGTH}`
    );
    return true;
  }

  checkUserId = (userId: any): userId is TUesrIdentity => {
    assert(validateUserIdentity(userId), 'The user identity is not valid');
    return true;
  };

  checkParticipants = (participants: any): participants is TUesrIdentity[] => {
    assert(!!participants, 'Participants list must be defined');
    assert(Array.isArray(participants), 'Participants list must be an array');

    const maxMembers = SWARM_CHANNEL_BASE_PARTICIPANTS_MAX_USERS;

    assert(
      participants.length <= maxMembers,
      `Participants list must have maximum of ${maxMembers} members`
    );
    participants.forEach(this.checkUserId);
    return true;
  };

  checkBlackList = (
    usersInBlackList: any
  ): usersInBlackList is TUesrIdentity[] => {
    assert(!!usersInBlackList, 'Blacklist must be defined');
    assert(Array.isArray(usersInBlackList), 'Blacklist must be an array');

    const maxMembers = SWARM_CHANNEL_BASE_BLACK_LIST_MAX_MEMBERS;

    assert(
      usersInBlackList.length <= maxMembers,
      `Blacklist must have maximum of ${maxMembers} members`
    );
    usersInBlackList.forEach(this.checkUserId);
    return true;
  };

  checkChannelDescription(description: any): description is string {
    assert(!!description, 'Description must be defined');
    assert(
      typeof description === 'string',
      'Channel description must be a string'
    );
    assert(
      description.length <=
        SWARM_CHANNEL_BASE_VALIDATOR_CHANNEL_DESCRIPTION_MAX_LENGTH,
      `The maximum length of a channel is ${SWARM_CHANNEL_BASE_VALIDATOR_CHANNEL_DESCRIPTION_MAX_LENGTH} charecters`
    );
    return true;
  }

  checPasswordCryptoKeyExported(
    channelPwdCryptoKeyExported: any
  ): channelPwdCryptoKeyExported is TSwarmChannelPassworCryptodKeyExported {
    assert(
      !!channelPwdCryptoKeyExported,
      'Channel password exported crypto key must be provided'
    );
    assert(
      typeof channelPwdCryptoKeyExported === 'string',
      'Channel password exported crypto key must be a string'
    );
    if (
      PASSWORD_ENRYPTION_UTILS_KEY_DERIVED_TARGET_KEY_EXPORT_FORMAT === 'jwk'
    ) {
      assert(
        isJWK(JSON.parse(channelPwdCryptoKeyExported)),
        'Channel password exported crypto key must be exported in JWK format'
      );
    }
    return true;
  }

  checkPasswordHash(
    channelPwdHash: any
  ): channelPwdHash is TSwarmChannelPasswordHash {
    assert(!!channelPwdHash, 'Channel password hash must be specified');
    assert(
      typeof channelPwdHash === 'string',
      'Channel password hash must be specified'
    );
    assert(
      channelPwdHash.length >=
        SWARM_CHANNEL_BASE_VALIDATOR_CHANNEL_PASSWORD_HASH_MIN_LENGTH,
      `The minimal length of channel password hash is ${SWARM_CHANNEL_BASE_VALIDATOR_CHANNEL_PASSWORD_HASH_MIN_LENGTH}`
    );
    assert(
      channelPwdHash.length <=
        SWARM_CHANNEL_BASE_VALIDATOR_CHANNEL_PASSWORD_HASH_MAX_LENGTH,
      `The maximal length of channel password hash is ${SWARM_CHANNEL_BASE_VALIDATOR_CHANNEL_PASSWORD_HASH_MAX_LENGTH}`
    );
    return true;
  }

  checkSharedMetaPartial = (
    sharedMeta: any,
    requiredFields?: Array<keyof ISwarmChannelSharedMeta>
  ): sharedMeta is Partial<ISwarmChannelSharedMeta> => {
    assert(!!sharedMeta, 'Shared metadata of the channel is not defined');
    assert(
      typeof sharedMeta === 'object',
      'Shared metadata of the channel must be an object'
    );

    const areRequiredFieldsSpecified = !!requiredFields?.length;

    (!areRequiredFieldsSpecified || requiredFields?.includes('isPublic')) &&
      assert(
        typeof sharedMeta.isPublic === 'boolean',
        'The channel flag isPublic must be a boolean'
      );
    (!areRequiredFieldsSpecified || requiredFields?.includes('name')) &&
      this.checkName(sharedMeta.name);
    (!areRequiredFieldsSpecified || requiredFields?.includes('description')) &&
      this.checkChannelDescription(sharedMeta.description);
    (!areRequiredFieldsSpecified || requiredFields?.includes('ownerId')) &&
      this.checkUserId(sharedMeta.ownerId);
    (!areRequiredFieldsSpecified || requiredFields?.includes('participants')) &&
      this.checkParticipants(sharedMeta.participants);
    (!areRequiredFieldsSpecified || requiredFields?.includes('passwordHash')) &&
      this.checkPasswordHash(sharedMeta.passwordHash);
    return true;
  };

  checkSharedMeta = (
    sharedMeta: any
  ): sharedMeta is ISwarmChannelSharedMeta => {
    return this.checkSharedMetaPartial(sharedMeta);
  };
  checkLocalMetaPartial = (
    localMeta: any,
    requiredFields?: Array<keyof ISwarmChannelLocalMeta>
  ): localMeta is Partial<ISwarmChannelLocalMeta> => {
    assert(!!localMeta, 'Local metadata of the channel is not defined');
    assert(
      typeof localMeta === 'object',
      'Local metadata of the channel must be an object'
    );

    const areRequiredFieldsSpecified = !!requiredFields?.length;

    (!areRequiredFieldsSpecified || requiredFields?.includes('blacklist')) &&
      this.checkBlackList(localMeta.blacklist);
    (!areRequiredFieldsSpecified || requiredFields?.includes('name')) &&
      this.checkName(localMeta.name);
    (!areRequiredFieldsSpecified ||
      requiredFields?.includes('passworCryptodKeyExported')) &&
      this.checPasswordCryptoKeyExported(localMeta.passworCryptodKeyExported);
    return true;
  };

  checkLocalMeta = (localMeta: any): localMeta is ISwarmChannelLocalMeta => {
    return this.checkLocalMetaPartial(localMeta);
  };

  checkChannelDecriptionPartial = (
    channelDescription: any,
    isLocalMetaRequired: boolean = true,
    isSharedMetaRequired: boolean = true,
    localMetaRequiredFields?: Array<keyof ISwarmChannelLocalMeta>,
    sharedMetaRequiredFields?: Array<keyof ISwarmChannelSharedMeta>
  ): channelDescription is ISwarmChannelDescriptionFieldsBasePartial => {
    assert(!!channelDescription, 'Channel description must be defined');
    assert(
      typeof channelDescription === 'object',
      'Channel description must be an object'
    );
    this.checkId(channelDescription.id);
    this.checkType(channelDescription.type);
    if (isLocalMetaRequired) {
      this.checkLocalMetaPartial(
        channelDescription.localMeta,
        localMetaRequiredFields
      );
    }
    if (isSharedMetaRequired) {
      this.checkSharedMetaPartial(
        channelDescription.sharedMeta,
        sharedMetaRequiredFields
      );
    }
    return true;
  };

  checkChannelDecription = (
    channelDescription: any
  ): channelDescription is ISwarmChannelDescriptionFieldsBase => {
    return this.checkChannelDecriptionPartial(channelDescription);
  };
}
