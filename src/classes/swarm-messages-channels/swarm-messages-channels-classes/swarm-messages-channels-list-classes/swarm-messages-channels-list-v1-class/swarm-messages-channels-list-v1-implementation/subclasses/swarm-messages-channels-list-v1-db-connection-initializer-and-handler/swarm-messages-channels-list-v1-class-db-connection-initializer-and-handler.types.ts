import { ESwarmStoreConnector } from '../../../../../../../swarm-store-class/swarm-store-class.const';
import { ISwarmStoreDBOGrandAccessCallbackBaseContext } from '../../../../../../../swarm-store-class/swarm-store-connectors/swarm-store-connetors.types';
import { TSwrmMessagesChannelsListDBOWithGrantAccess } from '../../../../../../types/swarm-messages-channels-list.types';
import { TSwarmMessageUserIdentifierSerialized } from '../../../../../../../swarm-message/swarm-message-subclasses/swarm-message-subclass-validators/swarm-message-subclass-validator-fields-validator/swarm-message-subclass-validator-fields-validator-validators/swarm-message-subclass-validator-fields-validator-validator-user-identifier/swarm-message-subclass-validator-fields-validator-validator-user-identifier.types';
import { TSwarmStoreDatabaseEntryOperation } from '../../../../../../../swarm-store-class/swarm-store-class.types';
import {
  IValidatorOfSwarmMessageWithChannelDescriptionArgument,
  IValidatorOfSwarmMessageWithChannelDescription,
} from '../../../../../../types/swarm-messages-channels-validation.types';
import {
  TSwarmMessageSerialized,
  ISwarmMessageInstanceDecrypted,
} from '../../../../../../../swarm-message/swarm-message-constructor.types';
import {
  ISwarmMessagesChannelsListV1GrantAccessVariableArguments,
  ISwarmMessagesChannelsListV1GrantAccessConstantArguments,
} from '../../types/swarm-messages-channels-list-v1-class.types';

export interface IGetVariableArgumentsWithoutExistingChannelDescriptionForGrantAccessValidatorCreator<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  I extends ISwarmMessageInstanceDecrypted,
  CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext,
  DBO extends TSwrmMessagesChannelsListDBOWithGrantAccess<P, T, I, CTX>
> {
  ({
    payload,
    userId,
    key,
    operation,
  }: {
    payload: T | I;
    userId: TSwarmMessageUserIdentifierSerialized;
    // key of the value
    key?: string;
    // operation which is processed (like delete, add or something else)
    operation?: TSwarmStoreDatabaseEntryOperation<P>;
  }): Omit<Required<ISwarmMessagesChannelsListV1GrantAccessVariableArguments<P, T, I, CTX, DBO>>, 'channelExistingDescription'>;
}

export interface IGetArgumentsForSwarmMessageWithChannelDescriptionValidator<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  I extends ISwarmMessageInstanceDecrypted,
  CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext,
  DBO extends TSwrmMessagesChannelsListDBOWithGrantAccess<P, T, I, CTX>
> {
  (
    constantArguments: ISwarmMessagesChannelsListV1GrantAccessConstantArguments<P, T, I, CTX, DBO>,
    variableArguments: Omit<
      Required<ISwarmMessagesChannelsListV1GrantAccessVariableArguments<P, T, I, CTX, DBO>>,
      'channelExistingDescription'
    >,
    channelExistingDescription: IValidatorOfSwarmMessageWithChannelDescriptionArgument<
      P,
      T,
      I,
      CTX,
      DBO
    >['channelExistingDescription']
  ): IValidatorOfSwarmMessageWithChannelDescriptionArgument<P, T, I, CTX, DBO>;
}

export interface ICreateGrantAccessCallbackByConstantArgumentsAndMessageWithChannelDescriptionValidatorArguments<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  I extends ISwarmMessageInstanceDecrypted,
  CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext,
  DBO extends TSwrmMessagesChannelsListDBOWithGrantAccess<P, T, I, CTX>
> {
  constantArguments: ISwarmMessagesChannelsListV1GrantAccessConstantArguments<P, T, I, CTX, DBO>;
  channelDescriptionSwarmMessageValidator: IValidatorOfSwarmMessageWithChannelDescription<P, T, DBO>;
  getVariableArgumentsWithoutExistingChannelDescriptionForGrantAccessValidator: IGetVariableArgumentsWithoutExistingChannelDescriptionForGrantAccessValidatorCreator<
    P,
    T,
    I,
    CTX,
    DBO
  >;
  getArgumentsForSwarmMessageWithChannelDescriptionValidator: IGetArgumentsForSwarmMessageWithChannelDescriptionValidator<
    P,
    T,
    I,
    CTX,
    DBO
  >;
  getExistingChannelDescriptionByMessageKey: (
    dbbKey: string
  ) => Promise<IValidatorOfSwarmMessageWithChannelDescriptionArgument<P, T, I, CTX, DBO>['channelExistingDescription']>;
}

export interface ICreateGrantAccessCallbackByConstantArgumentsAndMessageWithChannelDescriptionValidator<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  I extends ISwarmMessageInstanceDecrypted,
  CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext,
  DBO extends TSwrmMessagesChannelsListDBOWithGrantAccess<P, T, I, CTX>
> {
  (
    params: ICreateGrantAccessCallbackByConstantArgumentsAndMessageWithChannelDescriptionValidatorArguments<P, T, I, CTX, DBO>
  ): DBO['grantAccess'];
}

export interface IAdditionalUtils<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  I extends ISwarmMessageInstanceDecrypted,
  CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext,
  DBO extends TSwrmMessagesChannelsListDBOWithGrantAccess<P, T, I, CTX>
> {
  createGrantAccessCallbackByConstantArgumentsAndMessageWithChannelDescriptionValidator: ICreateGrantAccessCallbackByConstantArgumentsAndMessageWithChannelDescriptionValidator<
    P,
    T,
    I,
    CTX,
    DBO
  >;
  getVariableArgumentsWithoutExistingChannelDescriptionForGrantAccessValidator: IGetVariableArgumentsWithoutExistingChannelDescriptionForGrantAccessValidatorCreator<
    P,
    T,
    I,
    CTX,
    DBO
  >;
  getArgumentsForSwarmMessageWithChannelDescriptionValidator: IGetArgumentsForSwarmMessageWithChannelDescriptionValidator<
    P,
    T,
    I,
    CTX,
    DBO
  >;
}
