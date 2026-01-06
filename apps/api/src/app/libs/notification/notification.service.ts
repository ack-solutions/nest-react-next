import { Injectable } from '@nestjs/common';

import { EmailNotificationService, INotifiableData } from './providers/email-notification.service';
import { ISendMailOptions } from '@nestjs-modules/mailer';


interface INotifiable {
    email: string,
    [x: string]: string;
}
@Injectable()
export class NotificationService {

    public constructor(
        private readonly emailNotificationService: EmailNotificationService,
    ) { }

    async sendEmail(template: string, notifiable: INotifiable, data: INotifiableData, sendMailOptions: ISendMailOptions = {}) {
        await this.emailNotificationService.sendEmail(template, notifiable, data, sendMailOptions);
    }

}
