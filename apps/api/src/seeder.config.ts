import { NestAuthModule } from '@ackplus/nest-auth';
import { NestDynamicTemplatesModule } from '@ackplus/nest-dynamic-templates';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { FileStorageEnum, NestFileStorageModule } from '@ackplus/nest-file-storage';
import path from 'path';

import { Configs } from './app/config';
import { ALL_SEEDERS } from './app/seeders';
import { ALL_ENTITIES } from './app/entities';
import { templateFilters } from './app/utils/template-filter';
import { TypeOrmConfigService } from './app/core/service/typeorm-config.service';
import { DataSource } from 'typeorm';
import { NestAuthConfigService } from './app/core/service/nest-auth-config.service';

dotenv.config();

export default {
    imports: [
        ConfigModule.forRoot({
            load: Configs,
        }),
        EventEmitterModule.forRoot({
            wildcard: true,
            delimiter: '.',
            newListener: true,
            removeListener: true,
            maxListeners: 10,
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useClass: TypeOrmConfigService,
            dataSourceFactory: async (options: any) => {
                const dataSource = await new DataSource(options).initialize();
                (global as any)['dataSource'] = dataSource;
                return dataSource;
            },
        }),
        NestAuthModule.forRootAsync({
            isGlobal: true,
            imports: [ConfigModule],
            useClass: NestAuthConfigService,
        }),
        NestFileStorageModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: () => ({
                storage: FileStorageEnum.LOCAL,
                s3Config: {
                    accessKeyId: process.env.AWS_S3_ACCESS_KEY_ID,
                    secretAccessKey: process.env.AWS_S3_SECRET_ACCESS_KEY,
                    region: process.env.AWS_S3_REGION,
                    bucket: process.env.AWS_S3_BUCKET,
                    cloudFrontUrl: process.env.AWS_CDN_URL,
                },
                localConfig: {
                    rootPath: path.join(process.cwd(), 'public'),
                    baseUrl: `${process.env.API_URL}/public`,
                },
            }),
        }),
        TypeOrmModule.forFeature(ALL_ENTITIES),
        NestDynamicTemplatesModule.forRoot({
            isGlobal: true,
            enginesOptions: {
                filters: templateFilters,
            },
        }),
    ],
    seeders: [...ALL_SEEDERS],
};
