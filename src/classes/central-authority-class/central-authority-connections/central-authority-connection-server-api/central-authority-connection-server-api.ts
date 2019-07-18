import { TUesrIdentity, IUserDescription } from 'types/users.types';
import { HttpRequest } from 'classes/basic-classes/http-request-class-base/http-request-class-base';
import {
  ICentralAuthorityConnection,
  ICentralAuthorityConnectionOptions,
} from '../../central-authority-class.types';

export class CentralAuthorityConnectionServerAPI
  implements ICentralAuthorityConnection {
  constructor(protected options: ICentralAuthorityConnectionOptions) {}

  public async getUsersDescription(
    users: TUesrIdentity[]
  ): Promise<(IUserDescription | null)[] | Error> {
    const { options } = this;
    const { getUsersDescriptionsRequestOptions, serverUrl } = options;
    const request = new HttpRequest(getUsersDescriptionsRequestOptions);

    HttpRequest.setBaseUrl(serverUrl);
    HttpRequest.addQueryStringParams();
  }
}
