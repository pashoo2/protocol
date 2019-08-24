import * as firebase from 'firebase/app';
import 'firebase/auth';
import { ICAConnection } from '../central-authority-connections.types';
import { ICAConnectionConfigurationFirebase } from './central-authority-connection-firebase.types.configuration';

// TODO export class CAConnectionWithFirebase implements ICAConnection {
export class CAConnectionWithFirebase {
    protected app?: firebase.app.App;

    async connect(
        configuration: ICAConnectionConfigurationFirebase
    ): Promise<boolean | Error> {
        let app;
        try {
            app = firebase.initializeApp(configuration);
            debugger
        } catch (err) {
            console.error(err);
            return new Error('Failed to initialize the application with the given configuration');
        }
        return true;
    }
}

export default CAConnectionWithFirebase;
