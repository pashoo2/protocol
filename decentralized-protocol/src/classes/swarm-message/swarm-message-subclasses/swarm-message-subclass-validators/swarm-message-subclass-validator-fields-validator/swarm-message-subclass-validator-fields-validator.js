import assert from 'assert';
import { commonUtilsArrayDeleteFromArray, commonUtilsArrayDoCallbackTillNoError } from "../../../../../utils/common-utils";
import { validateIssuerDesirizlizedFormat } from './swarm-message-subclass-validator-fields-validator-validators/swarm-message-subclass-validator-fields-validator-validator-issuer-deserizlied/swarm-message-subclass-validator-fields-validator-validator-issuer-deserizlied';
import validateIssuerSerializedFormat from './swarm-message-subclass-validator-fields-validator-validators/swarm-message-subclass-validator-fields-validator-validator-issuer-serialized/swarm-message-subclass-validator-fields-validator-validator-issuer-serialized';
import validateTypeFormat from './swarm-message-subclass-validator-fields-validator-validators/swarm-message-subclass-validator-fields-validator-validator-type/swarm-message-subclass-validator-fields-validator-validator-type';
import { validateUserIdentifier } from '../../../../central-authority-class/central-authority-class-user-identity/central-authority-class-user-identity-validators/central-authority-common-validator-user-identifier';
import { createValidatePayload } from './swarm-message-subclass-validator-fields-validator-validators/swarm-message-subclass-validator-fields-validator-validator-payload';
import { createValidateTimestamp } from './swarm-message-subclass-validator-fields-validator-validators/swarm-message-subclass-validator-fields-validator-validator-timestamp';
import { CA_USER_IDENTITY_VERSIONS_LIST } from '../../../../central-authority-class/central-authority-class-user-identity/central-authority-class-user-identity.const';
import { validateMessageBodyRawFormat } from './swarm-message-subclass-validator-fields-validator-validators/swarm-message-subclass-validator-fields-validator-body-raw/swarm-message-subclass-validator-fields-validator-body-raw';
import { validateMessageSignatureFormat } from './swarm-message-subclass-validator-fields-validator-validators/swarm-message-subclass-validator-fields-validator-signature/swarm-message-subclass-validator-fields-validator-signature';
import { SWARM_MESSAGE_SUBCLASS_VALIDATOR_BODY_ENCRYPTED_MAX_LENGTH_BYTES, SWARM_MESSAGE_SUBCLASS_VALIDATOR_BODY_ENCRYPTED_MIN_LENGTH_BYTES, } from '../swarm-message-subclass-validator.const';
export class SwarmMessageSubclassFieldsValidator {
    constructor(options) {
        this.issuersList = [];
        this.supportedUserIdentifierVer = CA_USER_IDENTITY_VERSIONS_LIST;
        this.typesList = [];
        this.addIssuerToValidList = (issuer) => {
            const { issuersList } = this;
            validateIssuerDesirizlizedFormat(issuer);
            if (!issuersList.includes(issuer)) {
                issuersList.push(issuer);
            }
        };
        this.addType = (type) => {
            const { typesList } = this;
            validateTypeFormat(type, typesList);
        };
        this.validateUserIdentifier = (userId) => {
            validateUserIdentifier(userId, this.supportedUserIdentifierVer);
        };
        this.setOptions(options);
        this.validatePayload = createValidatePayload(this.payloadValidationOptions);
        this.validateTimestamp = createValidateTimestamp(this.timestampValidationOptions);
    }
    validateMessageBody(messageBody) {
        assert(!!messageBody, 'Message body must be defined');
        assert(typeof messageBody === 'object', 'Message body must be an object');
        const { iss, pld, ts, typ } = messageBody;
        this.validateType(typ);
        this.validateIssuer(iss);
        this.validatePayload(pld);
        this.validateTimestamp(ts);
    }
    validateMessageBodyEncrypted(messsageBodyEncrypted) {
        assert(!!messsageBodyEncrypted, 'Message body must be specefied');
        assert(typeof messsageBodyEncrypted === 'string', 'Message body must be a string for a private messages');
        assert(messsageBodyEncrypted.length < SWARM_MESSAGE_SUBCLASS_VALIDATOR_BODY_ENCRYPTED_MAX_LENGTH_BYTES, 'Private message body is increased the maximum length');
        assert(messsageBodyEncrypted.length > SWARM_MESSAGE_SUBCLASS_VALIDATOR_BODY_ENCRYPTED_MIN_LENGTH_BYTES, 'Private message body is less then the minimal length');
    }
    validateMessage(message) {
        assert(!!message, 'Message must be defined');
        assert(typeof message === 'object', 'Message must be an object');
        const { bdy, uid, sig, isPrivate } = message;
        validateMessageSignatureFormat(sig);
        this.validateUserIdentifier(uid);
        this.validateIsPrivateField(isPrivate);
        this.validateMessageBody(bdy);
    }
    validateMessageRaw(messageRaw) {
        assert(!!messageRaw, 'Message must be defined');
        assert(typeof messageRaw === 'object', 'Message must be an object');
        const { bdy, uid, sig } = messageRaw;
        validateMessageBodyRawFormat(bdy);
        validateMessageSignatureFormat(sig);
        this.validateUserIdentifier(uid);
    }
    removeIssuerFromValidList(issuer) {
        const { issuersList } = this;
        if (typeof issuer !== 'string') {
            return new Error('The issuer must be a string');
        }
        commonUtilsArrayDeleteFromArray(issuersList, issuer);
        return true;
    }
    checkIssuerIsInList(issuer) {
        const { issuersList } = this;
        assert(!issuersList.length || issuersList.includes(issuer), 'The issuer is not into the list of the valid issuers');
    }
    validateIsPrivateField(isPrivateField) {
        if (isPrivateField != null) {
            assert(isPrivateField === true, 'Is private value must be a "true"');
        }
    }
    validateIssuer(issuer) {
        validateIssuerSerializedFormat(issuer);
        this.checkIssuerIsInList(issuer);
    }
    removeType(type) {
        const { typesList } = this;
        commonUtilsArrayDeleteFromArray(typesList, type);
    }
    checkTypeInList(type) {
        const { typesList } = this;
        assert(!typesList.length || typesList.includes(type), 'The type is not into the list of the valid types');
    }
    validateType(type) {
        validateTypeFormat(type);
        this.checkTypeInList(type);
    }
    setOptions(options) {
        if (options != null) {
            assert(typeof options === 'object', 'The options must be an object');
            const { supportedUserIdentifierVer, payloadValidationOptions, issuersList, typesList, timestampValidationOptions, } = options;
            if (timestampValidationOptions) {
                this.timestampValidationOptions = timestampValidationOptions;
                this.validateTimestamp = createValidateTimestamp(timestampValidationOptions);
            }
            if (payloadValidationOptions) {
                this.payloadValidationOptions = payloadValidationOptions;
                this.validatePayload = createValidatePayload(payloadValidationOptions);
            }
            if (supportedUserIdentifierVer instanceof Array) {
                this.supportedUserIdentifierVer = supportedUserIdentifierVer.map((userIdentifierVersion) => {
                    if (typeof userIdentifierVersion === 'string') {
                        return userIdentifierVersion;
                    }
                    assert.fail(`The version ${userIdentifierVersion} must be a string`);
                });
            }
            if (issuersList) {
                if (issuersList instanceof Array) {
                    const setIssuersListResult = commonUtilsArrayDoCallbackTillNoError(issuersList, this.addIssuerToValidList);
                    if (setIssuersListResult instanceof Error) {
                        assert.fail(setIssuersListResult);
                    }
                }
                else {
                    assert.fail('The value of the "issuersList" option must be an Array');
                }
            }
            if (typesList) {
                if (typesList instanceof Array) {
                    const setTypesListResult = commonUtilsArrayDoCallbackTillNoError(typesList, this.addType);
                    if (setTypesListResult instanceof Error) {
                        throw setTypesListResult;
                    }
                }
                else {
                    assert.fail('The value of the "typesList" option must be an Array');
                }
            }
        }
    }
}
export default SwarmMessageSubclassFieldsValidator;
//# sourceMappingURL=swarm-message-subclass-validator-fields-validator.js.map