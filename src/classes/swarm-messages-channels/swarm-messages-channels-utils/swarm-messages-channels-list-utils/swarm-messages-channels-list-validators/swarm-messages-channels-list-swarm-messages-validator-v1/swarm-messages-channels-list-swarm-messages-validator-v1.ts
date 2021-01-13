import { ESwarmStoreConnector } from '../../../../../swarm-store-class/swarm-store-class.const';
import { TSwarmMessageSerialized } from '../../../../../swarm-message/swarm-message-constructor.types';
import { EOrbitDbFeedStoreOperation } from '../../../../../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.const';
import assert from 'assert';
import { ISwarmMessageChannelDescriptionRaw } from '../../../../types/swarm-messages-channel.types';
import { isValidSwarmMessageDecryptedFormat } from '../../../../../swarm-message-store/swarm-message-store-utils/swarm-message-store-validators/swarm-message-store-validator-swarm-message';
import {
  IValidatorOfSwarmMessageWithChannelDescriptionArgument,
  ISwarmMessagesChannelValidationContext,
} from '../../../../types/swarm-messages-channels-validation.types';
import { TSwrmMessagesChannelsListDBOWithGrantAccess } from '../../../../types/swarm-messages-channels-list.types';
import { IValidatorOfSwarmMessageWithChannelDescription } from '../../../../types/swarm-messages-channels-validation.types';

export async function validatorOfSwrmMessageWithChannelDescription<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DBO extends TSwrmMessagesChannelsListDBOWithGrantAccess<P, T>,
  CTX extends ISwarmMessagesChannelValidationContext
>(this: CTX, argument: IValidatorOfSwarmMessageWithChannelDescriptionArgument<P, T, DBO>): Promise<void> {
  if (!this) {
    throw new Error('A context value should be provided in for the grant access callback function');
  }

  const {
    messageOrHash,
    senderUserId,
    keyInDb,
    operationInDb,
    channelExistingDescription,
    channelsListDescription,
    grandAccessCallbackFromDbOptions,
    getDatabaseKeyForChannelDescription,
    getIssuerForSwarmMessageWithChannelDescriptionByChannelsListDescription,
    getTypeForSwarmMessageWithChannelDescriptionByChannelsListDescription,
    channelDescriptionFormatValidator,
  } = argument;
  assert(keyInDb, 'Database key should be defined for a swarm message with channel description');

  if (channelExistingDescription) {
    assert(
      getDatabaseKeyForChannelDescription(channelExistingDescription) === keyInDb,
      'Key in the database is not equals to the existing channel desciption'
    );
    // TODO - this check may cause an issues with a messages, because the latest channel existing
    // description can contain admins modified and which not contained the user as an admin,
    assert(
      channelExistingDescription.admins.includes(senderUserId),
      'The user who sends the channel descriptions should be in the list of the channel administrators'
    );
  }

  assert(
    await grandAccessCallbackFromDbOptions.call(this, messageOrHash, senderUserId, keyInDb, operationInDb),
    'Failed to get access by the main grand access function'
  );

  if (operationInDb === EOrbitDbFeedStoreOperation.DELETE) {
    /**
     * VALIADATION OF DELETE OPERATION
     */
    // TODO - move it in another function
    if (!channelExistingDescription) {
      throw new Error('This is an unknown channel and can not be deleted');
    }
  }

  if (operationInDb !== EOrbitDbFeedStoreOperation.DELETE) {
    /**
     * VALIADATION OF OPERATION FIFFERENT FROM DELETE
     */
    // TODO - move it in another function
    // for DELETE operation payload can be empty or deleted message's unique address
    if (!isValidSwarmMessageDecryptedFormat(messageOrHash)) {
      throw new Error('Paylod should be swarm message decrypted');
    }
    assert(!messageOrHash.isPrivate, 'The message should not be a private');

    const { bdy: messageBody } = messageOrHash;

    assert(messageBody.receiverId, 'Message receiver id should be empty');
    if (typeof messageBody.pld === 'string') {
      throw new Error('Message payload should be deserialized description of a swarm channel');
    }
    assert(
      messageBody.iss === getIssuerForSwarmMessageWithChannelDescriptionByChannelsListDescription(channelsListDescription),
      'The issuer of the swarm message with a channel description is not valid'
    );
    assert(
      messageBody.typ === getTypeForSwarmMessageWithChannelDescriptionByChannelsListDescription(channelsListDescription),
      'The type of the swarm message with a channel description is not valid'
    );

    const channelDescriptionRaw = (messageBody.pld as unknown) as ISwarmMessageChannelDescriptionRaw<P, T, any, any>;

    assert(
      getDatabaseKeyForChannelDescription(channelDescriptionRaw) === keyInDb,
      'Key in the database is not equals to the channel desciption'
    );
    if (!channelExistingDescription) {
      // if there is no existing description then the description in the message have to contain
      // the user identity in the list of admin users description
      assert(
        channelDescriptionRaw.admins.includes(senderUserId),
        'The user who sends the user id should be in the list of the channel administrators'
      );
    } else {
      assert(channelDescriptionRaw.id === channelExistingDescription.id, 'Identity of the channel cannot be changed');
      assert(channelDescriptionRaw.dbType === channelExistingDescription.dbType, 'Type of channel database cannot be changed');
    }
    assert(await channelDescriptionFormatValidator.call(this, messageBody.pld), 'Channel description format is not valid');
  }
}

export function getValidatorOfSwrmMessageWithChannelDescription<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  DBO extends TSwrmMessagesChannelsListDBOWithGrantAccess<P, T>
>(): IValidatorOfSwarmMessageWithChannelDescription<P, T, DBO> {
  return validatorOfSwrmMessageWithChannelDescription;
}
