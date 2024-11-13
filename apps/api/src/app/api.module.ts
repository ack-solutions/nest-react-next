import { MiddlewareConsumer, Module, OnModuleInit } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/user';
import { RoleModule } from './modules/role';
import { PermissionModule } from './modules/permission/permission.module';
import { AuthModule } from './modules/auth/auth.module';
import { RequestContextMiddleware } from './core/request-context/request-context.middleware';

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    AuthModule,
    RoleModule,
    PermissionModule,
  ],
  controllers: [],
  providers: [],
})

export class ApiModule {

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestContextMiddleware).forRoutes('*');
  }
  
}
