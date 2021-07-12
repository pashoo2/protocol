import { TCryptoUtilEncryptDataTypes, TDataSignUtilSignDataTypes, TDataSignUtilVerifyDataTypes } from '@pashoo2/crypto-utilities';
import { IAsyncQueueBaseClassOptions } from '../async-queue-class-base';
export interface IQueuedEncryptionClassBaseOptions {
    keys?: {
        signKey?: CryptoKey;
        decryptKey?: CryptoKey;
        encryptKey?: CryptoKey;
    };
    queueOptions?: IAsyncQueueBaseClassOptions;
}
export interface IQueuedEncryptionClassBase {
    encryptData(data: TCryptoUtilEncryptDataTypes, key?: CryptoKey): Promise<string | Error>;
    decryptData(data: TCryptoUtilEncryptDataTypes, key?: CryptoKey): Promise<string | Error>;
    signData(data: TDataSignUtilSignDataTypes, key?: CryptoKey): Promise<string | Error>;
    verifyData(data: TDataSignUtilVerifyDataTypes, signature: TDataSignUtilVerifyDataTypes, key: CryptoKey): Promise<boolean | Error>;
}
//# sourceMappingURL=queued-encryption-class-base.types.d.ts.map