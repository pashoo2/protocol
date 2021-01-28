import { JSONSchema7 } from 'json-schema';
import { validateVerboseBySchemaWithVoidResult } from '../../../../../utils/validation-utils/validation-utils';
import { ISwarmStoreConnectorOrbitDbDatabaseOptions } from '../swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.types';
import jsonSchemaDbOptions from '../const/validation/schemas/orbit-db-options-shema-v1.json';

/**
 * Validate OrbitDB database options V1
 * by json schema
 *
 * @export
 * @param {ISwarmStoreConnectorOrbitDbDatabaseOptions<any, any>} value
 * @returns {void}
 * @throws
 */
export function validateOrbitDBDatabaseOptionsV1(value: ISwarmStoreConnectorOrbitDbDatabaseOptions<any, any>): void {
  try {
    validateVerboseBySchemaWithVoidResult(jsonSchemaDbOptions as JSONSchema7, value);
  } catch (err) {
    console.error(err);
    debugger;
  }
}
