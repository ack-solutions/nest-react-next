import { BadGatewayException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import * as nunjucks from 'nunjucks';
import { TemplateService as NestTemplateService, RenderTemplateOutputDTO } from '@ackplus/nest-dynamic-templates';


@Injectable()
export class EmailNotificationService {
    private readonly logger = new Logger(EmailNotificationService.name);

    public constructor(
        private readonly configService: ConfigService,
        private readonly mailerService: MailerService,
        private readonly nestTemplateService: NestTemplateService,

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


    async getTemplate(slug, data = {}): Promise<RenderTemplateOutputDTO> {
        const globalValues = {
            now: new Date(),
            curruntYear: new Date().getFullYear()
        }

        return this.nestTemplateService.render({
            name: slug,
            context: { ...(data || {}), ...globalValues },
        });
    }

    async welcomeEmail(notifiable, data) {
        const to = this.getTo(notifiable);
        return this.getTemplate('welcome-email', {
            ...notifiable,
            ...data,
        }).then(({ subject, content }) => {
            return this.send(to, subject, content);
        });
    }

    async sendOtpMail(notifiable, data) {
        const to = this.getTo(notifiable);
        return this.getTemplate('sent-otp', {
            ...notifiable,
            ...data,
        }).then(({ subject, content }) => {
            return this.send(to, subject, content);
        });
    }

    async registerEmailVerificationOtp(notifiable, data) {
        const to = notifiable?.email;
        return this.getTemplate('otp-verification', {
            ...notifiable,
            ...data,
        }).then(({ subject, content }) => {
            return this.send(to, subject, content);
        });
    }

    async loginEmailVerificationOtp(notifiable, data) {
        const to = notifiable?.email;
        return this.getTemplate('login-otp', {
            ...notifiable,
            ...data,
        }).then(({ subject, content }) => {
            return this.send(to, subject, content);
        });
    }

    async forgotPasswordVerification(notifiable, data) {
        const to = notifiable?.email;
        const template = await this.getTemplate('forgot-password-otp-verification', {
            ...notifiable,
            ...data,
        }).then(({ subject, content }) => {
            return this.send(to, subject, content);
        }).catch((error) => {
            throw error;
        });
        return template;
    }

    async sendInvoiceToCustomer(notifiable, data) {
        const to = notifiable?.email;
        return this.getTemplate('send-invoice-to-customer', {
            ...notifiable,
            ...data,
        }).then(({ subject, content }) => {
            return this.send(to, subject, content, { attachments: data.attachments });
        });
    }


}
