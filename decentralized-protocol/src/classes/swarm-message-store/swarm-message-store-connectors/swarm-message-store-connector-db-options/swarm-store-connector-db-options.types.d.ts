import { IDatabaseOptionsClass, ISwarmStoreConnectorDatabaseAccessControlleGrantCallback, TSwarmStoreConnectorAccessConrotllerGrantAccessCallback, TSwarmStoreDatabaseOptions, TSwarmStoreDatabaseOptionsSerialized, TSwarmStoreDatabaseType, TSwarmStoreValueTypes } from '../../../swarm-store-class/swarm-store-class.types';
import { ESwarmStoreConnector } from '../../../swarm-store-class/swarm-store-class.const';
import { ISwarmMessageConstructor, ISwarmMessageInstanceDecrypted } from '../../../swarm-message/swarm-message-constructor.types';
import { IOptionsSerializerValidatorConstructor, IOptionsSerializerValidatorConstructorParams, IOptionsSerializerValidatorSerializer } from '../../../basic-classes/options-serializer-validator-class/options-serializer-validator-class.types';
import { ISwarmStoreDBOGrandAccessCallbackBaseContext, ISwarmStoreDBOSerializerValidator, ISwarmStoreConnectorUtilsDatabaseOptionsValidatorsInstanceFabric } from '../../../swarm-store-class/swarm-store-connectors/swarm-store-connetors.types';
import { ISwarmMessagesStoreConnectorUtilsDbOptionsGrandAccessCallbackBound } from '../..';
export interface ISwarmStoreConnectoDbOptionsUtilsGrandAccessCallbackContextFabric<P extends ESwarmStoreConnector, DbType extends TSwarmStoreDatabaseType<P>, ItemType extends TSwarmStoreValueTypes<P>, DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>, SMC extends ISwarmMessageConstructor, CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext> {
    (dbOptions: DBO, swarmMessageConstructor: SMC): CTX;
}
export interface ISwarmMessageStoreConnectorUtilsDbOptionsGrandAccessCallbackContextBinder<P extends ESwarmStoreConnector, ItemType extends TSwarmStoreValueTypes<P>, MD extends ISwarmMessageInstanceDecrypted, CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext> {
    (grandAccessCallback: TSwarmStoreConnectorAccessConrotllerGrantAccessCallback<P, ItemType, MD>, ctx?: CTX): ISwarmMessagesStoreConnectorUtilsDbOptionsGrandAccessCallbackBound<P, ItemType, MD, CTX>;
}
export interface ISwarmMessageStoreConnectorUtilsDbOptionsGrandAccessCallbackContextBinderFabric<P extends ESwarmStoreConnector, ItemType extends TSwarmStoreValueTypes<P>, MD extends ISwarmMessageInstanceDecrypted, CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext> {
    (ctx: CTX): ISwarmMessageStoreConnectorUtilsDbOptionsGrandAccessCallbackContextBinder<P, ItemType, MD, CTX>;
}
export interface ISwarmMessageStoreConnectorDatabaseAccessControlleGrantCallbackBound<P extends ESwarmStoreConnector, ItemType extends TSwarmStoreValueTypes<P>, MD extends ISwarmMessageInstanceDecrypted, CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext> extends ISwarmStoreConnectorDatabaseAccessControlleGrantCallback<P, ItemType, MD> {
    grantAccess?: ISwarmMessagesStoreConnectorUtilsDbOptionsGrandAccessCallbackBound<P, ItemType, MD, CTX>;
}
export interface ISwarmMessageStoreConnectorDatabaseOptionsWithAccessControlleGrantCallbackBound<P extends ESwarmStoreConnector, ItemType extends TSwarmStoreValueTypes<P>, DbType extends TSwarmStoreDatabaseType<P>, MD extends ISwarmMessageInstanceDecrypted, CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext, DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>> {
    (dbo: DBO, grandAccessCallbackBinder: ISwarmMessageStoreConnectorUtilsDbOptionsGrandAccessCallbackContextBinder<P, ItemType, MD, CTX>): DBO extends Required<ISwarmStoreConnectorDatabaseAccessControlleGrantCallback<P, ItemType, MD>> ? DBO & ISwarmMessageStoreConnectorDatabaseAccessControlleGrantCallbackBound<P, ItemType, MD, CTX> : DBO;
}
export interface ISwarmMessageStoreConnectorDatabaseOptionsWithAccessControlleGrantCallbackBoundFabric<P extends ESwarmStoreConnector, ItemType extends TSwarmStoreValueTypes<P>, DbType extends TSwarmStoreDatabaseType<P>, MD extends ISwarmMessageInstanceDecrypted, CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext, DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>> {
    (): ISwarmMessageStoreConnectorDatabaseOptionsWithAccessControlleGrantCallbackBound<P, ItemType, DbType, MD, CTX, DBO>;
}
export interface ISwarmMessageStoreDBOSerializerValidatorConstructorParams<P extends ESwarmStoreConnector, ItemType extends TSwarmStoreValueTypes<P>, DbType extends TSwarmStoreDatabaseType<P>, MD extends ISwarmMessageInstanceDecrypted, CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext, DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>, DBOS extends TSwarmStoreDatabaseOptionsSerialized> extends IOptionsSerializerValidatorConstructorParams<DBO, DBOS> {
    grandAccessBinder: ISwarmMessageStoreConnectorUtilsDbOptionsGrandAccessCallbackContextBinder<P, ItemType, MD, CTX>;
    grandAccessBinderForDBOptions: ISwarmMessageStoreConnectorDatabaseOptionsWithAccessControlleGrantCallbackBound<P, ItemType, DbType, MD, CTX, DBO>;
}
export interface ISwarmMessageStoreConnectorUtilsDatabaseOptionsSerializerValidatorConstructor<P extends ESwarmStoreConnector, ItemType extends TSwarmStoreValueTypes<P>, DbType extends TSwarmStoreDatabaseType<P>, MD extends ISwarmMessageInstanceDecrypted, CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext, DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>, DBOS extends TSwarmStoreDatabaseOptionsSerialized> extends IOptionsSerializerValidatorConstructor<DBO, DBOS> {
    new (params: ISwarmMessageStoreDBOSerializerValidatorConstructorParams<P, ItemType, DbType, MD, CTX, DBO, DBOS>): ISwarmStoreDBOSerializerValidator<P, ItemType, DbType, DBO, DBOS>;
}
export interface ISwarmMessageStoreConnectorUtilsDatabaseOptionsSerializerValidatorConstructorByDBO<P extends ESwarmStoreConnector, ItemType extends TSwarmStoreValueTypes<P>, DbType extends TSwarmStoreDatabaseType<P>, DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>, DBOS extends TSwarmStoreDatabaseOptionsSerialized> extends IOptionsSerializerValidatorConstructor<DBO, DBOS> {
    new (params: {
        options: DBO;
    }): ISwarmStoreDBOSerializerValidator<P, ItemType, DbType, DBO, DBOS>;
}
export interface ISwarmMessageStoreConnectorUtilsDatabaseOptionsSerializerValidatorConstructor<P extends ESwarmStoreConnector, ItemType extends TSwarmStoreValueTypes<P>, DbType extends TSwarmStoreDatabaseType<P>, MD extends ISwarmMessageInstanceDecrypted, CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext, DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>, DBOS extends TSwarmStoreDatabaseOptionsSerialized> extends IOptionsSerializerValidatorConstructor<DBO, DBOS> {
    new (params: ISwarmMessageStoreDBOSerializerValidatorConstructorParams<P, ItemType, DbType, MD, CTX, DBO, DBOS>): ISwarmStoreDBOSerializerValidator<P, ItemType, DbType, DBO, DBOS>;
}
export interface ISwarmMessageStoreConnectorUtilsDatabaseOptionsSerializerValidatorConstructor<P extends ESwarmStoreConnector, ItemType extends TSwarmStoreValueTypes<P>, DbType extends TSwarmStoreDatabaseType<P>, MD extends ISwarmMessageInstanceDecrypted, CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext, DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>, DBOS extends TSwarmStoreDatabaseOptionsSerialized> extends IOptionsSerializerValidatorConstructor<DBO, DBOS> {
    new (params: ISwarmMessageStoreDBOSerializerValidatorConstructorParams<P, ItemType, DbType, MD, CTX, DBO, DBOS>): ISwarmStoreDBOSerializerValidator<P, ItemType, DbType, DBO, DBOS>;
}
export interface ISwarmMessageStoreConnectorUtilsDatabaseOptionsSerializerValidatorConstructorFabricParams<P extends ESwarmStoreConnector, ItemType extends TSwarmStoreValueTypes<P>, DbType extends TSwarmStoreDatabaseType<P>, MD extends ISwarmMessageInstanceDecrypted, CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext, DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>, DBOS extends TSwarmStoreDatabaseOptionsSerialized, SMC extends ISwarmMessageConstructor> {
    grandAccessCallbackContextFabric: ISwarmStoreConnectoDbOptionsUtilsGrandAccessCallbackContextFabric<P, DbType, ItemType, DBO, SMC, CTX>;
    optionsSerializer?: IOptionsSerializerValidatorSerializer<DBO, DBOS>;
    validatorsFabric: ISwarmStoreConnectorUtilsDatabaseOptionsValidatorsInstanceFabric<P, ItemType, DbType, DBO, DBOS>;
    grandAccessBinderFabric?: ISwarmMessageStoreConnectorUtilsDbOptionsGrandAccessCallbackContextBinderFabric<P, ItemType, MD, CTX>;
    grandAccessBinderForDBOptionsFabric?: ISwarmMessageStoreConnectorDatabaseOptionsWithAccessControlleGrantCallbackBoundFabric<P, ItemType, DbType, MD, CTX, DBO>;
}
export interface ISwarmMessageStoreConnectorUtilsDatabaseOptionsSerializerValidatorConstructorFabric<P extends ESwarmStoreConnector, ItemType extends TSwarmStoreValueTypes<P>, DbType extends TSwarmStoreDatabaseType<P>, MD extends ISwarmMessageInstanceDecrypted, CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext, DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>, DBOS extends TSwarmStoreDatabaseOptionsSerialized, SMC extends ISwarmMessageConstructor> {
    (params: ISwarmMessageStoreConnectorUtilsDatabaseOptionsSerializerValidatorConstructorFabricParams<P, ItemType, DbType, MD, CTX, DBO, DBOS, SMC>): IDatabaseOptionsClass<P, ItemType, DbType, DBO, DBOS>;
}
export interface ISwarmMessageStoreConnectorUtilsDatabaseOptionsSerializerValidatorWithMetaConstructorArguments<P extends ESwarmStoreConnector, ItemType extends TSwarmStoreValueTypes<P>, DbType extends TSwarmStoreDatabaseType<P>, DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>, META extends Record<string, unknown> | never = never> {
    options: DBO;
    meta: META;
}
export interface ISwarmMessageStoreDatabaseOptionsWithMetaConstructor<P extends ESwarmStoreConnector, ItemType extends TSwarmStoreValueTypes<P>, DbType extends TSwarmStoreDatabaseType<P>, MD extends ISwarmMessageInstanceDecrypted, CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext, DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>, DBOS extends TSwarmStoreDatabaseOptionsSerialized, META extends Record<string, unknown> | never = never> extends ISwarmMessageStoreConnectorUtilsDatabaseOptionsSerializerValidatorConstructor<P, ItemType, DbType, MD, CTX, DBO, DBOS> {
    new (options: ISwarmMessageStoreConnectorUtilsDatabaseOptionsSerializerValidatorWithMetaConstructorArguments<P, ItemType, DbType, DBO, META>): ISwarmStoreDBOSerializerValidator<P, ItemType, DbType, DBO, DBOS>;
}
//# sourceMappingURL=swarm-store-connector-db-options.types.d.ts.map