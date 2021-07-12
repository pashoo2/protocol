import { OptionsSerializerValidator } from '../../../../basic-classes/options-serializer-validator-class/options-serializer-validator-class';
import { TSwarmStoreDatabaseOptionsSerialized, TSwarmStoreValueTypes, TSwarmStoreDatabaseType, TSwarmStoreDatabaseOptions } from '../../../../swarm-store-class/swarm-store-class.types';
import { ESwarmStoreConnector } from '../../../../swarm-store-class/swarm-store-class.const';
import { ISwarmStoreDBOGrandAccessCallbackBaseContext } from '../../../../swarm-store-class/swarm-store-connectors/swarm-store-connetors.types';
import { ISwarmMessageInstanceDecrypted } from '../../../../swarm-message/swarm-message-constructor.types';
import { ISwarmStoreDBOSerializerValidator } from '../../../../swarm-store-class/swarm-store-connectors/swarm-store-connetors.types';
import { ISwarmMessageStoreDBOSerializerValidatorConstructorParams, ISwarmMessageStoreConnectorUtilsDbOptionsGrandAccessCallbackContextBinder, ISwarmMessageStoreConnectorDatabaseOptionsWithAccessControlleGrantCallbackBound } from '../swarm-store-connector-db-options.types';
export declare class SwarmMessageStoreDBOptionsClass<P extends ESwarmStoreConnector, ItemType extends TSwarmStoreValueTypes<P>, DbType extends TSwarmStoreDatabaseType<P>, MD extends ISwarmMessageInstanceDecrypted, CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext, DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>, DBOS extends TSwarmStoreDatabaseOptionsSerialized> extends OptionsSerializerValidator<DBO, DBOS> implements ISwarmStoreDBOSerializerValidator<P, ItemType, DbType, DBO, DBOS> {
    protected _grandAccessContextBinder: ISwarmMessageStoreConnectorUtilsDbOptionsGrandAccessCallbackContextBinder<P, ItemType, MD, CTX> | undefined;
    protected _grandAccessCallbackToDbOptionsBinder: ISwarmMessageStoreConnectorDatabaseOptionsWithAccessControlleGrantCallbackBound<P, ItemType, DbType, MD, CTX, DBO> | undefined;
    constructor(params: ISwarmMessageStoreDBOSerializerValidatorConstructorParams<P, ItemType, DbType, MD, CTX, DBO, DBOS>);
    protected _validateParams(params: {
        grandAccessBinder: ISwarmMessageStoreDBOSerializerValidatorConstructorParams<P, ItemType, DbType, MD, CTX, DBO, DBOS>['grandAccessBinder'];
        grandAccessBinderForDBOptions: ISwarmMessageStoreDBOSerializerValidatorConstructorParams<P, ItemType, DbType, MD, CTX, DBO, DBOS>['grandAccessBinderForDBOptions'];
    }): void;
    protected _setGrandAccessCallbackContextBinder(grandAccessCallbackContextBinder: ISwarmMessageStoreConnectorUtilsDbOptionsGrandAccessCallbackContextBinder<P, ItemType, MD, CTX>): void;
    protected _setGrandAccessCallbackContextForDbOptionsBinder(grandAccessCallbackContextForDbOptionsBinder: ISwarmMessageStoreConnectorDatabaseOptionsWithAccessControlleGrantCallbackBound<P, ItemType, DbType, MD, CTX, DBO>): void;
    protected _getGrandAccessContextBinder(): ISwarmMessageStoreConnectorUtilsDbOptionsGrandAccessCallbackContextBinder<P, ItemType, MD, CTX>;
    protected _getGrandAccessCallbackToDbOptionsBinder(): ISwarmMessageStoreConnectorDatabaseOptionsWithAccessControlleGrantCallbackBound<P, ItemType, DbType, MD, CTX, DBO>;
    protected _bindGrandAccessContextToOptions(): void;
}
//# sourceMappingURL=swarm-message-store-connector-db-options-class.d.ts.map