import { ICentralAuthorityUserAuthCredentials } from 'classes/central-authority-class/central-authority-class-types/central-authority-class-types';

export interface ICAStorageAuthProvidersCredentials {
  // connect to the storage located locally
  connect(
    caAuthCredentials: ICentralAuthorityUserAuthCredentials
  ): Promise<Error | void>;
  // // get all urls for the auth providers on which the user has registered
  // getProvidersUrlsUserRegistered(): [string[]];
  // // set the credentials stored for the provider url
  // setCredentialsForProvider(
  //   providerUrl,
  //   providerAuthCredentials
  // ): Promise<Error | void>;
  // // get the credentials stored for the provider
  // setCredentialsForProvider(
  //   providerUrl
  // ): Promise<Error | providerAuthCredentials>;
  // // unset the credentials stored for the provider
  // unsetCredentialsForProvider(providerUrl): Promise<Error | void>;
}
