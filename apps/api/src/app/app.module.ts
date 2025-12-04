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
import { AuthConfigService } from './core/service/auth-config.service';


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
                global.dataSource = dataSource;
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
            useClass: AuthConfigService,
        }),

        NestDynamicTemplatesModule.forRoot({
            isGlobal: true,
            enginesOptions: {
                filters: templateFilters,
            },
        }),
        RoleModule,
        UsersModule,
        PageModule,
        CountryModule,
        CmsModule,
        TemplateModule,
        SettingModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {

    configure(consumer: MiddlewareConsumer) {
        consumer.apply(RequestContextMiddleware).forRoutes('*');
    }

}
