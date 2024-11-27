
import { Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { INotificationTemplate } from '@libs/types';
import { CrudController } from '@api/app/core/crud';
import { NotificationTemplateDTO } from './dto/notification-template.dto';
import { NotificationTemplateService } from './notification-template..service';

@ApiTags('Notification Template')
@Controller("notification-template")
@UseGuards(AuthGuard('jwt'))
export class NotificationTemplateController extends CrudController(NotificationTemplateDTO)<INotificationTemplate> {
  constructor(private notificationTemplateService: NotificationTemplateService) {
    super(notificationTemplateService);
  }
}
