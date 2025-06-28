import { Injectable } from '@nestjs/common';
import { ConfigService, registerAs } from '@nestjs/config';
import { MailerOptions, MailerOptionsFactory } from '@nestjs-modules/mailer';
import SMTPTransport = require('nodemailer/lib/smtp-transport');


export default registerAs('mail', () => ({
    fromName: process.env.MAIL_FROM_NAME,
    fromEmail: process.env.MAIL_FROM_ADDRESS,
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: process.env.MAIL_ENCRYPTION,
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
    },
}));

@Injectable()
export class MailConfigService implements MailerOptionsFactory {

    constructor(private configService: ConfigService) { }

    createMailerOptions(): MailerOptions | Promise<MailerOptions> {
        const transport: SMTPTransport = this.configService.get('mail');

        return {
            transport: transport,
            defaults: {
                from: `"${this.configService.get('mail.fromName')}" <${this.configService.get('mail.fromEmail')}>`,
            },
            template: {
                // dir: process.cwd() + '/apps/api/src/email-templates',
                // adapter: new HandlebarsAdapter(),
                // options: {
                //     layoutsDir: process.cwd() + '/apps/api/src/email-templates/layouts',
                //     extname: 'hbs',
                //     defaultLayout: 'main',
                //     partialsDir: process.cwd() + '/apps/api/src/email-templates/partials/',
                // },
            },
        };
    }

}
