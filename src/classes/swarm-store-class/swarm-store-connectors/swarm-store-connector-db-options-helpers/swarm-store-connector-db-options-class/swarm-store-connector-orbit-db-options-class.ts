import { OptionsSerializerValidator } from '../../../../basic-classes/options-serializer-validator-class/options-serializer-validator-class';
import {
  TSwarmStoreDatabaseOptionsSerialized,
  TSwarmStoreValueTypes,
  TSwarmStoreDatabaseType,
  TSwarmStoreDatabaseOptions,
} from '../../../swarm-store-class.types';
import { ESwarmStoreConnector } from '../../../swarm-store-class.const';
import { ISwarmStoreConnectoDbOptionsUtilsGrandAccessCallbackContext } from '../swarm-store-connector-db-options-helpers.types';
import { TSwarmMessageInstance } from '../../../../swarm-message/swarm-message-constructor.types';
import assert from 'assert';
import { ISwarmStoreConnectorUtilsDatabaseOptionsSerializerValidator } from '../swarm-store-connector-db-options-helpers.types';
import {
  ISwarmStoreConnectorUtilsDatabaseOptionsSerializerValidatorConstructorParams,
  ISwarmStoreConnectorUtilsDbOptionsGrandAccessCallbackContextBinder,
  ISwarmStoreConnectorDatabaseOptionsWithAccessControlleGrantCallbackBound,
} from '../swarm-store-connector-db-options-helpers.types';

export class SwarmStoreConnectorDBOptionsClass<
    P extends ESwarmStoreConnector,
    ItemType extends TSwarmStoreValueTypes<P>,
    DbType extends TSwarmStoreDatabaseType<P>,
    MSI extends TSwarmMessageInstance | ItemType,
    CTX extends ISwarmStoreConnectoDbOptionsUtilsGrandAccessCallbackContext,
    DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>,
    DBOS extends TSwarmStoreDatabaseOptionsSerialized
  >
  extends OptionsSerializerValidator<DBO, DBOS>
  implements ISwarmStoreConnectorUtilsDatabaseOptionsSerializerValidator<P, ItemType, DbType, DBO, DBOS> {
  protected _grandAccessContextBinder:
    | ISwarmStoreConnectorUtilsDbOptionsGrandAccessCallbackContextBinder<P, ItemType, MSI, CTX>
    | undefined;

  protected _grandAccessCallbackToDbOptionsBinder:
    | ISwarmStoreConnectorDatabaseOptionsWithAccessControlleGrantCallbackBound<P, ItemType, DbType, MSI, CTX, DBO>
    | undefined;

  constructor(
    params: ISwarmStoreConnectorUtilsDatabaseOptionsSerializerValidatorConstructorParams<P, ItemType, DbType, MSI, CTX, DBO, DBOS>
  ) {
    super(params);
    this._validateParams(params);
    this._setGrandAccessCallbackContextBinder(params.grandAccessBinder);
    this._setGrandAccessCallbackContextForDbOptionsBinder(params.grandAccessBinderForDBOptions);
    this._bindGrandAccessContextToOptions();
  }

  protected _validateParams(params: {
    grandAccessBinder: ISwarmStoreConnectorUtilsDatabaseOptionsSerializerValidatorConstructorParams<
      P,
      ItemType,
      DbType,
      MSI,
      CTX,
      DBO,
      DBOS
    >['grandAccessBinder'];
    grandAccessBinderForDBOptions: ISwarmStoreConnectorUtilsDatabaseOptionsSerializerValidatorConstructorParams<
      P,
      ItemType,
      DbType,
      MSI,
      CTX,
      DBO,
      DBOS
    >['grandAccessBinderForDBOptions'];
  }) {
    assert(params, 'Parameters must be defined');
    assert(typeof params.grandAccessBinder, 'Grand access callback context binder must be a function');
    assert(params.grandAccessBinder.length > 0, 'Grand access callback context binder function must accept arguments');
    assert(
      typeof params.grandAccessBinderForDBOptions === 'function',
      'Grand access callback context binder for a database options must be passed in params'
    );
    assert(
      params.grandAccessBinderForDBOptions.length > 0,
      'Grand access callback context binder for a database options function must accept arguments'
    );
  }

  protected _setGrandAccessCallbackContextBinder(
    grandAccessCallbackContextBinder: ISwarmStoreConnectorUtilsDbOptionsGrandAccessCallbackContextBinder<P, ItemType, MSI, CTX>
  ): void {
    this._grandAccessContextBinder = grandAccessCallbackContextBinder;
  }

  protected _setGrandAccessCallbackContextForDbOptionsBinder(
    grandAccessCallbackContextForDbOptionsBinder: ISwarmStoreConnectorDatabaseOptionsWithAccessControlleGrantCallbackBound<
      P,
      ItemType,
      DbType,
      MSI,
      CTX,
      DBO
    >
  ): void {
    this._grandAccessCallbackToDbOptionsBinder = grandAccessCallbackContextForDbOptionsBinder;
  }

  protected _getGrandAccessContextBinder(): ISwarmStoreConnectorUtilsDbOptionsGrandAccessCallbackContextBinder<
    P,
    ItemType,
    MSI,
    CTX
  > {
    const binder = this._grandAccessContextBinder;

    if (!binder) {
      throw new Error('Grand acess binder is not defined');
    }
    return binder;
  }

  protected _getGrandAccessCallbackToDbOptionsBinder(): ISwarmStoreConnectorDatabaseOptionsWithAccessControlleGrantCallbackBound<
    P,
    ItemType,
    DbType,
    MSI,
    CTX,
    DBO
  > {
    const grandAccessCallbackOptionsBinder = this._grandAccessCallbackToDbOptionsBinder;
    if (!grandAccessCallbackOptionsBinder) {
      throw new Error('Grand access callback to options binder not defined');
    }
    return grandAccessCallbackOptionsBinder;
  }

  protected _bindGrandAccessContextToOptions() {
    const databaseOptionsUnbound = this._getOptionsHandled();
    const databaseOptionsWithGrandAccessBound = this._getGrandAccessCallbackToDbOptionsBinder()(
      databaseOptionsUnbound,
      this._getGrandAccessContextBinder()
    );
    this._validateAndSetOptionsUnserialized(databaseOptionsWithGrandAccessBound);
  }
}
