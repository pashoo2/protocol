import { ISwarmMessageSubclassRawConstructorOptions } from './swarm-message-subclass-raw-constructor.types';

export class SwarmMessageSubclassRawConstructor {
    constructor(options: ISwarmMessageSubclassRawConstructorOptions) {

    }

    protected validateOptions(options: ISwarmMessageSubclassRawConstructorOptions): Error | boolean {
        if (!options) {
            return new Error('An options must be provided');
        }
        if (typeof options !== 'object') {
            return new Error('The options must be an object');
        }

        const {
            typ: string | number;
            pld: string | Buffer;
            uid: string;
            iss: string;
            k: CryptoKey;
        } = options;

        if (!typ) {
            return new Error();
        }
    }
}