import {
  IDatabaseOptionsClass,
  ISwarmStoreConnectorDatabaseAccessControlleGrantCallback,
  TSwarmStoreConnectorAccessConrotllerGrantAccessCallback,
  TSwarmStoreDatabaseOptions,
  TSwarmStoreDatabaseOptionsSerialized,
  TSwarmStoreDatabaseType,
  TSwarmStoreValueTypes,
} from '../../../swarm-store-class/swarm-store-class.types';
import { ESwarmStoreConnector } from '../../../swarm-store-class/swarm-store-class.const';
import { ISwarmMessageConstructor, ISwarmMessageInstanceDecrypted } from '../../../swarm-message/swarm-message-constructor.types';
import {
  IOptionsSerializerValidatorConstructor,
  IOptionsSerializerValidatorConstructorParams,
  IOptionsSerializerValidatorSerializer,
} from '../../../basic-classes/options-serializer-validator-class/options-serializer-validator-class.types';
import {
  ISwarmStoreDBOGrandAccessCallbackBaseContext,
  ISwarmStoreDBOSerializerValidator,
  ISwarmStoreConnectorUtilsDatabaseOptionsValidatorsInstanceFabric,
  ISwarmStoreConnectorUtilsDbOptionsGrandAccessCallbackBound,
} from '../../../swarm-store-class/swarm-store-connectors/swarm-store-connetors.types';

export interface ISwarmStoreConnectoDbOptionsUtilsGrandAccessCallbackContextFabric<
  P extends ESwarmStoreConnector,
  DbType extends TSwarmStoreDatabaseType<P>,
  ItemType extends TSwarmStoreValueTypes<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>,
  SMC extends ISwarmMessageConstructor,
  CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext
> {
  (dbOptions: DBO, swarmMessageConstructor: SMC): CTX;
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
  MD extends ISwarmMessageInstanceDecrypted,
  CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext
> {
  (
    grandAccessCallback: TSwarmStoreConnectorAccessConrotllerGrantAccessCallback<P, ItemType, MD>,
    ctx?: CTX
  ): ISwarmStoreConnectorUtilsDbOptionsGrandAccessCallbackBound<P, ItemType, MD, CTX>;
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
  MD extends ISwarmMessageInstanceDecrypted,
  CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext
> {
  (ctx: CTX): ISwarmMessageStoreConnectorUtilsDbOptionsGrandAccessCallbackContextBinder<P, ItemType, MD, CTX>;
}

export interface ISwarmMessageStoreConnectorDatabaseAccessControlleGrantCallbackBound<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmStoreValueTypes<P>,
  MD extends ISwarmMessageInstanceDecrypted,
  CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext
> extends ISwarmStoreConnectorDatabaseAccessControlleGrantCallback<P, ItemType, MD> {
  grantAccess?: ISwarmStoreConnectorUtilsDbOptionsGrandAccessCallbackBound<P, ItemType, MD, CTX>;
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
  MD extends ISwarmMessageInstanceDecrypted,
  CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>
> {
  (
    dbo: DBO,
    grandAccessCallbackBinder: ISwarmMessageStoreConnectorUtilsDbOptionsGrandAccessCallbackContextBinder<P, ItemType, MD, CTX>
  ): DBO extends Required<ISwarmStoreConnectorDatabaseAccessControlleGrantCallback<P, ItemType, MD>>
    ? DBO & ISwarmMessageStoreConnectorDatabaseAccessControlleGrantCallbackBound<P, ItemType, MD, CTX>
    : DBO;
}

export interface ISwarmMessageStoreConnectorDatabaseOptionsWithAccessControlleGrantCallbackBoundFabric<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmStoreValueTypes<P>,
  DbType extends TSwarmStoreDatabaseType<P>,
  MD extends ISwarmMessageInstanceDecrypted,
  CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>
> {
  (): ISwarmMessageStoreConnectorDatabaseOptionsWithAccessControlleGrantCallbackBound<P, ItemType, DbType, MD, CTX, DBO>;
}

export interface ISwarmMessageStoreDBOSerializerValidatorConstructorParams<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmStoreValueTypes<P>,
  DbType extends TSwarmStoreDatabaseType<P>,
  MD extends ISwarmMessageInstanceDecrypted,
  CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>,
  DBOS extends TSwarmStoreDatabaseOptionsSerialized
> extends IOptionsSerializerValidatorConstructorParams<DBO, DBOS> {
  grandAccessBinder: ISwarmMessageStoreConnectorUtilsDbOptionsGrandAccessCallbackContextBinder<P, ItemType, MD, CTX>;
  grandAccessBinderForDBOptions: ISwarmMessageStoreConnectorDatabaseOptionsWithAccessControlleGrantCallbackBound<
    P,
    ItemType,
    DbType,
    MD,
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
  MD extends ISwarmMessageInstanceDecrypted,
  CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>,
  DBOS extends TSwarmStoreDatabaseOptionsSerialized
> extends IOptionsSerializerValidatorConstructor<DBO, DBOS> {
  new (
    params: ISwarmMessageStoreDBOSerializerValidatorConstructorParams<P, ItemType, DbType, MD, CTX, DBO, DBOS>
  ): ISwarmStoreDBOSerializerValidator<P, ItemType, DbType, DBO, DBOS>;
}

export interface ISwarmMessageStoreConnectorUtilsDatabaseOptionsSerializerValidatorConstructorByDBO<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmStoreValueTypes<P>,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>,
  DBOS extends TSwarmStoreDatabaseOptionsSerialized
> extends IOptionsSerializerValidatorConstructor<DBO, DBOS> {
  new (params: { options: DBO }): ISwarmStoreDBOSerializerValidator<P, ItemType, DbType, DBO, DBOS>;
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
  MD extends ISwarmMessageInstanceDecrypted,
  CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>,
  DBOS extends TSwarmStoreDatabaseOptionsSerialized
> extends IOptionsSerializerValidatorConstructor<DBO, DBOS> {
  new (
    params: ISwarmMessageStoreDBOSerializerValidatorConstructorParams<P, ItemType, DbType, MD, CTX, DBO, DBOS>
  ): ISwarmStoreDBOSerializerValidator<P, ItemType, DbType, DBO, DBOS>;
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
  MD extends ISwarmMessageInstanceDecrypted,
  CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>,
  DBOS extends TSwarmStoreDatabaseOptionsSerialized
> extends IOptionsSerializerValidatorConstructor<DBO, DBOS> {
  new (
    params: ISwarmMessageStoreDBOSerializerValidatorConstructorParams<P, ItemType, DbType, MD, CTX, DBO, DBOS>
  ): ISwarmStoreDBOSerializerValidator<P, ItemType, DbType, DBO, DBOS>;
}

export interface ISwarmMessageStoreConnectorUtilsDatabaseOptionsSerializerValidatorConstructorFabricParams<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmStoreValueTypes<P>,
  DbType extends TSwarmStoreDatabaseType<P>,
  MD extends ISwarmMessageInstanceDecrypted,
  CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>,
  DBOS extends TSwarmStoreDatabaseOptionsSerialized,
  SMC extends ISwarmMessageConstructor
> {
  /**
   * context for grand access callback function
   *
   * @type {CTX}
   * @memberof ISwarmMessageStoreConnectorUtilsDatabaseOptionsSerializerValidatorConstructorFabricParams
   */
  grandAccessCallbackContextFabric: ISwarmStoreConnectoDbOptionsUtilsGrandAccessCallbackContextFabric<
    P,
    DbType,
    ItemType,
    DBO,
    SMC,
    CTX
  >;
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
  validatorsFabric: ISwarmStoreConnectorUtilsDatabaseOptionsValidatorsInstanceFabric<P, ItemType, DbType, DBO, DBOS>;
  grandAccessBinderFabric?: ISwarmMessageStoreConnectorUtilsDbOptionsGrandAccessCallbackContextBinderFabric<P, ItemType, MD, CTX>;
  grandAccessBinderForDBOptionsFabric?: ISwarmMessageStoreConnectorDatabaseOptionsWithAccessControlleGrantCallbackBoundFabric<
    P,
    ItemType,
    DbType,
    MD,
    CTX,
    DBO
  >;
}

export interface ISwarmMessageStoreConnectorUtilsDatabaseOptionsSerializerValidatorConstructorFabric<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmStoreValueTypes<P>,
  DbType extends TSwarmStoreDatabaseType<P>,
  MD extends ISwarmMessageInstanceDecrypted,
  CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>,
  DBOS extends TSwarmStoreDatabaseOptionsSerialized,
  SMC extends ISwarmMessageConstructor
> {
  (
    params: ISwarmMessageStoreConnectorUtilsDatabaseOptionsSerializerValidatorConstructorFabricParams<
      P,
      ItemType,
      DbType,
      MD,
      CTX,
      DBO,
      DBOS,
      SMC
    >
  ): IDatabaseOptionsClass<P, ItemType, DbType, DBO, DBOS>;
}

export interface ISwarmMessageStoreConnectorUtilsDatabaseOptionsSerializerValidatorWithMetaConstructorArguments<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmStoreValueTypes<P>,
  DbType extends TSwarmStoreDatabaseType<P>,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>,
  META extends Record<string, unknown> | never = never
> {
  options: DBO;
  meta: META;
}

export interface ISwarmMessageStoreDatabaseOptionsWithMetaClass<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmStoreValueTypes<P>,
  DbType extends TSwarmStoreDatabaseType<P>,
  MD extends ISwarmMessageInstanceDecrypted,
  CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext,
  DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>,
  DBOS extends TSwarmStoreDatabaseOptionsSerialized,
  META extends Record<string, unknown> | never = never
> extends ISwarmMessageStoreConnectorUtilsDatabaseOptionsSerializerValidatorConstructor<P, ItemType, DbType, MD, CTX, DBO, DBOS> {
  new (
    options: ISwarmMessageStoreConnectorUtilsDatabaseOptionsSerializerValidatorWithMetaConstructorArguments<
      P,
      ItemType,
      DbType,
      DBO,
      META
    >
  ): ISwarmStoreDBOSerializerValidator<P, ItemType, DbType, DBO, DBOS>;
}
