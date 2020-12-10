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
  isUserExists(userId: TSwarmMessageUserIdentifierSerialized): Promise<boolean>;
}

/**
 * Grand access callback function extended with a context
 *
 * @export
 * @interface ISwarmStoreConnectorOrbitDbUtilsDbOptionsGrandAccessCallbackWithContext
 * @extends {TSwarmStoreConnectorAccessConrotllerGrantAccessCallback<P, ItemType, MSI>}
 * @template P
 * @template ItemType
 * @template MSI
 * @template CTX - context in which the function will be executed
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
  parse(
    dbo: TSwarmStoreDatabaseOptionsSerialized
  ): TSwarmStoreDatabaseOptions<P, ItemType, DbType> &
    ISwarmStoreConnectorDatabaseAccessControlleGrantCallbackBound<P, ItemType, MSI, CTX>;
  stringify<DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>>(dbo: DBO): TSwarmStoreDatabaseOptionsSerialized;
}
