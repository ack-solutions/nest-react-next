import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';

import { NestAuthEvents, UserRegisteredEvent } from '@ackplus/nest-auth';
import { User } from '@api/app/modules/user/user.entity';
import { BaseRepository } from '@api/app/core/typeorm/base-repository';

/**
 * Handles user registration events
 * Creates entries in the user table when a user registers through the auth system
 */
@Injectable()
export class UserRegisteredListener {
    private readonly logger = new Logger(UserRegisteredListener.name);

    constructor(
        @InjectRepository(User)
        private readonly userRepository: BaseRepository<User>,
    ) { }

    /**
     * Handle user registration event
     * Creates a new user entry in the user table with data from the auth system
     */
    @OnEvent(NestAuthEvents.REGISTERED)
    async handleUserRegistered(event: UserRegisteredEvent): Promise<void> {
        this.logger.log(`Handling user registration event for auth user`);
        const { user: authUser, input } = event.payload;

        try {
            // Check if user already exists to prevent duplicates
            const existingUser = await this.userRepository.findOne({
                where: { authUserId: authUser.id },
            });
            console.log(existingUser, 'Existing User');
            if (existingUser) {
                this.logger.warn(`User already exists for auth user ID: ${authUser.id}`);
                return;
            }

            // Create user entity
            const userData: Partial<User> = {
                authUserId: authUser.id,
                firstName: (input as any).firstName,
                lastName: (input as any).lastName,
            };


            // Remove undefined values
            Object.keys(userData).forEach(key => {
                if (userData[key] === undefined) {
                    delete userData[key];
                }
            });

            const user = this.userRepository.create(userData);
            await this.userRepository.save(user);

            this.logger.log(`Successfully created user entry for auth user: ${user.id}, user ID: ${user.id}`);
        }
        catch (error) {
            this.logger.error(`Failed to create user entry for auth user: ${authUser.id}`, error.stack);
            throw error;
        }
    }
}
