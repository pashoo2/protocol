import { __awaiter } from "tslib";
import assert from 'assert';
import { isCryptoKeyDataDecryption } from '@pashoo2/crypto-utilities';
import { QueuedEncryptionClassBase } from '../../../basic-classes/queued-encryption-class-base/queued-encryption-class-base';
export class SwarmMessageSubclassParser {
    constructor(options) {
        this.parse = (message) => __awaiter(this, void 0, void 0, function* () {
            const messageRaw = yield this.parseMessageToRaw(message);
            const messageParsed = yield this.parseMessageRaw(messageRaw);
            return this.getSwarmMessageInstance(messageParsed, message);
        });
        this.setOptions(options);
        this.startMessageDecryptQueue();
    }
    get options() {
        if (!this.constructorOptions) {
            throw new Error('The options is not defined for the instance');
        }
        return this.constructorOptions;
    }
    get messageDecryptQueueOptions() {
        return Object.assign(Object.assign({}, this.options.queueOptions), { keys: {
                decryptKey: this.options.decryptionKey,
            } });
    }
    validateOptions(options) {
        assert(options, 'Options must be provided');
        assert(typeof options === 'object', 'The options provided must be an object');
        const { utils, validator, decryptionKey } = options;
        assert(utils, 'Utils must be provided');
        assert(typeof utils === 'object', 'Utils must be an object');
        assert(typeof utils.messageBodyRawParser === 'function', 'messageBodyRawParser utility must be a function');
        assert(typeof utils.messageParser === 'function', 'messageParser utility must be a function');
        assert(validator, 'Validator is not provided');
        assert(typeof validator.valiadateSwarmMessageRaw === 'function', 'Validator incorrectly implements the interface, cause the valiadateSwarmMessageRaw method is absent');
        assert(typeof validator.valiadateSwarmMessage === 'function', 'Validator incorrectly implements the interface, cause the valiadateSwarmMessage method is absent');
        if (!decryptionKey) {
            console.warn('There is no key for private messages decryption provided in options');
        }
        else {
            assert(isCryptoKeyDataDecryption(decryptionKey), "The key provided can't be used for data decryption");
        }
    }
    setOptions(options) {
        this.validateOptions(options);
        this.constructorOptions = options;
        this.encryptedCache = options.encryptedCache;
    }
    startMessageDecryptQueue() {
        this.msgDecryptQueue = new QueuedEncryptionClassBase(this.messageDecryptQueueOptions);
    }
    parseMessageToRaw(mesage) {
        return __awaiter(this, void 0, void 0, function* () {
            const { utils, validator } = this.options;
            const { messageParser } = utils;
            const messageRaw = messageParser(mesage);
            yield validator.valiadateSwarmMessageRaw(messageRaw);
            return messageRaw;
        });
    }
    parseMessageRaw(messageRaw) {
        return __awaiter(this, void 0, void 0, function* () {
            const { utils, validator } = this.options;
            const { messageBodyRawParser } = utils;
            const { bdy: bodyRaw, isPrivate } = messageRaw;
            let bodyRawDecrypted;
            if (isPrivate) {
                validator.validateMessageBodyEncrypted(messageRaw.bdy);
                const msgBody = yield this.readMessgeBodyFromCache(messageRaw.sig);
                if (typeof msgBody === 'string') {
                    bodyRawDecrypted = msgBody;
                }
            }
            if (!bodyRawDecrypted) {
                bodyRawDecrypted = isPrivate ? yield this.decryptMessageBodyRaw(bodyRaw) : bodyRaw;
            }
            const bodyRawParsed = messageBodyRawParser(bodyRawDecrypted);
            const swarmMessage = Object.assign(Object.assign({}, messageRaw), { bdy: bodyRawParsed });
            validator.valiadateSwarmMessage(swarmMessage);
            return swarmMessage;
        });
    }
    decryptMessageBodyRaw(bodyRaw) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.msgDecryptQueue) {
                throw new Error('Message decrypt queue must be started to read private messgaes');
            }
            const decryptedBody = yield this.msgDecryptQueue.decryptData(bodyRaw);
            if (decryptedBody instanceof Error) {
                console.error('Failed to decrypt the private message');
                throw decryptedBody;
            }
            if (!decryptedBody) {
                throw new Error('No data got after message was decrypted');
            }
            return decryptedBody;
        });
    }
    getSwarmMessageInstance(msg, msgSerizlized) {
        return Object.assign(Object.assign({}, msg), { toString: function (a) {
                return a;
            }.bind(undefined, msgSerizlized) });
    }
    readMessgeBodyFromCache(sig) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.encryptedCache) {
                return this.encryptedCache.get(sig);
            }
        });
    }
}
//# sourceMappingURL=swarm-message-subclass-parser.js.map