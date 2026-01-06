import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

import { NestAuthMFAMethodEnum, NestAuthEvents, TwoFactorCodeSentEvent } from '@ackplus/nest-auth';
import { User } from '../../modules/user/user.entity';
import { NotificationService } from '../../libs/notification/notification.service';

/**
 * Handles two-factor authentication code sending events
 * Sends MFA verification code email when requested by the auth system
 */
@Injectable()
export class SendMfaCodeListener {
    private readonly logger = new Logger(SendMfaCodeListener.name);

    constructor(
        private readonly notificationService: NotificationService,
    ) { }

    /**
     * Handle two-factor code sent event
     * Sends MFA verification code via email using the login-otp-verification template
     */
    @OnEvent(NestAuthEvents.TWO_FACTOR_CODE_SENT)
    async handleSendMfaCode(event: TwoFactorCodeSentEvent): Promise<void> {
        this.logger.log(`Handling send mfa code event for auth user`);
        const { user: authUser, method, code } = event.payload;

        try {
            const user = await User.findOne({ where: { authUserId: authUser.id } });
            if (method === NestAuthMFAMethodEnum.EMAIL) {
                const options = {
                    otp: code,
                    email: authUser?.email,
                    firstName: user?.firstName,
                    lastName: user?.lastName,
                    expiryMinutes: 15,
                    timestamp: new Date().toISOString(),
                    ipAddress: '',
                }
                await this.notificationService.sendEmail('login-otp-verification', { email: authUser?.email }, options);
            }
            this.logger.log(`Successfully send mfa code for auth user: ${authUser.id}`);
        }
        catch (error) {
            this.logger.error(`Failed to send mfa code for auth user: ${authUser.id}`, error.stack);
            throw error;
        }
    }
}
