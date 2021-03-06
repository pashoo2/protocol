import { IQueuedEncryptionClassBase } from '../queued-encryption-class-base.types';
import { generatePasswordKeyByPasswordString } from '@pashoo2/crypto-utilities';
import { IAsyncQueueBaseClassOptions } from '../../async-queue-class-base';
import { QueuedEncryptionClassBase } from '../queued-encryption-class-base';

/**
 * Creates queued encryption class by a password string
 * and a salt string.
 *
 * @export
 * @param {string} passwordString
 * @param {string} salt
 * @param {IAsyncQueueBaseClassOptions} [queueOptions]
 * @returns {Promise<IQueuedEncryptionClassBase>}
 */
export async function getQueuedEncryptionClassByPasswordStringAndSalt(
  passwordString: string,
  salt: string,
  queueOptions?: IAsyncQueueBaseClassOptions
): Promise<IQueuedEncryptionClassBase> {
  const passwordKey = await generatePasswordKeyByPasswordString(passwordString, salt);

  if (passwordKey instanceof Error) {
    throw passwordKey;
  }

  const encryptionQueue = new QueuedEncryptionClassBase({
    keys: {
      decryptKey: passwordKey,
      encryptKey: passwordKey,
    },
    queueOptions,
  });
  return encryptionQueue;
}
