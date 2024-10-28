import * as dotenv from 'dotenv';
dotenv.config();
import { ConfigModule, ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { SeederModuleExtraOptions } from './seeder/seeder.module';
import { seeder } from './seeder/seeder';
import { Configs } from '@mlm/nest-core';
import { TypeOrmConfigService } from '@mlm/nest-core';
import { seeders } from '../app/core/core-seeders';
import { entities } from '../app/core/core-entities';


export async function seedRunner(extraOptions: Partial<SeederModuleExtraOptions> = {}) {

    return seeder({
        imports: [
            ConfigModule.forRoot({
                load: Configs,
            }),
            TypeOrmModule.forRootAsync({
                imports: [ConfigModule,],
                inject: [ConfigService,],
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
