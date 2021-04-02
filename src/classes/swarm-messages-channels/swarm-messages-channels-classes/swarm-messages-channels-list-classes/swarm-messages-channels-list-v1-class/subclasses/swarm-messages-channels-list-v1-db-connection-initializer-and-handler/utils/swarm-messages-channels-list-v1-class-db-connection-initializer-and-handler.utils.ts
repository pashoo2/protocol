import { ESwarmStoreConnector } from '../../../../../../../swarm-store-class/swarm-store-class.const';
import {
  TSwarmMessageSerialized,
  ISwarmMessageInstanceDecrypted,
} from '../../../../../../../swarm-message/swarm-message-constructor.types';
import { ISwarmStoreDBOGrandAccessCallbackBaseContext } from '../../../../../../../swarm-store-class/swarm-store-connectors/swarm-store-connetors.types';
import { TSwrmMessagesChannelsListDBOWithGrantAccess } from '../../../../../../types/swarm-messages-channels-list-instance.types';
import { TSwarmMessageUserIdentifierSerialized } from '../../../../../../../central-authority-class/central-authority-class-user-identity/central-authority-class-user-identity-validators/central-authority-common-validator-user-identifier/central-authority-common-validator-user-identifier.types';
import { TSwarmStoreDatabaseEntryOperation } from '../../../../../../../swarm-store-class/swarm-store-class.types';
import {
  ISwarmMessagesChannelsListV1GrantAccessVariableArguments,
  ISwarmMessagesChannelsListV1GrantAccessConstantArguments,
} from '../../../types/swarm-messages-channels-list-v1-class.types';
import { IValidatorOfSwarmMessageWithChannelDescriptionArgument } from '../../../../../../types/swarm-messages-channels-validation.types';
import { ICreateGrantAccessCallbackByConstantArgumentsAndMessageWithChannelDescriptionValidatorArguments } from '../../../types/swarm-messages-channels-list-v1-class-db-connection-initializer-and-handler.types';
import { ISwarmMessageChannelDescriptionRaw } from '../../../../../../types/swarm-messages-channel-instance.types';
import { EOrbitDbStoreOperation } from '../../../../../../../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.const';
import { ISwarmMessagesStoreConnectorUtilsDbOptionsGrandAccessCallbackBound } from '../../../../../../../swarm-message-store/types/swarm-message-store.types';

export function getVariableArgumentsWithoutExistingChannelDescriptionForGrantAccessValidator<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  MD extends ISwarmMessageInstanceDecrypted,
  CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext,
  DBO extends TSwrmMessagesChannelsListDBOWithGrantAccess<P, T, MD, CTX>
>({
  payload,
  userId,
  key,
  operation,
  time,
}: {
  payload: T | MD;
  userId: TSwarmMessageUserIdentifierSerialized;
  // key of the value
  key: string | undefined;
  // operation which is processed (like delete, add or something else)
  operation: TSwarmStoreDatabaseEntryOperation<P> | undefined;
  // Clock time (e.g. Lamprod clock time) when was the entry added
  time: number;
}): Omit<Required<ISwarmMessagesChannelsListV1GrantAccessVariableArguments<P, T, MD, CTX, DBO>>, 'channelExistingDescription'> {
  debugger;
  if (!key) {
    throw new Error('A key must be provided for swarm messages channel description');
  }
  if (!operation) {
    throw new Error('A database operation must be provided for any changing of swarm messages channel description');
  }
  return {
    keyInDb: key,
    messageOrHash: payload,
    operationInDb: operation,
    senderUserId: userId,
    timeEntryAdded: time,
  };
}

export function getArgumentsForSwarmMessageWithChannelDescriptionValidator<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  MD extends ISwarmMessageInstanceDecrypted,
  CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext,
  DBO extends TSwrmMessagesChannelsListDBOWithGrantAccess<P, T, MD, CTX>
>(
  constantArguments: ISwarmMessagesChannelsListV1GrantAccessConstantArguments<P, T, MD, CTX, DBO>,
  variableArguments: Omit<
    ISwarmMessagesChannelsListV1GrantAccessVariableArguments<P, T, MD, CTX, DBO>,
    'channelExistingDescription'
  >,
  channelExistingDescription: IValidatorOfSwarmMessageWithChannelDescriptionArgument<
    P,
    T,
    MD,
    CTX,
    DBO
  >['channelExistingDescription']
): IValidatorOfSwarmMessageWithChannelDescriptionArgument<P, T, MD, CTX, DBO> {
  return {
    ...constantArguments,
    ...variableArguments,
    channelExistingDescription,
  };
}

export function createGrantAccessCallbackByConstantArgumentsAndMessageWithChannelDescriptionValidator<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  MD extends ISwarmMessageInstanceDecrypted,
  CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext,
  DBO extends TSwrmMessagesChannelsListDBOWithGrantAccess<P, T, MD, CTX>
>({
  constantArguments,
  channelDescriptionSwarmMessageValidator,
  getVariableArgumentsWithoutExistingChannelDescriptionForGrantAccessValidator,
  getArgumentsForSwarmMessageWithChannelDescriptionValidator,
  getPreviousChannelDescriptionByMessageKeyAndAddedTime,
}: ICreateGrantAccessCallbackByConstantArgumentsAndMessageWithChannelDescriptionValidatorArguments<
  P,
  T,
  MD,
  CTX,
  DBO
>): DBO['grantAccess'] {
  interface ILatestMessageDescription {
    /**
     * Swarm messages or undefiened if DELETE operation
     */
    message: MD;
    latestTime: number;
  }

  const messagesCachedForDatabaseKey: Record<string, Map<number, ILatestMessageDescription>> = {};

  function getHashForDatabaseKey(databaseName: string, key: string): string {
    return `${databaseName}_${key}`;
  }

  function getMessagesCachedForDatabaseKeyOrUndefined(
    databaseName: string,
    key: string
  ): Map<number, ILatestMessageDescription> | undefined {
    const hash = getHashForDatabaseKey(databaseName, key);
    return messagesCachedForDatabaseKey[hash];
  }

  function getPreviousMessageCachedFromDatabaseKeyAndTime(
    databaseName: string,
    // key of the value
    key: string,
    handledMessageTime: number
  ): MD | undefined {
    const messagesCachedMapWithTimeKeys = getMessagesCachedForDatabaseKeyOrUndefined(databaseName, key);

    if (messagesCachedMapWithTimeKeys) {
      const messagesAddTimes = messagesCachedMapWithTimeKeys;
      let messageCachedAddTime: number;
      let previousMessageTime: number = -1;

      for (messageCachedAddTime of messagesAddTimes.keys()) {
        if (messageCachedAddTime < handledMessageTime) {
          if (previousMessageTime < messageCachedAddTime) {
            previousMessageTime = messageCachedAddTime;
          }
        }
      }
      if (previousMessageTime !== -1) {
        const previousMessageDescription = messagesCachedMapWithTimeKeys.get(previousMessageTime);
        if (!previousMessageDescription) {
          throw new Error(`Previous message can't be gotten by the time key ${previousMessageTime}`);
        }
        return previousMessageDescription.message;
      }
    }
  }

  function addMessageToDatabaseKeysCache(
    swarmMessage: MD,
    databaseName: string,
    // key of the value
    key: string,
    time: number
  ): void {
    let messagesCachedMapWithTimeKeys = getMessagesCachedForDatabaseKeyOrUndefined(databaseName, key);

    if (!messagesCachedMapWithTimeKeys) {
      const hashForKeyAndDatabaseName = getHashForDatabaseKey(databaseName, key);

      messagesCachedMapWithTimeKeys = new Map<number, ILatestMessageDescription>();
      messagesCachedForDatabaseKey[hashForKeyAndDatabaseName] = messagesCachedMapWithTimeKeys;
    }
    messagesCachedMapWithTimeKeys.set(time, {
      latestTime: time,
      message: swarmMessage,
    });
  }

  async function channelsListGrantAccessCallbackFunction(
    this: CTX,
    payload: T | MD,
    userId: TSwarmMessageUserIdentifierSerialized,
    // name of the database
    databaseName: string,
    // key of the value
    key: string | undefined,
    // operation which is processed (like delete, add or something else).
    operation: TSwarmStoreDatabaseEntryOperation<P> | undefined,
    // a real or an abstract clock time when the entry was added into the database
    time: number
  ): Promise<boolean> {
    // TODO
    if ((window as any).__skipSwarmMessage) {
      return true;
    }
    if (!key) {
      throw new Error('Key should be provided for a message with a swarm messages channel description');
    }
    const variableArguments = getVariableArgumentsWithoutExistingChannelDescriptionForGrantAccessValidator({
      payload,
      userId,
      key,
      operation,
      time,
    });
    // let swarmMessagesChannelExistingDescription: Readonly<ISwarmMessageChannelDescriptionRaw<P, T, any, any>> | undefined;
    // if (constantArguments.isDatabaseReady) {
    //   /*
    //     TODO
    //     read an entry existsing before the current according
    //     it's time of adding to the database
    //   */
    //   swarmMessagesChannelExistingDescription = await getPreviousChannelDescriptionByMessageKeyAndAddedTime(key, time);
    //   if (swarmMessagesChannelExistingDescription) {
    //     console.log('swarmMessagesChannelExistingDescription', swarmMessagesChannelExistingDescription);
    //   }
    //   if (operation === EOrbitDbStoreOperation.DELETE) {
    //     // TODO - may be it will cause a problems e.g. if the DELETE
    //     // message has come before CREATE message
    //     if (!swarmMessagesChannelExistingDescription) {
    //       throw new Error('This is an unknown channel and can not be deleted');
    //     }
    //   }
    // }
    const isDELETE = operation === EOrbitDbStoreOperation.DELETE;
    const swarmMessageForChanelDescription = getPreviousMessageCachedFromDatabaseKeyAndTime(databaseName, key, time);

    if (isDELETE) {
      // TODO - may be it will cause a problems e.g. if the DELETE
      // message has come before CREATE message
      if (!swarmMessageForChanelDescription) {
        throw new Error('This is an unknown channel and can not be deleted');
      }
    }
    debugger;
    // TODO - instead of the getPreviousChannelDescriptionByMessageKeyAndAddedTime we need a function for
    // parsing a swarm message to a channel's description
    const swarmMessagesChannelExistingDescription = swarmMessageForChanelDescription
      ? JSON.parse(swarmMessageForChanelDescription.bdy.pld)
      : undefined;
    if (swarmMessagesChannelExistingDescription) {
      return false;
    }
    debugger;
    const argumentsForChannelDescriptionSwarmMessageValidator = getArgumentsForSwarmMessageWithChannelDescriptionValidator(
      constantArguments,
      variableArguments,
      swarmMessagesChannelExistingDescription
    );
    await channelDescriptionSwarmMessageValidator.call(this, argumentsForChannelDescriptionSwarmMessageValidator);
    if (!isDELETE) {
      // if it's a DELETE operation we don't need to add it into the list, because we need only an opearion before the DELETE.
      addMessageToDatabaseKeysCache((typeof payload === 'string' ? JSON.parse(payload) : payload) as MD, databaseName, key, time);
    }
    return true;
  }
  (channelsListGrantAccessCallbackFunction as ISwarmMessagesStoreConnectorUtilsDbOptionsGrandAccessCallbackBound<
    P,
    T,
    MD,
    CTX
  >).toString = constantArguments.grandAccessCallbackFromDbOptions.toString.bind(
    constantArguments.grandAccessCallbackFromDbOptions
  );
  return (channelsListGrantAccessCallbackFunction as ISwarmMessagesStoreConnectorUtilsDbOptionsGrandAccessCallbackBound<
    P,
    T,
    MD,
    CTX
  >) as DBO['grantAccess'];
}
