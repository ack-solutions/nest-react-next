import { NestAuthModule } from '@ackplus/nest-auth';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';

import { Configs } from './app/config';
import { TypeOrmConfigService } from './app/core/service/typeorm-config.service';
import { ALL_ENTITIES } from './app/entities';
import { seeder } from '@ackplus/nest-seeder';
import { ALL_SEEDERS } from './app/seeders';


dotenv.config();

seeder({
    imports: [
        ConfigModule.forRoot({
            load: Configs,
        }),
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useClass: TypeOrmConfigService,
            dataSourceFactory: async (options) => {
                const dataSource = await new DataSource(options).initialize();
                global['dataSource'] = dataSource;
                return dataSource;
            },
        }),
        EventEmitterModule.forRoot(),
        NestAuthModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                appName: 'API Seeder',
                jwt: {
                    secret: configService.get('jwt.secret'),
                },
            }),
        }),
        TypeOrmModule.forFeature(ALL_ENTITIES),
    ],
}).run({
    seeders: ALL_SEEDERS,
});
