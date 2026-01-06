import { NestAuthModule } from '@ackplus/nest-auth';
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserRegisteredListener, PasswordResetRequestedListener, SendMfaCodeListener } from './listeners';
import { User } from '../modules/user/user.entity';
import { NotificationModule } from '../libs/notification/notification.module';
import { UserLoginListener } from './listeners/user-login.listener';
import { ConfigModule } from '@nestjs/config';

/**
 * Events Module
 * Centralized module for managing all event listeners
 * This module can be imported by other modules that need event handling
 */
@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        NotificationModule,
        NestAuthModule,
        ConfigModule,
    ],
    providers: [
        UserRegisteredListener,
        PasswordResetRequestedListener,
        SendMfaCodeListener,
        UserLoginListener,
    ],
    exports: [
        UserRegisteredListener,
        PasswordResetRequestedListener,
        UserLoginListener,
        SendMfaCodeListener,
    ],
})
export class EventsModule { }
