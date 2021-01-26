import { TSwarmMessageUserIdentifierSerialized } from '../../../../../swarm-message/swarm-message-subclasses/swarm-message-subclass-validators/swarm-message-subclass-validator-fields-validator/swarm-message-subclass-validator-fields-validator-validators/swarm-message-subclass-validator-fields-validator-validator-user-identifier/swarm-message-subclass-validator-fields-validator-validator-user-identifier.types';
import { JSONSchema7 } from 'json-schema';

export interface ISwarmStoreConnectorDbOptionsGrandAccessContextClassFabricParams {
  readonly currentUserId: TSwarmMessageUserIdentifierSerialized;
  /**
   * Checks whether the user is valid or not
   *
   * @param {TSwarmMessageUserIdentifierSerialized} uesr
   * @returns {Promise<boolean>}
   * @memberof ISwarmStoreConnectorDbOptionsGrandAccessContextClassFabricParams
   */
  isUserValid(uesr: TSwarmMessageUserIdentifierSerialized): Promise<boolean>;
  /**
   * Validates value by a json schema
   *
   * @param {JSONSchema7} jsonSchema
   * @param {*} valueToValidate
   * @returns {Promise<void>}
   * @memberof ISwarmStoreConnectorDbOptionsGrandAccessContextClassFabricParams
   */
  jsonSchemaValidator(jsonSchema: JSONSchema7, valueToValidate: any): Promise<void>;
}
