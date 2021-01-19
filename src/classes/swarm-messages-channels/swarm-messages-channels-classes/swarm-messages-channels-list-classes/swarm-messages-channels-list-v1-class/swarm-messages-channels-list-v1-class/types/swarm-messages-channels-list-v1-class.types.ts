import { IValidatorOfSwarmMessageWithChannelDescriptionArgument } from '../../../../../types/swarm-messages-channels-validation.types';
import { ESwarmStoreConnector } from '../../../../../../swarm-store-class/swarm-store-class.const';
import { ISwarmStoreDBOGrandAccessCallbackBaseContext } from '../../../../../../swarm-store-class/swarm-store-connectors/swarm-store-connetors.types';
import { TSwrmMessagesChannelsListDBOWithGrantAccess } from '../../../../../types/swarm-messages-channels-list.types';
import {
  TSwarmMessageSerialized,
  ISwarmMessageInstanceDecrypted,
} from '../../../../../../swarm-message/swarm-message-constructor.types';

export type TSwarmMessagesChannelsListV1GrantAccessVariableArgumentsPropNames =
  | 'messageOrHash'
  | 'senderUserId'
  | 'keyInDb'
  | 'operationInDb'
  | 'channelExistingDescription';

export interface ISwarmMessagesChannelsListV1GrantAccessConstantArguments<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  MD extends ISwarmMessageInstanceDecrypted,
  CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext,
  DBO extends TSwrmMessagesChannelsListDBOWithGrantAccess<P, T, MD, CTX>
> extends Omit<
    IValidatorOfSwarmMessageWithChannelDescriptionArgument<P, T, MD, CTX, DBO>,
    TSwarmMessagesChannelsListV1GrantAccessVariableArgumentsPropNames
  > {}

export interface ISwarmMessagesChannelsListV1GrantAccessVariableArguments<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  MD extends ISwarmMessageInstanceDecrypted,
  CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext,
  DBO extends TSwrmMessagesChannelsListDBOWithGrantAccess<P, T, MD, CTX>
> extends Pick<
    IValidatorOfSwarmMessageWithChannelDescriptionArgument<P, T, MD, CTX, DBO>,
    TSwarmMessagesChannelsListV1GrantAccessVariableArgumentsPropNames
  > {}
