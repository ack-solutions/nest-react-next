import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

import { ApiModule } from './api.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Configs } from './core/config';
import { TypeOrmConfigService } from './core/typeorm/typeorm-config.service';


@Module({
    imports: [
        ConfigModule.forRoot({ load: Configs }),
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
        ApiModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})

export class AppModule {

}

