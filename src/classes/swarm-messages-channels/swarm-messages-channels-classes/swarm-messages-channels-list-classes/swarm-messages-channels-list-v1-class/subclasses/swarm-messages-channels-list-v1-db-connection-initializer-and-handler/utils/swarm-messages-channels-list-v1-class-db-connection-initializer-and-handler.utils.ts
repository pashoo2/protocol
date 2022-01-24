import { ESwarmStoreConnector } from '../../../../../../../swarm-store-class/swarm-store-class.const';
import {
  TSwarmMessageSerialized,
  ISwarmMessageInstanceDecrypted,
} from '../../../../../../../swarm-message/swarm-message-constructor.types';
import { ISwarmStoreDBOGrandAccessCallbackBaseContext } from '../../../../../../../swarm-store-class/swarm-store-connectors/swarm-store-connectors.types';
import { TSwarmMessagesChannelsListDBOWithGrantAccess } from '../../../../../../types/swarm-messages-channels-list-instance.types';
import { TSwarmMessageUserIdentifierSerialized } from '../../../../../../../central-authority-class/central-authority-class-user-identity/central-authority-class-user-identity-validators/central-authority-common-validator-user-identifier/central-authority-common-validator-user-identifier.types';
import {
  TSwarmStoreDatabaseEntryOperation,
  TSwarmStoreDatabaseEntityKey,
} from '../../../../../../../swarm-store-class/swarm-store-class.types';
import {
  ISwarmMessagesChannelsListV1GrantAccessVariableArguments,
  ISwarmMessagesChannelsListV1GrantAccessConstantArguments,
} from '../../../types/swarm-messages-channels-list-v1-class.types';
import { IValidatorOfSwarmMessageWithChannelDescriptionArgument } from '../../../../../../types/swarm-messages-channels-validation.types';
import { ICreateGrantAccessCallbackByConstantArgumentsAndMessageWithChannelDescriptionValidatorArguments } from '../../../types/swarm-messages-channels-list-v1-class-db-connection-initializer-and-handler.types';
import { EOrbitDbStoreOperation } from '../../../../../../../swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.const';
import { ISwarmMessagesStoreConnectorUtilsDbOptionsGrandAccessCallbackBound } from '../../../../../../../swarm-message-store/types/swarm-message-store.types';

export function getVariableArgumentsWithoutExistingChannelDescriptionForGrantAccessValidator<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  MD extends ISwarmMessageInstanceDecrypted,
  CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext,
  DBO extends TSwarmMessagesChannelsListDBOWithGrantAccess<P, T, MD, CTX>
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
  key: TSwarmStoreDatabaseEntityKey<P> | undefined;
  // operation which is processed (like delete, add or something else)
  operation: TSwarmStoreDatabaseEntryOperation<P> | undefined;
  // Clock time (e.g. Lamprod clock time) when was the entry added
  time: number;
}): Omit<Required<ISwarmMessagesChannelsListV1GrantAccessVariableArguments<P, T, MD, CTX, DBO>>, 'channelExistingDescription'> {
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
  DBO extends TSwarmMessagesChannelsListDBOWithGrantAccess<P, T, MD, CTX>
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
  DBO extends TSwarmMessagesChannelsListDBOWithGrantAccess<P, T, MD, CTX>
>({
  constantArguments,
  swarmChannelsListClockSortedChannelsDescriptionsUpdatesCache,
  channelDescriptionSwarmMessageValidator,
  getVariableArgumentsWithoutExistingChannelDescriptionForGrantAccessValidator,
  getArgumentsForSwarmMessageWithChannelDescriptionValidator,
}: ICreateGrantAccessCallbackByConstantArgumentsAndMessageWithChannelDescriptionValidatorArguments<
  P,
  T,
  MD,
  CTX,
  DBO
>): DBO['grantAccess'] {
  async function channelsListGrantAccessCallbackFunction(
    this: CTX,
    payload: T | MD,
    userId: TSwarmMessageUserIdentifierSerialized,
    // name of the database
    databaseName: string,
    // key of the value
    key: TSwarmStoreDatabaseEntityKey<P> | undefined,
    // operation which is processed (like delete, add or something else).
    operation: TSwarmStoreDatabaseEntryOperation<P> | undefined,
    // a real or an abstract clock time when the entry was added into the database
    time: number
  ): Promise<boolean> {
    if (process.env.NODE_ENV === 'development') {
      // TODO - remove it
      if ((window as any).__skipValidationChannelDescription) {
        return true;
      }
    }
    if (!key) {
      throw new Error('Key should be provided for a message with a swarm messages channel description');
    }

    const isDELETE = operation === EOrbitDbStoreOperation.DELETE;
    const variableArguments = getVariableArgumentsWithoutExistingChannelDescriptionForGrantAccessValidator({
      payload,
      userId,
      key,
      operation,
      time,
    });
    const previousChannelDescription =
      swarmChannelsListClockSortedChannelsDescriptionsUpdatesCache.getChannelDescriptionUpdatePreviousByClockTimeOrUndefined(
        key,
        time
      );

    if (isDELETE) {
      // TODO - may be it will cause a problems e.g. if the DELETE
      // message has come before CREATE message
      if (!previousChannelDescription) {
        throw new Error('This is an unknown channel and can not be deleted');
      }
    }

    const argumentsForChannelDescriptionSwarmMessageValidator = getArgumentsForSwarmMessageWithChannelDescriptionValidator(
      constantArguments,
      variableArguments,
      previousChannelDescription
    );

    await channelDescriptionSwarmMessageValidator.call(this, argumentsForChannelDescriptionSwarmMessageValidator);
    if (!isDELETE) {
      // if it's a DELETE operation we don't need to add it into the list, because we need only an opearion before the DELETE.
      if (typeof payload === 'string') {
        throw new Error('Paylod of a database non-delete operation must be a swarm message decrypted');
      }
      await swarmChannelsListClockSortedChannelsDescriptionsUpdatesCache.addSwarmMessageWithChannelDescriptionUpdate(
        key,
        time,
        payload
      );
    }
    return true;
  }
  (
    channelsListGrantAccessCallbackFunction as ISwarmMessagesStoreConnectorUtilsDbOptionsGrandAccessCallbackBound<P, T, MD, CTX>
  ).toString = constantArguments.grandAccessCallbackFromDbOptions.toString.bind(
    constantArguments.grandAccessCallbackFromDbOptions
  );
  return channelsListGrantAccessCallbackFunction as ISwarmMessagesStoreConnectorUtilsDbOptionsGrandAccessCallbackBound<
    P,
    T,
    MD,
    CTX
  > as DBO['grantAccess'];
}
