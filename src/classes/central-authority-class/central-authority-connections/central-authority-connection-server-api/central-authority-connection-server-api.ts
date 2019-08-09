import { TUesrIdentity, IUserDescription } from 'types/users.types';
import { HttpRequest } from 'classes/basic-classes/http-request-class-base/http-request-class-base';
import {
  CentralAuthorityConnection,
  ICentralAuthorityConnectionOptions,
} from '../../central-authority-class.types';

export class CentralAuthorityConnectionServerAPI
  implements CentralAuthorityConnection {
  constructor(protected options: ICentralAuthorityConnectionOptions) {}

  public async getUsersDescription(
    users: TUesrIdentity[]
  ): Promise<(IUserDescription | null)[] | Error> {
    const { options } = this;
    const { getUsersDescriptionsRequestOptions, serverUrl } = options;
    const request = new HttpRequest(getUsersDescriptionsRequestOptions);

    request.setBaseUrl(serverUrl);
    request.setQueryStringParams(users);
    return request.send();
  }
}