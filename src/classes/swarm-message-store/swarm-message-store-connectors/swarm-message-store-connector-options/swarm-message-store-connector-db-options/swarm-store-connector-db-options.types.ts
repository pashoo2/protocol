import {
  IDatabaseOptionsSerializerValidatorConstructor,
  ISwarmStoreConnectorDatabaseAccessControlleGrantCallback,
  TSwarmStoreConnectorAccessConrotllerGrantAccessCallback,
  TSwarmStoreDatabaseOptions,
  TSwarmStoreDatabaseOptionsSerialized,
  TSwarmStoreDatabaseType,
  TSwarmStoreValueTypes,
} from '../../../../swarm-store-class/swarm-store-class.types';
import { ESwarmStoreConnector } from '../../../../swarm-store-class/swarm-store-class.const';
import { TSwarmMessageInstance } from '../../../../swarm-message/swarm-message-constructor.types';
import {
  IOptionsSerializerValidatorConstructor,
  IOptionsSerializerValidatorConstructorParams,
  IOptionsSerializerValidatorSerializer,
} from '../../../../basic-classes/options-serializer-validator-class/options-serializer-validator-class.types';
import {
  ISwarmStoreConnectoDbOptionsUtilsGrandAccessCallbackContext,
  ISwarmStoreConnectorUtilsDatabaseOptionsSerializerValidator,
  ISwarmStoreConnectorUtilsDatabaseOptionsValidatorsInstanceFabric,
  ISwarmStoreConnectorUtilsDbOptionsGrandAccessCallbackBound,
} from '../../../../swarm-store-class/swarm-store-connectors/swarm-store-connetors.types';

export interface ISwarmStoreConnectoDbOptionsUtilsGrandAccessCallbackContextFabric<
  CTX extends ISwarmStoreConnectoDbOptionsUtilsGrandAccessCallbackContext
> {
  (): CTX;
}

/**
 * Funtion for context binding to a grand access callback.
 * Context provided automatically if this binder was created by fabric.
 *
 * @export
 * @interface ISwarmMessageStoreConnectorUtilsDbOptionsGrandAccessCallbackContextBinder
 * @template P
 * @template ItemType
 * @template MSI
 * @template CTX
 */
export interface ISwarmMessageStoreConnectorUtilsDbOptionsGrandAccessCallbackContextBinder<
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
 * @interface ISwarmMessageStoreConnectorUtilsDbOptionsGrandAccessCallbackContextBinderFabric
 * @template P
 * @template ItemType
 * @template MSI
 * @template CTX
 */
export interface ISwarmMessageStoreConnectorUtilsDbOptionsGrandAccessCallbackContextBinderFabric<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmStoreValueTypes<P>,
  MSI extends TSwarmMessageInstance | ItemType,
  CTX extends ISwarmStoreConnectoDbOptionsUtilsGrandAccessCallbackContext
> {
  (ctx: CTX): ISwarmMessageStoreConnectorUtilsDbOptionsGrandAccessCallbackContextBinder<P, ItemType, MSI, CTX>;
}

export interface ISwarmMessageStoreConnectorDatabaseAccessControlleGrantCallbackBound<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmStoreValueTypes<P>,
  MSI extends TSwarmMessageInstance | ItemType,
  CTX extends ISwarmStoreConnectoDbOptionsUtilsGrandAccessCallbackContext
> extends ISwarmStoreConnectorDatabaseAccessControlleGrantCallback<P, ItemType> {
  grantAccess?: ISwarmStoreConnectorUtilsDbOptionsGrandAccessCallbackBound<P, ItemType, MSI, CTX>;
}

/**
 * Made grand access callback bound for a database's options passed.
 *
 * @export
 * @interface ISwarmMessageStoreConnectorDatabaseOptionsWithAccessControlleGrantCallbackBound
 * @template P
 * @template ItemType
 * @template DbType
 * @template MSI
 * @template CTX
 * @template DBO
 */
export interface ISwarmMessageStoreConnectorDatabaseOptionsWithAccessControlleGrantCallbackBound<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmStoreValueTypes<P>,
  DbType extends TSwarmStoreDatabaseType<P>,
  MSI extends TSwarmMessageInstance | ItemType,
  CTX extends ISwarmStoreConnectoDbOptionsUtilsGrandAccessCallbackContext,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>
> {
  (
    dbo: DBO,
    grandAccessCallbackBinder: ISwarmMessageStoreConnectorUtilsDbOptionsGrandAccessCallbackContextBinder<P, ItemType, MSI, CTX>
  ): DBO extends Required<ISwarmStoreConnectorDatabaseAccessControlleGrantCallback<P, ItemType, MSI>>
    ? DBO & ISwarmMessageStoreConnectorDatabaseAccessControlleGrantCallbackBound<P, ItemType, MSI, CTX>
    : DBO;
}

export interface ISwarmMessageStoreConnectorDatabaseOptionsWithAccessControlleGrantCallbackBoundFabric<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmStoreValueTypes<P>,
  DbType extends TSwarmStoreDatabaseType<P>,
  MSI extends TSwarmMessageInstance | ItemType,
  CTX extends ISwarmStoreConnectoDbOptionsUtilsGrandAccessCallbackContext,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>
> {
  (): ISwarmMessageStoreConnectorDatabaseOptionsWithAccessControlleGrantCallbackBound<P, ItemType, DbType, MSI, CTX, DBO>;
}

export interface ISwarmMessageStoreConnectorUtilsDatabaseOptionsSerializerValidatorConstructorParams<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmStoreValueTypes<P>,
  DbType extends TSwarmStoreDatabaseType<P>,
  MSI extends TSwarmMessageInstance | ItemType,
  CTX extends ISwarmStoreConnectoDbOptionsUtilsGrandAccessCallbackContext,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>,
  DBOS extends TSwarmStoreDatabaseOptionsSerialized
> extends IOptionsSerializerValidatorConstructorParams<DBO, DBOS> {
  grandAccessBinder: ISwarmMessageStoreConnectorUtilsDbOptionsGrandAccessCallbackContextBinder<P, ItemType, MSI, CTX>;
  grandAccessBinderForDBOptions: ISwarmMessageStoreConnectorDatabaseOptionsWithAccessControlleGrantCallbackBound<
    P,
    ItemType,
    DbType,
    MSI,
    CTX,
    DBO
  >;
}

/**
 * Creates database options object from serialized and deserialized objects
 *
 * @export
 * @interface ISwarmMessageStoreConnectorUtilsDatabaseOptionsSerializerValidatorConstructor
 * @extends {IOptionsSerializerValidatorConstructor<DBO, DBOS>}
 * @template P
 * @template ItemType
 * @template DbType
 * @template DBO
 * @template DBOS
 */
export interface ISwarmMessageStoreConnectorUtilsDatabaseOptionsSerializerValidatorConstructor<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmStoreValueTypes<P>,
  DbType extends TSwarmStoreDatabaseType<P>,
  MSI extends TSwarmMessageInstance | ItemType,
  CTX extends ISwarmStoreConnectoDbOptionsUtilsGrandAccessCallbackContext,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>,
  DBOS extends TSwarmStoreDatabaseOptionsSerialized
> extends IOptionsSerializerValidatorConstructor<DBO, DBOS> {
  new (
    params: ISwarmMessageStoreConnectorUtilsDatabaseOptionsSerializerValidatorConstructorParams<
      P,
      ItemType,
      DbType,
      MSI,
      CTX,
      DBO,
      DBOS
    >
  ): ISwarmStoreConnectorUtilsDatabaseOptionsSerializerValidator<P, ItemType, DbType, DBO, DBOS>;
}

/**
 * Creates database options object from serialized and deserialized objects
 *
 * @export
 * @interface ISwarmMessageStoreConnectorUtilsDatabaseOptionsSerializerValidatorConstructor
 * @extends {IOptionsSerializerValidatorConstructor<DBO, DBOS>}
 * @template P
 * @template ItemType
 * @template DbType
 * @template DBO
 * @template DBOS
 */
export interface ISwarmMessageStoreConnectorUtilsDatabaseOptionsSerializerValidatorConstructor<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmStoreValueTypes<P>,
  DbType extends TSwarmStoreDatabaseType<P>,
  MSI extends TSwarmMessageInstance | ItemType,
  CTX extends ISwarmStoreConnectoDbOptionsUtilsGrandAccessCallbackContext,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>,
  DBOS extends TSwarmStoreDatabaseOptionsSerialized
> extends IOptionsSerializerValidatorConstructor<DBO, DBOS> {
  new (
    params: ISwarmMessageStoreConnectorUtilsDatabaseOptionsSerializerValidatorConstructorParams<
      P,
      ItemType,
      DbType,
      MSI,
      CTX,
      DBO,
      DBOS
    >
  ): ISwarmStoreConnectorUtilsDatabaseOptionsSerializerValidator<P, ItemType, DbType, DBO, DBOS>;
}

/**
 * Creates database options object from serialized and deserialized objects
 *
 * @export
 * @interface ISwarmMessageStoreConnectorUtilsDatabaseOptionsSerializerValidatorConstructor
 * @extends {IOptionsSerializerValidatorConstructor<DBO, DBOS>}
 * @template P
 * @template ItemType
 * @template DbType
 * @template DBO
 * @template DBOS
 */
export interface ISwarmMessageStoreConnectorUtilsDatabaseOptionsSerializerValidatorConstructor<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmStoreValueTypes<P>,
  DbType extends TSwarmStoreDatabaseType<P>,
  MSI extends TSwarmMessageInstance | ItemType,
  CTX extends ISwarmStoreConnectoDbOptionsUtilsGrandAccessCallbackContext,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>,
  DBOS extends TSwarmStoreDatabaseOptionsSerialized
> extends IOptionsSerializerValidatorConstructor<DBO, DBOS> {
  new (
    params: ISwarmMessageStoreConnectorUtilsDatabaseOptionsSerializerValidatorConstructorParams<
      P,
      ItemType,
      DbType,
      MSI,
      CTX,
      DBO,
      DBOS
    >
  ): ISwarmStoreConnectorUtilsDatabaseOptionsSerializerValidator<P, ItemType, DbType, DBO, DBOS>;
}

export interface ISwarmMessageStoreConnectorUtilsDatabaseOptionsSerializerValidatorConstructorFabricParams<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmStoreValueTypes<P>,
  DbType extends TSwarmStoreDatabaseType<P>,
  MSI extends TSwarmMessageInstance | ItemType,
  CTX extends ISwarmStoreConnectoDbOptionsUtilsGrandAccessCallbackContext,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>,
  DBOS extends TSwarmStoreDatabaseOptionsSerialized
> {
  /**
   * context for grand access callback function
   *
   * @type {CTX}
   * @memberof ISwarmMessageStoreConnectorUtilsDatabaseOptionsSerializerValidatorConstructorFabricParams
   */
  grandAccessCallbackContextFabric: ISwarmStoreConnectoDbOptionsUtilsGrandAccessCallbackContextFabric<CTX>;
  /**
   * A serializer for common object-string serialization (for simple logic JSON can be used)
   *
   * @type {ISerializer}
   * @memberof ISwarmMessageStoreConnectorUtilsDatabaseOptionsSerializerValidatorConstructorFabricParams
   */
  optionsSerializer?: IOptionsSerializerValidatorSerializer<DBO, DBOS>;
  /**
   * Database options validators
   *
   * @type {ISwarmStoreConnectorUtilsDatabaseOptionsValidators<P, ItemType, DbType, DBO, DBOS>}
   * @memberof ISwarmMessageStoreConnectorUtilsDatabaseOptionsSerializerValidatorConstructorFabricParams
   */
  validatorsFabric?: ISwarmStoreConnectorUtilsDatabaseOptionsValidatorsInstanceFabric<P, ItemType, DbType, DBO, DBOS>;
  grandAccessBinderFabric?: ISwarmMessageStoreConnectorUtilsDbOptionsGrandAccessCallbackContextBinderFabric<
    P,
    ItemType,
    MSI,
    CTX
  >;
  grandAccessBinderForDBOptionsFabric?: ISwarmMessageStoreConnectorDatabaseOptionsWithAccessControlleGrantCallbackBoundFabric<
    P,
    ItemType,
    DbType,
    MSI,
    CTX,
    DBO
  >;
}

export interface ISwarmMessageStoreConnectorUtilsDatabaseOptionsSerializerValidatorConstructorFabric<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmStoreValueTypes<P>,
  DbType extends TSwarmStoreDatabaseType<P>,
  MSI extends TSwarmMessageInstance | ItemType,
  CTX extends ISwarmStoreConnectoDbOptionsUtilsGrandAccessCallbackContext,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>,
  DBOS extends TSwarmStoreDatabaseOptionsSerialized
> {
  (
    params: ISwarmMessageStoreConnectorUtilsDatabaseOptionsSerializerValidatorConstructorFabricParams<
      P,
      ItemType,
      DbType,
      MSI,
      CTX,
      DBO,
      DBOS
    >
  ): IDatabaseOptionsSerializerValidatorConstructor<P, ItemType, DbType, DBO, DBOS>;
}

export interface ISwarmMessageStoreConnectorUtilsDatabaseOptionsSerializerValidatorWithMetaConstructor<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmStoreValueTypes<P>,
  DbType extends TSwarmStoreDatabaseType<P>,
  MSI extends TSwarmMessageInstance | ItemType,
  CTX extends ISwarmStoreConnectoDbOptionsUtilsGrandAccessCallbackContext,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>,
  DBOS extends TSwarmStoreDatabaseOptionsSerialized,
  META extends Record<string, unknown> | never = never
> extends ISwarmMessageStoreConnectorUtilsDatabaseOptionsSerializerValidatorConstructor<
    P,
    ItemType,
    DbType,
    MSI,
    CTX,
    DBO,
    DBOS
  > {
  new (options: { options: DBO; meta: META }): ISwarmStoreConnectorUtilsDatabaseOptionsSerializerValidator<
    P,
    ItemType,
    DbType,
    DBO,
    DBOS
  >;
}
