import { TCryptoUtilEncryptDataTypes, TCryptoUtilDecryptDataTypes, TDataSignUtilSignDataTypes, TDataSignUtilVerifyDataTypes, TDataSignUtilVerifyDataTypesExtended } from '@pashoo2/crypto-utilities';
import { AsyncQueueClassBase, IAsyncQueueBaseClassOptions } from '../async-queue-class-base';
import { IQueuedEncryptionClassBase } from './queued-encryption-class-base.types';
import { IQueuedEncryptionClassBaseOptions } from './queued-encryption-class-base.types';
export declare class QueuedEncryptionClassBase implements IQueuedEncryptionClassBase {
    protected defaultKeys: Required<IQueuedEncryptionClassBaseOptions>['keys'];
    protected asyncQueue: AsyncQueueClassBase;
    constructor(options?: IQueuedEncryptionClassBaseOptions);
    encryptData: (data: TCryptoUtilEncryptDataTypes, key?: CryptoKey) => Promise<string | Error>;
    decryptData: (data: TCryptoUtilDecryptDataTypes, key?: CryptoKey) => Promise<string | Error>;
    signData: (data: TDataSignUtilSignDataTypes, key?: CryptoKey) => Promise<string | Error>;
    verifyData: (data: TDataSignUtilVerifyDataTypesExtended, signature: TDataSignUtilVerifyDataTypes, key: CryptoKey) => Promise<boolean | Error>;
    protected startAsyncQueue(options?: IAsyncQueueBaseClassOptions): void;
    protected setOptions(options?: IQueuedEncryptionClassBaseOptions): void;
    protected addInQueue<T>(cb: () => Promise<T>): Promise<Error | T | (T extends any[] ? (Error | T)[] : never)>;
}
//# sourceMappingURL=queued-encryption-class-base.d.ts.map