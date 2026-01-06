import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { NestAuthEvents, UserRegisteredEvent } from '@ackplus/nest-auth';
import { User } from '../../modules/user/user.entity';
import { BaseRepository } from '../../core/typeorm/base-repository';
import { NotificationService } from '../../libs/notification/notification.service';

/**
 * Handles user registration events
 * Creates entries in the user table when a user registers through the auth system
 * Assigns default 'User' role if no role is provided
 * Processes referrals and awards if a referral code was used during signup
 */
@Injectable()
export class UserRegisteredListener {
    private readonly logger = new Logger(UserRegisteredListener.name);

    constructor(
        @InjectRepository(User)
        private readonly userRepository: BaseRepository<User>,

        private readonly notificationService: NotificationService
    ) { }

    /**
     * Handle user registration event
     * Creates a new user entry in the user table with data from the auth system
     * Assigns default 'User' role if no role is provided in the request
     * Processes referral and rewards if a referral code was provided
     */
    @OnEvent(NestAuthEvents.REGISTERED)
    async handleUserRegistered(event: UserRegisteredEvent): Promise<void> {
        this.logger.log(`Handling user registration event for auth user: ${event.payload.user.id}`);
        const { user: authUser, input } = event.payload;

        try {
            // Check if user already exists to prevent duplicates
            const existingUser = await this.userRepository.findOne({
                where: { authUserId: authUser.id },
            });

            if (existingUser) {
                this.logger.warn(`User already exists for auth user ID: ${authUser.id}`);
                return;
            }

            // // Get referrer info if referral code was provided
            // let referrerId: string | null = null;
            // let referralCode: string | null = null;

            // if (input?.referralCode) {
            //     referralCode = normalizeReferralCode(input.referralCode);

            //     const referrer = await this.userRepository.findOne({
            //         where: { referralCode },
            //         select: ['id', 'referralCode'],
            //     });

            //     if (referrer) {
            //         referrerId = referrer.id;
            //         this.logger.log(`Found referrer ${referrerId} for referral code ${referralCode}`);
            //     } else {
            //         this.logger.warn(`Referral code ${referralCode} not found, ignoring`);
            //         referralCode = null;
            //     }
            // }

            // Create user entity
            const userData: Partial<User> = {
                authUserId: authUser.id,
                firstName: input?.firstName,
                lastName: input?.lastName,
                phoneCountryCode: input?.phoneCountryCode,
                phoneNumber: input?.phoneNumber,
                phoneIsoCode: input?.phoneIsoCode,
            };

            // Remove undefined values
            Object.keys(userData).forEach((key) => {
                const typedKey = key as keyof User;
                if (userData[typedKey] === undefined) {
                    delete userData[typedKey];
                }
            });

            const user = this.userRepository.create(userData);
            await this.userRepository.save(user);

            const options = {
                loginUrl: `${process.env.FORN_URL}/auth/login`,
                firstName: user.firstName,
                lastName: user.lastName,
            }

            this.notificationService.sendEmail('welcome-email', { email: authUser.email }, options)

            this.logger.log(`Successfully created user entry for auth user: ${authUser.id}, user ID: ${user.id}`);
        } catch (error) {
            this.logger.error(`Failed to create user entry for auth user: ${authUser.id}`, error.stack);
            throw error;
        }
    }
}
