import assert from 'assert';
import {
  commonUtilsArrayDeleteFromArray,
  commonUtilsArrayDoCallbackTillNoError,
} from 'utils/common-utils/common-utils';
import { TSwarmMessageUserIdentifierVersion } from '../swarm-message-subclass-validator.types';
import validateIssuerDesirizlizedFormat from './swarm-message-subclass-validator-fields-validator-validators/swarm-message-subclass-validator-fields-validator-validator-issuer-deserizlied/swarm-message-subclass-validator-fields-validator-validator-issuer-deserizlied';
import validateIssuerSerializedFormat from './swarm-message-subclass-validator-fields-validator-validators/swarm-message-subclass-validator-fields-validator-validator-issuer-serialized/swarm-message-subclass-validator-fields-validator-validator-issuer-serialized';
import { TSwarmMessageIssuerDeserialized } from './swarm-message-subclass-validator-fields-validator-validators/swarm-message-subclass-validator-fields-validator-validator-issuer-deserizlied/swarm-message-subclass-validator-fields-validator-validator-issuer-deserizlied.types';
import validateTypeFormat from './swarm-message-subclass-validator-fields-validator-validators/swarm-message-subclass-validator-fields-validator-validator-type/swarm-message-subclass-validator-fields-validator-validator-type';
import validateUserIdentifier from './swarm-message-subclass-validator-fields-validator-validators/swarm-message-subclass-validator-fields-validator-validator-user-identifier';
import createValidatePayload from './swarm-message-subclass-validator-fields-validator-validators/swarm-message-subclass-validator-fields-validator-validator-payload';
import createValidateTimestamp from './swarm-message-subclass-validator-fields-validator-validators/swarm-message-subclass-validator-fields-validator-validator-timestamp';
import { TSwarmMessageType } from './swarm-message-subclass-validator-fields-validator-validators/swarm-message-subclass-validator-fields-validator-validator-type/swarm-message-subclass-validator-fields-validator-validator-type.types';
import { ISwarmMessagePayloadValidationOptions } from './swarm-message-subclass-validator-fields-validator-validators/swarm-message-subclass-validator-fields-validator-validator-payload/swarm-message-subclass-validator-fields-validator-validator-payload.types';
import { ISwarmMessageTimestampValidationOptions } from './swarm-message-subclass-validator-fields-validator-validators/swarm-message-subclass-validator-fields-validator-validator-timestamp/swarm-message-subclass-validator-fields-validator-validator-timestamp.types';
import { TSwarmMessageUserIdentifierSerialized } from './swarm-message-subclass-validator-fields-validator-validators/swarm-message-subclass-validator-fields-validator-validator-user-identifier/swarm-message-subclass-validator-fields-validator-validator-user-identifier.types';
import { CA_USER_IDENTITY_VERSIONS_LIST } from '../../../../central-authority-class/central-authority-class-user-identity/central-authority-class-user-identity.const';
import { ISwarmMessage } from '../../../swarm-message-constructortypes';
import { validateMessageBodyRawFormat } from './swarm-message-subclass-validator-fields-validator-validators/swarm-message-subclass-validator-fields-validator-body-raw/swarm-message-subclass-validator-fields-validator-body-raw';
import { validateMessageSignatureFormat } from './swarm-message-subclass-validator-fields-validator-validators/swarm-message-subclass-validator-fields-validator-signature/swarm-message-subclass-validator-fields-validator-signature';
import {
  IMessageFieldsValidatorOptions,
  ISwarmMessageSubclassFieldsValidator,
} from './swarm-message-subclass-validator-fields-validator.types';
import {
  ISwarmMessageBodyDeserialized,
  ISwarmMessageRaw,
} from '../../../swarm-message-constructortypes';

export class SwarmMessageSubclassFieldsValidator
  implements ISwarmMessageSubclassFieldsValidator {
  /**
   * list of a valid issuers.
   * If it is empty then any issuer will
   * be considered correct.
   *
   * @protected
   * @static
   * @type {string[]}
   * @memberof SwarmMessageSubclassValidator
   */
  protected issuersList: TSwarmMessageIssuerDeserialized[] = [];

  /**
   * list of a valid user identifier versions.
   *
   * @protected
   * @static
   * @type {string[]}
   * @memberof SwarmMessageSubclassValidator
   */
  protected supportedUserIdentifierVer: TSwarmMessageUserIdentifierVersion[] = CA_USER_IDENTITY_VERSIONS_LIST;

  /**
   * list of a valid message types.
   * If it is empty then any type will
   * be considered correct.
   *
   * @protected
   * @static
   * @type {Array<string | number>}
   * @memberof SwarmMessageSubclassValidator
   */
  protected typesList: TSwarmMessageType[] = [];

  protected payloadValidationOptions?: ISwarmMessagePayloadValidationOptions;

  protected timestampValidationOptions?: ISwarmMessageTimestampValidationOptions;

  protected validatePayload = createValidatePayload(
    this.payloadValidationOptions
  );

  protected validateTimestamp = createValidateTimestamp(
    this.timestampValidationOptions
  );

  /**
   * Creates an instance of SwarmMessageSubclassValidator.
   * @param {IMessageFieldsValidatorOptions} options
   * @memberof SwarmMessageSubclassValidator
   * @throws
   */
  constructor(options?: IMessageFieldsValidatorOptions) {
    this.setOptions(options);
  }

  /**
   * validate message's deserialized body object
   *
   * @param {ISwarmMessageBodyDeserialized} messageBody
   * @memberof SwarmMessageSubclassFieldsValidator
   * @throws
   */
  public validateMessageBody(messageBody: ISwarmMessageBodyDeserialized): void {
    assert(!!messageBody, 'Message body must be defined');
    assert(typeof messageBody === 'object', 'Message body must be an object');
    const { iss, pld, ts, typ } = messageBody;

    this.validateType(typ);
    this.validateIssuer(iss);
    this.validatePayload(pld);
    this.validateTimestamp(ts);
  }

  /**
   * validate swarm message object
   * throw an error if the message
   * is not valid
   *
   * @param {ISwarmMessage} message
   * @memberof SwarmMessageSubclassFieldsValidator
   * @throws
   */
  public validateMessage(message: ISwarmMessage): void {
    assert(!!message, 'Message must be defined');
    assert(typeof message === 'object', 'Message must be an object');

    const { bdy, uid, sig } = message;

    this.validateMessageBody(bdy);
    validateMessageSignatureFormat(sig);
    this.validateUserIdentifier(uid);

    const { iss, pld, ts, typ } = bdy;

    this.validateType(typ);
    this.validateIssuer(iss);
    this.validatePayload(pld);
    this.validateTimestamp(ts);
  }

  /**
   * validate the message's in format
   * when the body is serizlized
   *
   * @param {ISwarmMessageRaw} messageRaw
   * @memberof SwarmMessageSubclassFieldsValidator
   */
  public validateMessageRaw(messageRaw: ISwarmMessageRaw): void {
    assert(!!messageRaw, 'Message must be defined');
    assert(typeof messageRaw === 'object', 'Message must be an object');

    const { bdy, uid, sig } = messageRaw;

    validateMessageBodyRawFormat(bdy);
    validateMessageSignatureFormat(sig);
    this.validateUserIdentifier(uid);
  }

  /**
   * add an issuer string in the list
   * as a valid issuer.
   *
   * @param {string} issuer
   * @memberof SwarmMessageSubclassValidator
   * @throws
   */
  public addIssuerToValidList = (issuer: string): void => {
    const { issuersList } = this;

    validateIssuerDesirizlizedFormat(issuer);
    if (!issuersList.includes(issuer)) {
      issuersList.push(issuer);
    }
  };

  /**
   * remove an issuer from the list of the
   * valid issuers. If there is no
   * issuer in the list returns true.
   *
   * @param {string} issuer
   * @memberof SwarmMessageSubclassValidator
   */
  public removeIssuerFromValidList(issuer: string): boolean | Error {
    const { issuersList } = this;

    if (typeof issuer !== 'string') {
      return new Error('The issuer must be a string');
    }
    commonUtilsArrayDeleteFromArray(issuersList, issuer);
    return true;
  }

  /**
   * checks whether the issuer is in the
   * list of the valid issuers. If the
   * list of the valid issuers is empty
   * then returns true
   *
   * @param {string} issuer
   * @memberof SwarmMessageSubclassValidator
   * @throws
   */
  protected checkIssuerIsInList(issuer: string): void {
    const { issuersList } = this;

    assert(
      !issuersList.length || issuersList.includes(issuer),
      'The issuer is not into the list of the valid issuers'
    );
  }

  /**
   * validate the Issuer format and
   * if it is in the list of the valid
   * issuers
   *
   * @param {string} issuer
   * @memberof SwarmMessageSubclassValidator
   * @throws
   */
  protected validateIssuer(issuer: string): void {
    validateIssuerSerializedFormat(issuer);
    this.checkIssuerIsInList(issuer);
  }

  /**
   * add an type string in the list
   * as a valid types.
   *
   * @param {string | number} type
   * @memberof SwarmMessageSubclassValidator
   * @throws
   */
  protected addType = (type: TSwarmMessageType): void => {
    const { typesList } = this;

    validateTypeFormat(type, typesList);
  };

  /**
   * remove an issuer from the list of the
   * valid issuers. If there is no
   * issuer in the list returns true.
   *
   * @param {string | number} type
   * @memberof SwarmMessageSubclassValidator
   */
  protected removeType(type: TSwarmMessageType): void {
    const { typesList } = this;

    commonUtilsArrayDeleteFromArray(typesList, type);
  }

  /**
   * Checks whether the list of valid types is defined and not empty.
   * If it is then checks if the type is into the list.
   *
   * @param {string| number} type
   * @memberof SwarmMessageSubclassValidator
   * @throws
   */
  protected checkTypeInList(type: TSwarmMessageType): void {
    const { typesList } = this;

    assert(
      !typesList.length || typesList.includes(type),
      'The type is not into the list of the valid types'
    );
  }

  /**
   * check the Type value format and
   * if the type is in the list of the
   * valid types
   *
   * @param {string | number} type
   * @memberof SwarmMessageSubclassValidator
   * @throws
   */
  protected validateType(type: TSwarmMessageType): void {
    validateTypeFormat(type);
    this.checkTypeInList(type);
  }

  protected validateUserIdentifier = (
    userId: TSwarmMessageUserIdentifierSerialized
  ): void => {
    validateUserIdentifier(userId, this.supportedUserIdentifierVer);
  };

  /**
   * set the options
   *
   * @protected
   * @param {IMessageFieldsValidatorOptions} options
   * @memberof SwarmMessageSubclassValidator
   * @throws
   */
  protected setOptions(options?: IMessageFieldsValidatorOptions) {
    if (options != null) {
      assert(typeof options === 'object', 'The options must be an object');

      const {
        supportedUserIdentifierVer,
        payloadValidationOptions,
        issuersList,
        typesList,
        timestampValidationOptions,
      } = options;

      if (timestampValidationOptions) {
        this.timestampValidationOptions = timestampValidationOptions; // set time to live in milliseconds
        this.validateTimestamp = createValidateTimestamp(
          timestampValidationOptions
        );
      }
      if (payloadValidationOptions) {
        this.payloadValidationOptions = payloadValidationOptions;
        this.validatePayload = createValidatePayload(payloadValidationOptions);
      }
      if (supportedUserIdentifierVer instanceof Array) {
        this.supportedUserIdentifierVer = supportedUserIdentifierVer.map(
          (userIdentifierVersion) => {
            if (typeof userIdentifierVersion === 'string') {
              return userIdentifierVersion;
            }
            assert.fail(
              `The version ${userIdentifierVersion} must be a string`
            );
          }
        );
      }
      if (issuersList) {
        if (issuersList instanceof Array) {
          const setIssuersListResult = commonUtilsArrayDoCallbackTillNoError<
            string
          >(issuersList, this.addIssuerToValidList);

          if (setIssuersListResult instanceof Error) {
            assert.fail(setIssuersListResult);
          }
        } else {
          assert.fail('The value of the "issuersList" option must be an Array');
        }
      }
      if (typesList) {
        if (typesList instanceof Array) {
          const setTypesListResult = commonUtilsArrayDoCallbackTillNoError<
            TSwarmMessageType
          >(typesList, this.addType);

          if (setTypesListResult instanceof Error) {
            throw setTypesListResult;
          }
        } else {
          assert.fail('The value of the "typesList" option must be an Array');
        }
      }
    }
  }
}

export default SwarmMessageSubclassFieldsValidator;
