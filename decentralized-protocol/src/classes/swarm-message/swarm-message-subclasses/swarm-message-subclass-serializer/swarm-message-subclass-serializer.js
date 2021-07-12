import { __awaiter } from "tslib";
import assert from 'assert';
import { isCryptoKeyDataSign } from '@pashoo2/crypto-utilities';
import { QueuedEncryptionClassBase } from '../../../basic-classes/queued-encryption-class-base/queued-encryption-class-base';
import CentralAuthorityIdentity from '../../../central-authority-class/central-authority-class-user-identity/central-authority-class-user-identity';
import { typedArrayToString } from '../../../../utils/typed-array-utils';
export class SwarmMessageSerializer {
    constructor(options) {
        this.serialize = (msgBody, encryptWithKey) => __awaiter(this, void 0, void 0, function* () {
            this.validateMessageBody(msgBody);
            const swarmMessageBody = this.serializeMessageBody(msgBody);
            const bodySeriazlized = yield this.getMessageBodySerialized(swarmMessageBody, encryptWithKey);
            const swarmMessageNotSigned = this.getMessageRawWithoutSignature(bodySeriazlized);
            const signature = yield this.signSwarmMessageRaw(swarmMessageNotSigned);
            if (signature instanceof Error) {
                throw new Error('Failed to sign the message');
            }
            return this.getMessageSignedSerialized(swarmMessageNotSigned, swarmMessageBody, signature, !!encryptWithKey);
        });
        this.setConstructorOptions(options);
    }
    get options() {
        if (!this.constructorOptions) {
            throw new Error('Options are not defined');
        }
        return this.constructorOptions;
    }
    get messageEncryptAndSignQueueOptions() {
        const { user } = this;
        if (!user) {
            throw new Error("The current user's infromation is not defined");
        }
        return Object.assign(Object.assign({}, this.options.queueOptions), { keys: {
                signKey: user.dataSignKey,
            } });
    }
    validateConstructorOptions(options) {
        assert(!!options, 'The options must be defined');
        assert(typeof options === 'object', 'The options must be an object');
        assert(options.messageValidator, 'Message field validator must be defined');
        assert(typeof options.messageValidator.validateMessageBody === 'function', 'Message field validator incorrectly implements interface, cause there is no "validateMessageBody method"');
        assert(options.caConnection, 'Connection to the CentralAuthority is not provided');
        assert(typeof options.alg === 'string', 'The algorithm value must be a string');
        const { utils } = options;
        assert(utils, 'Utils must be provided in options');
        assert(typeof utils.getDataToSignBySwarmMsg === 'function', 'getDataToSignBySwarmMsg function must be provided in utils option');
        assert(typeof utils.swarmMessageBodySerializer === 'function', 'swarmMessageBodySerializer function must be provided in utils option');
        assert(typeof utils.swarmMessageSerializer === 'function', 'swarmMessageSerializer function must be provided in utils option');
    }
    setUserInfo() {
        const { caConnection } = this.options;
        const currentUserId = caConnection.getUserIdentity();
        assert(!(currentUserId instanceof Error), 'Failed to read an identity of the crurrent user from connection to the central authority');
        const userIdSerialized = new CentralAuthorityIdentity(currentUserId).identityDescritptionSerialized;
        assert(!(userIdSerialized instanceof Error), 'The user identity serialized is not valid');
        const dataSignCryptoKeyPair = caConnection.getUserDataSignKeyPair();
        if (dataSignCryptoKeyPair instanceof Error) {
            throw new Error('Failed to read data sign key pairs of the current user from a connection to the central authority');
        }
        const dataSignKey = isCryptoKeyDataSign(dataSignCryptoKeyPair.privateKey)
            ? dataSignCryptoKeyPair.privateKey
            : dataSignCryptoKeyPair.publicKey;
        assert(isCryptoKeyDataSign(dataSignKey), 'There is not key may used for data signing returned by the conntion to the central authority');
        this.user = {
            dataSignKey: dataSignCryptoKeyPair.privateKey,
            userId: userIdSerialized,
        };
    }
    startMessagesSigningQueue() {
        this.msgSignEncryptQueue = new QueuedEncryptionClassBase(this.messageEncryptAndSignQueueOptions);
    }
    setConstructorOptions(options) {
        this.validateConstructorOptions(options);
        this.constructorOptions = options;
        this.setUserInfo();
        this.startMessagesSigningQueue();
    }
    validateMessageBody(msgBody) {
        const { messageValidator } = this.options;
        messageValidator.validateMessageBody(msgBody);
    }
    serializeMessageBody(msgBody) {
        let msgPayload;
        const { pld } = msgBody;
        if (pld instanceof ArrayBuffer) {
            msgPayload = typedArrayToString(pld);
            assert(typeof msgPayload === 'string', 'Failed to convert message payload from Buffer to string');
        }
        else {
            msgPayload = pld;
        }
        return Object.assign(Object.assign({}, msgBody), { pld: msgPayload });
    }
    getMessageBodySerialized(msgBody, encryptWithKey) {
        return __awaiter(this, void 0, void 0, function* () {
            const { utils } = this.options;
            const bodyRaw = utils.swarmMessageBodySerializer(msgBody);
            return encryptWithKey ? yield this.encryptMessageBodyRaw(bodyRaw, encryptWithKey) : bodyRaw;
        });
    }
    encryptMessageBodyRaw(msgBody, encryptWithKey) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const encrypted = yield ((_a = this.msgSignEncryptQueue) === null || _a === void 0 ? void 0 : _a.encryptData(msgBody, encryptWithKey));
            if (encrypted instanceof Error) {
                console.error('Failed to encrypt the message body');
                throw encrypted;
            }
            if (!encrypted) {
                throw new Error('Failed to encrype the message body cause an unknown error');
            }
            return encrypted;
        });
    }
    getMessageRawWithoutSignature(msgBodySerialized) {
        if (!this.user) {
            throw new Error('The current user data is not defined');
        }
        return {
            bdy: msgBodySerialized,
            alg: this.options.alg,
            uid: this.user.userId,
        };
    }
    signSwarmMessageRaw(msgRawUnsigned) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.user) {
                throw new Error('The user info is not defined');
            }
            if (!this.msgSignEncryptQueue) {
                throw new Error('The messages sign queue was not started');
            }
            const { utils } = this.options;
            const dataToSign = utils.getDataToSignBySwarmMsg(msgRawUnsigned);
            return yield this.msgSignEncryptQueue.signData(dataToSign, this.user.dataSignKey);
        });
    }
    getMessageSignedSerialized(msgRawUnsigned, msgBody, signature, isPrivate) {
        const { utils } = this.options;
        const swarmMessage = Object.assign(Object.assign({}, msgRawUnsigned), { sig: signature });
        if (isPrivate) {
            swarmMessage.isPrivate = isPrivate;
        }
        return Object.assign(Object.assign({}, swarmMessage), { bdy: msgBody, toString: utils.swarmMessageSerializer.bind(undefined, swarmMessage) });
    }
}
//# sourceMappingURL=swarm-message-subclass-serializer.js.map