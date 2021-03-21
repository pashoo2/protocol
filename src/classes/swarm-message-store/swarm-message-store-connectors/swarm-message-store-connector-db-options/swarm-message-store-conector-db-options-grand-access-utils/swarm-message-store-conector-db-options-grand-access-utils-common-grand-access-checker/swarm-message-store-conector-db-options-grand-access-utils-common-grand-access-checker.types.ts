import { TCentralAuthorityUserIdentity } from '../../../../../central-authority-class/central-authority-class-types/central-authority-class-types-common';
import {
  ISwarmMessageConstructor,
  TSwarmMessageSerialized,
  TSwarmMessageInstance,
} from '../../../../../swarm-message/swarm-message-constructor.types';
import { ESwarmStoreConnector } from '../../../../../swarm-store-class/swarm-store-class.const';
import { ISwarmMessageStoreAccessControlGrantAccessCallback } from '../../../../types/swarm-message-store.types';
import { TSwarmMessageUserIdentifierSerialized } from '../../../../../central-authority-class/central-authority-class-user-identity/central-authority-class-user-identity-validators/central-authority-common-validator-user-identifier/central-authority-common-validator-user-identifier.types';

export interface ISwarmMessageGrantValidatorContext<
  P extends ESwarmStoreConnector,
  T extends TSwarmMessageSerialized,
  I extends TSwarmMessageInstance,
  CB extends
    | ISwarmMessageStoreAccessControlGrantAccessCallback<P, T>
    | ISwarmMessageStoreAccessControlGrantAccessCallback<P, I>
    | undefined
> {
  /**
   * Name of the database where is the message stored
   *
   * @type {string}
   * @memberof ISwarmMessageStoreDbOptionsGrandAccessCallbackContext
   */
  dbName: string;
  /**
   * Swarm message constructor used within the database
   *
   * @type {SMC}
   * @memberof ISwarmMessageStoreDbOptionsGrandAccessCallbackContext
   */
  messageConstructor: ISwarmMessageConstructor;
  /**
   * Is it a public database and everyone can make any operations in it
   *
   * @type {boolean}
   * @memberof ISwarmMessageStoreDbOptionsGrandAccessCallbackContext
   */
  isPublic: boolean | undefined;
  /**
   * Is the user who sent the message has the exclusive permission
   * to make any operations within the database.
   *
   * @type {boolean}
   * @memberof ISwarmMessageGrantValidatorContext
   */
  isUserCanWrite: boolean;
  /**
   * The currently authorized user's identifier
   *
   * @type {TCentralAuthorityUserIdentity}
   * @memberof ISwarmMessageGrantValidatorContext
   */
  currentUserId: TCentralAuthorityUserIdentity;
  /**
   * Custom function which is used to define whether
   * the current operation is permitted
   *
   * @type {CB}
   * @memberof ISwarmMessageGrantValidatorContext
   */
  grantAccessCb?: CB;
}

export interface IGetMessageValidatorUnboundFabricReturnedSwarmMessageGrantValidatorFunctionContext<
  SMC extends ISwarmMessageConstructor
> {
  /**
   * Name of the database where is the message stored
   *
   * @type {string}
   * @memberof ISwarmMessageStoreDbOptionsGrandAccessCallbackContext
   */
  readonly dbName: string;
  /**
   * Is it a public database and everyone can make any operations in it
   *
   * @type {boolean}
   * @memberof ISwarmMessageStoreDbOptionsGrandAccessCallbackContext
   */
  readonly isPublicDb: boolean;
  /**
   * Identifiers of users who have access to the database
   *
   * @type {TSwarmMessageUserIdentifierSerialized[]}
   * @memberof ISwarmMessageStoreDbOptionsGrandAccessCallbackContext
   */
  readonly usersIdsWithWriteAccess: TSwarmMessageUserIdentifierSerialized[];
  /**
   * Swarm message constructor used within the database
   *
   * @type {SMC}
   * @memberof ISwarmMessageStoreDbOptionsGrandAccessCallbackContext
   */
  readonly swarmMessageConstructor: SMC;

  /**
   * The currently authorized user's identifier
   *
   * @type {TSwarmMessageUserIdentifierSerialized}
   * @memberof IGetMessageValidatorUnboundFabricReturnedSwarmMessageGrantValidatorFunctionContext
   */
  readonly currentUserId: TSwarmMessageUserIdentifierSerialized;
}
