import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';

import { NotificationService } from './notification.service';
import { EmailNotificationService } from './providers/email-notification.service';


@Module({
    imports: [
        ConfigModule,

        MailerModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: (config: ConfigService) => {
                return {
                    transport: {
                        host: config.get('mail.host'),
                        port: config.get('mail.port'),
                        ignoreTLS: true,
                        secure: true,
                        auth: {
                            user: config.get('mail.auth.user'),
                            pass: config.get('mail.auth.pass'),
                        },
                    },
                    defaults: {
                        from: `${config.get('mail.from')}`,
                    },
                    preview: false,
                    // template: {
                    //     dir: process.cwd() + '/apps/api/src/email-templates/',
                    //     adapter: new HandlebarsAdapter(),
                    //     options: {
                    //         strict: false,
                    //     },
                    // },
                };
            },
            inject: [ConfigService],
        }),
    ],
    controllers: [],
    providers: [NotificationService, EmailNotificationService],
    exports: [NotificationService, EmailNotificationService],
})

export class NotificationModule {


}
