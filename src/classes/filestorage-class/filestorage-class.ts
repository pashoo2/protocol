import {
  IFileStorageServiceDescription,
  IFileStorage,
} from './filestorage-class.types';

export class FileStorage {
  public readonly services: IFileStorageServiceDescription[] = [];
  public async connect() {}
  public async get() {}
  public async add() {}
}
