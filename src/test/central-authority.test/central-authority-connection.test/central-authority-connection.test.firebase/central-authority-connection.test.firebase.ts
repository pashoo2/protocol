import {CAConnectionWithFirebase} from 'classes/central-authority-class/central-authority-connections/central-authority-connection-firebase/central-authority-connection-firebase';
import { CA_CONNECTION_FIREBASE_CONFIG } from './central-authority-connection.test.firebase.const';

export const runTestCAConnectionFirebase = async () => {
    console.warn('CA connection firebase test started');
    
    const connectionFirebase = new CAConnectionWithFirebase();
    const connectionResult = await connectionFirebase.connect(CA_CONNECTION_FIREBASE_CONFIG);

    if (connectionResult instanceof Error) {
        console.error(connectionResult);
        console.error(new Error('Failed connection to the firebase app account'));
        return;
    }

    console.warn('CA connection firebase test succeed');
}
