import { ISwarmMessageConstructorUtils, ESwarmMessageSignatureAlgorithms } from './swarm-message-constructor.types';
import { ISwarmMessageSerializerConstructorOptions } from './swarm-message-subclasses/swarm-message-subclass-serializer/swarm-message-subclass-serializer.types';
export declare const SWARM_MESSAGE_CONSTRUCTOR_OPTIONS_DEFAULTS_UTILS: ISwarmMessageConstructorUtils;
export declare const SWARM_MESSAGE_CONSTRUCTOR_OPTIONS_DEFAULTS_QUEUE_OPTIONS: ISwarmMessageSerializerConstructorOptions['queueOptions'];
export declare const SWARM_MESSAGE_CONSTRUCTOR_OPTIONS_DEFAULTS_SERIALIZER: {
    alg: ESwarmMessageSignatureAlgorithms;
    queueOptions: Required<import("@pashoo2/async-queue").IAsyncQueueBaseClassOptions>;
};
export declare const SWARM_MESSAGE_CONSTRUCTOR_OPTIONS_DEFAULTS_VALIDATION: {
    formatValidatorOpts: {};
    signatureValidationOpts: {
        algSupported: ESwarmMessageSignatureAlgorithms;
        utils: ISwarmMessageConstructorUtils;
        queueOptions: Required<import("@pashoo2/async-queue").IAsyncQueueBaseClassOptions>;
    };
};
//# sourceMappingURL=swarm-message-constructor.const.d.ts.map