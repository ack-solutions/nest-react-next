import { StorageFactory } from './storage.factory';
import { FileStorageEnum, FileStorageModuleOptions } from './types';


export class FileStorageService {

    private static options: FileStorageModuleOptions; // ✅ Static global property

    static setOptions(options: FileStorageModuleOptions) {
        FileStorageService.options = options;
    }

    static getOptions(): FileStorageModuleOptions {
        return FileStorageService.options;
    }

    static getStorage(storageType?: FileStorageEnum) {
        if (!storageType) {
            storageType = this.getOptions().storage;
        }
        const config = this.getOptions()[`${storageType}Config`];
        return StorageFactory.createStorage(storageType, config);
    }

}
