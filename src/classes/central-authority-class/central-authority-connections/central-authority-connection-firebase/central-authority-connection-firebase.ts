import * as firebase from 'firebase/app';
import { ICAConnection } from '../central-authority-connections.types';
import { CAConnectionWithFirebaseImplementation } from './central-authority-connection-firebase-connection-implementation/central-authority-connection-firebase-connection-implementation';

/**
 *
 * This is the class realized connection with the Firebase.
 * It allows to sign up and authorize on it, set a crypto credentials
 * for the user and read credentials for another users.
 * @export
 * @class CAConnectionWithFirebase
 * @implements {ICAConnection}
 */
export class CAConnectionWithFirebase
  extends CAConnectionWithFirebaseImplementation
  implements ICAConnection {}

export default CAConnectionWithFirebase;
