import { __awaiter } from "tslib";
import assert from 'assert';
import { extend, getDateNowInSeconds } from "../../utils";
import { SWARM_MESSAGE_CONSTRUCTOR_OPTIONS_DEFAULTS_SERIALIZER, SWARM_MESSAGE_CONSTRUCTOR_OPTIONS_DEFAULTS_UTILS, } from './swarm-message-constructor.const';
import { SwarmMessageSubclassParser } from './swarm-message-subclasses/swarm-message-subclass-parser/swarm-message-subclass-parser';
import { SwarmMessageSerializer } from './swarm-message-subclasses/swarm-message-subclass-serializer/swarm-message-subclass-serializer';
import { SwarmMessageSubclassValidator } from './swarm-message-subclasses/swarm-message-subclass-validators/swarm-message-subclass-validator';
import { SWARM_MESSAGE_CONSTRUCTOR_OPTIONS_DEFAULTS_VALIDATION } from './swarm-message-constructor.const';
export class SwarmMessageConstructor {
    constructor(options) {
        this.construct = (message) => __awaiter(this, void 0, void 0, function* () {
            assert(message, 'Message must not be empty');
            if (typeof message === 'string') {
                return yield this.parse(message);
            }
            else if (typeof message === 'object') {
                return yield this.serialize(message);
            }
            throw new Error('A message must be an object or a string');
        });
        this.setOptions(options);
    }
    get options() {
        if (!this.constructorOptions) {
            throw new Error('Options are not defined');
        }
        return this.constructorOptions;
    }
    get optionsForSwarmMessageParser() {
        const { options, validator } = this;
        if (!validator) {
            throw new Error('A swarm message validator instance is not running');
        }
        return {
            validator,
            utils: options.utils,
            encryptedCache: this.encryptedCache,
        };
    }
    get optionsForSwarmMessageSerizlizer() {
        const { options, validator } = this;
        if (!validator) {
            throw new Error('A swarm message validator instance is not running');
        }
        return Object.assign(Object.assign({}, SWARM_MESSAGE_CONSTRUCTOR_OPTIONS_DEFAULTS_SERIALIZER), { caConnection: options.caConnection, utils: options.utils, messageValidator: validator });
    }
    get optionsForSwarmMessageValidator() {
        const { options } = this;
        return options.validation;
    }
    validateOptions(options) {
        assert(options, 'An options must be defined');
        assert(typeof options === 'object', 'The options must be an object');
        const { utils, caConnection, instances, validation } = options;
        assert(caConnection, 'There is no connection to the central authority provided');
        assert(typeof caConnection === 'object', 'Connection to the central authority must be an object');
        assert(caConnection.isRunning === true, 'Connection to the central authority must be already running');
        assert(typeof caConnection.getUserIdentity === 'function', 'Connection to the central authority incorrectly implements the interface, cause there is no method to get the current user identity');
        if (utils) {
            assert(typeof utils === 'object', 'The utils must be an object');
        }
        if (validation) {
            assert(typeof validation === 'object', 'The validation options must be an object');
            if (validation.formatValidatorOpts) {
                assert(typeof validation.formatValidatorOpts === 'object', 'The formatValidatorOpts options must be an object');
            }
            if (validation.signatureValidationOpts) {
                assert(typeof validation.signatureValidationOpts === 'object', 'The signatureValidationOpts options must be an object');
            }
        }
        let warnAboutNoCryptoCache = true;
        if (instances) {
            assert(typeof instances === 'object', 'The instances must be an object');
            if (instances.parser) {
                assert(typeof instances.parser === 'object', 'A parser instance must be an object');
            }
            if (instances.serizlizer) {
                assert(typeof instances.serizlizer === 'object', 'A serizlizer instance must be an object');
            }
            if (instances.validator) {
                assert(typeof instances.validator === 'object', 'A validator instance must be an object');
            }
            if (instances.encryptedCache) {
                assert(typeof instances.encryptedCache === 'object', 'Encrypted cache storage must be an object');
                assert(typeof instances.encryptedCache.connect === 'function' &&
                    typeof instances.encryptedCache.add === 'function' &&
                    typeof instances.encryptedCache.get === 'function', 'Encrypted cache storage have a wrong implementation');
                this.encryptedCache = instances.encryptedCache;
                warnAboutNoCryptoCache = false;
            }
        }
        if (warnAboutNoCryptoCache) {
            console.warn('The encrypted cache must be provided to support private messages as decrypted');
        }
    }
    extendOptionsByDefaults(options) {
        return Object.assign(Object.assign({}, options), { validation: extend(options.validation || {}, Object.assign(Object.assign({}, SWARM_MESSAGE_CONSTRUCTOR_OPTIONS_DEFAULTS_VALIDATION), { signatureValidationOpts: Object.assign(Object.assign({}, SWARM_MESSAGE_CONSTRUCTOR_OPTIONS_DEFAULTS_VALIDATION.signatureValidationOpts), { caConnection: options.caConnection }) })), utils: extend(options.utils || {}, SWARM_MESSAGE_CONSTRUCTOR_OPTIONS_DEFAULTS_UTILS) });
    }
    runSwarmMessageValidator() {
        const { options } = this;
        const { instances } = options;
        this.validator =
            instances && instances.validator
                ? instances.validator
                : new SwarmMessageSubclassValidator(this.optionsForSwarmMessageValidator);
    }
    runSwarmMessageParser() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const { options } = this;
            const { instances } = options;
            const userRncryptionKeyPair = (_a = this.caConnection) === null || _a === void 0 ? void 0 : _a.getUserEncryptionKeyPair();
            if (!userRncryptionKeyPair) {
                throw new Error("Failed to get user's crypto key pair");
            }
            if (userRncryptionKeyPair instanceof Error) {
                throw userRncryptionKeyPair;
            }
            this.parser =
                instances && instances.parser
                    ? instances.parser
                    : new SwarmMessageSubclassParser(Object.assign(Object.assign({}, this.optionsForSwarmMessageParser), { decryptionKey: userRncryptionKeyPair.privateKey }));
        });
    }
    runSwarmMessageSerizlizer() {
        const { options } = this;
        const { instances } = options;
        this.serializer =
            instances && instances.serizlizer
                ? instances.serizlizer
                : new SwarmMessageSerializer(this.optionsForSwarmMessageSerizlizer);
    }
    setOptions(options) {
        this.validateOptions(options);
        this.caConnection = options.caConnection;
        this.constructorOptions = this.extendOptionsByDefaults(options);
        this.runSwarmMessageValidator();
        this.runSwarmMessageSerizlizer();
        void this.runSwarmMessageParser();
    }
    addPrivateMessageToCache(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            if (msg.isPrivate) {
                yield this.addPrivateMessageBodyToCache(msg.sig, msg.bdy);
            }
        });
    }
    parse(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.parser) {
                throw new Error('A swarm message parser instance is not defined');
            }
            const messageParsed = yield this.parser.parse(msg);
            if (messageParsed instanceof Error) {
                return messageParsed;
            }
            yield this.addPrivateMessageToCache(messageParsed);
            return messageParsed;
        });
    }
    serialize(msg) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.serializer) {
                throw new Error('A swarm message serializer instance is not defined');
            }
            const receiverId = msg.receiverId;
            let cryptoKey;
            if (receiverId) {
                if (!this.caConnection) {
                    throw new Error('There is no connection with the CentralAuthority');
                }
                const receiverPubKey = yield this.caConnection.getSwarmUserEncryptionPubKey(receiverId);
                if (receiverPubKey instanceof Error) {
                    console.error("Failed to get the user's public key");
                    throw receiverPubKey;
                }
                if (!receiverPubKey) {
                    throw new Error('There is no public crypto key of the receiver');
                }
                cryptoKey = receiverPubKey;
            }
            const bodyWithTs = Object.assign(Object.assign({}, msg), { ts: getDateNowInSeconds() });
            const swarmMessageSerialized = yield this.serializer.serialize(bodyWithTs, cryptoKey);
            const { sig, isPrivate } = swarmMessageSerialized;
            if (isPrivate) {
                yield this.addPrivateMessageBodyToCache(sig, bodyWithTs);
            }
            return swarmMessageSerialized;
        });
    }
    addPrivateMessageBodyToCache(sig, msgBody) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.encryptedCache && this.encryptedCache.isRunning) {
                yield this.encryptedCache.add(sig, JSON.stringify(msgBody));
            }
        });
    }
}
//# sourceMappingURL=swarm-message-constructor.js.map