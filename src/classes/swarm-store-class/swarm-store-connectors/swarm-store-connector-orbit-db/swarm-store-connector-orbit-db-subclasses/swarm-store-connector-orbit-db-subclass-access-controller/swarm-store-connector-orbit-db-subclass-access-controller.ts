import OrbitDB from 'orbit-db';
import OrbitDBAccessController from 'orbit-db-access-controllers/src/orbitdb-access-controller';
import { ISwarmStoreConnectorOrbitDbDatabaseAccessControllerOptions } from './swarm-store-connector-orbit-db-subclass-access-controller.types';
import { IdentityProvider } from 'orbit-db-identity-provider';
import { ESwarmStoreConnector } from '../../../../swarm-store-class.const';
import { EOrbitDbStoreOperation } from '../swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.const';
import { P } from '../../../../../../components/connect-to-swarm-with-dbo/connect-to-swarm-with-dbo';
import {
  TSwarmStoreConnectorAccessConrotllerGrantAccessCallback,
  TSwarmStoreValueTypes,
} from '../../../../swarm-store-class.types';
import {
  SWARM_STORE_CONNECTOR_ORBITDB_SUBCLASS_ACCESS_CONTROLLER_LOG_PREFIX,
  SWARM_STORE_CONNECTOR_ORBITDB_SUBCLASS_ACCESS_CONTROLLER_TYPE,
} from './swarm-store-connector-orbit-db-subclass-access-controller.const';

export function getControllerAddressByOptions<T extends TSwarmStoreValueTypes<ESwarmStoreConnector.OrbitDB>>(
  options: ISwarmStoreConnectorOrbitDbDatabaseAccessControllerOptions<T> & {
    address?: string;
    name?: string;
  }
): string {
  return options.address || options.name || 'default-access-controller';
}

export class SwarmStoreConnectorOrbitDBSubclassAccessController<
  T extends TSwarmStoreValueTypes<ESwarmStoreConnector.OrbitDB>
> extends OrbitDBAccessController {
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
    options: ISwarmStoreConnectorOrbitDbDatabaseAccessControllerOptions<T> & {
      address?: string;
      name?: string;
    } = {}
  ) {
    const ac = new SwarmStoreConnectorOrbitDBSubclassAccessController<T>(orbitdb, options);
    await ac.load(getControllerAddressByOptions<T>(options));

    // Add write access from options
    if (options.write && !options.address) {
      await Promise.all(
        options.write.map(async (e) => {
          try {
            await ac.grant('write', e);
          } catch (err) {
            console.error(err);
          }
        })
      );
    }

    return ac;
  }

  // if true then anyone have access
  // to the database
  protected __isPublic: boolean = false;

  protected __grantAccessCallback?: TSwarmStoreConnectorAccessConrotllerGrantAccessCallback<ESwarmStoreConnector.OrbitDB, T>;

  constructor(orbitdb: OrbitDB, protected __options: ISwarmStoreConnectorOrbitDbDatabaseAccessControllerOptions<T> = {}) {
    super(orbitdb, __options);
    this.__setOptions(__options);
  }

  async grant(capability: any, key: string) {
    return await super.grant(capability, key);
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
    try {
      if (!super.canAppend(entry, identityProvider)) {
        return false;
      }
      if (!this.__validateEntryFormat(entry)) {
        console.warn(`${SWARM_STORE_CONNECTOR_ORBITDB_SUBCLASS_ACCESS_CONTROLLER_LOG_PREFIX}::entry have an unknown format`);
        return false;
      }

      // Write keys and admins keys are allowed
      const { __options, __isPublic: _isPublic } = this;

      if (_isPublic) {
        return await this.__verifyAccess(entry);
      }

      if (!__options) {
        return false;
      }

      const { identity } = entry;
      const { id: userPerformedActionOnEntryId } = identity;
      const { write: accessListForUsers } = __options;

      // If the ACL contains the writer's public key or it contains '*'
      if (
        accessListForUsers &&
        userPerformedActionOnEntryId !== '*' &&
        accessListForUsers.includes(userPerformedActionOnEntryId)
      ) {
        return await this.__verifyAccess(entry);
      }
      return false;
    } catch (err) {
      console.error(err);
      return false;
    }
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
  protected __validateEntryFormat(entry: LogEntry<T>): entry is LogEntry<T> {
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
   * validates the enetry and verify the user have
   * the access on it
   *
   * @protected
   * @param {LogEntry<T>} entry
   * @param {IdentityProvider} identityProvider
   * @returns {Promise<boolean>}
   * @memberof SwarmStoreConnectorOrbitDBSubclassAccessController
   */
  protected async __verifyAccess(entry: LogEntry<T>): Promise<boolean> {
    try {
      const { identity, payload, clock } = entry;
      const { value, key, op } = payload;
      const { id: userId } = identity;
      const { __grantAccessCallback } = this;

      if (typeof __grantAccessCallback === 'function') {
        // also should add LamportClock as the last argument value
        return await __grantAccessCallback(value, userId, key, op as EOrbitDbStoreOperation | undefined, clock.time);
      }
      return true;
    } catch (err) {
      console.error(new Error('SwarmStoreConnectorOrbitDbAccessController::__verifyAccess::throw'));
      console.error(err);
      return false;
    }
  }

  protected __setOptions(options: ISwarmStoreConnectorOrbitDbDatabaseAccessControllerOptions<T>) {
    if (options) {
      const { write, grantAccess } = options;

      if (write instanceof Array) {
        if (write.includes('*')) {
          this.__isPublic = true;
        }
      } else {
        console.warn(`${SWARM_STORE_CONNECTOR_ORBITDB_SUBCLASS_ACCESS_CONTROLLER_LOG_PREFIX}::Noone have access on the database`);
      }
      if (typeof grantAccess === 'function') {
        if (grantAccess.length < 2) {
          console.warn(
            `${SWARM_STORE_CONNECTOR_ORBITDB_SUBCLASS_ACCESS_CONTROLLER_LOG_PREFIX}::A grant access callback must receives at least 2 arguments generally, but receives ${grantAccess.length}`
          );
        }
        this.__grantAccessCallback = grantAccess;
      }
      this.__options = options;
    }
  }

  /**
   * It returns a manifest data, which is used
   * in a naming of a resulted ipfs PubSub channel.
   *
   * @returns
   * @memberof SwarmStoreConnectorOrbitDBSubclassAccessController
   */
  async save(): Promise<{
    address: string;
  }> {
    const options = this.__options;

    if (!options) {
      throw new Error('Options are not defined for the access controller');
    }
    // return the manifest data
    return {
      address: getControllerAddressByOptions<T>(options),
    };
  }
}
