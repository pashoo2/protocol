import { JSONSchema7 } from 'json-schema';
import { TSwarmMessageUserIdentifierSerialized } from '../../central-authority-class/central-authority-class-user-identity/central-authority-class-user-identity-validators/central-authority-common-validator-user-identifier';
import { ESwarmStoreConnector } from '../swarm-store-class.const';
import { TSwarmStoreConnectorAccessConrotllerGrantAccessCallback, TSwarmStoreDatabaseEntryOperation, TSwarmStoreDatabaseOptions, TSwarmStoreDatabaseOptionsSerialized, TSwarmStoreDatabaseType, TSwarmStoreValueTypes } from '../swarm-store-class.types';
import { IOptionsSerializerValidator, IOptionsSerializerValidatorValidators } from '../../basic-classes/options-serializer-validator-class';
export interface ISwarmStoreDBOGrandAccessCallbackBaseContextMethods {
    isUserValid(userId: TSwarmMessageUserIdentifierSerialized): Promise<true>;
    jsonSchemaValidator(jsonSchema: JSONSchema7, valueToValidate: any): Promise<void>;
}
export interface ISwarmStoreDBOGrandAccessCallbackBaseContext extends ISwarmStoreDBOGrandAccessCallbackBaseContextMethods {
    readonly currentUserId: TSwarmMessageUserIdentifierSerialized;
}
export interface ISwarmStoreConnectorUtilsDatabaseOptionsValidators<P extends ESwarmStoreConnector, ItemType extends TSwarmStoreValueTypes<P>, DbType extends TSwarmStoreDatabaseType<P>, DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>, DBOS extends TSwarmStoreDatabaseOptionsSerialized> extends IOptionsSerializerValidatorValidators<DBO, DBOS> {
    isValidSerializedOptions(optsSerialized: unknown): optsSerialized is DBOS;
    isValidOptions(opts: unknown): opts is DBO;
}
export interface ISwarmStoreConnectorUtilsDbOptionsGrandAccessCallbackBound<P extends ESwarmStoreConnector, T extends TSwarmStoreValueTypes<P>, CTX extends ISwarmStoreDBOGrandAccessCallbackBaseContext> extends TSwarmStoreConnectorAccessConrotllerGrantAccessCallback<P, T, T> {
    (this: CTX, payload: T, userId: TSwarmMessageUserIdentifierSerialized, key: string | undefined, operation: TSwarmStoreDatabaseEntryOperation<P> | undefined, time: number): Promise<boolean>;
}
export interface ISwarmStoreConnectorUtilsDatabaseOptionsValidatorsInstanceConstructor<P extends ESwarmStoreConnector, ItemType extends TSwarmStoreValueTypes<P>, DbType extends TSwarmStoreDatabaseType<P>, DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>, DBOS extends TSwarmStoreDatabaseOptionsSerialized> {
    new (): ISwarmStoreConnectorUtilsDatabaseOptionsValidators<P, ItemType, DbType, DBO, DBOS>;
}
export interface ISwarmStoreConnectorUtilsDatabaseOptionsValidatorsInstanceFabric<P extends ESwarmStoreConnector, ItemType extends TSwarmStoreValueTypes<P>, DbType extends TSwarmStoreDatabaseType<P>, DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>, DBOS extends TSwarmStoreDatabaseOptionsSerialized> {
    (): ISwarmStoreConnectorUtilsDatabaseOptionsValidators<P, ItemType, DbType, DBO, DBOS>;
}
export interface ISwarmStoreConnectorUtilsDatabaseOptionsValidatorsConstructor<P extends ESwarmStoreConnector, ItemType extends TSwarmStoreValueTypes<P>, DbType extends TSwarmStoreDatabaseType<P>, DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>, DBOS extends TSwarmStoreDatabaseOptionsSerialized> {
    new (): ISwarmStoreConnectorUtilsDatabaseOptionsValidators<P, ItemType, DbType, DBO, DBOS>;
}
export interface ISwarmStoreDBOSerializerValidator<P extends ESwarmStoreConnector, ItemType extends TSwarmStoreValueTypes<P>, DbType extends TSwarmStoreDatabaseType<P>, DBO extends TSwarmStoreDatabaseOptions<P, ItemType, DbType>, DBOS extends TSwarmStoreDatabaseOptionsSerialized> extends IOptionsSerializerValidator<DBO, DBOS> {
}
//# sourceMappingURL=swarm-store-connetors.types.d.ts.map