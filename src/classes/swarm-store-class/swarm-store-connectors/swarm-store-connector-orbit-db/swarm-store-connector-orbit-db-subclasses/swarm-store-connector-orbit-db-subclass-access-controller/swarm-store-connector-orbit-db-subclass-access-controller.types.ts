import {
  TSwarmStoreConnectorAccessConrotllerGrantAccessCallback,
  TSwarmStoreValueTypes,
} from '../../../../swarm-store-class.types';
import { ESwarmStoreConnector } from '../../../../swarm-store-class.const';
import { ISwarmStoreConnectorDatabaseAccessControlleGrantCallback } from '../../../../swarm-store-class.types';

export interface ISwarmStoreConnectorOrbitDbDatabaseAccessControllerManifest {
  /**
   * do not use the manifest to
   *
   * @type {boolean}
   * @memberof ISwarmStoreConnectorOrbitDbDatabaseAccessControllerManifest
   */
  skipManifest?: boolean;
}

/**
 * return true or false
 * to allow or disallow the acces
 * on the entry for the user with
 * userId === id
 */

export interface ISwarmStoreConnectorOrbitDbAccessConrotllerOrbitDBStandardOptionsWriteAccess {
  /**
   * An array of hex encoded public keys which are used to set write access to the database.
   * ["*"] can be passed in to give write access to everyone.
   * See the GETTING STARTED guide for more info.
   * (Default: uses the OrbitDB instance key orbitdb.key, which would give write access only to yourself)
   */
  write?: string[];
}

export interface ISwarmStoreConnectorOrbitDbDatabaseAccessControlleGrantCallback<
  TValueType extends TSwarmStoreValueTypes<ESwarmStoreConnector.OrbitDB>
> extends ISwarmStoreConnectorDatabaseAccessControlleGrantCallback<ESwarmStoreConnector.OrbitDB, TValueType> {}

export interface ISwarmStoreConnectorOrbitDbAccessConrotllerOrbitDBStandardOptions
  extends ISwarmStoreConnectorOrbitDbAccessConrotllerOrbitDBStandardOptionsWriteAccess {
  /**
   * Name of custom AccessController
   */
  type?: string;
}

export interface ISwarmStoreConnectorOrbitDbDatabaseAccessControllerOptions<
  TFeedStoreType extends TSwarmStoreValueTypes<ESwarmStoreConnector.OrbitDB>
> extends ISwarmStoreConnectorOrbitDbAccessConrotllerOrbitDBStandardOptions,
    ISwarmStoreConnectorOrbitDbDatabaseAccessControlleGrantCallback<TFeedStoreType> {}
