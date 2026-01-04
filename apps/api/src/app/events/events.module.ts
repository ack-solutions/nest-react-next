import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserRegisteredListener, PasswordResetRequestedListener } from './listeners';
import { User } from '../modules/user/user.entity';
import { NotificationModule } from '../libs/notification/notification.module';

/**
 * Events Module
 * Centralized module for managing all event listeners
 * This module can be imported by other modules that need event handling
 */
@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        NotificationModule,
    ],
    providers: [
        UserRegisteredListener,
        PasswordResetRequestedListener,
        // Add more event listeners here as needed
    ],
    exports: [
        UserRegisteredListener,
        PasswordResetRequestedListener,
        // Export listeners that other modules might need
    ],
})
export class EventsModule { }
