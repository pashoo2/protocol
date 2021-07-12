import { ICentralAuthority } from '../../../central-authority-class/central-authority-class.types';
import { ConstructorType } from '../../../../types/helper.types';
import { ISwarmStoreDBOGrandAccessCallbackBaseContext } from '../../../swarm-store-class/swarm-store-connectors/swarm-store-connetors.types';
import { JSONSchema7 } from 'json-schema';
export declare function createSwarmStoreDatabaseGrandAccessBaseContextClass(params: {
    centralAuthority: {
        isRunning: ICentralAuthority['isRunning'];
        getSwarmUserCredentials: ICentralAuthority['getSwarmUserCredentials'];
        getUserIdentity: ICentralAuthority['getUserIdentity'];
    };
    jsonSchemaValidator: (jsonSchema: JSONSchema7, valueToValidate: any) => Promise<void>;
}): ConstructorType<ISwarmStoreDBOGrandAccessCallbackBaseContext>;
//# sourceMappingURL=connection-bridge-utils-store-to-swarm-database-grand-access-callbacks-fabrics.d.ts.map