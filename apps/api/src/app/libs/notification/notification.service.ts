import { Injectable } from '@nestjs/common';

import { EmailNotificationService } from './providers/email-notification.service';


interface INotifiable {
    email: string,
    [x: string]: string;
}
@Injectable()
export class NotificationService {

    public constructor(
        private readonly emailNotificationService: EmailNotificationService,
    ) { }

    async welcomeEmail(notifiable, tempOption = {}) {
        await this.emailNotificationService.welcomeEmail(notifiable, tempOption);
    }

    async sendOtpMail(notifiable: INotifiable, tempOption = {}) {
        await this.emailNotificationService.sendOtpMail(notifiable, tempOption);
    }

    async loginEmailVerificationOtp(notifiable, tempOption = {}) {
        await this.emailNotificationService.loginEmailVerificationOtp(notifiable, tempOption);
    }

    async registerEmailVerificationOtp(notifiable, tempOption = {}) {
        await this.emailNotificationService.registerEmailVerificationOtp(notifiable, tempOption);
    }

    async forgotPasswordVerification(notifiable, tempOption = {}) {
        await this.emailNotificationService.forgotPasswordVerification(notifiable, tempOption);
    }
    async sendInvoiceToCustomer(notifiable, tempOption = {}) {
        await this.emailNotificationService.sendInvoiceToCustomer(notifiable, tempOption);
    }

}
