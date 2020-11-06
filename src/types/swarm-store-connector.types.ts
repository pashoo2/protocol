import { ESwarmStoreConnector } from '../classes/swarm-store-class/swarm-store-class.const';
import { TSwarmStoreValueTypes, TSwarmStoreDatabaseType } from '../classes/swarm-store-class/swarm-store-class.types';
import {
  ISwarmStoreConnectorOrbitDbDatabaseIteratorOptions,
  ISwarmStoreConnectorOrbitDbDatabaseValue,
  TSwarmStoreConnectorOrbitDbDatabaseEntityIndex,
  TSwarmStoreConnectorOrbitDbDatabaseAddMethodArgument,
} from '../classes/swarm-store-class/swarm-store-connectors/swarm-store-connector-orbit-db/swarm-store-connector-orbit-db-subclasses/swarm-store-connector-orbit-db-subclass-database/swarm-store-connector-orbit-db-subclass-database.types';

export interface ISwarmStoreConnectorBasic<
  TSwarmStoreConnectorType extends ESwarmStoreConnector,
  TStoreValue extends TSwarmStoreValueTypes<TSwarmStoreConnectorType>,
  DbType extends TSwarmStoreDatabaseType<TSwarmStoreConnectorType>
> {
  /**
   * Connect to the database
   *
   * @returns {(Promise<Error | void>)}
   * @memberof ISwarmStoreConnectorOrbitDBDatabase
   */
  connect(): Promise<Error | void>;
  /**
   * Close the insatnce
   *
   * @param {*} [opt]
   * @returns {(Promise<Error | void>)}
   * @memberof ISwarmStoreConnectorOrbitDBDatabase
   */
  close(opt?: any): Promise<Error | void>;
  /**
   * Add the new entry to the database
   *
   * @param {TSwarmStoreConnectorOrbitDbDatabaseAddMethodArgument<TStoreValue>} addArg
   * @returns {(Promise<string | Error>)}
   * @memberof ISwarmStoreConnectorOrbitDBDatabase
   */
  add(addArg: TSwarmStoreConnectorOrbitDbDatabaseAddMethodArgument<TStoreValue>): Promise<string | Error>;

  /**
   * Read entry from the database by the given argument.
   * for the key value store a key must be used.
   * for the feed store a hash of the value
   * must be used.
   *
   * @param {TSwarmStoreConnectorOrbitDbDatabaseEntityIndex} keyOrHash
   * @returns {(Promise<
   *     Error | ISwarmStoreConnectorOrbitDbDatabaseValue<TStoreValue> | undefined
   *   >)}
   * @memberof ISwarmStoreConnectorOrbitDBDatabase
   */
  get(keyOrHash: TSwarmStoreConnectorOrbitDbDatabaseEntityIndex): Promise<Error | ISwarmStoreConnectorOrbitDbDatabaseValue<TStoreValue> | undefined>;

  /**
   * Remove a value located in the key provided if it is a key value
   * database.
   * Remove an entry by it's address for a non key-value database.
   *
   * @param {TSwarmStoreConnectorOrbitDbDatabaseEntityIndex} keyOrEntryAddress
   * @returns {(Promise<Error | void>)}
   * @memberof ISwarmStoreConnectorOrbitDBDatabase
   */
  remove(keyOrEntryAddress: TSwarmStoreConnectorOrbitDbDatabaseEntityIndex): Promise<Error | void>;

  /**
   * Iterate over the database values which are follows conditions
   * from the options.
   *
   * @param {ISwarmStoreConnectorOrbitDbDatabaseIteratorOptions<DbType>} [options]
   * @returns {(Promise<
   *     | Error
   *     | Array<
   *         | ISwarmStoreConnectorOrbitDbDatabaseValue<TStoreValue>
   *         | Error
   *         | undefined
   *       >
   *   >)}
   * @memberof ISwarmStoreConnectorOrbitDBDatabase
   */
  iterator(
    options?: ISwarmStoreConnectorOrbitDbDatabaseIteratorOptions<DbType>
  ): Promise<Error | Array<ISwarmStoreConnectorOrbitDbDatabaseValue<TStoreValue> | Error | undefined>>;

  /**
   * Drop the database and clear all local stored entries.
   *
   * @returns {(Promise<Error | void>)}
   * @memberof ISwarmStoreConnectorOrbitDBDatabase
   */
  drop(): Promise<Error | void>;
}
