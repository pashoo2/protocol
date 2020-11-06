import { TSwarmStoreDatabaseEntryOperation, TSwarmStoreValueTypes } from '../../../../swarm-store-class.types';
import { ESwarmStoreConnector } from '../../../../swarm-store-class.const';
import { TSwarmMessageUserIdentifierSerialized } from '../../../../../swarm-message/swarm-message-subclasses/swarm-message-subclass-validators/swarm-message-subclass-validator-fields-validator/swarm-message-subclass-validator-fields-validator-validators/swarm-message-subclass-validator-fields-validator-validator-user-identifier/swarm-message-subclass-validator-fields-validator-validator-user-identifier.types';
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
export type TSwarmStoreConnectorOrbitDbAccessConrotllerGrantAccessCallback<
  P extends ESwarmStoreConnector,
  T extends TSwarmStoreValueTypes<P>,
  I extends unknown = never
> = (
  // value
  payload: T | I,
  userId: TSwarmMessageUserIdentifierSerialized,
  // key of the value
  key?: string,
  // operation which is processed (like delete, add or something else)
  operation?: TSwarmStoreDatabaseEntryOperation<P>
) => Promise<boolean>;

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
> {
  /**
   * check whether to grant access for the user with
   * the id to the entity wich is have the payload
   *
   * @memberof ISwarmStoreConnectorOrbitDbDatabaseAccessControllerOptions
   * @returns boolean
   */
  grantAccess?: TSwarmStoreConnectorOrbitDbAccessConrotllerGrantAccessCallback<ESwarmStoreConnector.OrbitDB, TValueType>;
}

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
