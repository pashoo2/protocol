import assert from 'assert';
import { ESwarmStoreConnector } from '../../../../../swarm-store-class/swarm-store-class.const';
import {
  TSwarmMessageSerialized,
  ISwarmMessageInstanceDecrypted,
} from '../../../../../swarm-message/swarm-message-constructor.types';
import { EOrbitDbStoreOperation } from '../../../../../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.const';
import { isValidSwarmMessageDecryptedFormat } from '../../../../../swarm-message-store/swarm-message-store-utils/swarm-message-store-validators/swarm-message-store-validator-swarm-message';
import { IValidatorOfSwarmMessageWithChannelDescriptionArgument } from '../../../../types/swarm-messages-channels-validation.types';
import { TSwarmMessagesChannelsListDBOWithGrantAccess } from '../../../../types/swarm-messages-channels-list-instance.types';
import { IValidatorOfSwarmMessageWithChannelDescription } from '../../../../types/swarm-messages-channels-validation.types';
import { ISwarmStoreDBOGrandAccessCallbackBaseContext } from '../../../../../swarm-store-class/swarm-store-connectors/swarm-store-connectors.types';
import { validateUsersList } from '../../../swarm-messages-channel-utils/swarm-messages-channel-validation-utils/swarm-messages-channel-validation-description-utils/swarm-messages-channel-validation-utils-common/swarm-messages-channel-validation-utils-common';

// TODO - add memoization
export async function validatorOfSwrmMessageWithChannelDescription<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  MD extends ISwarmMessageInstanceDecrypted,
  CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext,
  DBO extends TSwarmMessagesChannelsListDBOWithGrantAccess<P, T, MD, CTX>
>(this: CTX, argument: IValidatorOfSwarmMessageWithChannelDescriptionArgument<P, T, MD, CTX, DBO>): Promise<void> {
  if (!this) {
    throw new Error('A context value should be provided in for the grant access callback function');
  }

  const {
    /*
     * if the databse is not ready it can not return an existing channel description
     * therefore there should no be any validations related to the existing channel
     * description. And it means that it's not neccessary to validate users
     * because all the message have been exists and all of them are not new
     */
    isDatabaseReady,
    messageOrHash,
    senderUserId,
    keyInDb,
    operationInDb,
    timeEntryAdded,
    channelExistingDescription,
    channelsListDescription,
    grandAccessCallbackFromDbOptions,
    getDatabaseKeyForChannelDescription,
    getIssuerForSwarmMessageWithChannelDescriptionByChannelsListDescription,
    getTypeForSwarmMessageWithChannelDescriptionByChannelsListDescription,
    channelDescriptionFormatValidator,
    parseChannelDescription,
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
    // TODO - resolve cas to string type T
    await grandAccessCallbackFromDbOptions.call(this, messageOrHash as T, senderUserId, keyInDb, operationInDb, timeEntryAdded),
    'Failed to get access by the main grand access function'
  );

  if (operationInDb !== EOrbitDbStoreOperation.DELETE) {
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

    assert(!messageBody.receiverId, 'Message receiver id should be empty');
    assert(
      messageBody.iss === getIssuerForSwarmMessageWithChannelDescriptionByChannelsListDescription(channelsListDescription),
      'The issuer of the swarm message with a channel description is not valid'
    );
    assert(
      messageBody.typ === getTypeForSwarmMessageWithChannelDescriptionByChannelsListDescription(channelsListDescription),
      'The type of the swarm message with a channel description is not valid'
    );

    // create description from string

    const channelDescriptionRaw = await parseChannelDescription(messageBody.pld);
    // validate the channel description raw format
    // eslint-disable-next-line @typescript-eslint/unbound-method
    const { jsonSchemaValidator, isUserValid } = this;

    await channelDescriptionFormatValidator(channelDescriptionRaw, jsonSchemaValidator);
    assert(
      getDatabaseKeyForChannelDescription(channelDescriptionRaw) === keyInDb,
      'Key in the database is not equals to the channel desciption'
    );

    if (channelExistingDescription) {
      assert(channelDescriptionRaw.id === channelExistingDescription.id, 'Identity of the channel cannot be changed');
      assert(channelDescriptionRaw.dbType === channelExistingDescription.dbType, 'Type of channel database cannot be changed');
      assert(
        channelDescriptionRaw.messageEncryption === channelExistingDescription.messageEncryption,
        'Message encryption type cant be changed for swarm messages channel'
      );
    } else if (isDatabaseReady) {
      /**
       * If there is no existing description then the description in the message have to contain
       * the user identity in the list of admin users description.
       * We have checked that the user was one of admins, so the user can change the
       * admins list and exlude itself from the list, so we don't need to check
       * whether the user still exists in the admins list
       * */

      assert(
        channelDescriptionRaw.admins.includes(senderUserId),
        'The user who sends the user id should be in the list of the channel administrators'
      );
    }

    const { admins, dbOptions } = channelDescriptionRaw;
    const { write: usersIdsWithWriteAccess } = dbOptions;

    if (isDatabaseReady) {
      // validate users only for a new message added, if the database is not ready
      // it means that the message is old and it's have already been validated

      // validate users presented in the channel description
      try {
        await validateUsersList(admins, isUserValid);
      } catch (err) {
        throw new Error(`Admin users identities are not valid: ${err.message}`);
      }
      if (usersIdsWithWriteAccess) {
        try {
          await validateUsersList(usersIdsWithWriteAccess as string[], isUserValid);
        } catch (err) {
          throw new Error(`Users identifiers list, which have a write access is not valid: ${err.message}`);
        }
      }
    }
  }
}

export function getValidatorOfSwrmMessageWithChannelDescription<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  MD extends ISwarmMessageInstanceDecrypted,
  CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext,
  DBO extends TSwarmMessagesChannelsListDBOWithGrantAccess<P, T, MD, CTX>
>(): IValidatorOfSwarmMessageWithChannelDescription<P, T, MD, CTX, DBO> {
  return validatorOfSwrmMessageWithChannelDescription;
}
