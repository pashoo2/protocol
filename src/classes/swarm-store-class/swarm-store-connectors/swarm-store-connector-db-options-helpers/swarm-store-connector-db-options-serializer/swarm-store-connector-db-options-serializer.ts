import {
  ISwarmStoreConnectoDbOptionsUtilsGrandAccessCallbackContext,
  ISwarmStoreConnectorUtilsOptionsSerializer,
} from '../swarm-store-connector-db-options-helpers.types';
import { TSwarmStoreValueTypes, TSwarmStoreDatabaseType, TSwarmStoreDatabaseOptions } from '../../../swarm-store-class.types';
import { ESwarmStoreConnector } from '../../../swarm-store-class.const';
import { TSwarmMessageInstance } from '../../../../swarm-message/swarm-message-constructor.types';
import { ISwarmStoreConnectorUtilsOptionsSerializerConstructorParams } from '../swarm-store-connector-db-options-helpers.types';
import assert from 'assert';
import {
  ISwarmStoreConnectorUtilsDbOptionsGrandAccessCallbackContextBinder,
  ISwarmStoreConnectorDatabaseAccessControlleGrantCallbackBound,
} from '../swarm-store-connector-db-options-helpers.types';
import {
  TSwarmStoreDatabaseOptionsSerialized,
  ISwarmStoreConnectorDatabaseAccessControlleGrantCallback,
} from '../../../swarm-store-class.types';
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

  protected _optionsSerializer: ISerializer | undefined;

  constructor(params: ISwarmStoreConnectorUtilsOptionsSerializerConstructorParams<P, ItemType, MSI, CTX>) {
    this._validateParams(params);
    this._setGrandAccessCallbackContextBinder(params.grandAccessCallbackBinder);
    this._setOptionsSerializer(params.optionsSerializer);
  }

  public parse(
    dboSerialized: TSwarmStoreDatabaseOptionsSerialized
  ): TSwarmStoreDatabaseOptions<P, ItemType, DbType> &
    ISwarmStoreConnectorDatabaseAccessControlleGrantCallbackBound<P, ItemType, MSI, CTX> {
    const dbOptionsParsed = this._parseDbOptionsSerialized(dboSerialized);

    if (dbOptionsParsed.grantAccess) {
      return this._bindGrandAccessCallbackInOptions(
        dbOptionsParsed as TSwarmStoreDatabaseOptions<P, ItemType, DbType> &
          Required<ISwarmStoreConnectorDatabaseAccessControlleGrantCallback<P, ItemType, MSI>>
      ) as TSwarmStoreDatabaseOptions<P, ItemType, DbType> &
        Required<ISwarmStoreConnectorDatabaseAccessControlleGrantCallbackBound<P, ItemType, MSI, CTX>>;
    }
    return dbOptionsParsed as TSwarmStoreDatabaseOptions<P, ItemType, DbType> &
      Partial<ISwarmStoreConnectorDatabaseAccessControlleGrantCallbackBound<P, ItemType, MSI, CTX>>;
  }

  public stringify<DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>>(dbo: DBO): TSwarmStoreDatabaseOptionsSerialized {
    return this._stringifyDatabaseOptions(dbo);
  }

  protected _validateParams(params: ISwarmStoreConnectorUtilsOptionsSerializerConstructorParams<P, ItemType, MSI, CTX>): void {
    assert(params, 'Params should be defined');
    assert(
      typeof params.grandAccessCallbackBinder === 'function',
      'Grand access callback bind fabric should be passed in params'
    );
    assert(params.optionsSerializer, 'Serializer for options should be passed in params');
    assert(typeof params.optionsSerializer.parse === 'function', 'Serializer for options should have the parse method');
    assert(typeof params.optionsSerializer.stringify === 'function', 'Serializer for options should have the serialize method');
  }

  protected _setGrandAccessCallbackContextBinder(
    grandAccessCallbackBinder: ISwarmStoreConnectorUtilsDbOptionsGrandAccessCallbackContextBinder<P, ItemType, MSI, CTX>
  ): void {
    this._grandAccessContextBinder = grandAccessCallbackBinder;
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

  protected _parseDbOptionsSerialized(
    dboSerialized: TSwarmStoreDatabaseOptionsSerialized
  ): TSwarmStoreDatabaseOptions<P, ItemType, DbType> {
    return this._getOptionsSerializer().parse(dboSerialized);
  }

  protected _bindGrandAccessCallback(
    grandAccessParams: Required<ISwarmStoreConnectorDatabaseAccessControlleGrantCallback<P, ItemType, MSI>>
  ): ISwarmStoreConnectorDatabaseAccessControlleGrantCallbackBound<P, ItemType, MSI, CTX> {
    return this.getGrandAccessContextBinder()(
      grandAccessParams.grantAccess
    ) as ISwarmStoreConnectorDatabaseAccessControlleGrantCallbackBound<P, ItemType, MSI, CTX>;
  }

  protected _bindGrandAccessCallbackInOptions<
    DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType> &
      Required<ISwarmStoreConnectorDatabaseAccessControlleGrantCallback<P, ItemType, MSI>>
  >(dboParsed: DBO): DBO & ISwarmStoreConnectorDatabaseAccessControlleGrantCallbackBound<P, ItemType, MSI, CTX> {
    const grandAccessCallbackBound = this._bindGrandAccessCallback(dboParsed);

    return {
      ...dboParsed,
      grantAccess: grandAccessCallbackBound,
    } as DBO & ISwarmStoreConnectorDatabaseAccessControlleGrantCallbackBound<P, ItemType, MSI, CTX>;
  }

  protected _stringifyDatabaseOptions<DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>>(
    dbo: DBO
  ): TSwarmStoreDatabaseOptionsSerialized {
    return this._getOptionsSerializer().stringify(dbo);
  }
}
