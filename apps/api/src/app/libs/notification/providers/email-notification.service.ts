import { BadGatewayException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { TemplateService as NestTemplateService, RenderTemplateOutputDTO } from '@ackplus/nest-dynamic-templates';


export interface INotifiable {
    email: string,
    [x: string]: any;
}
export interface INotifiableData {
    [x: string]: any;
}

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
    private getTo(notifiable: INotifiable) {
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


        // const template = nunjucks.renderString(html, {
        //     html: new nunjucks.runtime.SafeString(html),
        // });

        try {
            await this.mailerService.sendMail({
                to,
                from: this.configService.get('mail.from'),
                subject,
                html,
                ...sendMailOptions,
            });
        } catch (error) {
            throw new BadGatewayException(error || 'Email send failed, Please check your email.');
        }
    }


    async getTemplate(slug: string, data = {}): Promise<RenderTemplateOutputDTO> {
        const globalValues = {
            appName: this.configService.get('app.appName') || process.env.APP_NAME,
            appUrl: this.configService.get('app.frontUrl') || process.env.FRONT_URL,
            now: new Date(),
            curruntYear: new Date().getFullYear()
        }

        return this.nestTemplateService.render({
            name: slug,
            context: { ...(data || {}), ...globalValues },
        });
    }

    async sendEmail(template: string, notifiable: INotifiable, data: INotifiableData, sendMailOptions: ISendMailOptions = {}) {
        const to = this.getTo(notifiable);
        return this.getTemplate(template, {
            ...notifiable,
            ...data,
        }).then(({ subject, content }) => {
            return this.send(to, subject, content, sendMailOptions);
        });
    }



}
