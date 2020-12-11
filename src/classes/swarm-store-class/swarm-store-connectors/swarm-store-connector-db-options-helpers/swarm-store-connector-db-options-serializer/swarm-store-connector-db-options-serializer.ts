import {
  ISwarmStoreConnectoDbOptionsUtilsGrandAccessCallbackContext,
  ISwarmStoreConnectorUtilsOptionsSerializer,
} from '../swarm-store-connector-db-options-helpers.types';
import { TSwarmStoreValueTypes, TSwarmStoreDatabaseType, TSwarmStoreDatabaseOptions } from '../../../swarm-store-class.types';
import { ESwarmStoreConnector } from '../../../swarm-store-class.const';
import { TSwarmMessageInstance } from '../../../../swarm-message/swarm-message-constructor.types';
import {
  ISwarmStoreConnectorUtilsOptionsSerializerConstructorParams,
  ISwarmStoreConnectorDatabaseOptionsWithAccessControlleGrantCallbackBound,
} from '../swarm-store-connector-db-options-helpers.types';
import assert from 'assert';
import {
  ISwarmStoreConnectorUtilsDbOptionsGrandAccessCallbackContextBinder,
  ISwarmStoreConnectorDatabaseAccessControlleGrantCallbackBound,
} from '../swarm-store-connector-db-options-helpers.types';
import { TSwarmStoreDatabaseOptionsSerialized } from '../../../swarm-store-class.types';
import { ISerializer } from '../../../../../types/serialization.types';

export class SwarmStoreConnectorDBOptionsSerializer<
  P extends ESwarmStoreConnector,
  ItemType extends TSwarmStoreValueTypes<P>,
  DbType extends TSwarmStoreDatabaseType<P>,
  MSI extends TSwarmMessageInstance | ItemType,
  CTX extends ISwarmStoreConnectoDbOptionsUtilsGrandAccessCallbackContext
> implements ISwarmStoreConnectorUtilsOptionsSerializer<P, ItemType, DbType, MSI, CTX> {
  protected _grandAccessContextBinder:
    | ISwarmStoreConnectorUtilsDbOptionsGrandAccessCallbackContextBinder<P, ItemType, MSI, CTX>
    | undefined;

  protected _grandAccessCallbackToDbOptionsBinder:
    | ISwarmStoreConnectorDatabaseOptionsWithAccessControlleGrantCallbackBound<
        P,
        ItemType,
        DbType,
        MSI,
        CTX,
        TSwarmStoreDatabaseOptions<P, ItemType, DbType>
      >
    | undefined;

  protected _optionsSerializer: ISerializer | undefined;

  constructor(params: ISwarmStoreConnectorUtilsOptionsSerializerConstructorParams<P, ItemType, DbType, MSI, CTX>) {
    this._validateParams(params);
    this._setGrandAccessCallbackContextBinder(params.grandAccessCallbackBinder);
    this._setGrandAccessCallbackContextToDbOptionsBinder(params.grandAccessCallbackOptionsBinder);
    this._setOptionsSerializer(params.mainSerializer);
  }

  public parse(
    dboSerialized: TSwarmStoreDatabaseOptionsSerialized
  ): TSwarmStoreDatabaseOptions<P, ItemType, DbType> &
    ISwarmStoreConnectorDatabaseAccessControlleGrantCallbackBound<P, ItemType, MSI, CTX> {
    const dbOptionsParsed = this._parseDbOptionsSerialized(dboSerialized);

    return this._getGrandAccessCallbackToDbOptionsBinder()(
      dbOptionsParsed,
      this.getGrandAccessContextBinder()
    ) as TSwarmStoreDatabaseOptions<P, ItemType, DbType> &
      ISwarmStoreConnectorDatabaseAccessControlleGrantCallbackBound<P, ItemType, MSI, CTX>;
  }

  public stringify<DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>>(dbo: DBO): TSwarmStoreDatabaseOptionsSerialized {
    return this._stringifyDatabaseOptions(dbo);
  }

  protected _validateParams(
    params: ISwarmStoreConnectorUtilsOptionsSerializerConstructorParams<P, ItemType, DbType, MSI, CTX>
  ): void {
    assert(params, 'Params should be defined');
    assert(
      typeof params.grandAccessCallbackBinder === 'function',
      'Grand access callback bind fabric should be passed in params'
    );
    assert(
      typeof params.grandAccessCallbackOptionsBinder === 'function',
      'Grand access callback to options binder should be defined'
    );
    assert(params.mainSerializer, 'Serializer for options should be passed in params');
    assert(typeof params.mainSerializer.parse === 'function', 'Serializer for options should have the parse method');
    assert(typeof params.mainSerializer.stringify === 'function', 'Serializer for options should have the serialize method');
  }

  protected _setGrandAccessCallbackContextBinder(
    grandAccessCallbackBinder: ISwarmStoreConnectorUtilsDbOptionsGrandAccessCallbackContextBinder<P, ItemType, MSI, CTX>
  ): void {
    this._grandAccessContextBinder = grandAccessCallbackBinder;
  }

  protected _setGrandAccessCallbackContextToDbOptionsBinder(
    grandAccessCallbackToDbOptionsBinder: ISwarmStoreConnectorDatabaseOptionsWithAccessControlleGrantCallbackBound<
      P,
      ItemType,
      DbType,
      MSI,
      CTX,
      TSwarmStoreDatabaseOptions<P, ItemType, DbType>
    >
  ): void {
    this._grandAccessCallbackToDbOptionsBinder = grandAccessCallbackToDbOptionsBinder;
  }

  protected _setOptionsSerializer(optionsSerializer: ISerializer): void {
    this._optionsSerializer = optionsSerializer;
  }

  protected getGrandAccessContextBinder(): ISwarmStoreConnectorUtilsDbOptionsGrandAccessCallbackContextBinder<
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

  protected _getOptionsSerializer(): ISerializer {
    const optionsSerializer = this._optionsSerializer;

    if (!optionsSerializer) {
      throw new Error('Options serializer is not defined');
    }
    return optionsSerializer;
  }

  protected _getGrandAccessCallbackToDbOptionsBinder(): ISwarmStoreConnectorDatabaseOptionsWithAccessControlleGrantCallbackBound<
    P,
    ItemType,
    DbType,
    MSI,
    CTX,
    TSwarmStoreDatabaseOptions<P, ItemType, DbType>
  > {
    const grandAccessCallbackOptionsBinder = this._grandAccessCallbackToDbOptionsBinder;
    if (!grandAccessCallbackOptionsBinder) {
      throw new Error('Grand access callback to options binder not defined');
    }
    return grandAccessCallbackOptionsBinder;
  }

  protected _parseDbOptionsSerialized(
    dboSerialized: TSwarmStoreDatabaseOptionsSerialized
  ): TSwarmStoreDatabaseOptions<P, ItemType, DbType> {
    return this._getOptionsSerializer().parse(dboSerialized);
  }

  protected _stringifyDatabaseOptions<DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>>(
    dbo: DBO
  ): TSwarmStoreDatabaseOptionsSerialized {
    return this._getOptionsSerializer().stringify(dbo);
  }
}
