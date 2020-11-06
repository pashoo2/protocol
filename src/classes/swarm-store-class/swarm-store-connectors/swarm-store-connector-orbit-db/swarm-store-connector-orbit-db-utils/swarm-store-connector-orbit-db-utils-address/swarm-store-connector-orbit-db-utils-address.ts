import { relative } from 'path';
import OrbitDbAddress from 'orbit-db/src/orbit-db-address';
import assert from 'assert';

import { calculateHash } from 'utils/hash-calculation-utils/hash-calculation-utils';

import { ISwarmStoreConnectorOrbitDbUtilsAddressCreateRootPathOptions } from './swarm-store-connector-orbit-db-utils-address.types';

import { HASH_CALCULATION_UTILS_HASH_ALHORITHM } from 'utils';
import { SWARM_STORE_CONNECTOR_ORITDB_UTILS_ADDRESS_FULL_PSATH_HASH_CALC_METHOD } from './swarm-store-connector-orbit-db-utils-address.const';
import {
  SWARM_STORE_CONNECTOR_ORITDB_UTILS_ADDRESS_DIRECTORY_HASH_CALC_METHOD,
  SWARM_STORE_CONNECTOR_ORITDB_UTILS_ADDRESS_USER_ID_HASH_CALC_METHOD,
  SWARM_STORE_CONNECTOR_ORITDB_UTILS_ADDRESS_DBNAME_HASH_CALC_METHOD,
  SWARM_STORE_CONNECTOR_ORITDB_UTILS_ADDRESS_ORBITDB_PATH_PREFIX,
} from './swarm-store-connector-orbit-db-utils-address.const';

export function checkIfPathStartedWithSlash(path: string): boolean {
  return path.startsWith('/') || path.startsWith('\\');
}

export function addStartSlash(path: string): string {
  if (checkIfPathStartedWithSlash(path)) {
    return path;
  }
  if (path.includes('\\') && !path.includes('/')) {
    return `\\${path}`;
  }
  return `/${path}`;
}

export function removeDuplicateOrbitDBPrefixInPath(path: string): string {
  if (
    path.indexOf(SWARM_STORE_CONNECTOR_ORITDB_UTILS_ADDRESS_ORBITDB_PATH_PREFIX) !==
    path.lastIndexOf(SWARM_STORE_CONNECTOR_ORITDB_UTILS_ADDRESS_ORBITDB_PATH_PREFIX)
  ) {
    const pathWithoutPrefixDuplication = relative(SWARM_STORE_CONNECTOR_ORITDB_UTILS_ADDRESS_ORBITDB_PATH_PREFIX, path);
    return checkIfPathStartedWithSlash(path) ? addStartSlash(pathWithoutPrefixDuplication) : pathWithoutPrefixDuplication;
  }
  return path;
}

export function swarmStoreConnectorOrbitDbUtilsAddressJoinPathParts(...parts: string[]): string {
  return removeDuplicateOrbitDBPrefixInPath(OrbitDbAddress.join(...parts));
}

export async function swarmStoreConnectorOrbitDbUtilsAddresGetAddressPartForPathPart(
  pathPart: string,
  alg: HASH_CALCULATION_UTILS_HASH_ALHORITHM
): Promise<string> {
  const result = await calculateHash(pathPart, alg);

  if (result instanceof Error) {
    console.error(result);
    throw new Error(result.message);
  }
  return result;
}

export async function swarmStoreConnectorOrbitDbUtilsAddresGetHashPathFull(fullPath: string): Promise<string> {
  assert(typeof fullPath === 'string', 'Full path shoult be a string');
  return swarmStoreConnectorOrbitDbUtilsAddresGetAddressPartForPathPart(
    fullPath,
    SWARM_STORE_CONNECTOR_ORITDB_UTILS_ADDRESS_FULL_PSATH_HASH_CALC_METHOD
  );
}

export async function swarmStoreConnectorOrbitDbUtilsAddresGetAddressPartForUserId(userId: string): Promise<string> {
  assert(typeof userId === 'string', 'User id should be a string');
  return swarmStoreConnectorOrbitDbUtilsAddresGetAddressPartForPathPart(
    userId,
    SWARM_STORE_CONNECTOR_ORITDB_UTILS_ADDRESS_USER_ID_HASH_CALC_METHOD
  );
}

export async function swarmStoreConnectorOrbitDbUtilsAddresGetAddressPartForDirectory(directory: string): Promise<string> {
  assert(typeof directory === 'string', 'Directory shoult be a string');
  return swarmStoreConnectorOrbitDbUtilsAddresGetAddressPartForPathPart(
    directory,
    SWARM_STORE_CONNECTOR_ORITDB_UTILS_ADDRESS_DIRECTORY_HASH_CALC_METHOD
  );
}

export async function swarmStoreConnectorOrbitDbUtilsAddresGetAddressPartForDb(dbName: string): Promise<string> {
  assert(typeof dbName === 'string', 'Database name shoult be a string');
  return swarmStoreConnectorOrbitDbUtilsAddresGetAddressPartForPathPart(
    dbName,
    SWARM_STORE_CONNECTOR_ORITDB_UTILS_ADDRESS_DBNAME_HASH_CALC_METHOD
  );
}

export async function swarmStoreConnectorOrbitDbUtilsAddressCreateRootPath(
  options: ISwarmStoreConnectorOrbitDbUtilsAddressCreateRootPathOptions
): Promise<string> {
  const { directory, userId } = options;
  const directoryHash = await swarmStoreConnectorOrbitDbUtilsAddresGetAddressPartForDirectory(directory);
  const userIdHash = await swarmStoreConnectorOrbitDbUtilsAddresGetAddressPartForUserId(userId);

  return swarmStoreConnectorOrbitDbUtilsAddressJoinPathParts(directoryHash, userIdHash);
}

export function swarmStoreConnectorOrbitDbUtilsAddressGetValidPath(path: string): string {
  // return path.startsWith('/') ? path : `/${path}`;
  return swarmStoreConnectorOrbitDbUtilsAddressJoinPathParts(path);
}

export function swarmStoreConnectorOrbitDbUtilsAddressGetDBNameByAddress(path: string): undefined | string {
  try {
    return OrbitDbAddress.parseAddress(swarmStoreConnectorOrbitDbUtilsAddressGetValidPath(path)).path;
  } catch (err) {
    console.error('Cant parse the path', err);
  }
}

export async function swarmStoreConnectorOrbitDbUtilsAddressCreateOrbitDbAddressByDatabaseName(
  rootPath: string,
  dbName: string
): Promise<string> {
  const dbNamePathPart = await swarmStoreConnectorOrbitDbUtilsAddresGetAddressPartForDb(dbName);
  return swarmStoreConnectorOrbitDbUtilsAddressJoinPathParts(rootPath, dbNamePathPart);
}
