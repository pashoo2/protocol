import { FILE_STORAGE_SERVICE_TYPE, FILE_STORAGE_SERVICES_IMPLEMENTATIONS } from './filestorage-class.const';
import { IFileStorageServiceConnectOptions, IFileStorageService } from './filestorage-class.types';
import assert from 'assert';
import path from 'path';
import { FILE_STORAGE_SERVICE_PREFIX, FILE_STORAGE_SERVICE_PREFIX_LENGTH } from './filestorage-class.const';
import { TFileStorageFileAddress, TFileStorageServiceFileGetOptions } from './filestorage-class.types';
import { TFileStorageServiceIdentifier, TFileStorageFile, TFileStorageServiceFileAddOptions } from './filestorage-class.types';
import { IFileStorage, TFileStorageServiceFileDownloadOptions } from './filestorage-class.types';

export class FileStorage<T extends FILE_STORAGE_SERVICE_TYPE> implements IFileStorage<T> {
  protected readonly services = new Map<TFileStorageServiceIdentifier, IFileStorageService<T>>();

  protected readonly servicesByTypes = new Map<T, IFileStorageService<T>>();

  public connect = async (configurations: IFileStorageServiceConnectOptions<T>[]) => {
    return Promise.all(configurations.map(this.connectToService));
  };

  public close = async (s: TFileStorageServiceIdentifier) => {
    const service = this.getServiceByTypeOrId(s);

    if (!service) {
      throw new Error(`Service with the given identifier = "${s}" was not found`);
    }
    return this.removeService(service);
  };

  public add = async (
    s: TFileStorageServiceIdentifier | T,
    filename: string,
    file: TFileStorageFile,
    options?: TFileStorageServiceFileAddOptions
  ) => {
    const service = this.getServiceByTypeOrId(s);

    if (!service) {
      throw new Error(`Service with the given identifier or type = "${s}" was not found`);
    }
    return this.addPrefixToFileAddress(await service.add(filename, file, options));
  };

  public get = async (addr: TFileStorageFileAddress, options?: TFileStorageServiceFileGetOptions) => {
    const addrWOPrefix = this.getAddrWOPrefix(addr);
    const service = this.getServiceByFileAddr(addrWOPrefix);

    if (!service) {
      throw new Error(`A file with the address "${addr}" is not supported`);
    }
    return service.get(addrWOPrefix, options);
  };

  public async download(addr: TFileStorageFileAddress, options?: TFileStorageServiceFileDownloadOptions) {
    const addrWOPrefix = this.getAddrWOPrefix(addr);
    const service = this.getServiceByFileAddr(addrWOPrefix);

    if (!service) {
      throw new Error(`A file with the address "${addr}" is not supported`);
    }
    return service.download(addrWOPrefix, options);
  }

  protected getAddrWOPrefix(addr: TFileStorageFileAddress): string {
    if (!addr.startsWith(FILE_STORAGE_SERVICE_PREFIX)) {
      throw new Error(`Uknown address ${addr}`);
    }
    return addr.slice(FILE_STORAGE_SERVICE_PREFIX_LENGTH);
  }

  protected addPrefixToFileAddress(addrWOPrefix: TFileStorageFileAddress): string {
    if (typeof addrWOPrefix !== 'string') {
      throw new Error('The result is not a valid file address');
    }
    return path.join(FILE_STORAGE_SERVICE_PREFIX, addrWOPrefix);
  }

  protected getServiceById(serviceId: TFileStorageServiceIdentifier) {
    return this.services.get(serviceId);
  }

  protected getServiceByType(serviceType: T) {
    return this.servicesByTypes.get(serviceType);
  }

  protected getServiceByTypeOrId(s: TFileStorageServiceIdentifier | T) {
    return this.getServiceById(s) || this.getServiceByType(s as T);
  }

  protected getServiceConstructorByType(type: FILE_STORAGE_SERVICE_TYPE) {
    const constructorGetter = FILE_STORAGE_SERVICES_IMPLEMENTATIONS[type];
    return constructorGetter();
  }

  protected getServiceByFileAddr(addr: TFileStorageFileAddress) {
    for (const sevice of this.services.values()) {
      if (sevice.isFileServed(addr)) {
        return sevice;
      }
    }
  }

  protected addService<ST extends T>(type: ST, service: IFileStorageService<ST>) {
    this.services.set(service.identifier, service);
    this.servicesByTypes.set(type, service);
  }

  protected removeService(service: IFileStorageService<T>) {
    this.services.delete(service.identifier);
    this.servicesByTypes.delete(service.type as T);
  }

  protected connectToService = async (
    configuration: IFileStorageServiceConnectOptions<T>
  ): Promise<TFileStorageServiceIdentifier> => {
    assert(configuration, 'Service configuration was not provided');

    const { type, options } = configuration;

    assert(type, 'Service type must be defined');
    assert(options, `Options for the service "${type}" must be defined`);

    const ServiceConstuctor = await this.getServiceConstructorByType(configuration.type);
    const service = new (ServiceConstuctor.default ?? ServiceConstuctor)();

    await service.connect(options);
    this.addService(type as T, service);
    return service.identifier as string;
  };
}
