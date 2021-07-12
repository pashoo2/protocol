import { __awaiter } from "tslib";
import assert from 'assert';
import { isCryptoKeyDataVerify } from '@pashoo2/crypto-utilities';
import { QueuedEncryptionClassBase } from '../../../../basic-classes/queued-encryption-class-base/queued-encryption-class-base';
import { swarmMessageUtilSignatureGetStringForSignByMessageRaw } from '../../../swarm-message-utils/swarm-message-utils-signature/swarm-message-utils-signature';
export class SwarmMessgeSubclassSignatureValidator {
    constructor(options) {
        this.signaturesValidatedCache = {};
        this.validateSignature = (messageRaw) => __awaiter(this, void 0, void 0, function* () {
            this.validateRawMessageFormat(messageRaw);
            const { uid } = messageRaw;
            const userSignPubKey = yield this.getSenderSignPubKey(uid);
            assert(isCryptoKeyDataVerify(userSignPubKey), 'Failed to get a valid key for the signature verification');
            assert(!((yield this.validateSig(messageRaw, userSignPubKey)) instanceof Error), 'The signature of the message is not valid');
        });
        this.setOptions(options);
        this.startSignatureVerificationQueue();
    }
    validateOptions(options) {
        assert(options, 'An options must be defined');
        assert(typeof options === 'object', 'The options must be an object');
        const { queueOptions, caConnection } = options;
        assert(!!caConnection, 'Central authority connection must be provided in options');
        assert(typeof caConnection.getSwarmUserSignPubKey === 'function', 'Central authority connection must have the method getSwarmUserSignPubKey');
        assert(options.utils, 'Utils must be provided in options');
        assert(typeof options.utils === 'object', 'Utils must be an object');
        if (queueOptions) {
            assert(typeof queueOptions === 'object', 'The queue options must be an object');
        }
        const { getDataToSignBySwarmMsg } = options.utils;
        assert(typeof getDataToSignBySwarmMsg === 'function', 'getDataToSignBySwarmMsg must be provided');
    }
    setOptions(options) {
        this.validateOptions(options);
        const { utils, queueOptions, algSupported, caConnection } = options;
        const { getDataToSignBySwarmMsg } = utils;
        this.caConnection = caConnection;
        this.queueOptions = queueOptions;
        this.getDataToSignBySwarmMsg = getDataToSignBySwarmMsg;
        this.algSupported = typeof algSupported === 'string' ? [algSupported] : algSupported;
    }
    startSignatureVerificationQueue() {
        this.signVerificationQueue = new QueuedEncryptionClassBase({
            queueOptions: this.queueOptions,
        });
    }
    validateRawMessageFormat(messageRaw) {
        assert(!!messageRaw, 'Message is not defined');
        assert(typeof messageRaw === 'object', 'Message must be an object');
        const { bdy, uid, sig, alg } = messageRaw;
        assert(!!bdy, 'A body of the message must be defined');
        assert(typeof bdy === 'string', 'Body of the message deserialized must be a string');
        assert(!!uid, 'A user identifier of the message must not be empty');
        assert(typeof uid === 'string', 'A user identifier of the message must be a string');
        assert(sig, 'A signature of the message must not be empty');
        assert(typeof sig === 'string', 'A signature of the message must be a string');
        assert(typeof alg === 'string', "Algorithm of the message's singature must be a string");
        assert(this.algSupported && this.algSupported.includes(alg), "The algorithm of the message's signature is not supported");
    }
    getSenderSignPubKey(uid) {
        assert(!!this.caConnection, 'there is no connection to the central authority to get the user public key for data sign');
        return !!this.caConnection && this.caConnection.getSwarmUserSignPubKey(uid);
    }
    getHashForSignature(sig) {
        return this.signaturesValidatedCache[sig];
    }
    addHashForSignature(sig, hash) {
        this.signaturesValidatedCache[sig] = hash;
    }
    validateSig(msgRaw, key) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = swarmMessageUtilSignatureGetStringForSignByMessageRaw(msgRaw);
            const sig = msgRaw.sig;
            const hashFromCache = !!sig && this.getHashForSignature(sig);
            if (hashFromCache) {
                if (hashFromCache === data) {
                    return true;
                }
                return new Error('Signature from the cache is not the same as provided');
            }
            assert(this.signVerificationQueue, 'signVerificationQueue is not started');
            const result = !!this.signVerificationQueue && (yield this.signVerificationQueue.verifyData(data, sig, key));
            if (result instanceof Error) {
                return result;
            }
            this.addHashForSignature(sig, data);
            return result;
        });
    }
}
//# sourceMappingURL=swarm-message-subclass-validator-signature-validator.js.map