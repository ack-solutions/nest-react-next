import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';

import database from './app/config/database';
import { TypeOrmConfigService } from './app/core/typeorm/typeorm-config.service';
import { ALL_ENTITIES } from './app/entities';
import { seeder } from './app/libs/nest-seeder';
import { ALL_SEEDERS } from './app/seeders';


dotenv.config();

seeder({
    imports: [
        ConfigModule.forFeature(database),
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
        TypeOrmModule.forFeature(ALL_ENTITIES),
    ],
}).run({
    seeders: ALL_SEEDERS,
});
