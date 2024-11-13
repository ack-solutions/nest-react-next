import * as dotenv from 'dotenv';
dotenv.config();
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import database from './app/core/config/database';
import { AllEntities } from './app/core/entities';
import { AllSeeders } from './app/core/seeders';
import { TypeOrmConfigService } from './app/core/typeorm/typeorm-config.service';
import { seeder } from './app/core/nest-seeder';



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
