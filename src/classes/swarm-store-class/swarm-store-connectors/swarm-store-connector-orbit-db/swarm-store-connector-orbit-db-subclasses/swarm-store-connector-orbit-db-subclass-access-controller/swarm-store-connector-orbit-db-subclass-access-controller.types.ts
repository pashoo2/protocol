import {
    ISwarmStoreConnectorDatabaseAccessControlleGrantCallback,
    ISwarmStoreDatabaseBaseOptionsWithWriteAccess,
    TSwarmStoreValueTypes
} from '../../../../swarm-store-class.types';
import {ESwarmStoreConnector} from '../../../../swarm-store-class.const';

export interface ISwarmStoreConnectorOrbitDbDatabaseAccessControllerManifest {
  /**
   * do not use the manifest to
   *
   * @type {boolean}
   * @memberof ISwarmStoreConnectorOrbitDbDatabaseAccessControllerManifest
   */
  skipManifest?: boolean;
}

export interface ISwarmStoreConnectorOrbitDbDatabaseAccessControlleGrantCallback<
  TValueType extends TSwarmStoreValueTypes<ESwarmStoreConnector.OrbitDB>
> extends ISwarmStoreConnectorDatabaseAccessControlleGrantCallback<ESwarmStoreConnector.OrbitDB, TValueType> {}

export interface ISwarmStoreConnectorOrbitDbAccessConrotllerOrbitDBStandardOptions
  extends ISwarmStoreDatabaseBaseOptionsWithWriteAccess {
  /**
   * Name of custom AccessController
   */
  type?: string;
}

export interface ISwarmStoreConnectorOrbitDbDatabaseAccessControllerOptions<
  TFeedStoreType extends TSwarmStoreValueTypes<ESwarmStoreConnector.OrbitDB>
> extends ISwarmStoreConnectorOrbitDbAccessConrotllerOrbitDBStandardOptions,
    ISwarmStoreConnectorOrbitDbDatabaseAccessControlleGrantCallback<TFeedStoreType> {}
