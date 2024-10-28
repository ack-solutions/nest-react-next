import { DynamicModule, Module, OnModuleInit } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Configs} from '@mlm/nest-core';
import { DataSource } from 'typeorm';
import { UsersModule } from './module/user';
import { RoleModule } from './module/role';
import { PermissionModule } from './module/permission/permission.module';
import { TypeOrmConfigService } from './core/database';

@Module({
  imports: [
    ConfigModule.forRoot({  load: Configs }),
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
    UsersModule,
    // AuthModule,
    RoleModule,
    PermissionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
// export class AppModule {

//   constructor() { }
//   static forRoot(): DynamicModule {
//     return {
//       module: AppModule,
      
//       controllers: [AppController],
//       providers: [AppService],
//       exports: []
//     };

//   }
// }
export class AppModule implements OnModuleInit {
  constructor() { }
  onModuleInit() {
    // throw new Error('Method not implemented.');
  }

}
