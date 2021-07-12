import { TSwarmMessageUserIdentifierSerialized } from '../../../../../central-authority-class/central-authority-class-user-identity/central-authority-class-user-identity-validators/central-authority-common-validator-user-identifier/central-authority-common-validator-user-identifier.types';
import { JSONSchema7 } from 'json-schema';
export interface ISwarmStoreConnectorDbOptionsGrandAccessContextClassFabricParams {
    readonly currentUserId: TSwarmMessageUserIdentifierSerialized;
    isUserValid(uesr: TSwarmMessageUserIdentifierSerialized): Promise<boolean>;
    jsonSchemaValidator(jsonSchema: JSONSchema7, valueToValidate: any): Promise<void>;
}
//# sourceMappingURL=swarm-store-conector-db-options-grand-access-context-class.types.d.ts.map