import * as firebase from 'firebase';
import {
  CA_CONNECTION_FIREBASE_UTILS_DATABASE_KEY_MAX_LENGTH,
  CA_CONNECTION_FIREBASE_UTILS_DATABASE_KEY_MIN_LENGTH,
} from './central-authority-connection-firebase-utils.database.const';

export class CAConnectionWithFirebaseUtilDatabase {
  protected app?: firebase.app.App;

  protected database?: firebase.database.Database;

  protected wasConnected: boolean = false;

  public get isConnected(): boolean {
    const { wasConnected, database } = this;

    return wasConnected && !!database;
  }

  protected setWasConnectedStatus(wasConnected = false) {
    this.wasConnected = !!wasConnected;
  }

  protected setDatabaseInstance(db: firebase.database.Database) {
    this.database = db;
  }

  protected checkIsConnected(): Error | boolean {
    const { isConnected } = this;

    if (!isConnected) {
      return new Error('There is no connection with the remote database');
    }
    return true;
  }

  protected checkKeyValue(key: any): key is string {
    if (typeof key !== 'string') {
      console.error('Key must be a string');
      return false;
    }

    const keyLen = key.length;

    if (keyLen > CA_CONNECTION_FIREBASE_UTILS_DATABASE_KEY_MAX_LENGTH) {
      console.error(
        `Key must be less than ${CA_CONNECTION_FIREBASE_UTILS_DATABASE_KEY_MAX_LENGTH}, but the value is ${keyLen} characters len`
      );
      return false;
    }
    if (keyLen < CA_CONNECTION_FIREBASE_UTILS_DATABASE_KEY_MIN_LENGTH) {
      console.error(
        `Key must be greater than ${CA_CONNECTION_FIREBASE_UTILS_DATABASE_KEY_MAX_LENGTH}, but the value is ${keyLen} characters len`
      );
      return false;
    }
    return true;
  }

  public async connect(): Promise<boolean | Error> {
    const { isConnected, app } = this;

    if (isConnected) {
      return true;
    }
    if (!app) {
      return new Error('The app is not defined');
    }
    try {
      const database = app.database();

      await database.goOnline();
      this.setDatabaseInstance(database);
    } catch (err) {
      console.error(err);
      return new Error('Failed to connect to the Database server');
    }
    this.setWasConnectedStatus(true);
    return true;
  }

  /**
   * This method destroys the
   * application instance, Not just
   * go offline. This means that
   * the reconnection with calling of
   * the 'connect' method will failed
   * and therefore is not allowed.
   *
   * @returns {(Promise<boolean | Error>)}
   * @memberof CAConnectionWithFirebaseUtilDatabase
   */
  public async disconnect(): Promise<boolean | Error> {
    const isConnected = this.checkIsConnected();

    if (isConnected instanceof Error) {
      return isConnected;
    }

    const { database } = this;

    try {
      await database!!.goOffline();
    } catch (err) {
      console.error(err);
      return new Error('Failed to go offline before destroy the application');
    }
    this.setWasConnectedStatus(false);
    return true;
  }

  protected checkBeforeReadWrite(key: string): Error | boolean {
    const isConnectedResult = this.checkIsConnected();

    if (isConnectedResult instanceof Error) {
      return isConnectedResult;
    }
    if (!this.checkKeyValue(key)) {
      return new Error('The key value is not valid');
    }
    return true;
  }

  public async setValue<T>(key: string, value: T): Promise<Error | boolean> {
    const canWrite = this.checkBeforeReadWrite(key);

    if (canWrite instanceof Error) {
      return canWrite;
    }

    const { database } = this;

    try {
      await database!!.ref(key).set(value);
    } catch (err) {
      console.error(err);
      return new Error('Failed to store the value in the database');
    }
    return true;
  }

  public async getValue<T>(key: string): Promise<Error | null | T> {
    const canRead = this.checkBeforeReadWrite(key);

    if (canRead instanceof Error) {
      return canRead;
    }

    const { database } = this;

    try {
      const snapshot = await database!!.ref(key).once('value');
      const isExists = snapshot.exists();

      if (!isExists) {
        return null;
      }
      return snapshot.val() as T;
    } catch (err) {
      console.error(err);
      return new Error('Failed to read the value from the storage');
    }
  }
}

export default CAConnectionWithFirebaseUtilDatabase;
