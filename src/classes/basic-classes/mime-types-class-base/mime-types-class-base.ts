import mime from 'mime';
import {
  MIME_TYPES_CLASS_TEXT_EXTENSIONS,
  MIME_TYPES_CLASS_TEXT_TYPES,
  MIME_TYPES_CLASS_BLOB_TYPES,
  MIME_TYPES_CLASS_JSON_EXTENSIONS,
} from './mime-types-class-base.const';

export class MimeTypeClass {
  public extension: string | null = null;

  public isText: boolean = false;

  public isBlob: boolean = false;

  public isFile: boolean = false;

  public isJSON: boolean = false;

  public isUnknown: boolean = false;

  constructor(protected mimeType: string) {
    this.processMimeType();
  }

  checkIsFile(): boolean {
    const { extension } = this;

    return !!extension;
  }

  checkIsBlob(): boolean {
    const { mimeType } = this;

    return MIME_TYPES_CLASS_BLOB_TYPES.includes(mimeType);
  }

  checkIsJSON(): boolean {
    const { extension } = this;

    return !!extension && MIME_TYPES_CLASS_JSON_EXTENSIONS.includes(extension);
  }

  checkIsText(): boolean {
    const { mimeType } = this;

    if (MIME_TYPES_CLASS_TEXT_TYPES.includes(mimeType)) {
      return true;
    }

    const { extension } = this;

    if (extension) {
      return MIME_TYPES_CLASS_TEXT_EXTENSIONS.includes(extension);
    }
    return false;
  }

  checkFileExtension() {
    const { mimeType } = this;

    this.extension = mime.getExtension(mimeType);
  }

  processMimeType() {
    this.checkFileExtension();
    if ((this.isText = this.checkIsText())) {
      return;
    }
    if ((this.isBlob = this.checkIsBlob())) {
      return;
    }
    if ((this.isJSON = this.checkIsJSON())) {
      return;
    }
    if ((this.isFile = this.checkIsFile())) {
      return;
    }
    this.isUnknown = true;
  }
}
