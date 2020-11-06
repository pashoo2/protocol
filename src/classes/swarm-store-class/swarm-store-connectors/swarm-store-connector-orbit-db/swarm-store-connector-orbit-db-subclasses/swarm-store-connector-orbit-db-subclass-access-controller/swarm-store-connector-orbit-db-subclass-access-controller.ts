import OrbitDB from 'orbit-db';
import AccessController from 'orbit-db-access-controllers/src/access-controller-interface';
import {
  SWARM_STORE_CONNECTOR_ORBITDB_SUBCLASS_ACCESS_CONTROLLER_TYPE,
  SWARM_STORE_CONNECTOR_ORBITDB_SUBCLASS_ACCESS_CONTROLLER_LOG_PREFIX,
} from './swarm-store-connector-orbit-db-subclass-access-controller.const';
import {
  ISwarmStoreConnectorOrbitDbDatabaseAccessControllerOptions,
  TSwarmStoreConnectorOrbitDbAccessConrotllerGrantAccessCallback,
  ISwarmStoreConnectorOrbitDbDatabaseAccessControllerManifest,
} from './swarm-store-connector-orbit-db-subclass-access-controller.types';
import { IdentityProvider } from 'orbit-db-identity-provider';
import { ESwarmStoreConnector } from '../../../../swarm-store-class.const';
import { EOrbitDbFeedStoreOperation } from '../swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.const';
import { TSwarmStoreValueTypes } from '../../../../swarm-store-class.types';

export class SwarmStoreConnectorOrbitDBSubclassAccessController<
  T extends TSwarmStoreValueTypes<ESwarmStoreConnector.OrbitDB>
> extends AccessController {
  // Returns the type of the access controller
  public static get type(): string {
    return SWARM_STORE_CONNECTOR_ORBITDB_SUBCLASS_ACCESS_CONTROLLER_TYPE;
  }
  /**
   * create and preload an instance
   * of the SwarmStoreConnectorOrbitDBSubclassAccessController
   *
   * @static
   * @template T
   * @param {OrbitDB} orbitdb
   * @param {ISwarmStoreConnectorOrbitDbDatabaseAccessControllerOptions<T>} [options={}]
   * @returns
   * @memberof SwarmStoreConnectorOrbitDBSubclassAccessController
   */
  public static async create<T extends TSwarmStoreValueTypes<ESwarmStoreConnector.OrbitDB>>(
    orbitdb: OrbitDB,
    options: ISwarmStoreConnectorOrbitDbDatabaseAccessControllerOptions<T> = {}
  ): Promise<SwarmStoreConnectorOrbitDBSubclassAccessController<T>> {
    return new SwarmStoreConnectorOrbitDBSubclassAccessController<T>(orbitdb, options);
  }

  // if true then anyone have access
  // to the database
  protected _isPublic: boolean = false;

  protected _grantAccessCallback?: TSwarmStoreConnectorOrbitDbAccessConrotllerGrantAccessCallback<
    ESwarmStoreConnector.OrbitDB,
    T
  >;

  protected _orbitdb?: OrbitDB;

  protected _options?: ISwarmStoreConnectorOrbitDbDatabaseAccessControllerOptions<T>;

  constructor(orbitdb: OrbitDB, options: ISwarmStoreConnectorOrbitDbDatabaseAccessControllerOptions<T> = {}) {
    super();
    this._orbitdb = orbitdb;
    this.setOptions(options);
  }

  /**
   * Called by the databases (the log) to see if entry should
   * be allowed in the database. Return true if the entry is allowed,
   * false is not allowed.
   *
   * @param {LogEntry<T>} entry
   * @param {IdentityProvider} identityProvider
   * @returns
   * @memberof SwarmStoreConnectorOrbitDBSubclassAccessController
   */
  public async canAppend(entry: LogEntry<T>, identityProvider: IdentityProvider): Promise<boolean> {
    if (!this.verifyEntryFormat(entry)) {
      console.warn(`${SWARM_STORE_CONNECTOR_ORBITDB_SUBCLASS_ACCESS_CONTROLLER_LOG_PREFIX}::entry have an unknown format`);
      return false;
    }

    // Write keys and admins keys are allowed
    const { _options, _isPublic } = this;

    if (_isPublic) {
      return this.checkAccess(entry, identityProvider);
    }

    if (!_options) {
      return false;
    }

    const { identity } = entry;
    const { id: userPerformedActionOnEntryId } = identity;
    const { write: accessListForUsers } = _options;

    // If the ACL contains the writer's public key or it contains '*'
    if (accessListForUsers && accessListForUsers.includes(userPerformedActionOnEntryId)) {
      return this.checkAccess(entry, identityProvider);
    }
    return false;
  }

  /**
   *  return manifest params
   *
   * @returns
   * @memberof SwarmStoreConnectorOrbitDBSubclassAccessController
   */
  public async save(): Promise<ISwarmStoreConnectorOrbitDbDatabaseAccessControllerManifest> {
    return {};
  }

  /**
   * check if the entry have the common fields
   * used to verfy the access on it
   *
   * @protected
   * @param {LogEntry<T>} entry
   * @returns {entry is LogEntry<T>}
   * @memberof SwarmStoreConnectorOrbitDBSubclassAccessController
   */
  protected verifyEntryFormat(entry: LogEntry<T>): entry is LogEntry<T> {
    if (!entry || typeof entry !== 'object') {
      return false;
    }

    const { identity, payload } = entry;
    const { id } = identity;

    if (!id) {
      return false;
    }
    if (payload === undefined) {
      return false;
    }
    return true;
  }

  /**
   * validate the identiry provided by the entity
   *
   * @protected
   * @param {IdentityJson} identity
   * @returns {Promise<boolean>}
   * @memberof SwarmStoreConnectorOrbitDBSubclassAccessController
   */
  protected verifyIdentity(identity: IdentityJson, identityProvider: IdentityProvider): Promise<boolean> {
    return (identityProvider as any).verifyIdentity(identity);
  }

  /**
   * validate the entity format and
   * check the access on it for the
   * identity provided
   *
   * @protected
   * @param {LogEntry<T>} entry
   * @returns {Promise<boolean>}
   * @memberof SwarmStoreConnectorOrbitDBSubclassAccessController
   */
  protected async verifyEntity(entry: LogEntry<T>): Promise<boolean> {
    if (!this.verifyEntryFormat(entry)) {
      return false;
    }

    const { identity, payload } = entry;
    const { value, key, op } = payload;
    const { id } = identity;
    const { _grantAccessCallback } = this;

    if (typeof _grantAccessCallback === 'function') {
      return _grantAccessCallback(value, id, key, op as EOrbitDbFeedStoreOperation | undefined);
    }
    return true;
  }

  /**
   * validates the enetry and verify the user have
   * the access on it
   *
   * @protected
   * @param {LogEntry<T>} entry
   * @param {IdentityProvider} identityProvider
   * @returns {Promise<boolean>}
   * @memberof SwarmStoreConnectorOrbitDBSubclassAccessController
   */
  protected async checkAccess(entry: LogEntry<T>, identityProvider: IdentityProvider): Promise<boolean> {
    try {
      if (!this.verifyEntryFormat(entry)) {
        return false;
      }

      const { identity } = entry;
      const validateIdentityResult = await this.verifyIdentity(identity, identityProvider);

      if (validateIdentityResult !== true) {
        return false;
      }
      return this.verifyEntity(entry);
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  protected setOptions(options: ISwarmStoreConnectorOrbitDbDatabaseAccessControllerOptions<T>) {
    if (options) {
      const { write, grantAccess } = options;

      if (write instanceof Array) {
        if (write.includes('*')) {
          this._isPublic = true;
        }
      } else {
        console.warn(`${SWARM_STORE_CONNECTOR_ORBITDB_SUBCLASS_ACCESS_CONTROLLER_LOG_PREFIX}::Noone have access on the database`);
      }
      if (typeof grantAccess === 'function') {
        if (grantAccess.length !== 2) {
          console.warn(
            `${SWARM_STORE_CONNECTOR_ORBITDB_SUBCLASS_ACCESS_CONTROLLER_LOG_PREFIX}::A grant access callback must receives 2 arguments generally, but receives ${grantAccess.length}`
          );
        }
        this._grantAccessCallback = grantAccess;
      }
      this._options = options;
    }
  }
}
