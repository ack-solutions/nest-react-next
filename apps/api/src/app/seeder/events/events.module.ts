import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserRegisteredListener } from './listeners';
import { User } from '@api/app/modules/user/user.entity';

/**
 * Events Module
 * Centralized module for managing all event listeners
 * This module can be imported by other modules that need event handling
 */
@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
    ],
    providers: [
        UserRegisteredListener,
        // Add more event listeners here as needed
    ],
    exports: [
        UserRegisteredListener,
        // Export listeners that other modules might need
    ],
})
export class EventsModule { }
