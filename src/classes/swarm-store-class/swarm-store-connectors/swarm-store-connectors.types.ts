import { JSONSchema7 } from 'json-schema';
import { TSwarmMessageUserIdentifierSerialized } from '../../central-authority-class/central-authority-class-user-identity/central-authority-class-user-identity-validators/central-authority-common-validator-user-identifier';
import { ESwarmStoreConnector } from '../swarm-store-class.const';
import {
  TSwarmStoreConnectorAccessConrotllerGrantAccessCallback,
  TSwarmStoreDatabaseEntryOperation,
  TSwarmStoreDatabaseOptions,
  TSwarmStoreDatabaseOptionsSerialized,
  TSwarmStoreDatabaseType,
  TSwarmStoreValueTypes,
} from '../swarm-store-class.types';
import {
  IOptionsSerializerValidator,
  IOptionsSerializerValidatorValidators,
} from '../../basic-classes/options-serializer-validator-class';

/**
 * Base context methods
 *
 * @export
 * @interface ISwarmStoreDBOGrandAccessCallbackBaseContextMethods
 */
export interface ISwarmStoreDBOGrandAccessCallbackBaseContextMethods {
  /**
   * Whether the user with the identity exists
   *
   * @param {TSwarmMessageUserIdentifierSerialized} userId
   * @returns {Promise<true>} - only true, if invalid will throw an error
   * @memberof ISwarmStoreConnectoDbOptionsUtilsGrandAccessCallbackContext
   * @throws {Error} - throws an error if the user is not valid
   */
  isUserValid(userId: TSwarmMessageUserIdentifierSerialized): Promise<true>;
  /**
   * Validator for json schema object
   *
   * @param {JSONSchema7} jsonSchema
   * @param {*} valueToValidate
   * @returns {true} - only true, if invalid will throw an error
   * @memberof ISwarmStoreDBOGrandAccessCallbackBaseContext
   * @throws {Error} - throws an error if invalid data
   */
  jsonSchemaValidator(jsonSchema: JSONSchema7, valueToValidate: any): Promise<void>;
}

/**
 * A context in which a grand access function will be executed
 *
 * @export
 * @interface ISwarmStoreConnectoDbOptionsUtilsGrandAccessCallbackContext
 */
export interface ISwarmStoreDBOGrandAccessCallbackBaseContext extends ISwarmStoreDBOGrandAccessCallbackBaseContextMethods {
  /**
   * Identity of the current user
   *
   * @type {TSwarmMessageUserIdentifierSerialized}
   * @memberof ISwarmStoreConnectoDbOptionsUtilsGrandAccessCallbackContext
   */
  readonly currentUserId: TSwarmMessageUserIdentifierSerialized;
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

/**
 * Grand access callback function which has already been bound to a context.
 *
 * @export
 * @interface ISwarmMessagesStoreConnectorUtilsDbOptionsGrandAccessCallbackBound
 * @extends {TSwarmStoreConnectorAccessConrotllerGrantAccessCallback<P, T, MSI>}
 * @template P
 * @template T
 * @template CTX context in which the function will be executed
 */
export interface ISwarmStoreConnectorUtilsDbOptionsGrandAccessCallbackBound<
  P extends ESwarmStoreConnector,
  T extends TSwarmStoreValueTypes<P>,
  CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext
> extends TSwarmStoreConnectorAccessConrotllerGrantAccessCallback<P, T, T> {
  (
    this: CTX,
    // value
    payload: T,
    userId: TSwarmMessageUserIdentifierSerialized,
    // key of the value
    key: string | undefined,
    // operation which is processed (like delete, add or something else)
    operation: TSwarmStoreDatabaseEntryOperation<P> | undefined,
    // a real or an abstract clock time when the entry was added
    time: number
  ): Promise<boolean>;
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

export interface ISwarmStoreDBOSerializerValidator<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmStoreValueTypes<P>,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>,
  DBOS extends TSwarmStoreDatabaseOptionsSerialized
> extends IOptionsSerializerValidator<DBO, DBOS> {}
