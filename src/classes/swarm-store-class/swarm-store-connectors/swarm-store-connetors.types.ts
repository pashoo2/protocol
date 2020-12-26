import { TSwarmMessageUserIdentifierSerialized } from '../../swarm-message/swarm-message-subclasses/swarm-message-subclass-validators/swarm-message-subclass-validator-fields-validator/swarm-message-subclass-validator-fields-validator-validators/swarm-message-subclass-validator-fields-validator-validator-user-identifier';
import { ESwarmStoreConnector } from '../swarm-store-class.const';
import {
  TSwarmStoreConnectorAccessConrotllerGrantAccessCallback,
  TSwarmStoreDatabaseEntryOperation,
  TSwarmStoreDatabaseOptions,
  TSwarmStoreDatabaseOptionsSerialized,
  TSwarmStoreDatabaseType,
  TSwarmStoreValueTypes,
} from '../swarm-store-class.types';
import { TSwarmMessageInstance } from '../../swarm-message';
import {
  IOptionsSerializerValidator,
  IOptionsSerializerValidatorValidators,
} from '../../basic-classes/options-serializer-validator-class';

/**
 * A context in which a grand access function will be executed
 *
 * @export
 * @interface ISwarmStoreConnectoDbOptionsUtilsGrandAccessCallbackContext
 */
export interface ISwarmStoreDBOGrandAccessCallbackBaseContext {
  /**
   * Identity of the current user
   *
   * @type {TSwarmMessageUserIdentifierSerialized}
   * @memberof ISwarmStoreConnectoDbOptionsUtilsGrandAccessCallbackContext
   */
  readonly currentUserId: TSwarmMessageUserIdentifierSerialized;

  /**
   * Whether the user with the identity exists
   *
   * @param {TSwarmMessageUserIdentifierSerialized} userId
   * @returns {Promise<boolean>}
   * @memberof ISwarmStoreConnectoDbOptionsUtilsGrandAccessCallbackContext
   */
  isUserValid(userId: TSwarmMessageUserIdentifierSerialized): Promise<boolean>;
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
  CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext
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

export interface ISwarmStoreConnectorUtilsDatabaseOptionsValidators<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmStoreValueTypes<P>,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>,
  DBOS extends TSwarmStoreDatabaseOptionsSerialized
> extends IOptionsSerializerValidatorValidators<DBO, DBOS> {
  isValidSerializedOptions(optsSerialized: unknown): optsSerialized is DBOS;

  isValidOptions(opts: unknown): opts is DBO;
}

export interface ISwarmStoreConnectorUtilsDatabaseOptionsValidatorsInstanceConstructor<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmStoreValueTypes<P>,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>,
  DBOS extends TSwarmStoreDatabaseOptionsSerialized
> {
  new (): ISwarmStoreConnectorUtilsDatabaseOptionsValidators<P, ItemType, DbType, DBO, DBOS>;
}

export interface ISwarmStoreConnectorUtilsDatabaseOptionsValidatorsInstanceFabric<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmStoreValueTypes<P>,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>,
  DBOS extends TSwarmStoreDatabaseOptionsSerialized
> {
  (): ISwarmStoreConnectorUtilsDatabaseOptionsValidators<P, ItemType, DbType, DBO, DBOS>;
}

export interface ISwarmStoreConnectorUtilsDatabaseOptionsValidatorsConstructor<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmStoreValueTypes<P>,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>,
  DBOS extends TSwarmStoreDatabaseOptionsSerialized
> {
  new (): ISwarmStoreConnectorUtilsDatabaseOptionsValidators<P, ItemType, DbType, DBO, DBOS>;
}

export interface ISwarmStoreConnectorUtilsDatabaseOptionsSerializerValidator<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmStoreValueTypes<P>,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>,
  DBOS extends TSwarmStoreDatabaseOptionsSerialized
> extends IOptionsSerializerValidator<DBO, DBOS> {}
