import {
  IFileStorageServiceDescription,
  IFileStorage,
} from './filestorage-class.types';

export class FileStorage implements IFileStorage {
  public readonly services: IFileStorageServiceDescription[] = [];
  public async connect() {}
  public async get() {}
  public async add() {}
  public async download() {}
}
