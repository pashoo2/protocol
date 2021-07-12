import { ISwarmStoreConnectorOrbitDbUtilsAddressCreateRootPathOptions } from './swarm-store-connector-orbit-db-utils-address.types';
import { HASH_CALCULATION_UTILS_HASH_ALGORITHM } from '@pashoo2/crypto-utilities';
export declare function checkIfPathStartedWithSlash(path: string): boolean;
export declare function addStartSlash(path: string): string;
export declare function removeDuplicateOrbitDBPrefixInPath(path: string): string;
export declare function swarmStoreConnectorOrbitDbUtilsAddressJoinPathParts(...parts: string[]): string;
export declare function swarmStoreConnectorOrbitDbUtilsAddresGetAddressPartForPathPart(pathPart: string, alg: HASH_CALCULATION_UTILS_HASH_ALGORITHM): Promise<string>;
export declare function swarmStoreConnectorOrbitDbUtilsAddresGetHashPathFull(fullPath: string): Promise<string>;
export declare function swarmStoreConnectorOrbitDbUtilsAddresGetAddressPartForUserId(userId: string): Promise<string>;
export declare function swarmStoreConnectorOrbitDbUtilsAddresGetAddressPartForDirectory(directory: string): Promise<string>;
export declare function swarmStoreConnectorOrbitDbUtilsAddresGetAddressPartForDb(dbName: string): Promise<string>;
export declare function swarmStoreConnectorOrbitDbUtilsAddressCreateRootPath(options: ISwarmStoreConnectorOrbitDbUtilsAddressCreateRootPathOptions): Promise<string>;
export declare function swarmStoreConnectorOrbitDbUtilsAddressGetValidPath(path: string): string;
export declare function swarmStoreConnectorOrbitDbUtilsAddressGetDBNameByAddress(path: string): undefined | string;
export declare function swarmStoreConnectorOrbitDbUtilsAddressCreateOrbitDbAddressByDatabaseName(rootPath: string, dbName: string): Promise<string>;
//# sourceMappingURL=swarm-store-connector-orbit-db-utils-address.d.ts.map