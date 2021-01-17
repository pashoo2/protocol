import { ESwarmStoreConnector, TSwarmStoreDatabaseEntryOperation } from '../../../../../../swarm-store-class';
import {
  ISwarmMessageInstanceDecrypted,
  TSwarmMessageSerialized,
  TSwarmMessageUserIdentifierSerialized,
} from '../../../../../../swarm-message';
import { ISwarmStoreDBOGrandAccessCallbackBaseContext } from '../../../../../../swarm-store-class/swarm-store-connectors/swarm-store-connetors.types';
import {
  TSwrmMessagesChannelsListDBOWithGrantAccess,
  ISwarmMessagesChannelsDescriptionsListConstructorArguments,
} from '../../../../../types/swarm-messages-channels-list.types';
import { AbstactSwarmMessagesChannelsListVersionOneOptionsSetUp } from './swarm-messages-channels-list-v1-class-options-setup.types';
import {
  ISwarmMessageChannelDescriptionRaw,
  ISwarmMessagesChannelDescriptionWithMetadata,
} from '../../../../../types/swarm-messages-channel.types';
import {
  TSwarmStoreDatabaseEntityKey,
  TSwarmStoreDatabaseEntityAddress,
} from '../../../../../../swarm-store-class/swarm-store-class.types';
import { TSwarmMessageConstructorBodyMessage } from '../../../../../../swarm-message/swarm-message-constructor.types';
import {
  ISwarmMessagesChannelsListV1GrantAccessConstantArguments,
  ISwarmMessagesChannelsListV1GrantAccessVariableArguments,
} from './swarm-messages-channels-list-v1-class.types';
import {
  IValidatorOfSwarmMessageWithChannelDescription,
  IValidatorOfSwarmMessageWithChannelDescriptionArgument,
} from '../../../../../types/swarm-messages-channels-validation.types';

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

export interface ICreateGrantAccessCallbackByConstantArgumentsAndMessageWithChannelDescriptionValidatorArguments<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  I extends ISwarmMessageInstanceDecrypted,
  CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext,
  DBO extends TSwrmMessagesChannelsListDBOWithGrantAccess<P, T, I, CTX>
> {
  constantArguments: ISwarmMessagesChannelsListV1GrantAccessConstantArguments<P, T, I, CTX, DBO>;
  channelDescriptionSwarmMessageValidator: IValidatorOfSwarmMessageWithChannelDescription<P, T, I, CTX, DBO>;
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

export abstract class AbstractSwarmMessagesChannelsListVersionOneDatabaseConnectionInitializerAndHandler<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  I extends ISwarmMessageInstanceDecrypted,
  CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext,
  DBO extends TSwrmMessagesChannelsListDBOWithGrantAccess<P, T, I, CTX>,
  CARGS extends ISwarmMessagesChannelsDescriptionsListConstructorArguments<P, T, I, CTX, DBO>
> extends AbstactSwarmMessagesChannelsListVersionOneOptionsSetUp<P, T, I, CTX, DBO, CARGS> {
  protected abstract async _readSwarmMessagesChannelDescriptionOrUndefinedForDbKey(
    dbbKey: TSwarmStoreDatabaseEntityKey<P>
  ): Promise<ISwarmMessageChannelDescriptionRaw<P, T, any, any> | undefined>;

  protected abstract async _removeValueForDbKey(dbbKey: TSwarmStoreDatabaseEntityKey<P>): Promise<void>;

  protected abstract _addSwarmMessageBodyInDatabase(
    dbKey: TSwarmStoreDatabaseEntityKey<P>,
    messageBody: TSwarmMessageConstructorBodyMessage
  ): Promise<TSwarmStoreDatabaseEntityAddress<P>>;

  protected abstract _readAllChannelsDescriptionsWithMeta(): Promise<
    ISwarmMessagesChannelDescriptionWithMetadata<P, T, I, any, any>[]
  >;
}

export interface IConstructorAbstractSwarmMessagesChannelsListVersionOneDatabaseConnectionInitializerAndHandler<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  I extends ISwarmMessageInstanceDecrypted,
  CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext,
  DBO extends TSwrmMessagesChannelsListDBOWithGrantAccess<P, T, I, CTX>,
  CARGS extends ISwarmMessagesChannelsDescriptionsListConstructorArguments<P, T, I, CTX, DBO>
> {
  new (args: CARGS): AbstractSwarmMessagesChannelsListVersionOneDatabaseConnectionInitializerAndHandler<P, T, I, CTX, DBO, CARGS>;
}
