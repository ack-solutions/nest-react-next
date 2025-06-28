import { AzureStorage } from './storage/azure.storage';
import { LocalStorage } from './storage/local.storage';
import { S3Storage } from './storage/s3.storage';
import { AzureStorageOptions, FileStorageEnum, LocalStorageOptions, S3StorageOptions, StorageOptions } from './types';


export class StorageFactory {

    static createStorage(storageType: FileStorageEnum, options: StorageOptions) {
        switch (storageType) {
            case FileStorageEnum.S3:
                return new S3Storage(options as S3StorageOptions);
            case FileStorageEnum.AZURE:
                return new AzureStorage(options as AzureStorageOptions);
            case FileStorageEnum.LOCAL:
            default:
                return new LocalStorage(options as LocalStorageOptions);
        }
    }

}
