import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import * as dotenv from 'dotenv';
import { DataSource } from "typeorm";

import database from './app/core/config/database';
import { AllEntities } from './app/core/entities';
import { seeder } from './app/core/nest-seeder';
import { AllSeeders } from './app/core/seeders';
import { TypeOrmConfigService } from './app/core/typeorm/typeorm-config.service';


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
        TypeOrmModule.forFeature(AllEntities),
    ],
}).run({
    seeders: AllSeeders,
});
