import { validateVerboseBySchemaWithVoidResult } from '../../../../../utils/validation-utils/validation-utils';
import jsonSchemaDbOptions from '../const/validation/schemas/orbit-db-options-shema-v1.json';
export function validateOrbitDBDatabaseOptionsV1(value) {
    validateVerboseBySchemaWithVoidResult(jsonSchemaDbOptions, value);
}
//# sourceMappingURL=swarm-store-connector-orbit-db-validators-db-options.js.map