import { HttpResponseError } from './http-request-class-base-response-error';
import { THttpResponseResult } from '../http-request-class-base.types';

export class HttpRequestResponseProcessor {
  constructor(protected response: Response) {}

  public async getResult(): Promise<
    Error | HttpResponseError | THttpResponseResult
  > {}
}
