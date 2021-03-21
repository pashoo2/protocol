import { TSwarmMessageUserIdentifierSerialized } from '../../../../../central-authority-class/central-authority-class-user-identity/central-authority-class-user-identity-validators/central-authority-common-validator-user-identifier/central-authority-common-validator-user-identifier.types';

export interface ISwarmStoreConnectorOrbitDbUtilsAddressCreateRootPathOptions {
  userId: TSwarmMessageUserIdentifierSerialized;
  directory: string;
}
