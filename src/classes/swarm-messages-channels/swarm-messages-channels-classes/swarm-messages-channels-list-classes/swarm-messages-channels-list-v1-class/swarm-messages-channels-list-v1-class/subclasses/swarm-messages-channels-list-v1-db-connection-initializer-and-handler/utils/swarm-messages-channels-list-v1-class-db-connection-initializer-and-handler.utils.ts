import { ESwarmStoreConnector } from '../../../../../../../../swarm-store-class/swarm-store-class.const';
import {
  TSwarmMessageSerialized,
  ISwarmMessageInstanceDecrypted,
} from '../../../../../../../../swarm-message/swarm-message-constructor.types';
import { ISwarmStoreDBOGrandAccessCallbackBaseContext } from '../../../../../../../../swarm-store-class/swarm-store-connectors/swarm-store-connetors.types';
import { TSwrmMessagesChannelsListDBOWithGrantAccess } from '../../../../../../../types/swarm-messages-channels-list.types';
import { TSwarmMessageUserIdentifierSerialized } from '../../../../../../../../swarm-message/swarm-message-subclasses/swarm-message-subclass-validators/swarm-message-subclass-validator-fields-validator/swarm-message-subclass-validator-fields-validator-validators/swarm-message-subclass-validator-fields-validator-validator-user-identifier/swarm-message-subclass-validator-fields-validator-validator-user-identifier.types';
import { TSwarmStoreDatabaseEntryOperation } from '../../../../../../../../swarm-store-class/swarm-store-class.types';
import {
  ISwarmMessagesChannelsListV1GrantAccessVariableArguments,
  ISwarmMessagesChannelsListV1GrantAccessConstantArguments,
} from '../../../types/swarm-messages-channels-list-v1-class.types';
import { IValidatorOfSwarmMessageWithChannelDescriptionArgument } from '../../../../../../../types/swarm-messages-channels-validation.types';
import { ICreateGrantAccessCallbackByConstantArgumentsAndMessageWithChannelDescriptionValidatorArguments } from '../../../types/swarm-messages-channels-list-v1-class-db-connection-initializer-and-handler.types';

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
}: {
  payload: T | MD;
  userId: TSwarmMessageUserIdentifierSerialized;
  // key of the value
  key?: string;
  // operation which is processed (like delete, add or something else)
  operation?: TSwarmStoreDatabaseEntryOperation<P>;
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
  getExistingChannelDescriptionByMessageKey,
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
    // key of the value
    key?: string,
    // operation which is processed (like delete, add or something else)
    operation?: TSwarmStoreDatabaseEntryOperation<P>
  ): Promise<boolean> {
    if (!key) {
      throw new Error('Key should be provided for a message with a swarm messages channel description');
    }
    const variableArguments = getVariableArgumentsWithoutExistingChannelDescriptionForGrantAccessValidator({
      payload,
      userId,
      key,
      operation,
    });
    const swarmMessagesChannelExistingDescription = await getExistingChannelDescriptionByMessageKey(key);
    const argumentsForChannelDescriptionSwarmMessageValidator = getArgumentsForSwarmMessageWithChannelDescriptionValidator(
      constantArguments,
      variableArguments,
      swarmMessagesChannelExistingDescription
    );
    await channelDescriptionSwarmMessageValidator.call(this, argumentsForChannelDescriptionSwarmMessageValidator);
    return true;
  }
  return channelsListGrantAccessCallbackFunction as DBO['grantAccess'];
}
