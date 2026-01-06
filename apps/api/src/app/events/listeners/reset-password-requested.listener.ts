import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';

import { NestAuthEvents, PasswordResetRequestedEvent } from '@ackplus/nest-auth';
import { User } from '../../modules/user/user.entity';
import { BaseRepository } from '../../core/typeorm/base-repository';
import { NotificationService } from '../../libs/notification/notification.service';

/**
 * Handles password reset requested events
 * Sends forgot password email when a user requests password reset
 */
@Injectable()
export class PasswordResetRequestedListener {
    private readonly logger = new Logger(PasswordResetRequestedListener.name);

    constructor(
        @InjectRepository(User)
        private readonly userRepository: BaseRepository<User>,
        private readonly notificationService: NotificationService,
    ) { }

    /**
     * Handle password reset requested event
     * Sends forgot password OTP email to the user
     */
    @OnEvent(NestAuthEvents.PASSWORD_RESET_REQUESTED)
    async handlePasswordResetRequested(event: PasswordResetRequestedEvent): Promise<void> {
        try {
            const { user: authUser, otp } = event.payload;

            if (!authUser?.email || !otp?.code) {
                this.logger.warn('Missing required data for password reset email', {
                    hasEmail: !!authUser?.email,
                    hasOtp: !!otp?.code,
                });
                return;
            }

            // Get the app user record to get additional information if needed
            const user = await this.userRepository.findOne({
                where: { authUserId: authUser.id },
            });

            // Send forgot password OTP email using the notification service

            const options = {
                loginUrl: `${process.env.FORN_URL}/auth/login`,
                firstName: user?.firstName || '',
                lastName: user?.lastName || '',
                otp: otp.code,
                expiryMinutes: 15,
            }
            await this.notificationService.sendEmail('forgot-password-otp-verification', { email: authUser.email, }, options,);

            this.logger.log(`Successfully sent password reset OTP email to user: ${authUser.email}`);
        } catch (error) {
            this.logger.error('Failed to send password reset OTP email', error.stack);
            throw error;
        }
    }
}
