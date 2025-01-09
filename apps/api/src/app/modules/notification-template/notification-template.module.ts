import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { NotificationTemplateService } from './notification-template..service';
import { NotificationTemplateController } from './notification-template.controller';
import { NotificationTemplate } from './notification-template.entity';


@Module({
    imports: [TypeOrmModule.forFeature([NotificationTemplate])],
    controllers: [NotificationTemplateController],
    providers: [NotificationTemplateService],
    exports: [NotificationTemplateService],
})
export class NotificationTemplateModule { }
