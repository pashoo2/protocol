import { TSwarmMessageUserIdentifierSerialized } from '../../../swarm-message/swarm-message-subclasses/swarm-message-subclass-validators/swarm-message-subclass-validator-fields-validator/swarm-message-subclass-validator-fields-validator-validators/swarm-message-subclass-validator-fields-validator-validator-user-identifier/swarm-message-subclass-validator-fields-validator-validator-user-identifier.types';
import {
  TSwarmStoreValueTypes,
  TSwarmStoreDatabaseEntryOperation,
  TSwarmStoreDatabaseType,
  TSwarmStoreDatabaseOptions,
} from '../../swarm-store-class.types';
import { ESwarmStoreConnector } from '../../swarm-store-class.const';
import {
  TSwarmStoreConnectorAccessConrotllerGrantAccessCallback,
  ISwarmStoreConnectorDatabaseAccessControlleGrantCallback,
} from '../../swarm-store-class.types';
import { TSwarmMessageInstance } from '../../../swarm-message/swarm-message-constructor.types';
import { ISerializer } from 'types/serialization.types';
import { TSwarmStoreDatabaseOptionsSerialized } from '../../swarm-store-class.types';

/**
 * A context in which a grand access function will be executed
 *
 * @export
 * @interface ISwarmStoreConnectoDbOptionsUtilsGrandAccessCallbackContext
 */
export interface ISwarmStoreConnectoDbOptionsUtilsGrandAccessCallbackContext {
  /**
   * Identity of the current user
   *
   * @type {TSwarmMessageUserIdentifierSerialized}
   * @memberof ISwarmStoreConnectoDbOptionsUtilsGrandAccessCallbackContext
   */
  currentUserId: TSwarmMessageUserIdentifierSerialized;
  /**
   * Whether the user with the identity exists
   *
   * @param {TSwarmMessageUserIdentifierSerialized} userId
   * @returns {Promise<boolean>}
   * @memberof ISwarmStoreConnectoDbOptionsUtilsGrandAccessCallbackContext
   */
  isUserExists(userId: TSwarmMessageUserIdentifierSerialized): Promise<boolean>;
}

/**
 * Grand access callback function which has already been bound to a context.
 *
 * @export
 * @interface ISwarmStoreConnectorUtilsDbOptionsGrandAccessCallbackBound
 * @extends {TSwarmStoreConnectorAccessConrotllerGrantAccessCallback<P, ItemType, MSI>}
 * @template P
 * @template ItemType
 * @template MSI
 * @template CTX context in which the function will be executed
 */
export interface ISwarmStoreConnectorUtilsDbOptionsGrandAccessCallbackBound<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmStoreValueTypes<P>,
  MSI extends TSwarmMessageInstance | ItemType,
  CTX extends ISwarmStoreConnectoDbOptionsUtilsGrandAccessCallbackContext
> extends TSwarmStoreConnectorAccessConrotllerGrantAccessCallback<P, ItemType, MSI> {
  (
    this: CTX,
    // value
    payload: ItemType | MSI,
    userId: TSwarmMessageUserIdentifierSerialized,
    // key of the value
    key?: string,
    // operation which is processed (like delete, add or something else)
    operation?: TSwarmStoreDatabaseEntryOperation<P>
  ): Promise<boolean>;
}

/**
 * Funtion for context binding to a grand access callback.
 * Context provided automatically if this binder was created by fabric.
 *
 * @export
 * @interface ISwarmStoreConnectorUtilsDbOptionsGrandAccessCallbackContextBinder
 * @template P
 * @template ItemType
 * @template MSI
 * @template CTX
 */
export interface ISwarmStoreConnectorUtilsDbOptionsGrandAccessCallbackContextBinder<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmStoreValueTypes<P>,
  MSI extends TSwarmMessageInstance | ItemType,
  CTX extends ISwarmStoreConnectoDbOptionsUtilsGrandAccessCallbackContext
> {
  (
    grandAccessCallback: TSwarmStoreConnectorAccessConrotllerGrantAccessCallback<P, ItemType, MSI>,
    ctx?: CTX
  ): ISwarmStoreConnectorUtilsDbOptionsGrandAccessCallbackBound<P, ItemType, MSI, CTX>;
}

/**
 * Fabric creates context binder for grand access callback in options
 *
 * @export
 * @interface ISwarmStoreConnectorUtilsDbOptionsGrandAccessCallbackContextBinderFabric
 * @template P
 * @template ItemType
 * @template MSI
 * @template CTX
 */
export interface ISwarmStoreConnectorUtilsDbOptionsGrandAccessCallbackContextBinderFabric<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmStoreValueTypes<P>,
  MSI extends TSwarmMessageInstance | ItemType,
  CTX extends ISwarmStoreConnectoDbOptionsUtilsGrandAccessCallbackContext
> {
  (ctx: CTX): ISwarmStoreConnectorUtilsDbOptionsGrandAccessCallbackContextBinder<P, ItemType, MSI, CTX>;
}

export interface ISwarmStoreConnectorDatabaseAccessControlleGrantCallbackBound<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmStoreValueTypes<P>,
  MSI extends TSwarmMessageInstance | ItemType,
  CTX extends ISwarmStoreConnectoDbOptionsUtilsGrandAccessCallbackContext
> extends ISwarmStoreConnectorDatabaseAccessControlleGrantCallback<P, ItemType> {
  grantAccess?: ISwarmStoreConnectorUtilsDbOptionsGrandAccessCallbackBound<P, ItemType, MSI, CTX>;
}

export interface ISwarmStoreConnectorUtilsOptionsSerializer<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmStoreValueTypes<P>,
  DbType extends TSwarmStoreDatabaseType<P>,
  MSI extends TSwarmMessageInstance | ItemType,
  CTX extends ISwarmStoreConnectoDbOptionsUtilsGrandAccessCallbackContext
> extends ISerializer {
  /**
   * Parse options serialized and bind the grand access callback function if exists in options
   *
   * @param {TSwarmStoreDatabaseOptionsSerialized} dboSerialized
   * @returns {(TSwarmStoreDatabaseOptions<P, ItemType, DbType> &
   *     ISwarmStoreConnectorDatabaseAccessControlleGrantCallbackBound<P, ItemType, MSI, CTX>)}
   * @memberof ISwarmStoreConnectorUtilsOptionsSerializer
   */
  parse(
    dboSerialized: TSwarmStoreDatabaseOptionsSerialized
  ): TSwarmStoreDatabaseOptions<P, ItemType, DbType> &
    ISwarmStoreConnectorDatabaseAccessControlleGrantCallbackBound<P, ItemType, MSI, CTX>;
  /**
   * Stringify the database options with grand access callback function
   *
   * @template DBO
   * @param {DBO} dbo
   * @returns {TSwarmStoreDatabaseOptionsSerialized}
   * @memberof ISwarmStoreConnectorUtilsOptionsSerializer
   */
  stringify<DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>>(dbo: DBO): TSwarmStoreDatabaseOptionsSerialized;
}

export interface ISwarmStoreConnectorUtilsOptionsSerializerConstructorParams<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmStoreValueTypes<P>,
  MSI extends TSwarmMessageInstance | ItemType,
  CTX extends ISwarmStoreConnectoDbOptionsUtilsGrandAccessCallbackContext
> {
  /**
   * Serializer for options
   *
   * @type {ISerializer}
   * @memberof ISwarmStoreConnectorUtilsOptionsSerializerConstructorParams
   */
  optionsSerializer: ISerializer;
  /**
   * Function than returns a grand access callback bound to a context
   *
   * @type {ISwarmStoreConnectorUtilsDbOptionsGrandAccessCallbackContextBinder<P, ItemType, MSI, CTX>}
   * @memberof ISwarmStoreConnectorUtilsOptionsSerializerConstructorParams
   */
  grandAccessCallbackBinder: ISwarmStoreConnectorUtilsDbOptionsGrandAccessCallbackContextBinder<P, ItemType, MSI, CTX>;
}

export interface ISwarmStoreConnectorUtilsOptionsSerializerConstructor<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmStoreValueTypes<P>,
  DbType extends TSwarmStoreDatabaseType<P>,
  MSI extends TSwarmMessageInstance | ItemType,
  CTX extends ISwarmStoreConnectoDbOptionsUtilsGrandAccessCallbackContext
> {
  new (
    params: ISwarmStoreConnectorUtilsOptionsSerializerConstructorParams<P, ItemType, MSI, CTX>
  ): ISwarmStoreConnectorUtilsOptionsSerializer<P, ItemType, DbType, MSI, CTX>;
}

export interface ISwarmStoreConnectorUtilsOptionsSerializerInstanceFabric<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmStoreValueTypes<P>,
  DbType extends TSwarmStoreDatabaseType<P>,
  MSI extends TSwarmMessageInstance | ItemType,
  CTX extends ISwarmStoreConnectoDbOptionsUtilsGrandAccessCallbackContext
> {
  (
    params: ISwarmStoreConnectorUtilsOptionsSerializerConstructorParams<P, ItemType, MSI, CTX>
  ): ISwarmStoreConnectorUtilsOptionsSerializer<P, ItemType, DbType, MSI, CTX>;
}
