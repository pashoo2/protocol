import { HttpResponseError } from './http-request-class-base-response-error';
import { THttpResponseResult } from '../http-request-class-base.types';
import {
  isSucceedResponse,
  getContentTypeRAW,
} from '../http-request-class-base-utils';
import { HTTP_RESPONSE_TYPES } from '../http-request-class-base.const';
import { MimeTypeClass } from 'classes/basic-classes/mime-types-class-base/mime-types-class-base';
import { getFilenameByUrl } from '../../../../utils/files-utils/files-utils-download';

export class HttpRequestResponseProcessor {
  constructor(protected response: Response) {}

  protected getHeader(name: string) {
    return this.response.headers.get(name);
  }

  protected getFileNameByResponse(extension?: string | null) {
    const contentDisposition = this.getHeader('content-disposition');
    let fileName = '' as string | undefined;

    if (contentDisposition) {
      const fileNameMatch = /filename="(.+)"/.exec(contentDisposition);

      if (fileNameMatch?.length === 2) fileName = fileNameMatch[1];
    }
    if (!fileName) {
      fileName = getFilenameByUrl(this.response.url);
    }

    if (extension) {
      return fileName && fileName.endsWith(extension)
        ? fileName
        : `${fileName}.${extension}`;
    }
    return fileName;
  }

  protected logError(error: Error): Error {
    console.error(error);
    return error;
  }

  protected async processAsText(): Promise<string | Error> {
    const { response } = this;

    try {
      const result = await response.text();

      return result;
    } catch (err) {
      return this.logError(err);
    }
  }

  protected async processAsFormData(): Promise<Error | FormData> {
    const { response } = this;
    let result;

    try {
      if (typeof response.formData === 'function') {
        result = await response.formData();
      } else {
      }

      return new Error("Can't process the response as FormData");
    } catch (err) {
      return this.logError(err);
    }
  }

  protected async processAsBlob(): Promise<Error | object> {
    const { response } = this;

    try {
      const result = await response.blob();

      return result;
    } catch (err) {
      return this.logError(err);
    }
  }

  protected async processAsFile(
    mimeType?: string | null,
    extension?: string | null
  ): Promise<Error | object> {
    const { response } = this;

    try {
      const result = await response.blob();

      if (result instanceof Blob) {
        return new File(
          [result],
          this.getFileNameByResponse(extension) || 'unknown',
          {
            type: mimeType || undefined,
          }
        );
      }
      return new Error("Can't process the response as a file");
    } catch (err) {
      return this.logError(err);
    }
  }

  protected async processAsJSON(): Promise<Error | object> {
    const { response } = this;

    try {
      const result = await response.json();

      if (result && typeof result === 'object') {
        return result;
      }
      return new Error("Can't process the response as json");
    } catch (err) {
      return this.logError(err);
    }
  }

  protected async processResponse(): Promise<Error | THttpResponseResult> {
    const { response } = this;
    const contentType = getContentTypeRAW(response);

    if (contentType) {
      const mimeType = new MimeTypeClass(contentType);
      debugger;
      if (mimeType.isBlob) {
        return this.processAsBlob();
      }
      if (mimeType.isJSON) {
        return this.processAsJSON();
      }
      if (mimeType.isText) {
        return this.processAsText();
      }
      if (mimeType.isFile) {
        return this.processAsFile(contentType, mimeType.extension);
      }
      return new Error('There is unknown mime-type of the response content');
    }

    return new Error('There is no "Content-Type" in the response headers');
  }

  public async getResult(): Promise<
    Error | HttpResponseError | THttpResponseResult
  > {
    const { response } = this;
    debugger;
    if (response.type === HTTP_RESPONSE_TYPES.OPAQUE) {
      return undefined;
    }
    if (response.type === HTTP_RESPONSE_TYPES.OPAQUE_REDIRECT) {
      return undefined;
    }
    if (!isSucceedResponse(response)) {
      return new HttpResponseError(response);
    }
    return this.processResponse();
  }
}
