import CentralAuthorityIdentity from 'classes/central-authority-class/central-authority-class-user-identity/central-authority-class-user-identity';
import {
  TCentralAuthorityUserCryptoCredentials,
  TCentralAuthorityUserIdentity,
} from 'classes/central-authority-class/central-authority-class-types/central-authority-class-types';
import { ICAUserUniqueIdentifierDescriptionWithOptionalVersion } from 'classes/central-authority-class/central-authority-class-user-identity/central-authority-class-user-identity.types';
import {
  commonUtilsArrayDeleteFromArray,
  commonUtilsArrayDoCallbackTillNoError,
  commonUtilsArrayCalculateLengthOfIntegerArray,
} from 'utils/common-utils/common-utils';
import {
  TType,
  IMessageValidatorOptions,
  TPayload,
} from './swarm-message-subclass-validator.types';
import {
  SWARM_MESSAGE_SUBCLASS_VALIDATOR_PAYLOAD_MAX_LENGTH_BYTES,
  SWARM_MESSAGE_SUBCLASS_VALIDATOR_PAYLOAD_MIN_LENGTH_BYTES,
} from './swarm-message-subclass-validator.const';

export class SwarmMessageSubclassValidator {
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
  protected issuersList: string[] = [];

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
  protected typesList: Array<string | number> = [];

  /**
   * the maximum lenght for a payload value
   *
   * @protected
   * @type {number}
   * @memberof SwarmMessageSubclassValidator
   */
  protected payloadMaxLength: number = SWARM_MESSAGE_SUBCLASS_VALIDATOR_PAYLOAD_MAX_LENGTH_BYTES;

  /**
   * the minimum length for a payload values
   *
   * @protected
   * @type {number}
   * @memberof SwarmMessageSubclassValidator
   */
  protected payloadMinLength: number = SWARM_MESSAGE_SUBCLASS_VALIDATOR_PAYLOAD_MIN_LENGTH_BYTES;

  /**
   * time to life of a message, the message will be invalidated if the
   * message timestamp is not in the interval within the timestamp. If not defined or se to 0 means infinite
   * time to live. Time to live in seconds
   *
   * @protected
   * @type {number}
   * @memberof SwarmMessageSubclassValidator
   */
  protected ttlSeconds?: number;

  /**
   * Creates an instance of SwarmMessageSubclassValidator.
   * @param {IMessageValidatorOptions} options
   * @memberof SwarmMessageSubclassValidator
   * @throws
   */
  constructor(options: IMessageValidatorOptions) {
    this.setOptions(options);
  }

  /**
   * validates the Issuer type and length
   *
   * @param {string} issuer
   * @memberof SwarmMessageSubclassValidator
   */
  public validateIssuerFormat(issuer: string): boolean | Error {
    if (!issuer) {
      return new Error('The issuer must be defined');
    }
    if (typeof issuer !== 'string') {
      return new Error('The issuer must be a string');
    }
    if (!issuer.length) {
      return new Error('The issuer string must not be empty');
    }
    return true;
  }

  /**
   * add an issuer string in the list
   * as a valid issuer.
   *
   * @static
   * @param {string} issuer
   * @returns {(boolean | Error)}
   * @memberof SwarmMessageSubclassValidator
   */
  public addIssuer = (issuer: string): boolean | Error => {
    const issuerFormatValidationResult = this.validateIssuerFormat(issuer);

    if (issuerFormatValidationResult instanceof Error) {
      return issuerFormatValidationResult;
    }

    const { issuersList } = this;

    if (typeof issuer !== 'string') {
      return new Error('The issuer must be a string');
    }
    if (!issuersList.includes(issuer)) {
      issuersList.push(issuer);
    }
    return true;
  };

  /**
   * remove an issuer from the list of the
   * valid issuers. If there is no
   * issuer in the list returns true.
   *
   * @static
   * @param {string} issuer
   * @returns {(boolean | Error)}
   * @memberof SwarmMessageSubclassValidator
   */
  public removeIssuer(issuer: string): boolean | Error {
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
   * @returns {(Error | boolean)}
   * @memberof SwarmMessageSubclassValidator
   */
  public checkIssuerInList(issuer: string): Error | boolean {
    const { issuersList } = this;

    if (issuersList && issuersList.length && !issuersList.includes(issuer)) {
      return new Error('The issuer is not into the list of the valid issuers');
    }
    return true;
  }

  /**
   * validate the Issuer format and
   * if it is in the list of the valid
   * issuers
   *
   * @param {string} issuer
   * @memberof SwarmMessageSubclassValidator
   */
  public validateIssuer(issuer: string): boolean | Error {
    const issuerFormatValidationResult = this.validateIssuerFormat(issuer);

    if (issuerFormatValidationResult instanceof Error) {
      return issuerFormatValidationResult;
    }

    const issuerInListOfValidResult = this.checkIssuerInList(issuer);

    if (issuerInListOfValidResult instanceof Error) {
      return issuerInListOfValidResult;
    }
    return true;
  }

  /**
   * validate the type of the Type value
   * it's length or if it is positive or
   * a negative number
   *
   * @param {string | number} [type]
   * @returns {(boolean | Error)}
   * @memberof SwarmMessageSubclassValidator
   */
  public validateTypeFormat(type?: TType): boolean | Error {
    if (type == null) {
      return new Error('A type must be specified');
    }
    if (typeof type === 'string') {
      if (!type.length) {
        return new Error('The type of the message must not be empty');
      }
      return true;
    } else if (typeof type === 'number') {
      if (type < 0) {
        return new Error('The type must be a positive number');
      }
      return true;
    }
    return new Error('The type must be a number or a string');
  }

  /**
   * add an type string in the list
   * as a valid types.
   *
   * @static
   * @param {string | number} type
   * @returns {(boolean | Error)}
   * @memberof SwarmMessageSubclassValidator
   */
  public addType = (type: TType): boolean | Error => {
    const { typesList } = this;
    const validationResult = this.validateTypeFormat(type);

    if (validationResult instanceof Error) {
      return validationResult;
    }
    if (!typesList.includes(type)) {
      typesList.push(type);
    }
    return true;
  };

  /**
   * remove an issuer from the list of the
   * valid issuers. If there is no
   * issuer in the list returns true.
   *
   * @static
   * @param {string | number} type
   * @returns {(boolean | Error)}
   * @memberof SwarmMessageSubclassValidator
   */
  public removeType(type: TType): boolean | Error {
    const { typesList } = this;

    commonUtilsArrayDeleteFromArray(typesList, type);
    return true;
  }

  /**
   * Checks whether the list of valid types is defined and not empty.
   * If it is then checks if the type is into the list.
   *
   * @static
   * @param {string| number} type
   * @returns
   * @memberof SwarmMessageSubclassValidator
   */
  public checkTypeInList(type: TType): boolean | Error {
    const { typesList } = this;

    if (typesList && typesList.length && !typesList.includes(type)) {
      return new Error('The type is not into the list of the valid types');
    }
    return true;
  }

  /**
   * check the Type value format and
   * if the type is in the list of the
   * valid types
   *
   * @param {string | number} type
   * @memberof SwarmMessageSubclassValidator
   */
  public validateType(type: TType): boolean | Error {
    const formatValidationResult = this.validateTypeFormat(type);

    if (formatValidationResult instanceof Error) {
      return formatValidationResult;
    }

    const isTypeInTheList = this.checkTypeInList(type);

    if (isTypeInTheList instanceof Error) {
      return isTypeInTheList;
    }
    return true;
  }

  /**
   * validates if the user identity is a valid
   * central authority identity
   *
   * @param {((
   *             TCentralAuthorityUserCryptoCredentials
   *             | TCentralAuthorityUserIdentity
   *             | ICAUserUniqueIdentifierDescriptionWithOptionalVersion
   *         ))} userId
   * @returns {(boolean | Error)}
   * @memberof SwarmMessageSubclassValidator
   */
  public validateUserIdentifier(
    userId:
      | TCentralAuthorityUserCryptoCredentials
      | TCentralAuthorityUserIdentity
      | ICAUserUniqueIdentifierDescriptionWithOptionalVersion
  ): boolean | Error {
    if (!userId) {
      return new Error('User id must be specified');
    }
    if (!(userId instanceof CentralAuthorityIdentity) && userId !== 'string') {
      return new Error(
        'User id must be a string or an instance of the CentralAuthorityIdentity'
      );
    }

    const uid = new CentralAuthorityIdentity(userId);

    if (!uid.isValid) {
      return new Error('The user identity is not valid');
    }
    return true;
  }

  /**
   * validates if the payload is an instance
   * of the Buffer-compatible types or a string.
   * And checks the length of the payload value
   * to be less than the max and greater than the
   * min
   *
   * @param {} pld
   * @returns {string | number[] | Uint8Array | ArrayBuffer | SharedArrayBuffer}
   * @memberof SwarmMessageSubclassValidator
   */
  public validatePayload(pld: TPayload): boolean | Error {
    if (!pld) {
      return new Error('A payload must be specified');
    }

    const { payloadMaxLength, payloadMinLength } = this;
    let len;

    if (pld instanceof Array) {
      len = commonUtilsArrayCalculateLengthOfIntegerArray(pld, 255, 0);

      if (len instanceof Error) {
        console.error(len);
        return new Error(
          'The value of the payload is not a valid array with byte-length integers'
        );
      }
    } else if (typeof pld === 'string') {
      len = pld.length;
    } else if (pld instanceof Uint8Array) {
      len = pld.buffer.byteLength;
    } else if (pld instanceof ArrayBuffer) {
      len = pld.byteLength;
    } else if (pld instanceof SharedArrayBuffer) {
      len = pld.byteLength;
    } else {
      return new Error(
        'The payload value must be a string, an instance of a byte-integers Array, Uint8Array, ArrayBuffer or SharedArrayBuffer'
      );
    }
    if (typeof len !== 'number') {
      return new Error(
        'Unknown error has occurred while calculating the lenght of the payload'
      );
    }
    if (Number.isFinite(len)) {
      return new Error('The length of the payload is too big');
    }
    if (len > payloadMaxLength) {
      return new Error('The payload value is too big');
    }
    if (len < payloadMinLength) {
      return new Error('The payload value is too small');
    }
    return true;
  }

  /**
   * validate the timestamp format and
   * check whether it within the ttl defined
   *
   * @param {number} timestamp
   * @returns {(Error | boolean)}
   * @memberof SwarmMessageSubclassValidator
   */
  public validateTimestamp(timestamp: number): Error | boolean {
    if (!timestamp) {
      return new Error('Timestamp must be defined');
    }
    if (typeof timestamp !== 'number') {
      return new Error('Timestamp must be a number');
    }

    return true;
  }

  /**
   * set the options
   *
   * @protected
   * @param {IMessageValidatorOptions} options
   * @memberof SwarmMessageSubclassValidator
   * @throws
   */
  protected setOptions(options: IMessageValidatorOptions) {
    if (options) {
      if (typeof options !== 'object') {
        throw new Error('The options must be an object');
      }

      const {
        payloadMaxLength,
        payloadMinLength,
        issuersList,
        typesList,
        ttlSeconds,
      } = options;

      if (ttlSeconds) {
        if (typeof ttlSeconds !== 'number') {
          throw new Error('The time to live must be a number');
        }
        this.ttlSeconds = ttlSeconds; // set time to live in milliseconds
      }
      if (payloadMaxLength) {
        if (typeof payloadMaxLength === 'number') {
          this.payloadMaxLength = payloadMaxLength;
        } else {
          throw new Error(
            'The value of the "payloadMaxLength" option must be a number'
          );
        }
      }
      if (payloadMinLength) {
        if (typeof payloadMinLength === 'number') {
          this.payloadMinLength = payloadMinLength;
        } else {
          throw new Error(
            'The value of the "payloadMinLength" option must be a number'
          );
        }
      }
      if (issuersList) {
        if (issuersList instanceof Array) {
          const setIssuersListResult = commonUtilsArrayDoCallbackTillNoError<
            string
          >(issuersList, this.addIssuer);

          if (setIssuersListResult instanceof Error) {
            throw setIssuersListResult;
          }
        } else {
          throw new Error(
            'The value of the "issuersList" option must be an Array'
          );
        }
      }
      if (typesList) {
        if (typesList instanceof Array) {
          const setTypesListResult = commonUtilsArrayDoCallbackTillNoError<
            TType
          >(typesList, this.addType);

          if (setTypesListResult instanceof Error) {
            throw setTypesListResult;
          }
        } else {
          throw new Error(
            'The value of the "typesList" option must be an Array'
          );
        }
      }
    }
  }
}
