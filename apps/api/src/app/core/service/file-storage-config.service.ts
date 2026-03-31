import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileStorageEnum, FileStorageModuleOptions, FileStorageOptionsFactory } from '@ackplus/nest-file-storage';
import path from 'path';
import { IStorageConfig } from '../../config/storage';
import { IAppConfig } from '../../config/app';
@Injectable()
export class FileStorageConfigService implements FileStorageOptionsFactory {
    constructor(private readonly configService: ConfigService) { }

    createFileStorageOptions(): FileStorageModuleOptions {
        const config = this.configService.get<IStorageConfig>('storage');
        const appConfig = this.configService.get<IAppConfig>('app');

        if (config.type === FileStorageEnum.S3) {
            return {
                storage: FileStorageEnum.S3,
                s3Config: {
                    endpoint: config.endpoint,
                    accessKeyId: config.accessKeyId,
                    secretAccessKey: config.secretAccessKey,
                    region: config.region,
                    bucket: config.bucket,
                    cloudFrontUrl: config.cloudFrontUrl,
                },
            };
        }

        if (config.type === FileStorageEnum.AZURE) {
            return {
                storage: FileStorageEnum.AZURE,
                azureConfig: {
                    account: config.accessKeyId,
                    accountKey: config.secretAccessKey,
                    container: config.bucket,
                },
            };
        }

        // Default to Local
        return {
            storage: FileStorageEnum.LOCAL,
            localConfig: {
                rootPath: path.join(process.cwd(), 'public'),
                baseUrl: `${appConfig.appUrl}/public`,
            },
        };
    }
}
