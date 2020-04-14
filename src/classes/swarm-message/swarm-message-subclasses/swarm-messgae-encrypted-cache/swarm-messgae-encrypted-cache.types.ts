import { TSwarmMessageBodyRaw } from '../../swarm-message-constructor.types';

/**
 * This is a cache of the messages decrypted
 * and signatures already validated.
 * It usefull to store messages body decrypted,
 * which was encrypted with a receiver user
 * public key, and sent to it. But this
 * message can't be decrypted cause there is
 * no receiver private key we know.
 *
 * Also it may be usefull to store messages signatures
 * already validated.
 *
 * @export
 * @interface ISwarmMessgaeEncryptedCache
 */
export interface ISwarmMessgaeEncryptedCache {
  get(sig: string): Promise<TSwarmMessageBodyRaw | undefined>;
  isValid(sig: boolean): Promise<boolean>;
}
