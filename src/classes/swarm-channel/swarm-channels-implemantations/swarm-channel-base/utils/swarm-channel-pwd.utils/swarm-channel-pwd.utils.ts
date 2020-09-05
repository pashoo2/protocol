import {
  generatePasswordKeyByPasswordString,
  exportPasswordKeyAsString,
} from 'utils/password-utils/derive-key.password-utils';
import { extend } from 'utils/common-utils/common-utils-objects';
import { calculateHash } from 'utils/hash-calculation-utils';

import { TSwarmChannelId } from '../../../../swarm-channel.types';
import { SwarmChannelType } from '../../../../swarm-channel.const';
import { ISwarmChannelPwdUtilsOptions } from './swarm-channel-pwd.utils.types';
import { OPTIONS_PWD_UTILS_DEFAULT } from './swarm-channel-pwd.utils.const';

/**
 * Returns a new salt value used for
 * password's crypto key generation.
 * It must be a pure function with the
 * same result across all peers.
 *
 * @param {TSwarmChannelId} id
 * @param {SwarmChannelType} type
 * @param {ISwarmChannelPwdUtilsOptions} options
 * @returns
 */
const getSaltValueForCryptoChannel = (
  id: TSwarmChannelId,
  type: SwarmChannelType,
  options: ISwarmChannelPwdUtilsOptions
): string => {
  return `${id}${options.fieldsDelimeter}${type}`;
};

/**
 * Returns a new prefix value used for
 * password's hash calculation.
 * It must be a pure function with the
 * same result across all peers.
 *
 * @param {TSwarmChannelId} id
 * @param {SwarmChannelType} type
 * @param {ISwarmChannelPwdUtilsOptions} options
 * @returns
 */
const getPwdPrefixForHashCalculation = (
  id: TSwarmChannelId,
  type: SwarmChannelType,
  options: ISwarmChannelPwdUtilsOptions
): string => {
  return `${type}${options.fieldsDelimeter}${id}`;
};

/**
 * Returns a password prefixed string.
 * It must be a pure function with the
 * same result across all peers.
 *
 * @param {TSwarmChannelId} id
 * @param {SwarmChannelType} type
 * @param {ISwarmChannelPwdUtilsOptions} options
 * @returns
 */
const getPwdPrefixedForHashCalculation = (
  password: string,
  prefix: string,
  options: ISwarmChannelPwdUtilsOptions
): string => {
  return `${prefix}${options.fieldsDelimeter}${password}`;
};

/**
 * Returns options used by the module's functions.
 *
 * @param {ISwarmChannelPwdUtilsOptions} [options]
 * @returns {ISwarmChannelPwdUtilsOptions}
 */
const getPwdGenerationOptions = (
  options?: ISwarmChannelPwdUtilsOptions
): ISwarmChannelPwdUtilsOptions => {
  return options
    ? extend(options, OPTIONS_PWD_UTILS_DEFAULT)
    : OPTIONS_PWD_UTILS_DEFAULT;
};

/**
 * Generate a CryptoKey for a password string.
 *
 * @param {TSwarmChannelId} id - channel's id
 * @param {SwarmChannelType} type - channel's type
 * @param {string} passwordString - password as a string
 * @param {ISwarmChannelPwdUtilsOptions} [options=OPTIONS_DEFAULT] - options
 * @returns {Promise<CryptoKey>}
 * @throws
 */
export const generatePasswordKey = async (
  id: TSwarmChannelId,
  type: SwarmChannelType,
  passwordString: string,
  options?: ISwarmChannelPwdUtilsOptions
): Promise<CryptoKey> => {
  const opts = getPwdGenerationOptions(options);
  const salt = getSaltValueForCryptoChannel(id, type, opts);
  const passwordKey = await generatePasswordKeyByPasswordString(
    passwordString,
    salt
  );

  if (passwordKey instanceof Error) {
    throw new Error(
      `Failed to generate a crypto key for the password: ${passwordKey.message}`
    );
  }
  return passwordKey;
};

/**
 * Exports password's Crypto key as a strig
 *
 * @param {CryptoKey} passwordCryptoKey
 * @returns {Promise<string>}
 * @throws
 */
export const exportPasswordKey = async (
  passwordCryptoKey: CryptoKey
): Promise<string> => {
  const pwdCryptoKeyExported = await exportPasswordKeyAsString(
    passwordCryptoKey
  );

  if (pwdCryptoKeyExported instanceof Error) {
    throw new Error(
      `Failed to export channel password crypto key as a string: ${pwdCryptoKeyExported.message}`
    );
  }
  return pwdCryptoKeyExported;
};

/**
 * Returns a hash of the password.
 * It must be a pure function with
 * the same result across all peers.
 *
 * @param {TSwarmChannelId} id - channel's id
 * @param {SwarmChannelType} type - channel's type
 * @param {string} passwordString - password
 * @returns {Promise<string>}
 * @throws
 */
export const getPasswordHash = async (
  id: TSwarmChannelId,
  type: SwarmChannelType,
  passwordString: string,
  options?: ISwarmChannelPwdUtilsOptions
): Promise<string> => {
  const opts = getPwdGenerationOptions(options);
  const pwdPrefix = getPwdPrefixForHashCalculation(id, type, opts);
  const pwdWithPrefix = getPwdPrefixedForHashCalculation(
    passwordString,
    pwdPrefix,
    opts
  );
  const pwdHash = await calculateHash(pwdWithPrefix, opts.hashAlh);

  if (pwdHash instanceof Error) {
    throw new Error(
      `Failed to calculate hash for the password: ${pwdHash.message}`
    );
  }
  return pwdHash;
};
/**
 * Check whether the password's string
 * is valid and equals to the passwrod's
 * hash.
 * It must be a pure function with
 * the same result across all peers.
 *
 * @param {TSwarmChannelId} id - channel's id
 * @param {SwarmChannelType} type - channel'd type
 * @param {string} passwordString - password string
 * @param {string} passwordHash - password's hash string
 * @param {ISwarmChannelPwdUtilsOptions} [options]
 * @returns {Promise<boolean>}
 */
export const checkIsPasswordValid = async (
  id: TSwarmChannelId,
  type: SwarmChannelType,
  passwordString: string,
  passwordHash: string,
  options?: ISwarmChannelPwdUtilsOptions
): Promise<boolean> => {
  const passwordHashCalculated = await getPasswordHash(
    id,
    type,
    passwordString,
    options
  );
  return passwordHashCalculated === passwordHash;
};
