export interface ICAConnectionConfigurationFirebase {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
}

export interface ICAConnectionFirebaseUserProfile {
  displayName: string | null;
  photoURL: string | null;
}
