import * as firebase from 'firebase/app';
import 'firebase/auth';
import { ICAConnection } from '../central-authority-connections.types';
import { ICAConnectionConfigurationFirebase } from './central-authority-connection-firebase.types.configuration';
import { ICentralAuthorityUserAuthCredentials } from 'classes/central-authority-class/central-authority-class-types/central-authority-class-types';

// TODO export class CAConnectionWithFirebase implements ICAConnection {
export class CAConnectionWithFirebase {
    protected app?: firebase.app.App;

    public async connect(
        configuration: ICAConnectionConfigurationFirebase
    ): Promise<boolean | Error> {
        let app;
        try {
            app = firebase.initializeApp(configuration);
        } catch (err) {
            console.error(err);
            return new Error('Failed to initialize the application with the given configuration');
        }
        return true;
    }

    public async singUpWithAuthCredentials(authCredentials: ICentralAuthorityUserAuthCredentials): Promise<boolean | Error>  {
        let signUpResult;

        try {
            signUpResult = await (
                firebase
                .auth()
                .createUserWithEmailAndPassword(authCredentials.login, authCredentials.password));
        } catch(err) {
            console.error(err);
            return new Error('Failed to sign up to the Firebase with the given credentials');
        }
        debugger;
        return true;
    }
}

export default CAConnectionWithFirebase;
