import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/user';
import { RoleModule } from './modules/role';
import { PermissionModule } from './modules/permission/permission.module';
import { AuthModule } from './modules/auth/auth.module';
import { RequestContextMiddleware } from './core/request-context/request-context.middleware';
import { PageModule } from './modules/page/page.module';
import { NotificationTemplateModule } from './modules/notification-template/notification-template.module';

@Module({
    imports: [
        ConfigModule,
        UsersModule,
        AuthModule,
        RoleModule,
        PermissionModule,
        PageModule,
        NotificationTemplateModule
    ],
    controllers: [],
    providers: [],
})
export class ApiModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(RequestContextMiddleware).forRoutes('*');
    }
}
