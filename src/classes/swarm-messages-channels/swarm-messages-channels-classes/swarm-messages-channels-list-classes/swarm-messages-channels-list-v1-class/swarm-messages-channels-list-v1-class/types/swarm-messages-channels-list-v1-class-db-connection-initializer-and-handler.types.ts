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
import { ISwarmMessagesChannelsDescriptionsListConstructorArgumentsUtilsDatabaseConnectionFabric } from '../../../../../types/swarm-messages-channels-list.types';
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
  MD extends ISwarmMessageInstanceDecrypted,
  CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext,
  DBO extends TSwrmMessagesChannelsListDBOWithGrantAccess<P, T, MD, CTX>
> {
  ({
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
    operation?: TSwarmStoreDatabaseEntryOperation<P> | undefined;
    time: number;
  }): Omit<Required<ISwarmMessagesChannelsListV1GrantAccessVariableArguments<P, T, MD, CTX, DBO>>, 'channelExistingDescription'>;
}

export interface IGetArgumentsForSwarmMessageWithChannelDescriptionValidator<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  MD extends ISwarmMessageInstanceDecrypted,
  CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext,
  DBO extends TSwrmMessagesChannelsListDBOWithGrantAccess<P, T, MD, CTX>
> {
  (
    constantArguments: ISwarmMessagesChannelsListV1GrantAccessConstantArguments<P, T, MD, CTX, DBO>,
    variableArguments: Omit<
      Required<ISwarmMessagesChannelsListV1GrantAccessVariableArguments<P, T, MD, CTX, DBO>>,
      'channelExistingDescription'
    >,
    channelExistingDescription: IValidatorOfSwarmMessageWithChannelDescriptionArgument<
      P,
      T,
      MD,
      CTX,
      DBO
    >['channelExistingDescription']
  ): IValidatorOfSwarmMessageWithChannelDescriptionArgument<P, T, MD, CTX, DBO>;
}

export interface ICreateGrantAccessCallbackByConstantArgumentsAndMessageWithChannelDescriptionValidator<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  MD extends ISwarmMessageInstanceDecrypted,
  CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext,
  DBO extends TSwrmMessagesChannelsListDBOWithGrantAccess<P, T, MD, CTX>
> {
  (
    params: ICreateGrantAccessCallbackByConstantArgumentsAndMessageWithChannelDescriptionValidatorArguments<P, T, MD, CTX, DBO>
  ): DBO['grantAccess'];
}

export interface IAdditionalUtils<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  MD extends ISwarmMessageInstanceDecrypted,
  CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext,
  DBO extends TSwrmMessagesChannelsListDBOWithGrantAccess<P, T, MD, CTX>
> {
  createGrantAccessCallbackByConstantArgumentsAndMessageWithChannelDescriptionValidator: ICreateGrantAccessCallbackByConstantArgumentsAndMessageWithChannelDescriptionValidator<
    P,
    T,
    MD,
    CTX,
    DBO
  >;
  getVariableArgumentsWithoutExistingChannelDescriptionForGrantAccessValidator: IGetVariableArgumentsWithoutExistingChannelDescriptionForGrantAccessValidatorCreator<
    P,
    T,
    MD,
    CTX,
    DBO
  >;
  getArgumentsForSwarmMessageWithChannelDescriptionValidator: IGetArgumentsForSwarmMessageWithChannelDescriptionValidator<
    P,
    T,
    MD,
    CTX,
    DBO
  >;
}

export interface ICreateGrantAccessCallbackByConstantArgumentsAndMessageWithChannelDescriptionValidatorArguments<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  MD extends ISwarmMessageInstanceDecrypted,
  CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext,
  DBO extends TSwrmMessagesChannelsListDBOWithGrantAccess<P, T, MD, CTX>
> {
  constantArguments: ISwarmMessagesChannelsListV1GrantAccessConstantArguments<P, T, MD, CTX, DBO>;
  channelDescriptionSwarmMessageValidator: IValidatorOfSwarmMessageWithChannelDescription<P, T, MD, CTX, DBO>;
  getVariableArgumentsWithoutExistingChannelDescriptionForGrantAccessValidator: IGetVariableArgumentsWithoutExistingChannelDescriptionForGrantAccessValidatorCreator<
    P,
    T,
    MD,
    CTX,
    DBO
  >;
  getArgumentsForSwarmMessageWithChannelDescriptionValidator: IGetArgumentsForSwarmMessageWithChannelDescriptionValidator<
    P,
    T,
    MD,
    CTX,
    DBO
  >;
  // get previus existsing entry by entrie's key and added time
  getPreviousChannelDescriptionByMessageKeyAndAddedTime: (
    // a database key for the entry
    entryDbKey: string,
    // an abstact or real time when the entry was added in the local db
    timeEntryAdded: number
  ) => Promise<IValidatorOfSwarmMessageWithChannelDescriptionArgument<P, T, MD, CTX, DBO>['channelExistingDescription']>;
}

export abstract class AbstractSwarmMessagesChannelsListVersionOneDatabaseConnectionInitializerAndHandler<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  MD extends ISwarmMessageInstanceDecrypted,
  CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext,
  DBO extends TSwrmMessagesChannelsListDBOWithGrantAccess<P, T, MD, CTX>,
  CF extends ISwarmMessagesChannelsDescriptionsListConstructorArgumentsUtilsDatabaseConnectionFabric<P, T, MD, CTX, DBO>,
  CARGS extends ISwarmMessagesChannelsDescriptionsListConstructorArguments<P, T, MD, CTX, DBO, CF>
> extends AbstactSwarmMessagesChannelsListVersionOneOptionsSetUp<P, T, MD, CTX, DBO, CF, CARGS> {
  protected abstract readonly _isDatabaseOpened: boolean;

  protected abstract async _readSwarmMessagesChannelDescriptionOrUndefinedForDbKey(
    dbbKey: TSwarmStoreDatabaseEntityKey<P>
  ): Promise<ISwarmMessageChannelDescriptionRaw<P, T, any, any> | undefined>;

  protected abstract async _removeValueForDbKey(dbbKey: TSwarmStoreDatabaseEntityKey<P>): Promise<void>;

  protected abstract _addSwarmMessageBodyInDatabase(
    dbKey: TSwarmStoreDatabaseEntityKey<P>,
    messageBody: TSwarmMessageConstructorBodyMessage
  ): Promise<TSwarmStoreDatabaseEntityAddress<P>>;

  protected abstract _readAllChannelsDescriptionsWithMeta(): Promise<
    ISwarmMessagesChannelDescriptionWithMetadata<P, T, MD, any, any>[]
  >;
}

export interface IConstructorAbstractSwarmMessagesChannelsListVersionOneDatabaseConnectionInitializerAndHandler<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  MD extends ISwarmMessageInstanceDecrypted,
  CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext,
  DBO extends TSwrmMessagesChannelsListDBOWithGrantAccess<P, T, MD, CTX>,
  CF extends ISwarmMessagesChannelsDescriptionsListConstructorArgumentsUtilsDatabaseConnectionFabric<P, T, MD, CTX, DBO>,
  CARGS extends ISwarmMessagesChannelsDescriptionsListConstructorArguments<P, T, MD, CTX, DBO, CF>
> {
  new (args: CARGS): AbstractSwarmMessagesChannelsListVersionOneDatabaseConnectionInitializerAndHandler<
    P,
    T,
    MD,
    CTX,
    DBO,
    CF,
    CARGS
  >;
}
