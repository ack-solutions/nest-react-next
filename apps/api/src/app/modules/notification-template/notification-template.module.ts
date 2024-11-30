
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationTemplate } from './notification-template.entity';
import { NotificationTemplateController } from './notification-template.controller';
import { NotificationTemplateService } from './notification-template..service';

@Module({
    imports: [
        TypeOrmModule.forFeature([NotificationTemplate]),
    ],
    controllers: [NotificationTemplateController],
    providers: [NotificationTemplateService],
    exports: [NotificationTemplateService]
})
export class NotificationTemplateModule { }
