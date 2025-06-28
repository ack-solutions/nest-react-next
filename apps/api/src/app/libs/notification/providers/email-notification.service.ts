import { BadGatewayException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import * as nunjucks from 'nunjucks';

import { EmailTemplate } from '../../../modules/email-template/email-template.entity';
import { getDataSource } from '../../../utils/database';


@Injectable()
export class EmailNotificationService {

    public constructor(
        private readonly configService: ConfigService,
        private readonly mailerService: MailerService,

    ) { }

    getReplaceData(data = {}) {
        return {
            heading: 'Inventory',
            ...data,
        };
    }
    private getTo(notifiable) {
        return notifiable.email;
    }

    async send(
        to: string,
        subject: string,
        html: any,
        sendMailOptions: ISendMailOptions = {},
    ): Promise<any> {
        if (!(to && subject && html)) {
            throw new BadGatewayException('Email send failed, Please check email.');
        }


        const template = nunjucks.renderString(html, {
            html: new nunjucks.runtime.SafeString(html),
        });

        try {
            await this.mailerService.sendMail({
                to,
                from: this.configService.get('mail.from'),
                subject,
                html: template,
                ...sendMailOptions,
            });
        } catch (error) {
            throw new BadGatewayException(error || 'Email send failed, Please check your email.');
        }
    }


    getTemplate(slug, data = {}): Promise<any> {
        return new Promise((resolve, reject) => {
            if (slug) {
                const dataSource = getDataSource();
                const query = dataSource.getRepository(EmailTemplate).createQueryBuilder('emailTemplate');
                query.where({
                    slug: slug,
                });
                query.getOne().then((template: EmailTemplate) => {
                    if (template) {
                        const replaceData = this.getReplaceData(data);
                        nunjucks.configure({ autoescape: false });
                        const subject = nunjucks.renderString(template?.emailSubject, replaceData);
                        nunjucks.configure({ autoescape: false });
                        const body = nunjucks.renderString(template?.emailBody, replaceData);
                        resolve({
                            subject,
                            body,
                        });
                    } else {
                        reject('Template not found');
                    }
                }).catch(() => {
                    reject('Template not found');
                });
            } else {
                reject('Slug not found');
            }
        });
    }

    async welcomeEmail(notifiable, data) {
        const to = this.getTo(notifiable);
        return this.getTemplate('welcome-email', {
            ...notifiable,
            ...data,
        }).then(({ subject, body }) => {
            return this.send(to, subject, body);
        });
    }

    async sendOtpMail(notifiable, data) {
        const to = this.getTo(notifiable);
        return this.getTemplate('sent-otp', {
            ...notifiable,
            ...data,
        }).then(({ subject, body }) => {
            return this.send(to, subject, body);
        });
    }

    async registerEmailVerificationOtp(notifiable, data) {
        const to = notifiable?.email;
        return this.getTemplate('otp-verification', {
            ...notifiable,
            ...data,
        }).then(({ subject, body }) => {
            return this.send(to, subject, body);
        });
    }

    async loginEmailVerificationOtp(notifiable, data) {
        const to = notifiable?.email;
        return this.getTemplate('login-otp', {
            ...notifiable,
            ...data,
        }).then(({ subject, body }) => {
            return this.send(to, subject, body);
        });
    }

    async forgotPasswordVerification(notifiable, data) {
        const to = notifiable?.email;
        return this.getTemplate('forgot-password-otp-verification', {
            ...notifiable,
            ...data,
        }).then(({ subject, body }) => {
            return this.send(to, subject, body);
        });
    }

    async sendInvoiceToCustomer(notifiable, data) {
        const to = notifiable?.email;
        return this.getTemplate('send-invoice-to-customer', {
            ...notifiable,
            ...data,
        }).then(({ subject, body }) => {
            return this.send(to, subject, body, { attachments: data.attachments });
        });
    }


}
