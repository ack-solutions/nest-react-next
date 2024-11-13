import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { TypeOrmConfigService } from './core/typeorm/typeorm-config.service';
import { ApiModule } from './api.module';
import { Configs } from './core/config';

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
