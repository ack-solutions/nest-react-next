import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from '../../modules/user/user.entity';
import { BaseRepository } from '../../core/typeorm/base-repository';
import { NestAuthEvents, PasswordResetRequestedEvent } from '@ackplus/nest-auth';
import { EmailNotificationService } from '@api/app/libs/notification/providers/email-notification.service';

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
        private readonly emailNotificationService: EmailNotificationService
    ) { }

    /**
     * Handle password reset requested event
     * Sends forgot password OTP email to the user
     */
    @OnEvent(NestAuthEvents.PASSWORD_RESET_REQUESTED)
    async handlePasswordResetRequested(event: PasswordResetRequestedEvent): Promise<void> {
        const { user: authUser, otp } = event.payload;

        // Get the app user record to get additional information if needed
        const user = await this.userRepository.findOne({
            where: { authUserId: authUser.id },
        });
        // Prepare email data for OTP verification
        const emailData = {
            firstName: user?.firstName || 'User',
            lastName: user?.lastName || '',
            email: authUser.email,
            otp: otp.code,
            expiryMinutes: 10, // OTP typically expires faster than reset links
        };

        // Send forgot password OTP email using the existing service method
        await this.emailNotificationService.forgotPasswordVerification(
            { email: authUser.email, firstName: emailData.firstName, lastName: emailData.lastName },
            emailData
        );

        this.logger.log(`Successfully sent password reset OTP email to user: ${authUser.email}, OTP: ${otp}`);

    }

}
