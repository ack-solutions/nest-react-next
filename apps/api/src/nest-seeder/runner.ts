import * as dotenv from 'dotenv';
dotenv.config();
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { SeederModuleExtraOptions } from './seeder/seeder.module';
import { seeder } from './seeder/seeder';
import { seeders } from '../app/core/core-seeders';
import { entities } from '../app/core/core-entities';
import { TypeOrmConfigService } from '../app/core/typeorm-config.service';
import database from '../app/core/database';



export async function seedRunner(extraOptions: Partial<SeederModuleExtraOptions> = {}) {

    return seeder({
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
            TypeOrmModule.forFeature(entities),
        ],
    }).run({
        seeders: seeders,
        ...extraOptions
    });
}
