import { NestAuthModule } from '@ackplus/nest-auth';
import { NestDynamicTemplatesModule } from '@ackplus/nest-dynamic-templates';
import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Configs } from './config';
import { RequestContextMiddleware } from './core/request-context/request-context.middleware';
import { TypeOrmConfigService } from './core/service/typeorm-config.service';
import { CmsModule } from './modules/cms/cms.module';
import { CountryModule } from './modules/country/country.module';
import { PageModule } from './modules/page/page.module';
import { RoleModule } from './modules/role/role.module';
import { SettingModule } from './modules/setting/setting.module';
import { TemplateModule } from './modules/template/template.module';
import { UsersModule } from './modules/user/users.module';
import { templateFilters } from './utils/template-filter';
import { EventsModule } from './events/events.module';
import { NestAuthConfigService } from './core/service/nest-auth-config.service';
import { FileStorageEnum, NestFileStorageModule } from '@ackplus/nest-file-storage';
import path from 'path';
import { PermissionModule } from './modules/permission/permission.module';


@Module({
    imports: [
        ConfigModule.forRoot({
            load: Configs,
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useClass: TypeOrmConfigService,
            dataSourceFactory: async options => {
                const dataSource = await new DataSource(options).initialize();
                (global as any).dataSource = dataSource;
                return dataSource;
            },
        }),
        ThrottlerModule.forRoot([
            {
                ttl: 60000,
                limit: 20,
            },
        ]),
        EventEmitterModule.forRoot({
            wildcard: true,
            delimiter: '.',
            newListener: true,
            removeListener: true,
            maxListeners: 10,
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
                storage: (process.env.FILE_STORAGE ||
                    FileStorageEnum.LOCAL) as any,
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


        NestDynamicTemplatesModule.forRoot({
            isGlobal: true,
            enginesOptions: {
                globalValues: {
                    currentYear: new Date().getFullYear(),
                    appName: process.env.APP_NAME || '',
                    appUrl: process.env.FRONT_URL || '',
                },
                filters: templateFilters,
            },
        }),
        RoleModule,
        PermissionModule,
        UsersModule,
        PageModule,
        CountryModule,
        CmsModule,
        TemplateModule,
        SettingModule,
        EventsModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {

    configure(consumer: MiddlewareConsumer) {
        consumer.apply(RequestContextMiddleware).forRoutes('*');
    }

}
